# HIPAA Checker

HIPAA Checker is an open-source static analysis tool for scanning mobile and web application codebases for potential HIPAA compliance issues.

The project is a monorepo containing:

- a **Next.js** frontend
- a **Ruby on Rails** API backend
- **PostgreSQL** for application data
- **Redis + Sidekiq** for background jobs

Everything is started locally with Docker Compose, so you do **not** need to install Ruby, Node.js, PostgreSQL, or Redis separately.

---

## 1. Clone the Repository

Repository:

https://github.com/HIPAACKR/hipaa-checker

Copy and run:

```bash
git clone https://github.com/HIPAACKR/hipaa-checker.git
cd hipaa-checker
```

---

## 2. Prerequisites

Before starting HIPAA Checker, make sure you have:

- **Git**
- **Docker Desktop** on Windows/macOS, or Docker Engine with Docker Compose on Linux
- Docker running before you start the application

### Required local ports

The following ports must be free:

| Port | Service |
|---:|---|
| `5002` | Next.js frontend |
| `3000` | Rails backend/API |

If another application is already using either port, stop that application before starting HIPAA Checker.

### Check the ports on Windows PowerShell

```powershell
Get-NetTCPConnection -State Listen -LocalPort 3000,5002 -ErrorAction SilentlyContinue
```

If the command returns nothing, the ports are free.

### Check the ports on macOS/Linux

```bash
lsof -iTCP:3000 -sTCP:LISTEN
lsof -iTCP:5002 -sTCP:LISTEN
```

If the commands return nothing, the ports are free.

---

## 3. Quick Start

Run these commands from the repository root.

### Windows: PowerShell

```powershell
Copy-Item .env.example .env
docker compose up --build
```

### macOS / Linux

```bash
cp .env.example .env
docker compose up --build
```

---

## 4. Open HIPAA Checker

After Docker finishes starting the services, open:

**Frontend**

http://localhost:5002

**Sign-in page**

http://localhost:5002/sign-in

**Backend/API**

http://localhost:3000

---

## 5. Default Admin Login

A local super-admin account is created automatically by the database seed process.

| | |
|---|---|
| **Email** | `admin@example.com` |
| **Password** | `SecurePassword123` |

Open the sign-in page and use the credentials above.

> Change the default admin credentials before making an installation publicly accessible.

---

## 6. Services Started by Docker

A single `docker compose up` starts the full application stack:

| Service | Purpose | Port |
|---|---|---:|
| `frontend` | Next.js web application | `5002` |
| `backend` | Rails API served by Puma | `3000` |
| `db` | PostgreSQL 16 | Internal only |
| `redis` | Redis 7 | Internal only |
| `sidekiq_extraction` | Extracts uploaded APK/ZIP files | Internal |
| `sidekiq_report_generation` | Runs HIPAA rule checks and report-generation jobs | Internal |
| `sidekiq_general` | General background jobs | Internal |

PostgreSQL and Redis are only exposed inside the Docker network and do not require separate local ports.

---

## 7. Stopping the Application

If Docker Compose is running in the foreground, press:

```text
Ctrl + C
```

Then stop the containers with:

```bash
docker compose down
```

Your database and uploaded application data remain in Docker volumes unless you explicitly remove those volumes.

---

## 8. Useful Commands

### Check running services

```bash
docker compose ps
```

### Start the full application

```bash
docker compose up
```

### Start and rebuild images

```bash
docker compose up --build
```

### Run in the background

```bash
docker compose up -d
```

### View backend logs

```bash
docker compose logs -f backend
```

### View frontend logs

```bash
docker compose logs -f frontend
```

### View report-generation worker logs

```bash
docker compose logs -f sidekiq_report_generation
```

### Open the Rails console

```bash
docker compose exec backend bundle exec rails console
```

### Run database migrations

```bash
docker compose exec backend bundle exec rails db:migrate
```

### Rebuild only the backend

```bash
docker compose up -d --build backend
```

### Rebuild only the frontend

```bash
docker compose up -d --build frontend
```

### Stop all services

```bash
docker compose down
```

### Completely reset local Docker data

```bash
docker compose down -v
```

> **Warning:** `docker compose down -v` deletes the local PostgreSQL and application-data volumes. Use it only when you intentionally want a fresh local installation.

---

## 9. Troubleshooting

### Docker is not running

Start Docker Desktop or the Docker daemon, then run:

```bash
docker compose up --build
```

### Port 3000 or 5002 is already in use

Another application is using a port required by HIPAA Checker. Stop that application and run Docker Compose again.

### A container failed to start

Check the current service status:

```bash
docker compose ps
```

Then inspect its logs. For example:

```bash
docker compose logs -f backend
```

or:

```bash
docker compose logs -f frontend
```

### Frontend environment variables were changed

`NEXT_PUBLIC_*` variables are built into the Next.js image. Rebuild the frontend after changing them:

```bash
docker compose up -d --build frontend
```

### Start completely fresh

If you intentionally want to remove the local database and application volumes:

```bash
docker compose down -v
docker compose up --build
```

---

## 10. Project Structure

```text
hipaa-checker/
├── backend/             # Ruby on Rails API and background jobs
├── frontend/            # Next.js frontend
├── .env.example         # Local environment template
├── docker-compose.yml   # Full local application stack
├── LICENSE
└── README.md
```

---

## 11. Cite Us

If HIPAA Checker is useful in your research, project, publication, or software, please cite the project.

GitHub users can use the **Cite this repository** option on the repository page to copy a formatted citation directly. The citation information is provided in [`CITATION.cff`](CITATION.cff).

### BibTeX

```bibtex
@software{hipaackr_hipaa_checker,
  author = {{HIPAACKR}},
  title = {HIPAA Checker},
  url = {https://github.com/HIPAACKR/hipaa-checker},
  note = {Open-source static analysis tool for HIPAA compliance checking}
}
```

### Plain text

```text
HIPAACKR. HIPAA Checker. GitHub repository: https://github.com/HIPAACKR/hipaa-checker
```

---

## 12. License

HIPAA Checker is currently distributed under the **GNU General Public License v3.0 (GPL-3.0)**.

See the [`LICENSE`](LICENSE) file for the full license text.
