# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mindrian is an AI-driven deep-research platform for uncovering non-obvious connections. Phoenix backend serves a React SPA, with session-based auth and WebSocket channels for real-time features. Dual-licensed: GPL-3.0 + commercial.

See `README.md` for project vision and setup instructions. See `backend/AGENTS.md` for Phoenix/Elixir/Ecto guidelines.

## Build Commands

```bash
# Backend (from backend/)
mix deps.get              # Install dependencies
mix ecto.setup            # Create DB, run migrations, seed
mix ecto.reset            # Drop and recreate DB
iex -S mix phx.server     # Start with IEx console
mix precommit             # Run before committing

# Frontend (from frontend/)
npm install               # Install dependencies
npm run dev               # Vite dev server (port 5173)
npm run build             # Production build → backend/priv/static/spa/
npm run precommit         # Run before committing
```

## Development Workflow

Two-terminal development:
- Terminal 1: `cd backend && iex -S mix phx.server` (port 4000)
- Terminal 2: `cd frontend && npm run dev` (port 5173)

Access via `localhost:5173` - Vite proxies `/api`, `/socket`, `/users` to Phoenix.

Production mode: build frontend, then Phoenix serves SPA from `priv/static/spa/` at `localhost:4000`.

## Project Structure

```
backend/
├── lib/mindrian/              # Business logic contexts
│   ├── accounts.ex            # User auth API (registration, login, tokens)
│   ├── accounts/              # User schema, tokens, notifier
│   └── repo.ex                # Ecto repository
├── lib/mindrian_web/
│   ├── router.ex              # All route definitions
│   ├── user_auth.ex           # Auth plugs (:require_authenticated_user, etc.)
│   ├── controllers/api/       # JSON API endpoints
│   └── channels/              # WebSocket (ping_channel for testing)
└── priv/static/spa/           # Built React app (gitignored, generated)

frontend/
├── src/routes/                # TanStack Router file-based pages
│   ├── __root.tsx             # Root layout, auth check
│   └── index.tsx              # Home page (authenticated)
├── src/components/            # UI components (Layout, Header, ChatPane, etc.)
├── src/hooks/useAuth.ts       # Auth state from /api/me
└── src/lib/
    ├── api.ts                 # REST client
    └── socket.ts              # Phoenix channel client

docs/                              # Reference documents for AI agents and humans
                                   # (design docs, research spikes, specs, etc.)
```

## Authentication

Phoenix.gen.auth with session cookies and magic link tokens. Key files:
- `backend/lib/mindrian/accounts.ex` - Auth logic (register, login, tokens)
- `backend/lib/mindrian_web/user_auth.ex` - Plugs for route protection
- `frontend/src/hooks/useAuth.ts` - React hook checking `/api/me`

Auth flow: React redirects to `/users/log-in` → Phoenix handles auth → sets session cookie → React reads user from `/api/me`.

Access current user via `@current_scope.user` (not `@current_user`).

## API Routes

```
GET  /api/health              # Health check
GET  /api/me                  # Current user (requires auth)
POST /users/register          # Registration
POST /users/log-in            # Login (email/password or magic link)
DELETE /users/log-out         # Logout
```

Dev-only: `/dev/dashboard` (LiveDashboard), `/dev/mailbox` (email preview)

## WebSocket

Phoenix channels via `/socket`. Test channel: `ping:lobby` responds to `ping` with `pong`.

Frontend connects via `src/lib/socket.ts` using the `phoenix` npm package.

## Deployment (Fly.io)

```bash
fly deploy                    # Deploy
fly logs                      # View logs
./fiex                        # Remote IEx console
fly mpg connect <cluster>     # Database access
```

Required env vars: `DATABASE_URL`, `SECRET_KEY_BASE`, `PHX_HOST`, `PORT`

Generate secret: `mix phx.gen.secret`

## Key Dependencies

- **Backend**: Phoenix 1.8, Ecto/Postgrex, Req (HTTP client), bcrypt_elixir
- **Frontend**: React 19, TanStack Router, phoenix (JS client), Vite

Version requirements in `.tool-versions`: Elixir 1.19+, Erlang/OTP 28+, Node 24+

## Updating This File

Keep this file focused on project-specific knowledge that helps Claude work effectively:

- **Do**: Document commands, workflows, key files, architecture decisions, non-obvious conventions
- **Don't**: Duplicate README content, add generic framework rules (put those in `backend/AGENTS.md`)
- **Keep it concise**: If a section grows too long, it probably belongs elsewhere
- **Show, don't tell**: Prefer code blocks and examples over prose explanations
