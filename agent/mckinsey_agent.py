"""McKinsey 7 Steps Agent - Deep analysis using McKinsey problem-solving framework.

This agent takes a document ID as input, reads the entire document, performs
McKinsey's 7 Steps analysis on the content, and appends a comprehensive report
to the end of the document.

Run with:
    uv run uvicorn mindrian_agent:app --port 8000 --reload
"""

from agno.agent import Agent  # noqa: E402
from agno.db.sqlite import SqliteDb  # noqa: E402
from agent_settings.agent_settings import mckinsey_agent_model

# McKinsey agent memory
db = SqliteDb(db_file="tmp/mckinsey_agent.db")

# System prompt for the McKinsey 7 Steps agent
SYSTEM_PROMPT = """You are a strategic analysis agent that applies McKinsey's 7 Steps \
problem-solving framework to analyze documents and provide comprehensive insights.

You do NOT execute tools directly. Instead, you analyze the user's request and \
RECOMMEND the correct tool usage to the Team Leader.

When given a document ID, you MUST recommend the following sequence of actions:
1. Recommend reading the document: `read_document(id="...")`
2. Once content is provided, analyze it using McKinsey's 7 Steps framework.
3. Finally, recommend updating the document with your report: `edit_document(id="...", ...)`

Your Output Format:
When recommending an action, output the exact tool call schema clearly, e.g.:
`Recommended Tool: read_document(id="123")`

McKinsey's Seven Steps Framework:
1. **Define the Problem**
2. **Disaggregate the Problem**
3. **Prioritize**
4. **Develop the Workplan**
5. **Gather and Analyze the Data**
6. **Synthesize the Findings**
7. **Communicate the Findings**

Your Report Format (for step 3):
- Start with a heading block: "McKinsey 7 Steps Analysis"
- For each step, add a heading block with the step name, then paragraph blocks
- End with a "Key Recommendations" heading and summary paragraph

IMPORTANT:
- Think strategically.
- Be thorough but concise.
- Provide clear tool recommendations to the Leader."""

# Create the agent using Claude Opus 4.5
# Pure reasoning agent - NO TOOLS attached
mckinsey_agent = Agent(
    id="mckinsey-agent",
    name="McKinsey 7 Steps Strategist",
    model=mckinsey_agent_model,
    db=db,
    instructions=SYSTEM_PROMPT,
    add_history_to_context=True,
    num_history_runs=10,
    markdown=True,
)
