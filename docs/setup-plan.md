# Mindrian Setup Plan
## Getting to v0.1

**Goal:** A working skeleton where Phoenix serves a React SPA, auth works, and a Phoenix Channel can send a message to the frontend.

**Not in scope for 0.1:** BlockNote, Yjs, AI integration, actual features.

---

## Phase 0: Prerequisites

Verify local environment:

```
□ Elixir 1.15+ installed
□ Phoenix 1.7+ installed (mix archive.install hex phx_new)
□ PostgreSQL running
□ Node.js 18+ installed
□ pnpm or npm available
```

---

## Phase 1: Phoenix Backend

### 1.1 Generate Project

```bash
mix phx.new mindrian --no-live --no-assets --binary-id
cd mindrian
```

**Verify:** `mix phx.server` runs, shows Phoenix welcome page at localhost:4000

### 1.2 Generate Auth

```bash
mix phx.gen.auth Accounts User users
# Answer 'n' to LiveView question (controller-based auth)

mix deps.get
mix ecto.create
mix ecto.migrate
```

**Verify:** 
- Can register account at /users/register
- Can log in at /users/log_in
- Session persists across page refreshes

### 1.3 Configure CORS (for development)

During development, Vite runs on :5173, Phoenix on :4000. Need CORS for API calls.

Add `cors_plug` dependency and configure for dev environment only.

**Verify:** Fetch request from localhost:5173 to localhost:4000/api/health returns 200

### 1.4 Create API Pipeline

Set up `/api` scope in router with JSON responses, session auth (not token-based for simplicity).

Endpoints needed for 0.1:
```
GET  /api/health          → { status: "ok" }
GET  /api/me              → current user or 401
```

**Verify:** 
- /api/health returns JSON
- /api/me returns 401 when not logged in
- /api/me returns user data when logged in (with session cookie)

### 1.5 Create Basic Channel

Set up a simple channel to verify WebSocket connectivity:

```
Channel: "ping:lobby"
Client sends: "ping"
Server responds: "pong"
```

**Verify:** Can connect to socket and receive pong (test via browser console or simple script)

---

## Phase 2: React Frontend

### 2.1 Scaffold Vite + React

```bash
# From project root (parent of mindrian/)
pnpm create vite mindrian-frontend --template react-ts
cd mindrian-frontend
pnpm install
```

### 2.2 Install Core Dependencies

```bash
pnpm add @tanstack/react-router phoenix
pnpm add -D @tanstack/router-devtools
```

That's it for 0.1. No BlockNote, no Yjs yet.

### 2.3 Configure TanStack Router

Set up minimal routing:

```
/login    → Login page (or redirect to Phoenix /users/log_in)
/         → Main app shell (protected)
```

**Verify:** Navigation between routes works, browser back/forward works

### 2.4 Phoenix Socket Connection

Create a socket client that:
- Connects to Phoenix socket at ws://localhost:4000/socket
- Joins "ping:lobby" channel
- Can send "ping" and receive "pong"

**Verify:** Console shows successful connection and pong response

### 2.5 Basic Auth Flow

For 0.1, auth is simple:
- Check /api/me on app load
- If 401, redirect to Phoenix /users/log_in
- If 200, user is authenticated, show app

No React login form yet — Phoenix HTML handles auth, React just checks session.

**Verify:**
- Not logged in → redirected to Phoenix login
- Log in via Phoenix → redirected back to React app
- React shows "logged in as {email}"

### 2.6 Basic Layout Shell

Create the 3-pane layout structure with placeholder content:

```
┌─────────────────────────────────────────────┐
│ Header: Logo, User email, Logout link       │
├────────┬────────────────────┬───────────────┤
│        │                    │               │
│  File  │     Content        │    Chat       │
│  Tree  │     (placeholder)  │  (placeholder)│
│        │                    │               │
│        │                    │               │
└────────┴────────────────────┴───────────────┘
```

Panes don't need to be resizable yet. Just CSS grid/flexbox layout.

**Verify:** Three panes visible, layout doesn't break on window resize

---

## Phase 3: Connect Frontend to Backend

### 3.1 Production Build Integration

Configure Vite to build into Phoenix's `priv/static/spa/` directory.

Configure Phoenix to:
- Serve static files from `priv/static/spa/`
- Route non-API, non-auth requests to `spa/index.html` (SPA catch-all)

### 3.2 Development Proxy (Alternative to CORS)

Optionally, configure Vite to proxy /api and /socket to Phoenix.
This avoids CORS entirely in development.

