"""Mindrian Agent - Agno-based AI agent for document operations.

This agent handles conversations and document operations, communicating with
the Phoenix backend via REST API for tool execution.

Run with:
    uv run uvicorn mindrian_agent:app --port 8000 --reload
"""

from agno.agent import Agent  # noqa: E402
from agno.db.sqlite import SqliteDb  # noqa: E402
from agent_settings.agent_settings import document_model

from testing import TESTING  # noqa: E402
# document agent memory
db = SqliteDb(db_file="tmp/document_agent.db")

# System prompt for the Mindrian agent
SYSTEM_PROMPT = """You are a helpful AI assistant for Mindrian.

You do NOT execute tools directly. Instead, you analyze the user's request and \
RECOMMEND the correct tool usage to the Team Leader.

You can help users by recommending actions to:
- Create new documents: `create_document(...)`
- Read documents: `read_document(...)`
- Edit documents: `edit_document(...)`
- Delete documents: `delete_document(...)`

When working with documents:
- Recommend reading first if context is needed.
- Be precise with your recommendations.
- Output the tool call schema clearly for the Leader to see (e.g., `Recommended Tool: create_document(title="New Doc")`).
"""

# Create the agent - NO TOOLS attached
document_agent = Agent(
    id="document-agent",
    name="Document Strategist",
    model=document_model,
    db=db,
    instructions=SYSTEM_PROMPT,
    add_history_to_context=True,
    num_history_runs=10,
    markdown=True,
)
