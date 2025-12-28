"""Mindrian Agent - Agno-based AI agent for document operations.

This agent handles conversations and document operations, communicating with
the Phoenix backend via REST API for tool execution.

Run with:
    uv run uvicorn mindrian_agent:app --port 8000 --reload
"""

import os

from dotenv import load_dotenv

load_dotenv()

from agno.agent import Agent  # noqa: E402
from agno.db.sqlite import SqliteDb  # noqa: E402
from agno.models.anthropic import Claude  # noqa: E402
from agno.os import AgentOS  # noqa: E402
from testing import TESTING

from tools import document_tools, testing_tools  # noqa: E402

# document agent memory
db = SqliteDb(db_file="tmp/document_agent.db")

# System prompt for the Mindrian agent
SYSTEM_PROMPT = """You are a helpful AI assistant for Mindrian, a deep-research \
platform for uncovering non-obvious connections.

You can help users:
- Create new documents to organize their research
- Read and understand document content
- Edit documents by adding, updating, or removing content blocks
- Delete documents when no longer needed

When working with documents:
- Use read_document to understand what's already in a document before making changes
- Use edit_document with appropriate operations to make changes
- Be precise with block operations - you can insert, update, delete, or append blocks
- Confirm destructive actions like deleting documents
- You can use **bold** markdown formatting in document content
- For headings, use the "heading" block type instead of markdown # symbols

Be concise and helpful. Focus on assisting the user with their research and \
document management tasks."""

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")

# Build tools list - include testing tools when MINDRIAN_TESTING=true
tools = document_tools + (testing_tools if TESTING else [])

# Create the agent
document_agent = Agent(
    id="document-agent",
    name="Document Agent",
    model=Claude(id="claude-haiku-4-5", api_key=api_key),
    db=db,
    tools=tools,
    instructions=SYSTEM_PROMPT,
    add_history_to_context=True,
    num_history_runs=10,
    markdown=True,
)
