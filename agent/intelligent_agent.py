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

# intelligent agent memory
db = SqliteDb(db_file="tmp/intelligent_agent.db")

# System prompt for the Mindrian agent

# TODO: Fill in system prompt
SYSTEM_PROMPT = """"""

# Get API key from environment
api_key = os.getenv("ANTHROPIC_API_KEY")

# Build tools list - include testing tools when MINDRIAN_TESTING=true
tools = document_tools + (testing_tools if TESTING else [])

# Create the agent
intelligent_agent = Agent(
    id="intelligent-agent",
    name="Intelligent Agent",
    model=Claude(id="claude-haiku-4-5", api_key=api_key),
    db=db,
    tools=tools,
    instructions=SYSTEM_PROMPT,
    add_history_to_context=True,
    num_history_runs=10,
    markdown=True,
)
