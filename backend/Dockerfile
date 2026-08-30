FROM ruby:3.1

ARG SECRET_KEY_BASE

ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV SECRET_KEY_BASE=$SECRET_KEY_BASE
ENV DATABASE_URL=postgres://fake:fake@localhost:5432/fake
ENV REDIS_URL=redis://localhost:6379/1
# RAILS_MASTER_KEY is intentionally not baked in here: nothing in this app
# reads Rails.application.credentials, and Devise's secret-key lookup treats
# an *empty* RAILS_MASTER_KEY (as opposed to a genuinely unset one) as a
# fatal error, not a fallback. If you ever need it, pass it as a runtime
# `environment:`/`env_file` value instead of baking it into the image.

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
  curl \
  gnupg \
  build-essential \
  libpq-dev \
  openjdk-17-jre \
  unzip \
  wget \
  git \
  zip \
  ca-certificates

# Install NVM and Node.js 14 manually
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=14.21.3

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default && \
    ln -s "$NVM_DIR/versions/node/v$NODE_VERSION/bin/node" /usr/local/bin/node && \
    ln -s "$NVM_DIR/versions/node/v$NODE_VERSION/bin/npm" /usr/local/bin/npm && \
    ln -s "$NVM_DIR/versions/node/v$NODE_VERSION/bin/npx" /usr/local/bin/npx

# Verify Node & NPM
RUN node -v && npm -v

# Install Yarn Classic (v1) without npm global
RUN curl -o- -L https://classic.yarnpkg.com/install.sh | bash

# Add Yarn to PATH so subsequent steps can use it
ENV PATH="/root/.yarn/bin:/root/.config/yarn/global/node_modules/.bin:$PATH"

# Verify Yarn installation
RUN yarn --version

## Install JADX CLI
#RUN wget https://github.com/skylot/jadx/releases/download/v1.4.7/jadx-1.4.7.zip -O /tmp/jadx.zip && \
#    unzip /tmp/jadx.zip -d /opt && \
#    cd /opt && \
#    find . -type f -name "jadx*" -exec chmod +x {} \; && \
#    find /opt -type f -name "jadx" -exec ln -s {} /usr/local/bin/jadx \; && \
#    find /opt -type f -name "jadx-gui" -exec ln -s {} /usr/local/bin/jadx-gui \; && \
#    rm /tmp/jadx.zip

# Set working directory
WORKDIR /app

# Install Ruby gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler:2.3.26 && bundle install --without development test

# Copy application code
COPY . .

# Set up binstubs and install JS packages
RUN chmod +x ./bin/* && yarn install && bin/webpack
RUN bundle exec rake assets:precompile --trace

# Make JADX and APKTOOL is executable
RUN chmod +x utils/jadx/bin/jadx
RUN chmod +x utils/apktool

# Default command to run the Rails server
#CMD ["rails", "server", "-e", "production", "-b", "0.0.0.0"]

