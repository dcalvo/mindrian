import os

from dotenv import load_dotenv

load_dotenv()

from agno.os import AgentOS  # noqa: E402
from document_agent import document_agent
from intelligent_agent import intelligent_agent
from agno.team import Team
from agno.models.anthropic import Claude

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")

# TODO: come up with better prompt
TEAM_PROMPT = """You are a team of AI agents working together to provide comprehensive information. \
Delegate tasks based on the user's request."""

# Create team
mindrian_team = Team(
    name="mindrian-team",
    members=[document_agent, intelligent_agent],
    model=Claude(id="claude-haiku-4-5", api_key=api_key),
    instructions=TEAM_PROMPT
)

# Create AgentOS instance
agent_os = AgentOS(teams=[mindrian_team])

# Get FastAPI app from AgentOS
app = agent_os.get_app()

# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "team": "mindrian-team"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    agent_os.serve(app="mindrian_agent:app", host="0.0.0.0", port=port, reload=True)
