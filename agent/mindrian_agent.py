import os

from dotenv import load_dotenv

load_dotenv()

from agno.os import AgentOS  # noqa: E402
from document_agent import document_agent
from intelligent_agent import intelligent_agent
from agno.agent import Agent
from agno.utils.log import logger
from agno.models.anthropic import Claude

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")

def delegate_task(agent_name: str, task: str) -> str:
    """Delegate a task to a specific agent.

    Args:
        agent_name (str): The name of the agent to delegate to (either 'document-agent' or 'intelligent-agent').
        task (str): The task description.

    Returns:
        str: The result of the task.
    """
    target_agent = None
    if agent_name == "document-agent":
        target_agent = document_agent
    elif agent_name == "intelligent-agent":
        target_agent = intelligent_agent
    
    if target_agent:
        try:
            response = target_agent.run(task)
            if response.content:
                 if isinstance(response.content, str):
                     return response.content
                 return str(response.content)
            return "Task completed successfully."
        except Exception as e:
            return f"Error executing task: {str(e)}"
    
    return f"Agent '{agent_name}' not found."

LEADER_INSTRUCTIONS = """You are the Mindrian Leader Agent. Your goal is to route user requests to the appropriate specialist agent.

You have access to two specialist agents:
1. 'document-agent': Use this for ANY operations related to documents (creating, reading, editing, deleting).
2. 'intelligent-agent': Use this for general reasoning, math, chat, or complex analysis not strictly related to document management.

ALWAYS use the `delegate_task` tool to hand off the work. Do not attempt to answer the user's request directly unless it is a simple greeting or clarification.

Example:
User: "Create a document notes.txt"
You: Call delegate_task("document-agent", "Create a document named notes.txt")

User: "Calculate the fibonacci sequence"
You: Call delegate_task("intelligent-agent", "Calculate the fibonacci sequence")
"""

# Create leader agent
mindrian_agent = Agent(
    id="mindrian-agent",
    name="Mindrian Leader",
    model=Claude(id="claude-haiku-4-5", api_key=api_key),
    instructions=LEADER_INSTRUCTIONS,
    tools=[delegate_task],
    markdown=True,
    add_history_to_context=True,
)

# Create AgentOS instance
# We register all agents so they are available in the system, but the frontend will primarily talk to the leader.
agent_os = AgentOS(agents=[mindrian_agent, document_agent, intelligent_agent])

# Get FastAPI app from AgentOS
app = agent_os.get_app()

# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "mindrian-agent"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    agent_os.serve(app="mindrian_agent:app", host="0.0.0.0", port=port, reload=True)
