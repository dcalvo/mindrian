from agno.agent import Agent  # noqa: E402
from agno.db.sqlite import SqliteDb  # noqa: E402
from agno.os import AgentOS  # noqa: E402

from document_agent import document_agent  # noqa: E402
from mckinsey_agent import mckinsey_agent  # noqa: E402
from larry.larry_team import larry_team  # noqa: E402
from larry.diagnosis_consolidator import diagnosis_consolidator_team  # noqa: E402
from testing import TESTING  # noqa: E402
from tools import document_tools, mckinsey_tools, testing_tools  # noqa: E402
from db.db import DB  # noqa: E402
from agent_settings.agent_settings import mindrian_agent_model

# Chat agent memory (required for tool approval continuations)
db = DB

def delegate_task(agent_name: str, task: str) -> str:
    """Consult a specialist agent for a recommendation.

    Args:
        agent_name: The specialist to consult ('document-agent' or 'larry-team').
        task: The task or question for the specialist.

    Returns:
        The specialist's recommended course of action (e.g., specific tool calls).
    """
    target_agent = None
    if agent_name == "document-agent":
        target_agent = document_agent
    elif agent_name == "larry-team":
        target_agent = larry_team

    if target_agent:
        try:
            # We just want the recommendation text
            response = target_agent.run(task)
            if agent_name == "larry-team":
                if response.content:
                    content = response.content if isinstance(response.content, str) else str(response.content)
                    print(content)
            if response.content:
                content = response.content if isinstance(response.content, str) else str(response.content)
                return f"Specialist {agent_name} recommends:\n\n{content}"
            return f"Specialist {agent_name} had no recommendation."
        except Exception as e:
            return f"Error consulting specialist: {str(e)}"

    return f"Specialist '{agent_name}' not found."


LEADER_INSTRUCTIONS = """You are the Mindrian Supervisor (Leader Agent). You are the central coordinator.

Your Workflow for EVERY user request:
1. Receive user request.
2. You MUST consult a specialist agent for every action. Do NOT make decisions yourself.
   - For general document tasks (create, read, list, delete), consult 'document-agent'.
   - For complex analysis tasks, consult 'larry-team'.
3. Call `delegate_task(agent_name, task)`.
4. The specialist will return a some information. It will either be a recommendation to execute a tool, or some information.
If the information is in the form of a question or statement, give the user the ability to answer it, and then delegate again.
5. If the recommendation is a tool call, you MUST then EXECUTE that recommended tool exactly as specified.
6. Do not tell the user that you are delegating to a specialist. Simply delegate when appropriate.

Example:
User: "List my documents"
You: delegate_task("document-agent", "List documents")
returned: "Recommended Tool: list_documents()"
You: Call list_documents()

User: "Analyze doc 1"
You: delegate_task("larry-team", "Analyze doc 1")
returned: "do you want this idea to generate revenue?"
You: "do you want this idea to generate revenue?"
User: "yes"
You: delegate_task("larry-team", "yes")

Be a strict coordinator. ALWAYS delegate first, then execute the recommendation."""

# Build tools list - include testing tools when MINDRIAN_TESTING=true
tools = document_tools + mckinsey_tools + [delegate_task] + (testing_tools if TESTING else [])

# Create leader/chat agent with ALL tools
mindrian_agent = Agent(
    id="mindrian-agent",
    name="Mindrian Supervisor",
    model=mindrian_agent_model,
    db=db,
    instructions=LEADER_INSTRUCTIONS,
    tools=tools,
    markdown=True,
    add_history_to_context=True,
    num_history_runs=10,
)

# Create AgentOS instance - all agents registered, frontend talks to leader
agent_os = AgentOS(agents=[mindrian_agent, document_agent, mckinsey_agent], teams=[larry_team, diagnosis_consolidator_team])

# Get FastAPI app from AgentOS
app = agent_os.get_app()

# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "mindrian-agent"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    agent_os.serve(app="mindrian_agent:app", host="0.0.0.0", port=port, reload=True)
