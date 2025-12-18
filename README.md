# Mindrian

An AI-driven, agentic deep-research platform that transforms how individuals, teams, and organizations innovate by uncovering non-obvious connections and accelerating insight generation.

## The Problem

Innovation cycle time and quality are critical to survival and growth, yet innovation remains messy, sporadic, and structureless. The bottleneck isn't expertise—it's **cognitive bandwidth**.

Human cognition cannot simultaneously process:
- All relevant domain knowledge
- Cutting-edge research and cross-domain advances
- Organizational goals and constraints
- Multi-dimensional relationships across disparate fields

Even brilliant teams miss original, non-obvious connections—not from lack of knowledge, but from structural cognitive limits. Current AI systems fall short with rigid roles, static logic, and inability to generalize across domains.

## The Solution

Mindrian transforms static thinking frameworks into **adaptive, executable cognitive agents** that:

- **Dynamically adjust roles** between tools and orchestrators based on context
- **Continuously enhance intelligence** through recursive composition and contextual reasoning
- **Enable human-in-the-loop learning** for evolving system capabilities
- **Uncover intersectional innovations** by revealing hidden connections across distant domains

## Why It Matters

Organizations waste time, capital, and opportunities on fragile, episodic innovation. Exploratory thinking is expensive but critical for breakthroughs. Mindrian enables you to:

- **Perceive faulty assumptions** and incoherent conclusions early
- **Identify missed research** and cutting-edge developments
- **Discover non-obvious connections** that drive disruptive innovation
- **Move from vague insights to investable opportunities** systematically

By raising the quality of ideation through AI-driven deep research that asks the right questions, stress-tests assumptions, and reveals unexpected relationships, Mindrian makes continuous, institutionalized innovation possible.

## Getting Started

### Prerequisites

- **Elixir** 1.19+ and **Erlang/OTP** 28+
- **PostgreSQL** 17+
- **Node.js** 24+
- **Python** 3.11+ with **uv** package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/dcalvo/mindrian.git
cd mindrian

# Backend setup
cd backend
mix deps.get
mix ecto.setup
cd ..

# Frontend setup
cd frontend
npm install
cd ..

# Agent setup
cd agent
uv sync
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY
cd ..
```

### Development

Run all three servers in separate terminals:

```bash
# Terminal 1: Phoenix backend (port 4000)
./run-backend                   # or: cd backend && iex -S mix phx.server
```

```bash
# Terminal 2: Agno agent (port 8000)
./run-agent                     # or: cd agent && uv run uvicorn mindrian_agent:app --port 8000 --reload
```

```bash
# Terminal 3: Vite dev server (port 5173)
./run-frontend                  # or: cd frontend && npm run dev
```

**Access the app at `http://localhost:5173`** for development (with hot reload).

The Vite dev server proxies API requests (`/api/*`), WebSocket connections (`/socket/*`), and auth routes (`/users/*`) to Phoenix at `:4000`.

### Production Build

To test the production build locally:

```bash
# Build frontend
cd frontend
npm run build

# Run Phoenix (serves the built SPA)
cd ../backend
iex -S mix phx.server
```

Access at `http://localhost:4000`.

### Precommit

Run before committing:

```bash
# Backend (from backend/)
mix precommit

# Frontend (from frontend/)
npm run precommit
```

### Deployment

Deploy to [Fly.io](https://fly.io):

```bash
fly deploy
```

Useful commands:
- `./fiex` - Remote IEx console
- `fly logs` - View logs
- `fly mpg connect <cluster>` - Connect to database

## Architecture

```
backend/                   # Phoenix backend (Elixir)
├── lib/mindrian/          # Business logic, contexts
├── lib/mindrian_web/      # Web layer (controllers, channels)
└── priv/static/spa/       # Built React app (generated)

agent/                     # AI agent microservice (Python)
├── mindrian_agent.py      # Agent definition with Agno
└── tools/                 # Document tools for agent

frontend/                  # React SPA (TypeScript)
├── src/components/        # UI components
├── src/hooks/             # React hooks
├── src/lib/               # API client, socket helpers
└── src/routes/            # TanStack Router pages
```

**Key technologies:**
- **Backend**: Phoenix, PostgreSQL, Phoenix Channels
- **Agent**: Python, Agno, Claude
- **Frontend**: React, TypeScript, Vite, TanStack Router
- **Auth**: Phoenix.gen.auth (session-based)

## Contributing

Mindrian is open source under GPL-3.0, with commercial licenses available for enterprises. See [LICENSE](LICENSE) for details.

## License

This project is dual-licensed:

- **Open Source**: GNU General Public License v3.0 (GPL-3.0) - See [LICENSE](LICENSE)
- **Commercial**: Available for enterprises requiring commercial use without GPL restrictions

For commercial licensing options, please contact us at support@mindrian.com.

## Status

🚧 **In Development** - Mindrian is currently in early development.

---

*Pushing thinking forward through agentic deep research.*
