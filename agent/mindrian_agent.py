import os

from dotenv import load_dotenv

load_dotenv()

from agno.agent import Agent  # noqa: E402
from agno.db.sqlite import SqliteDb  # noqa: E402
from agno.models.anthropic import Claude  # noqa: E402
from agno.os import AgentOS  # noqa: E402

from document_agent import document_agent  # noqa: E402
from mckinsey_agent import mckinsey_agent  # noqa: E402
from testing import TESTING  # noqa: E402
from tools import document_tools, testing_tools  # noqa: E402

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")

# Chat agent memory (required for tool approval continuations)
db = SqliteDb(db_file="tmp/mindrian_agent.db")


def delegate_task(agent_name: str, task: str) -> str:
    """Delegate a task to a specific agent.

    Args:
        agent_name: The agent to delegate to ('document-agent' or 'mckinsey-agent').
        task: The task description.

    Returns:
        The result of the task.
    """
    target_agent = None
    if agent_name == "document-agent":
        target_agent = document_agent
    elif agent_name == "mckinsey-agent":
        target_agent = mckinsey_agent

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


LEADER_INSTRUCTIONS = """You are the Mindrian Chat Agent. You help users with \
document management and can delegate specialized analysis tasks to expert agents.

You have direct access to document tools for managing documents:
- list_documents: List all documents in the workspace
- create_document: Create a new document
- read_document: Read document content
- edit_document: Edit document blocks (insert, update, delete, append)
- delete_document: Delete a document

For simple document operations, use your document tools directly.

For specialized analysis, you can delegate to:
- 'mckinsey-agent': Run a comprehensive McKinsey 7 Steps analysis on a document.
  This agent reads the document, analyzes it using McKinsey's problem-solving
  framework, and appends a detailed report to the document. Example:
  delegate_task("mckinsey-agent", "Run McKinsey 7 Steps analysis on document ID")

Examples:
User: "Create a document called Research Notes"
You: Use create_document tool directly with title "Research Notes"

User: "What documents do I have?"
You: Use list_documents tool directly

User: "Run a strategic analysis on document abc123"
You: delegate_task("mckinsey-agent", "Run 7 Steps analysis on document abc123")

Be helpful and conversational. Handle simple requests directly and delegate \
complex analysis to specialists."""

# Build tools list - include testing tools when MINDRIAN_TESTING=true
tools = document_tools + [delegate_task] + (testing_tools if TESTING else [])

# Create leader/chat agent with document tools
mindrian_agent = Agent(
    id="mindrian-agent",
    name="Mindrian Chat Agent",
    model=Claude(id="claude-haiku-4-5", api_key=api_key),
    db=db,
    instructions=LEADER_INSTRUCTIONS,
    tools=tools,
    markdown=True,
    add_history_to_context=True,
    num_history_runs=10,
)

# Create AgentOS instance - all agents registered, frontend talks to leader
agent_os = AgentOS(agents=[mindrian_agent, document_agent, mckinsey_agent])

# Get FastAPI app from AgentOS
app = agent_os.get_app()


# Add health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "agent": "mindrian-agent"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    agent_os.serve(app="mindrian_agent:app", host="0.0.0.0", port=port, reload=True)
