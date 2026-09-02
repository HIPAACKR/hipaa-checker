# HIPAA Checker

Static analysis tool that scans mobile/web app codebases for HIPAA compliance
issues. Monorepo with a Ruby on Rails API backend and a Next.js frontend.

## Stack

| Service | What it is | Port |
|---|---|---|
| `frontend` | Next.js app | 5002 |
| `backend` | Rails API (Puma) | 3000 |
| `db` | Postgres 16 | internal only |
| `redis` | Redis 7 (Sidekiq queues) | internal only |
| `sidekiq_extraction` | Unpacks uploaded APKs/zips | — |
| `sidekiq_report_generation` | Runs HIPAA rule checks against extracted code | — |
| `sidekiq_general` | Everything else (cache cleanup, codebase upload) | — |

All seven run via a single `docker compose up` from the repo root.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running
- That's it — Ruby, Node, Postgres, Redis all run inside containers.

## Quickstart

```bash
cp .env.example .env
# edit .env — see "Populating the .env file" below
docker compose up
```

First boot builds both images (a few minutes — the backend image compiles
webpacker assets), then:

- runs `rails db:prepare` automatically (creates the DB, runs migrations)
- starts the backend on http://localhost:3000
- starts the frontend on http://localhost:5002

Watch logs for a specific service with `docker compose logs -f backend` (or
`sidekiq_report_generation`, `frontend`, etc.).

Tear down with `docker compose down` (add `-v` to also wipe the Postgres/data
volumes and start completely fresh next time).

## Populating the `.env` file

Copy `.env.example` to `.env` at the repo root, then work through it
section by section. Everything below is read by `docker-compose.yml` — some
values become container environment variables, others get baked into the
frontend build (`NEXT_PUBLIC_*`) at `docker compose up` time.

### Required — the app won't start correctly without these

| Variable | What it's for | How to set it |
|---|---|---|
| `POSTGRES_PASSWORD` | Postgres password, also used to build `DATABASE_URL` | Pick any string, e.g. `openssl rand -hex 16` |
| `SECRET_KEY_BASE` | Rails session/cookie signing key | Generate: `openssl rand -hex 64` |
| `OTP_SECRET_KEY` | Encrypts 2FA (devise-two-factor) secrets at rest | Generate: `openssl rand -hex 32` |

Run this to generate all three at once:

```bash
echo "POSTGRES_PASSWORD=$(openssl rand -hex 16)"
echo "SECRET_KEY_BASE=$(openssl rand -hex 64)"
echo "OTP_SECRET_KEY=$(openssl rand -hex 32)"
```

Paste the output into `.env`. These are local secrets — never reuse them in
a real production environment, and never commit `.env` (it's gitignored).

> **Note on `RAILS_MASTER_KEY`:** you won't find it in `.env.example` on
> purpose. Nothing in this app reads `Rails.application.credentials`, and
> Rails resolves `secret_key_base` from `SECRET_KEY_BASE` directly without
> ever touching `config/credentials.yml.enc`. Setting `RAILS_MASTER_KEY` to
> an *empty* string (rather than leaving it unset) actually crashes boot —
> see the comment in `backend/Dockerfile` if you're curious why.

### Optional — the app boots fine without these; only specific features need them

| Variable | What it's for | Where to get it |
|---|---|---|
| `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` | Billing/subscriptions | [Stripe Dashboard → API keys](https://dashboard.stripe.com/test/apikeys) (use test-mode keys) |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Verifies incoming Stripe webhooks | Stripe Dashboard → Webhooks, or `stripe listen` CLI output |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Same Stripe key, exposed to the frontend | Same as `STRIPE_PUBLIC_KEY` above |
| `GOOGLE_CAPTCHA_SITE_KEY` / `GOOGLE_CAPTCHA_SECRET_KEY` | reCAPTCHA on the web sign-up form | Leave the defaults — they're Google's public **always-pass** test keys, fine for local dev. Get real ones at the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) only if you need to test the captcha actually rejecting bots. |
| `OTP_2FA_ISSUER_NAME` | Cosmetic — name shown in authenticator apps | Any string, e.g. `HIPAA Checker` |
| `RAILS_LOG_TO_STDOUT` | Makes Rails logs show up in `docker compose logs` | Leave as `true` |

### Frontend build-time variables

These get compiled into the Next.js bundle, so they must point somewhere
your **browser** can reach — not a Docker service name like `backend`.

| Variable | Value for local docker-compose use |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_API_BASE_URL_V2` | `http://localhost:3000/api/v2` |
| `NEXT_PUBLIC_ENABLE_LLM_FEATURES` | `false` unless you have an LLM backend to point at |
| `NEXT_PUBLIC_LLM_API_BASE_URL` | Leave blank unless the flag above is `true` |

If you change any `NEXT_PUBLIC_*` value, rebuild the frontend image:
`docker compose up --build frontend`.

## Logging in

`docker compose up` seeds a super-admin account automatically on every
backend start (`db/seeds.rb` runs after migrations, and is idempotent — it
won't duplicate anything on restarts):

- **Email:** `admin@example.com`
- **Password:** `SecurePassword123`

Change these in `db/seeds.rb` if you want different defaults. The seed skips
the real Stripe API call for the Free plan unless `STRIPE_SECRET_KEY` in
`.env` is a real key (the placeholder value is detected and skipped
automatically), so it works out of the box with no Stripe account.

## Pulling `suggestions` data from the live server

The `suggestions` table (HIPAA remediation guidance shown per rule) is
normally populated by hand on the live server. To bring that data into local
Docker seeding:

1. On the **live server**, run the export script:
   ```bash
   cd /path/to/app/current
   RAILS_ENV=production bundle exec rails runner script/export_suggestions.rb
   ```
   This writes `db/seed_data/suggestions.json`. It resolves the Action Text
   fields (`comment`, `code_snippet`, `expectations_from_hipaa` — see
   `app/models/suggestion.rb`) to plain text, since that content actually
   lives in `action_text_rich_texts`, not as plain columns on `suggestions`.

2. Copy that one file down to this repo, e.g.:
   ```bash
   scp youruser@yourserver:/path/to/app/current/db/seed_data/suggestions.json \
     backend/db/seed_data/suggestions.json
   ```

3. Rebuild and restart the backend so the file gets baked into the image and
   `db/seeds.rb` picks it up automatically:
   ```bash
   docker compose up -d --build backend
   ```
   Look for `Suggestions seeded: N/N` in `docker compose logs backend`.

Re-running is safe — suggestions are matched on `(platform, rule_id,
subrule_id)` and updated in place rather than duplicated.

## Useful commands

```bash
docker compose ps                              # what's running
docker compose logs -f backend                 # tail backend logs
docker compose exec backend bundle exec rails console
docker compose exec backend bundle exec rails db:migrate
docker compose down                            # stop everything
docker compose down -v                         # stop + wipe all data
docker compose up -d --build backend           # rebuild just the backend
```
