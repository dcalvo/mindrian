from agno.os import AgentOS  # noqa: E402
from document_agent import document_agent

# Create AgentOS instance
agent_os = AgentOS(agents=[document_agent])

# Get FastAPI app from AgentOS
app = agent_os.get_app()

# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "mindrian-agent"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    agent_os.serve(app="mindrian_agent:app", host="0.0.0.0", port=port, reload=True)