**Verify (dev mode):**
```bash
# Terminal 1
cd mindrian && mix phx.server

# Terminal 2  
cd mindrian-frontend && pnpm dev
```
- Visit localhost:5173
- Auth flow works
- Channel connects

**Verify (production build):**
```bash
cd mindrian-frontend && pnpm build
cd mindrian && mix phx.server
```
- Visit localhost:4000
- SPA loads
- Everything works same as dev

---

## Phase 4: Research Spikes

Before feature work, validate unknowns:

### 4.1 y_ex Spike

**Goal:** Understand y_ex API

Tasks:
```
□ Add y_ex to mix.exs dependencies
□ Create a simple test: create Yjs doc, insert text, read text back
□ Figure out: how to apply update from client
□ Figure out: how to encode state to send to client
□ Document findings
```

**Timebox:** 2-3 hours

### 4.2 BlockNote + Yjs Spike

**Goal:** Verify BlockNote's Yjs integration works

Tasks:
```
□ Create minimal React app with BlockNote
□ Add Yjs provider (y-websocket with demo server, or local-only)
□ Open in two browser tabs
□ Type in one, verify appears in other
□ Note any issues, limitations
□ Document findings
```

**Timebox:** 2-3 hours

### 4.3 Phoenix Channel + Binary Data Spike

**Goal:** Verify binary messages work over Phoenix Channels

Tasks:
```
□ Send binary (Uint8Array) from browser to Phoenix Channel
□ Receive and decode in Elixir
□ Send binary from Phoenix to browser
□ Receive and decode in JavaScript
□ Document the encoding/decoding pattern
```

**Timebox:** 1-2 hours

---

## v0.1 Definition of Done

All of the following must be true:

```
□ Phoenix runs with auth working
□ React app builds and is served by Phoenix
□ User can register, log in, log out
□ React app shows current user's email
□ React app has 3-pane layout (placeholder content)
□ Phoenix Channel round-trip works (ping/pong)
□ Works in both dev mode (Vite + Phoenix separate) and prod mode (Phoenix serves built SPA)
□ Research spikes completed with findings documented
```

---

## Directory Structure at v0.1

```
project-root/
├── mindrian/                          # Phoenix backend
│   ├── lib/
│   │   ├── mindrian/
│   │   │   ├── accounts/         # Generated auth context
│   │   │   │   ├── user.ex
│   │   │   │   └── ...
│   │   │   └── application.ex
│   │   └── mindrian_web/
│   │       ├── channels/
│   │       │   ├── user_socket.ex
│   │       │   └── ping_channel.ex
│   │       ├── controllers/
│   │       │   ├── api/
│   │       │   │   └── health_controller.ex
│   │       │   └── user_session_controller.ex  # Generated
│   │       └── router.ex
│   ├── priv/
│   │   └── static/
│   │       └── spa/              # Built React app goes here
│   └── mix.exs
│
├── mindrian-frontend/                 # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # fetch wrapper
│   │   │   └── socket.ts         # Phoenix socket client
│   │   ├── routes/
│   │   │   ├── index.tsx         # Main app
│   │   │   └── login.tsx         # Redirect to Phoenix
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
└── docs/
    ├── design-document.md        # The main design doc
    ├── setup-plan.md             # This document
    └── research/
        ├── y_ex-findings.md
        ├── blocknote-yjs-findings.md
        └── channel-binary-findings.md
```

---

## Estimated Time

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Phoenix Backend | 1-2 hours |
| Phase 2: React Frontend | 2-3 hours |
| Phase 3: Integration | 1-2 hours |
| Phase 4: Research Spikes | 5-7 hours |
| **Total to v0.1** | **~1 day** |

This leaves a full day for feature implementation per the original 2-day plan.

---

## Open Questions Before Starting

1. **Monorepo or separate repos?**
   - Single repo (shown above) is simpler for a 2-person team
   - Separate repos if different deploy pipelines needed

2. **pnpm vs npm?**
   - pnpm is faster, more disk-efficient
   - npm if team less familiar with pnpm

3. **Auth redirect flow**
   - After Phoenix login, redirect to `/?authenticated=1` or just `/`?
   - Does React need to know it was just-authenticated vs already-authenticated?

4. **Environment variables**
   - How to share between Phoenix and React (e.g., API URL)?
   - Vite uses `VITE_*` prefix for client-exposed vars

---

## Next Step

Once this plan is approved:

1. Create the repo
2. Execute Phase 1 (Phoenix)
3. Execute Phase 2 (React)
4. Execute Phase 3 (Integration)
5. Run research spikes in parallel or sequence
6. Checkpoint: v0.1 complete
7. Begin feature implementation per design doc

---

*Setup plan v1.0*
