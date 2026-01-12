# Find eligible builder and runner images on Docker Hub. We use Ubuntu/Debian
# instead of Alpine to avoid DNS resolution issues in production.
#
# https://hub.docker.com/r/hexpm/elixir/tags?name=ubuntu
# https://hub.docker.com/_/ubuntu/tags
#
# This file is based on these images:
#
#   - https://hub.docker.com/r/hexpm/elixir/tags - for the build image
#   - https://hub.docker.com/_/debian/tags?name=trixie-20251208-slim - for the release image
#   - https://pkgs.org/ - resource for finding needed packages
#   - Ex: docker.io/hexpm/elixir:1.19.4-erlang-28.3-debian-trixie-20251208-slim
#
ARG ELIXIR_VERSION=1.19.4
ARG OTP_VERSION=28.3
ARG DEBIAN_VERSION=trixie-20251208-slim

ARG BUILDER_IMAGE="docker.io/hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="docker.io/debian:${DEBIAN_VERSION}"

# Build stage for frontend
FROM node:lts-slim AS frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Elixir build stage
ARG BUILDER_IMAGE
FROM ${BUILDER_IMAGE} AS builder

# install build dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential git \
  && rm -rf /var/lib/apt/lists/*

# prepare build dir
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force \
  && mix local.rebar --force

# set build ENV
ENV MIX_ENV="prod"

# install mix dependencies
COPY backend/mix.exs backend/mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# copy compile-time config files before we compile dependencies
# to ensure any relevant config change will trigger the dependencies
# to be re-compiled.
COPY backend/config/config.exs backend/config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY backend/priv priv
COPY backend/lib lib

# Copy frontend build output
COPY --from=frontend /app/backend/priv/static/spa priv/static/spa

# Compile the release
RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
COPY backend/config/runtime.exs config/

COPY backend/rel rel
RUN mix release

# Agno agent build stage
ARG RUNNER_IMAGE
FROM ${RUNNER_IMAGE} AS agno-builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-venv \
  && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app/agno_agent
COPY agent/pyproject.toml agent/uv.lock ./
COPY agent/tools ./tools
RUN uv sync --frozen
COPY agent/*.py ./

# Claude Agent SDK build stage
ARG RUNNER_IMAGE
FROM ${RUNNER_IMAGE} AS claude-builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-venv \
  && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app/claude_agent
COPY claude_agent/pyproject.toml claude_agent/uv.lock ./
COPY claude_agent/mcp_tools ./mcp_tools
RUN uv sync --frozen
COPY claude_agent/*.py ./

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
ARG RUNNER_IMAGE
FROM ${RUNNER_IMAGE} AS final

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libstdc++6 openssl libncurses6 locales ca-certificates \
    python3 python3-venv \
  && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
  && locale-gen

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

WORKDIR "/app"

# set runner ENV
ENV MIX_ENV="prod"

# Copy the Elixir release
COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/mindrian ./

# Copy both Python agents with their virtual environments
COPY --from=agno-builder --chown=nobody:root /app/agno_agent /app/agno_agent
COPY --from=claude-builder --chown=nobody:root /app/claude_agent /app/claude_agent

# Configure agent servers (both run, Claude is default driver)
ENV START_AGENT_SERVER="true"
ENV AGNO_AGENT_DIRECTORY="/app/agno_agent"
ENV CLAUDE_AGENT_DIRECTORY="/app/claude_agent"
ENV AGNO_URL="http://localhost:8000"
ENV CLAUDE_AGENT_URL="http://localhost:8001"
ENV PHOENIX_URL="http://localhost:8080"
ENV HOME="/app"

# Create tmp and cache directories for both agents
RUN mkdir -p /app/agno_agent/tmp /app/claude_agent/tmp && chown -R nobody:nogroup /app

USER nobody

# If using an environment that doesn't automatically reap zombie processes, it is
# advised to add an init process such as tini via `apt-get install`
# above and adding an entrypoint. See https://github.com/krallin/tini for details
# ENTRYPOINT ["/tini", "--"]

CMD ["/app/bin/server"]
