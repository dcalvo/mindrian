"""Claude Agent Service - FastAPI service wrapping Claude Agent SDK.

Provides SSE-streaming endpoints for the Phoenix backend to communicate with
Claude Agent SDK, matching the event format expected by the Mindrian Driver.

Run with:
    uv run uvicorn claude_agent_service:app --port 8001 --reload
"""

import asyncio
import json
import logging
import os
import traceback
import uuid
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException
from sse_starlette.sse import EventSourceResponse

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from claude_agent_sdk import (  # noqa: E402
    AgentDefinition,
    AssistantMessage,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    HookContext,
    HookInput,
    HookJSONOutput,
    HookMatcher,
    ResultMessage,
    SystemMessage,
    ToolResultBlock,
    ToolUseBlock,
    UserMessage,
    create_sdk_mcp_server,
)
from claude_agent_sdk.types import StreamEvent  # noqa: E402

from mcp_tools.documents import (  # noqa: E402
    create_document,
    delete_document,
    edit_document,
    get_workspace_summary,
    list_documents,
    open_document,
    read_document,
    search_documents,
    set_session_context,
)

app = FastAPI(title="Mindrian Claude Agent", version="0.1.0")

# Session storage for ClaudeSDKClient instances
# Key: session_id (conversation_id), Value: dict with client and state
_sessions: dict[str, dict[str, Any]] = {}

# Reverse map: sdk_session_id -> our session_id (for hooks)
_sdk_to_session: dict[str, str] = {}

# Larry conversation history: session_id -> list of {larry: str, user: str}
_larry_sessions: dict[str, list[dict[str, str]]] = {}

# Pending Larry Task calls: tool_use_id -> {session_id, user_prompt}
# Used to capture Larry exchanges when the Task completes
_pending_larry_calls: dict[str, dict[str, str]] = {}

# Innovation conversation history: session_id -> {technique: [exchanges]}
_innovation_sessions: dict[str, dict[str, list[dict[str, str]]]] = {}

# Pending innovation Task calls: tool_use_id -> {session_id, technique, user_prompt}
_pending_innovation_calls: dict[str, dict[str, str]] = {}

# Innovation technique identifiers
INNOVATION_TECHNIQUES = {
    "trending_to_absurd",
    "dominant_design",
    "user_process",
    "macro_changes",
}

# System prompt for the Mindrian agent
SYSTEM_PROMPT = """You are a helpful AI assistant for Mindrian, a deep-research \
platform for uncovering non-obvious connections.

You can help users:
- Get an overview of their workspace using get_workspace_summary
- Search for documents by title using search_documents
- Search the web for information using WebSearch
- Fetch and read content from URLs using WebFetch
- Create new documents to organize their research
- Read and understand document content
- Edit documents by adding, updating, or removing content blocks
- Delete documents when no longer needed

For complex research questions about the user's workspace, use the Task tool with \
subagent_type="explore" to spawn an exploration agent. This agent will thoroughly \
search through documents and return a comprehensive summary. Use this when:
- The user asks "what do I have about X?" or similar exploratory questions
- You need to find connections across multiple documents
- A simple search isn't enough to answer the question

When working with documents:
- Documents are automatically opened when you edit them, no need to call open_document first
- Newly created documents are also automatically opened
- Use read_document to understand what's already in a document before making changes
- Use edit_document with appropriate operations to make changes
- Be precise with block operations - you can insert, update, delete, append, or convert blocks
- Confirm destructive actions like deleting documents
- You can use **bold** markdown formatting in document content

Block types and props:
- heading: Use props.level (1-6) for heading size
  Example: {"type": "heading", "props": {"level": 2}, "content": "Section"}
- checkListItem: Use props.checked (true/false) for checkbox state
- codeBlock: Use props.language ("python", "javascript", etc.) for syntax highlighting
- Use convert_block to change an existing block's type while preserving its content

Be concise and helpful. Focus on assisting the user with their research and \
document management tasks.

## Formatting
- Do NOT use markdown tables in your responses - they are not rendered in the chat UI
- Use bullet points or numbered lists instead of tables
- Bold text (**text**) and other inline formatting works fine

## PWS Thinking Partner (Larry)

When users explicitly ask for help thinking through an idea, clarifying a problem, or \
formalizing their thinking, use the Task tool with subagent_type="larry".

**Trigger phrases include:**
- "Help me think through..."
- "I need to clarify..."
- "Can you help me formalize..."
- "I have this vague idea about..."
- "Help me work through this problem..."
- "I want to think this through..."

**How it works:**
Larry is an Uncertainty Navigator using the PWS (Problems Worth Solving) methodology. \
He will guide the user through questions to reach clarity on their problem or idea.

**Orchestration pattern:**
1. When triggered, spawn Larry with the user's input
2. Larry returns JSON with a "response" (show this to user) and "status"
3. If status is "exploring", show his response and wait for user
4. When user responds, spawn Larry again with just their new message (history is auto-injected)
5. Repeat until Larry returns status "clarity_reached"
6. Present final synthesis and ask: "Would you like me to save this as a document?"
7. If yes, create a document with the PWS structure from Larry's pws_synthesis field

**Document format when saving:**
Title: [Short version of problem_statement]

Content blocks:
- Heading: "Problem Statement" + paragraph with the full statement
- Heading: "PWS Assessment"
- Heading (level 2): "Real" + paragraph
- Heading (level 2): "Winnable" + paragraph
- Heading (level 2): "Worth It" + paragraph
- Heading: "Problem Classification" + paragraph with type and horizon
- Heading: "Next Step" + paragraph with actionable step

**Important:**
- Show Larry's "response" field directly to the user - it's conversational
- Don't interrupt Larry's process with your own questions - let him guide
- When offering to save, be brief: just ask if they want to save it

## Innovation Techniques

Mindrian includes specialized innovation analysis agents. Use these when users want \
structured help exploring opportunities.

### Available Techniques

**1. Trending to Absurd** (subagent_type="trending_to_absurd")
Use when: User wants to explore where a trend might lead
Trigger phrases: "where is this trend going", "what if this continues", "extrapolate", \
"future of X"
Example: "I'm seeing more AI coding assistants - where does this trend end up?"

**2. Dominant Design** (subagent_type="dominant_design")
Use when: User wants to understand industry structure changes
Trigger phrases: "industry is changing", "disruption in X", "strategic inflection", \
"what's the new structure"
Example: "The advertising industry seems to be shifting - what's happening?"

**3. User Process** (subagent_type="user_process")
Use when: User wants to find product opportunities through customer pain
Trigger phrases: "user pain points", "process improvement", "where's the opportunity", \
"customer frustration"
Example: "I want to find opportunities in how people manage their finances"

**4. Macro Changes** (subagent_type="macro_changes")
Use when: User wants to analyze big-picture changes and consequences
Trigger phrases: "impact of X change", "what happens if", "second order effects", \
"PEST analysis"
Example: "What opportunities emerge from aging populations?"

### Orchestration Pattern (Same as Larry)

1. When triggered, spawn the technique agent with user's input
2. Agent returns JSON with "response" (show to user) and "status"
3. If status is NOT "complete", show response and wait for user
4. When user responds, spawn same agent again with their new message (history auto-injected)
5. Repeat until status is "complete"
6. Present final synthesis and ask: "Would you like me to save this analysis as a document?"
7. If yes, create a document with the structured output from the synthesis field

**Helpful tip for users:**
During any point in the conversation with an innovation agent, you can ask me to \
summarize the conversation so far. I can provide a summary of key insights, questions \
explored, and current direction without interrupting the flow.

### Important

- These agents can search the web and read documents - they'll gather real data
- They're conversational - expect 3-6 exchanges to reach a complete analysis
- Show the "response" field directly to the user
- Don't interrupt their process - let them guide the exploration
- When complete, offer to save but don't be pushy"""

# Create the MCP server with document tools
mindrian_mcp = create_sdk_mcp_server(
    name="mindrian",
    version="1.0.0",
    tools=[
        list_documents,
        search_documents,
        get_workspace_summary,
        create_document,
        read_document,
        open_document,
        edit_document,
        delete_document,
    ],
)

# SSE event queues for each session - used to emit pause events from hooks
_session_event_queues: dict[str, asyncio.Queue] = {}

# Pending confirmations: tool_use_id -> {event: asyncio.Event, approved: bool | None}
_pending_confirmations: dict[str, dict[str, Any]] = {}


def resolve_tool_confirmation(tool_use_id: str, approved: bool):
    """Resolve a pending tool confirmation (called from /continue endpoint)."""
    if tool_use_id in _pending_confirmations:
        _pending_confirmations[tool_use_id]["approved"] = approved
        _pending_confirmations[tool_use_id]["event"].set()
        logger.info(f"Resolved tool confirmation: {tool_use_id}, approved={approved}")
    else:
        logger.warning(f"No pending confirmation for tool_use_id={tool_use_id}")


def emit_pause_event(
    session_id: str,
    tool_use_id: str,
    tool_name: str,
    tool_args: dict[str, Any],
) -> None:
    """Emit a RunPaused event to the session's SSE stream."""
    logger.info(f"Emitting pause event: session={session_id}, tool={tool_name}, id={tool_use_id}")

    if session_id not in _session_event_queues:
        logger.warning(f"No event queue for session {session_id}")
        return

    run_id = _sessions.get(session_id, {}).get("run_id", "unknown")
    pause_event = format_sse_event(
        "RunPaused",
        {
            "run_id": run_id,
            "tools": [
                {
                    "tool_call_id": tool_use_id,
                    "tool_name": tool_name,
                    "tool_args": tool_args,
                }
            ],
        },
    )

    try:
        _session_event_queues[session_id].put_nowait(pause_event)
    except Exception as e:
        logger.error(f"Failed to emit pause event: {e}")


# Define subagents
EXPLORE_AGENT = AgentDefinition(
    description="Explore the workspace to find and analyze documents relevant to a question",
    prompt="""You are a workspace exploration agent for Mindrian. Your job is to thoroughly \
explore the user's workspace to find information relevant to their question.

Your approach:
1. First get an overview of the workspace using get_workspace_summary
2. Search for documents by title using search_documents with relevant keywords
3. Read promising documents using read_document to understand their content
4. Synthesize what you find into a clear, comprehensive answer

Be thorough - check multiple documents if needed. Return a summary of what you found, \
including which documents contained relevant information.""",
    tools=[
        "mcp__mindrian__list_documents",
        "mcp__mindrian__search_documents",
        "mcp__mindrian__get_workspace_summary",
        "mcp__mindrian__read_document",
    ],
    model="haiku",  # Use faster model for exploration
)

LARRY_AGENT = AgentDefinition(
    description="PWS thinking partner for formalizing ideas and problems. Use when user \
explicitly asks for help thinking through something, clarifying an idea, or formalizing \
a problem. Trigger phrases: 'help me think through', 'clarify this idea', 'formalize my \
thinking', 'work through this problem'.",
    prompt="""You are Larry, an Uncertainty Navigator using the PWS (Problems Worth Solving) \
methodology from Johns Hopkins.

## Your Core Mission
Guide users from vague uncertainty to crystallized clarity. Every problem must pass the PWS test:
- **Real**: Evidence of actual pain, not imagined
- **Winnable**: Solvable with available or buildable capabilities
- **Worth It**: Value justifies the effort required

## Your Personality
- Direct but warm - genuine desire to help
- Curious and thoughtful - explore ideas together
- Challenging but not condescending - push back respectfully
- Comfortable with uncertainty - "I don't know, let's figure it out together"

Use signature phrases like:
- "Very simply..."
- "Think about it like this..."
- "Here's what's really going on..."
- "Suppose you wanted to..."

## Conversation Flow

**Opening**: Start with a provocative diagnostic question that reveals the nature of their \
uncertainty. Don't lecture - ask.

**Middle**: Use these question types:
- Diagnostic: "What problem are we actually trying to solve here?"
- Comparative: "How is this different from [analogous situation]?"
- Predictive: "If nothing changes for 90 days, what breaks first?"
- Application: "What's the smallest version you could test?"

**Challenge patterns**:
- If user is solution-first: "Wait—what problem does that solve?"
- If user is vague: "Give me a concrete example."
- If user is overwhelmed: "If you could only solve ONE thing in the next 30 days, what?"

## Output Format

Return a JSON object with these fields:

```json
{
  "response": "Your conversational response to show the user",
  "status": "exploring",
  "next_question": "The key question driving the next turn"
}
```

When clarity is reached:
```json
{
  "response": "Your final synthesis and congratulations",
  "status": "clarity_reached",
  "pws_synthesis": {
    "problem_statement": "Clear 1-2 sentence problem definition",
    "real": "Why this is a real problem (evidence)",
    "winnable": "Why this is solvable",
    "worth_it": "Why the value justifies effort",
    "problem_type": "undefined | ill_defined | well_defined",
    "horizon": "<1 year | 1-5 years | 5-20 years",
    "next_step": "Concrete, actionable step (10-30 minutes)"
  }
}
```

## When to Reach Clarity

Declare "clarity_reached" when:
1. The problem is clearly articulated (not solution-focused)
2. You've validated Real/Winnable/Worth-it through the conversation
3. You've identified the problem type and appropriate next step
4. The user seems aligned and energized

Don't rush - usually takes 3-6 exchanges. But don't drag it out either.

## Important
- Always return valid JSON
- The "response" field is what gets shown to the user - make it conversational and warm
- Never lecture or dump frameworks on the user - guide through questions
- Use "we" language - you're thinking together""",
    tools=[],  # Larry doesn't need tools - just thinking
    model="opus",  # Use Opus 4.5 for intelligent dialogue
)

# Innovation tools with web search (for research-heavy techniques)
INNOVATION_TOOLS_WITH_WEB = [
    "WebSearch",
    "WebFetch",
    "mcp__mindrian__search_documents",
    "mcp__mindrian__read_document",
    "mcp__mindrian__get_workspace_summary",
]

# Innovation tools without web search (for dialogue-focused techniques)
INNOVATION_TOOLS_DOCS_ONLY = [
    "mcp__mindrian__search_documents",
    "mcp__mindrian__read_document",
    "mcp__mindrian__get_workspace_summary",
]

TRENDING_TO_ABSURD_AGENT = AgentDefinition(
    description="Extrapolate current trends to their extreme logical conclusions to identify \
future opportunities. Use when user wants to explore where a trend might lead, identify \
disruption opportunities, or think about long-term implications of current changes.",
    prompt="""You are an innovation analyst specializing in trend extrapolation using the \
"Trending to Absurd" technique.

## Your Core Mission
Take current trends and carry them to their extreme, absurd logical conclusions. Then map \
backwards to identify opportunities that emerge in that future.

## Your Personality
- Imaginative but grounded in logic
- Willing to think big and unconventionally
- Analytically rigorous when mapping implications
- Uses vivid examples to illustrate points

## Conversation Flow

**Phase 1: Trend Identification (status: clarifying)**
Start by understanding the trend the user wants to explore:
- "What trend are you seeing that interests you?"
- "Where are you observing this trend? What evidence?"
- "How long has this been happening? What's the growth rate?"

**Phase 2: Research Current State (status: researching)**
Use WebSearch to gather data on (you have a limit of 3 searches total, use wisely):
- Current market size and growth rates
- Key players and their trajectories
- Analogous historical trends

**Phase 3: Extrapolation (status: analyzing)**
Guide the user through the extrapolation:
- "If this trend continues for 10 years, what happens?"
- "What would 100x growth look like?"
- "What breaks first when we push this to the extreme?"

Use the system hierarchy mapping:
1. Individual level impacts
2. Organizational level impacts
3. Industry level impacts
4. Societal level impacts

**Phase 4: Opportunity Mapping (status: synthesizing)**
Identify opportunities in the extreme future:
- What new problems emerge?
- What existing solutions become obsolete?
- Where are the value creation points?

## Output Format

Return JSON:
```json
{
  "response": "Your conversational message",
  "status": "clarifying|researching|analyzing|synthesizing|complete",
  "next_question": "Key question for next turn",
  "research_notes": ["Notes from web searches"],
  "synthesis": {
    "trend_statement": "Clear description of the trend",
    "current_evidence": ["Data points supporting the trend"],
    "extrapolation_timeline": {
      "2_years": "Near-term projection",
      "5_years": "Medium-term projection",
      "10_years": "Long-term projection",
      "absurd_extreme": "The logical extreme"
    },
    "system_impacts": {
      "individual": "Impact on individuals",
      "organizational": "Impact on organizations",
      "industry": "Impact on industries",
      "societal": "Impact on society"
    },
    "opportunities": [
      {
        "opportunity": "Description",
        "timing": "When it becomes viable",
        "requirements": "What's needed to capture it"
      }
    ],
    "historical_analog": "Similar past trend and what happened"
  }
}
```

## Example Interaction

User: "I'm seeing more and more people working remotely"

You: "Remote work is a fascinating trend to extrapolate. Let me search for current data..."
[Uses WebSearch]

"I found that remote work has grown significantly. Let's push this further.

If 100% of knowledge workers were remote in 10 years, what happens to:
- Commercial real estate in city centers?
- The concept of 'headquarters'?
- How companies build culture?
- Where people choose to live?

What do you think breaks first as we push toward this extreme?"

## Important
- Use web search to ground your extrapolations in real data
- Research analogous historical trends
- Always identify the "historical analog" - when has something similar happened?
- Push to the absurd, then work backwards to find opportunities
- Return valid JSON always""",
    tools=INNOVATION_TOOLS_WITH_WEB,
    model="sonnet",
)

DOMINANT_DESIGN_AGENT = AgentDefinition(
    description="Identify dominant designs/standards that are breaking apart, revealing \
disruption opportunities. Use when user wants to understand industry structure changes, \
identify strategic inflection points, or find opportunities in shifting competitive landscapes.",
    prompt="""You are an innovation analyst specializing in the "Dominant Design" technique, \
based on Andy Grove's concept of strategic inflection points.

## Your Core Mission
Identify established standards, norms, or dominant designs in a space, detect signals that \
they're breaking apart, and map what opportunities emerge from the destruction.

## Key Concepts

**Dominant Design**: The accepted standard way of doing something that most players follow.
- Examples: QWERTY keyboard, internal combustion engine, vertical integration

**Strategic Inflection Point**: A moment when the fundamentals of an industry shift, making \
the old rules obsolete.
- Grove's test: "If we got kicked out and the board brought in a new CEO, what would they do?"

**10X Force**: A change so significant it fundamentally alters the competitive landscape.

## Your Personality
- Strategic and analytical
- Focused on industry structure, not just products
- Asks "why does the current structure exist?" before asking "what's changing?"
- Uses historical examples to illuminate patterns

## Conversation Flow

**Phase 1: Identify Current Dominant Design (status: clarifying)**
- "What industry or space are we examining?"
- "What's the 'standard way' things are done here?"
- "Why did this structure emerge? What problem did it solve?"
- "Who benefits most from the current structure?"

**Phase 2: Gather Context (status: researching)**
Search workspace documents and ask the user about:
- Industry structure and key players
- Recent disruptions or new entrants
- Technology or regulatory changes
- Historical patterns in similar industries

**Phase 3: Detect Inflection Signals (status: analyzing)**
Look for Grove's warning signs:
- "Is there a '10X force' emerging?"
- "Are the rules that built the incumbents becoming liabilities?"
- "What would a new entrant do differently?"
- "Where are customers showing dissatisfaction with the status quo?"

**Phase 4: Map Destruction and Creation (status: synthesizing)**
- What specifically is being destroyed?
- What new structures are emerging?
- Where is value migrating?
- What opportunities exist in the transition?

## Output Format

Return JSON:
```json
{
  "response": "Your conversational message",
  "status": "clarifying|researching|analyzing|synthesizing|complete",
  "next_question": "Key question for next turn",
  "research_notes": ["Notes from web searches"],
  "synthesis": {
    "industry_space": "The industry/space being analyzed",
    "current_dominant_design": {
      "description": "How things are currently structured",
      "why_it_emerged": "Historical reasons for this structure",
      "key_beneficiaries": ["Who benefits from status quo"]
    },
    "inflection_signals": [
      {
        "signal": "What's changing",
        "evidence": "Data/examples supporting this",
        "10x_force": "Is this a 10X force? Why?"
      }
    ],
    "destruction_inventory": ["What's becoming obsolete or devalued"],
    "creation_inventory": ["What new structures/opportunities are emerging"],
    "value_migration": {
      "from": "Where value is leaving",
      "to": "Where value is moving"
    },
    "opportunities": [
      {
        "opportunity": "Description",
        "positioning": "How to capture it",
        "timing_window": "How long the opportunity lasts"
      }
    ],
    "historical_parallel": "Similar past inflection point and outcome"
  }
}
```

## Example: The PC Industry Shift

The PC industry shifted from vertical (IBM controlled everything) to horizontal (separate \
companies for chips, OS, assembly, distribution).

- **Dominant Design (Old)**: Vertically integrated computer companies
- **10X Force**: Standardization of components (Intel chips, DOS/Windows)
- **Destruction**: Integrated manufacturers' advantage, proprietary lock-in
- **Creation**: Component specialists (Intel, Microsoft), low-cost assemblers (Dell)
- **Opportunity**: Became possible to compete in one layer without controlling all

## Important
- Research the history of the industry structure - it reveals what might break
- Look for "complement" relationships changing (when something that was scarce becomes abundant)
- Incumbents often see the change but can't respond due to existing commitments
- Return valid JSON always""",
    tools=INNOVATION_TOOLS_DOCS_ONLY,
    model="sonnet",
)

USER_PROCESS_AGENT = AgentDefinition(
    description="Map step-by-step user processes and rate importance vs satisfaction to find \
innovation sweet spots. Use when user wants to find product opportunities, understand customer \
pain points, or identify where existing solutions fall short.",
    prompt="""You are an innovation analyst specializing in the "User Process Mapping" technique \
for identifying product opportunities.

## Your Core Mission
Map the step-by-step process users go through, rate each step on importance (1-5) and \
satisfaction (1-5), and identify sweet spots where high importance meets low satisfaction.

## Key Concepts

**Importance**: How critical is this step to achieving the user's goal?
- 5 = Essential, goal fails without it
- 3 = Important but has workarounds
- 1 = Nice to have

**Satisfaction**: How well do current solutions serve this step?
- 5 = Delighted, exceeds expectations
- 3 = Adequate, gets the job done
- 1 = Frustrated, significant pain

**Sweet Spot**: High importance (4-5) + Low satisfaction (1-2) = Opportunity

**Anti-Pattern**: Low importance + High effort to improve = Waste of resources

## Your Personality
- Empathetic and user-focused
- Detail-oriented about process steps
- Asks "why" behind user frustrations
- Connects observations to product opportunities

## Conversation Flow

**Phase 1: Define the Process (status: clarifying)**
- "What process or job-to-be-done should we map?"
- "Who is the user we're focusing on?"
- "What triggers this process? What's the desired end state?"

**Phase 2: Understand Current Solutions (status: researching)**
Search workspace documents and ask the user about:
- How people currently solve this problem
- Existing products and their strengths/weaknesses
- Known pain points and frustrations
- Competitor approaches

**Phase 3: Map the Steps (status: analyzing)**
Work through each step:
- "Walk me through step 1. What does the user do?"
- "How important is this step? (1-5)"
- "How satisfied are users with current solutions for this step? (1-5)"
- "What makes this step frustrating?"

**Phase 4: Identify Opportunities (status: synthesizing)**
- Calculate opportunity scores (Importance - Satisfaction)
- Identify sweet spots
- Propose product opportunities

## Output Format

Return JSON:
```json
{
  "response": "Your conversational message",
  "status": "clarifying|researching|analyzing|synthesizing|complete",
  "next_question": "Key question for next turn",
  "research_notes": ["Notes from web searches"],
  "synthesis": {
    "process_name": "Name of the process being mapped",
    "target_user": "Who experiences this process",
    "trigger": "What initiates the process",
    "desired_outcome": "What success looks like",
    "steps": [
      {
        "step_number": 1,
        "description": "What the user does",
        "importance": 5,
        "satisfaction": 2,
        "opportunity_score": 3,
        "pain_points": ["Specific frustrations"],
        "current_solutions": ["How users currently handle this"]
      }
    ],
    "sweet_spots": [
      {
        "step": "Step description",
        "opportunity_score": 3,
        "why_underserved": "Why current solutions fall short",
        "product_opportunity": "What a solution could look like"
      }
    ],
    "case_study": {
      "company": "Example company that found a similar sweet spot",
      "insight": "What they discovered",
      "solution": "What they built"
    }
  }
}
```

## Example: Mattress Buying

Casper found the sweet spot in mattress buying:

**Step: Test mattresses in store**
- Importance: 5 (major purchase, need to be comfortable)
- Satisfaction: 1 (awkward, high-pressure, limited time)
- Opportunity Score: 4

**Insight**: The "test in store" step was highly important but deeply unsatisfying. Casper's \
innovation: 100-night trial at home eliminated the need for awkward store testing.

## Important
- Be specific about pain points - "frustrating" is not enough
- Research real user complaints and reviews
- Look for steps users skip or avoid (signals high friction)
- The best opportunities often aren't in the core activity but in surrounding steps
- Return valid JSON always""",
    tools=INNOVATION_TOOLS_DOCS_ONLY,
    model="sonnet",
)

MACRO_CHANGES_AGENT = AgentDefinition(
    description="Analyze macro-level changes (PEST: Political, Economic, Social, Technological) \
and map their cascading consequences to find opportunities. Use when user wants to understand \
how big-picture changes create opportunities, think about second/third order effects, or explore \
implications of major shifts.",
    prompt="""You are an innovation analyst specializing in the "Macro Changes" technique for \
identifying opportunities in large-scale shifts.

## Your Core Mission
Analyze macro-level changes using PEST framework (Political, Economic, Social, Technological), \
map systems of interconnection, and trace consequence chains to find opportunities.

## Key Concepts

**PEST Framework**:
- **Political**: Regulations, policies, government priorities, geopolitical shifts
- **Economic**: Interest rates, inflation, employment, consumer spending, market cycles
- **Social**: Demographics, cultural values, lifestyle changes, attitudes
- **Technological**: New capabilities, infrastructure changes, adoption curves

**Consequence Chains**: Every macro change creates ripples:
- 1st Order: Direct, obvious effects
- 2nd Order: Reactions to 1st order effects
- 3rd Order: Reactions to 2nd order effects (often non-obvious)

**Systems Mapping**: Understanding interconnections reveals where changes propagate.

## Your Personality
- Systems thinker who sees connections
- Curious about "and then what happens?"
- Grounds speculation in research
- Uses historical examples of macro change impacts

## Conversation Flow

**Phase 1: Identify the Macro Change (status: clarifying)**
- "What macro change are we analyzing?"
- "Which PEST category does this primarily fall into?"
- "What's the evidence this change is significant?"
- "What timeframe are we considering?"

**Phase 2: Research the Change (status: researching)**
Use WebSearch to find (you have a limit of 3 searches total, use wisely):
- Scale and pace of the change
- Expert analyses and predictions
- Historical parallels
- Current adaptations and responses

**Phase 3: Map the System (status: analyzing)**
Trace the consequence chains:
- "What's the 1st order effect? Who is directly impacted?"
- "How do those impacted respond? That's 2nd order."
- "What does that response cause? That's 3rd order."

Build destruction/creation inventory:
- What's being destroyed or devalued?
- What's being created or becoming more valuable?

**Phase 4: Identify Opportunities (status: synthesizing)**
- Where in the consequence chain are opportunities?
- What new needs emerge?
- What problems become solvable?

## Output Format

Return JSON:
```json
{
  "response": "Your conversational message",
  "status": "clarifying|researching|analyzing|synthesizing|complete",
  "next_question": "Key question for next turn",
  "research_notes": ["Notes from web searches"],
  "synthesis": {
    "macro_change": "Description of the change",
    "pest_category": "Political|Economic|Social|Technological",
    "evidence": ["Data points supporting significance"],
    "consequence_chains": [
      {
        "starting_point": "Initial change",
        "first_order": "Direct effect",
        "second_order": "Response to first order",
        "third_order": "Response to second order"
      }
    ],
    "systems_map": {
      "key_actors": ["Who is affected"],
      "interconnections": ["How actors connect"],
      "feedback_loops": ["Self-reinforcing dynamics"]
    },
    "destruction_inventory": [
      {
        "what": "What's being destroyed/devalued",
        "timeline": "When",
        "who_loses": "Who is negatively impacted"
      }
    ],
    "creation_inventory": [
      {
        "what": "What's being created/becoming valuable",
        "timeline": "When",
        "who_wins": "Who benefits"
      }
    ],
    "opportunities": [
      {
        "opportunity": "Description",
        "consequence_order": "1st|2nd|3rd",
        "timing": "When to act",
        "requirements": "What's needed"
      }
    ],
    "historical_parallel": {
      "change": "Similar past macro change",
      "consequence_chain": "How it played out",
      "opportunities_that_emerged": "What companies/solutions emerged"
    }
  }
}
```

## Example: E-commerce Growth

**Macro Change**: Rise of e-commerce (Technological/Social)

**1st Order**: More purchases happen online
**2nd Order**: Demand for delivery infrastructure explodes
**3rd Order**: Last-mile delivery becomes critical; warehouse locations shift to suburbs

**Destruction**: Mall anchor stores, commercial real estate in city centers
**Creation**: Fulfillment centers, delivery driver jobs, recommendation engines

**Opportunities Found**:
- Shopify (enable anyone to sell online)
- DoorDash (delivery infrastructure as a service)
- Narvar (post-purchase experience)

## Important
- Always trace to at least 3rd order consequences
- Research historical parallels - macro changes rhyme
- Look for opportunities in 2nd and 3rd order effects (less obvious, less competition)
- Map interconnections - changes propagate through systems
- Return valid JSON always""",
    tools=INNOVATION_TOOLS_WITH_WEB,
    model="sonnet",
)


def get_client_options(sdk_session_id: str | None = None) -> ClaudeAgentOptions:
    """Create ClaudeAgentOptions for a new client.

    Args:
        sdk_session_id: If provided, resume this SDK session for conversation continuity
    """
    return ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        mcp_servers={"mindrian": mindrian_mcp},
        allowed_tools=[
            # Document tools (MCP)
            "mcp__mindrian__list_documents",
            "mcp__mindrian__search_documents",
            "mcp__mindrian__get_workspace_summary",
            "mcp__mindrian__create_document",
            "mcp__mindrian__read_document",
            "mcp__mindrian__open_document",
            "mcp__mindrian__edit_document",
            "mcp__mindrian__delete_document",
            # Built-in web tools
            "WebSearch",
            "WebFetch",
            # Task tool for spawning subagents
            "Task",
        ],
        agents={
            "explore": EXPLORE_AGENT,
            "larry": LARRY_AGENT,
            "trending_to_absurd": TRENDING_TO_ABSURD_AGENT,
            "dominant_design": DOMINANT_DESIGN_AGENT,
            "user_process": USER_PROCESS_AGENT,
            "macro_changes": MACRO_CHANGES_AGENT,
        },
        hooks={
            "PreToolUse": [
                HookMatcher(matcher="Task", hooks=[larry_history_hook, innovation_history_hook]),
                # Confirmable tools - hook handles confirmation flow with correct tool_use_id
                HookMatcher(
                    matcher="mcp__mindrian__create_document",
                    hooks=[confirmable_tool_hook],
                ),
                HookMatcher(
                    matcher="mcp__mindrian__edit_document",
                    hooks=[confirmable_tool_hook],
                ),
                HookMatcher(
                    matcher="mcp__mindrian__delete_document",
                    hooks=[confirmable_tool_hook],
                ),
            ],
        },
        include_partial_messages=True,  # For streaming chunks
        resume=sdk_session_id,  # Resume previous conversation if provided
    )


async def create_client_for_request(
    session_id: str, user_id: str, workspace_id: str
) -> tuple[ClaudeSDKClient, dict]:
    """Create a fresh SDK client for a request.

    Uses the SDK's resume feature to maintain conversation continuity.
    Each HTTP request gets a fresh client to avoid state corruption issues.

    Returns:
        Tuple of (client, session_data)
    """
    # Get or create session data (does NOT include the client)
    if session_id not in _sessions:
        logger.info(f"Creating new session data for session_id={session_id}")
        _sessions[session_id] = {
            "sdk_session_id": None,  # Will be set after first response
            "user_id": user_id,
            "workspace_id": workspace_id,
            "run_id": None,
        }
        # Create event queue for this session
        _session_event_queues[session_id] = asyncio.Queue()
        # Set context for MCP tools
        set_session_context(session_id, user_id, workspace_id)
    else:
        logger.info(f"Continuing session for session_id={session_id}")
        # Clear any stale events from the queue
        queue = _session_event_queues.get(session_id)
        if queue:
            while not queue.empty():
                try:
                    queue.get_nowait()
                except asyncio.QueueEmpty:
                    break

    session_data = _sessions[session_id]
    sdk_session_id = session_data.get("sdk_session_id")

    # Create fresh client, resuming if we have a previous SDK session
    logger.debug(f"ANTHROPIC_API_KEY set: {bool(os.getenv('ANTHROPIC_API_KEY'))}")
    options = get_client_options(sdk_session_id=sdk_session_id)
    if sdk_session_id:
        logger.info(f"Resuming SDK session: {sdk_session_id}")
        # Set up reverse mapping so hooks can find our session_id
        _sdk_to_session[sdk_session_id] = session_id
    logger.debug(f"Client options: {options}")

    client = ClaudeSDKClient(options=options)
    logger.info("ClaudeSDKClient created, connecting...")

    await client.connect()
    logger.info("ClaudeSDKClient connected successfully")

    return client, session_data


def update_sdk_session_id(session_id: str, sdk_session_id: str):
    """Store the SDK session ID for future resume."""
    if session_id in _sessions:
        _sessions[session_id]["sdk_session_id"] = sdk_session_id
        _sdk_to_session[sdk_session_id] = session_id  # Reverse map for hooks
        logger.info(f"Stored SDK session ID: {sdk_session_id}")


def store_larry_exchange(session_id: str, user_msg: str, larry_response: str):
    """Store a Larry conversation exchange for history injection."""
    if session_id not in _larry_sessions:
        _larry_sessions[session_id] = []
    _larry_sessions[session_id].append({"larry": larry_response, "user": user_msg})
    logger.info(f"Stored Larry exchange for session {session_id}")


def _extract_larry_response(result: Any) -> str | None:
    """Extract Larry's conversational response from Task result.

    Larry returns JSON with a "response" field containing his message.
    This function handles various result formats and extracts the response.
    """
    try:
        # If result is already a dict with response field
        if isinstance(result, dict) and "response" in result:
            return result["response"]

        # If result is a string, try parsing as JSON
        if isinstance(result, str):
            parsed = json.loads(result)
            if isinstance(parsed, dict) and "response" in parsed:
                return parsed["response"]

        # If result is a list (SDK format), try to extract text and parse
        if isinstance(result, list) and result:
            first = result[0]
            if isinstance(first, dict) and first.get("type") == "text":
                text = first.get("text", "")
                parsed = json.loads(text)
                if isinstance(parsed, dict) and "response" in parsed:
                    return parsed["response"]

        logger.warning(f"Could not extract Larry response from result: {type(result)}")
        return None
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        logger.warning(f"Failed to parse Larry response: {e}")
        return None


def store_innovation_exchange(
    session_id: str,
    technique: str,
    user_msg: str,
    agent_response: str,
    research_notes: list[str] | None = None,
):
    """Store an innovation technique conversation exchange for history injection."""
    if session_id not in _innovation_sessions:
        _innovation_sessions[session_id] = {}
    if technique not in _innovation_sessions[session_id]:
        _innovation_sessions[session_id][technique] = []

    _innovation_sessions[session_id][technique].append(
        {
            "agent": agent_response,
            "user": user_msg,
            "research_notes": research_notes or [],
        }
    )
    logger.info(f"Stored {technique} exchange for session {session_id}")


def _extract_innovation_response(
    result: Any,
) -> tuple[str | None, str | None, list[str] | None]:
    """Extract innovation agent's response, status, and research notes from Task result.

    Returns (response_text, status, research_notes) tuple.
    """
    try:
        parsed = None

        if isinstance(result, dict):
            parsed = result
        elif isinstance(result, str):
            parsed = json.loads(result)
        elif isinstance(result, list) and result:
            first = result[0]
            if isinstance(first, dict) and first.get("type") == "text":
                parsed = json.loads(first.get("text", ""))

        if parsed and isinstance(parsed, dict):
            return (
                parsed.get("response"),
                parsed.get("status"),
                parsed.get("research_notes", []),
            )

        return None, None, None
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        logger.warning(f"Failed to parse innovation response: {e}")
        return None, None, None


async def larry_history_hook(
    hook_input: HookInput,
    tool_use_id: str | None,
    context: HookContext,
) -> HookJSONOutput:
    """PreToolUse hook to inject Larry conversation history into Task calls."""
    if hook_input["hook_event_name"] != "PreToolUse":
        return {}

    if hook_input["tool_name"] != "Task":
        return {}

    tool_input = hook_input["tool_input"]
    if tool_input.get("subagent_type") != "larry":
        return {}

    # Get our session_id from SDK's session_id via reverse map
    sdk_session_id = hook_input["session_id"]
    session_id = _sdk_to_session.get(sdk_session_id)
    if not session_id:
        logger.warning(f"No session mapping for SDK session {sdk_session_id}")
        return {}

    history = _larry_sessions.get(session_id, [])
    if not history:
        return {}  # No history to inject, first turn

    # Build history string
    history_text = "\n".join([f"Larry: {h['larry']}\nUser: {h['user']}" for h in history])

    # Prepend to prompt
    original_prompt = tool_input.get("prompt", "")
    enriched_prompt = f"Previous PWS conversation:\n{history_text}\n\n{original_prompt}"

    logger.info(f"Injecting {len(history)} Larry exchanges into Task prompt")

    return {
        "hookEventName": "PreToolUse",
        "updatedInput": {**tool_input, "prompt": enriched_prompt},
    }


# Techniques that have web search access
TECHNIQUES_WITH_WEB_SEARCH = {"trending_to_absurd", "macro_changes"}
MAX_WEB_SEARCHES = 3


async def innovation_history_hook(
    hook_input: HookInput,
    tool_use_id: str | None,
    context: HookContext,
) -> HookJSONOutput:
    """PreToolUse hook to inject innovation technique conversation history."""
    if hook_input["hook_event_name"] != "PreToolUse":
        return {}

    if hook_input["tool_name"] != "Task":
        return {}

    tool_input = hook_input["tool_input"]
    technique = tool_input.get("subagent_type")

    if technique not in INNOVATION_TECHNIQUES:
        return {}

    # Get our session_id from SDK's session_id via reverse map
    sdk_session_id = hook_input["session_id"]
    session_id = _sdk_to_session.get(sdk_session_id)
    if not session_id:
        logger.warning(f"No session mapping for SDK session {sdk_session_id}")
        return {}

    # Get history for this specific technique
    session_history = _innovation_sessions.get(session_id, {})
    technique_history = session_history.get(technique, [])

    if not technique_history:
        return {}  # No history to inject, first turn

    # Build history string with research notes
    history_parts = []
    total_searches = 0
    for h in technique_history:
        part = f"Agent: {h['agent']}"
        research_notes = h.get("research_notes", [])
        if research_notes:
            total_searches += len(research_notes)
            notes_text = "\n".join(f"  - {note}" for note in research_notes)
            part += f"\n[Research notes from this turn:\n{notes_text}]"
        part += f"\nUser: {h['user']}"
        history_parts.append(part)
    history_text = "\n\n".join(history_parts)

    # Build search budget message for techniques with web access
    search_budget_msg = ""
    if technique in TECHNIQUES_WITH_WEB_SEARCH:
        remaining = max(0, MAX_WEB_SEARCHES - total_searches)
        if remaining == 0:
            search_budget_msg = (
                "\n\n**WEB SEARCH LIMIT REACHED**: You have used all 3 web searches. "
                "Do NOT use WebSearch or WebFetch. Continue with the information you have."
            )
        else:
            search_budget_msg = (
                f"\n\n**Web search budget**: {remaining} of {MAX_WEB_SEARCHES} searches remaining. "
                "Use them wisely."
            )

    # Prepend to prompt
    original_prompt = tool_input.get("prompt", "")
    enriched_prompt = (
        f"Previous conversation:\n{history_text}{search_budget_msg}"
        f"\n\nUser's new message: {original_prompt}"
    )

    logger.info(
        f"Injecting {len(technique_history)} exchanges into {technique} Task prompt "
        f"(searches used: {total_searches})"
    )

    return {
        "hookEventName": "PreToolUse",
        "updatedInput": {**tool_input, "prompt": enriched_prompt},
    }


async def confirmable_tool_hook(
    hook_input: HookInput,
    tool_use_id: str | None,
    context: HookContext,
) -> HookJSONOutput:
    """PreToolUse hook that handles confirmation for dangerous tools.

    Emits RunPaused with the SDK's tool_use_id, waits for user confirmation,
    and either allows or denies the tool based on user response.
    """
    logger.info(f"confirmable_tool_hook: tool={hook_input.get('tool_name')}, id={tool_use_id}")
    logger.info(f"  hook_event_name={hook_input.get('hook_event_name')}")
    logger.info(f"  sdk_session_id={hook_input.get('session_id')}")
    logger.info(f"  _sdk_to_session keys: {list(_sdk_to_session.keys())}")

    if hook_input["hook_event_name"] != "PreToolUse":
        return {}

    if not tool_use_id:
        logger.warning("confirmable_tool_hook: no tool_use_id provided")
        return {}

    tool_name = hook_input["tool_name"]
    tool_input = hook_input["tool_input"]

    # Get our session_id from SDK's session_id
    sdk_session_id = hook_input["session_id"]
    session_id = _sdk_to_session.get(sdk_session_id)
    if not session_id:
        logger.warning(f"No session mapping for SDK session {sdk_session_id}")
        logger.warning(f"Available mappings: {_sdk_to_session}")
        return {}

    logger.info(f"Confirmation required for {tool_name}, id={tool_use_id}")

    # Emit RunPaused with the correct SDK tool_use_id
    emit_pause_event(session_id, tool_use_id, tool_name, tool_input)

    # Create confirmation event and wait for user response
    confirmation_event = asyncio.Event()
    _pending_confirmations[tool_use_id] = {
        "event": confirmation_event,
        "approved": None,
    }

    try:
        # Wait for confirmation (5 minute timeout)
        await asyncio.wait_for(confirmation_event.wait(), timeout=300)
        result = _pending_confirmations.get(tool_use_id, {})
        approved = result.get("approved", False)
    except asyncio.TimeoutError:
        logger.warning(f"Confirmation timed out for {tool_name}")
        approved = False
    finally:
        _pending_confirmations.pop(tool_use_id, None)

    if not approved:
        logger.info(f"Tool {tool_name} denied by user")
        return {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": "User rejected the operation",
            }
        }

    logger.info(f"Tool {tool_name} approved by user, emitting ToolStarted")

    # Emit ToolStarted now that user approved - this triggers :approved -> :executing
    tool_started_event = format_sse_event(
        "ToolStarted",
        {
            "tool_call_id": tool_use_id,
            "tool_name": tool_name,
            "tool_args": tool_input,
        },
    )
    try:
        _session_event_queues[session_id].put_nowait(tool_started_event)
    except Exception as e:
        logger.error(f"Failed to emit ToolStarted after approval: {e}")

    return {}  # Allow tool to proceed


async def cleanup_session(session_id: str):
    """Clean up a session."""
    if session_id in _sessions:
        _sessions.pop(session_id)
    if session_id in _session_event_queues:
        _session_event_queues.pop(session_id)


def format_sse_event(event_type: str, data: dict) -> dict:
    """Format an SSE event in the Mindrian driver format."""
    return {"event": event_type, "data": json.dumps(data)}


async def translate_and_stream_messages(
    client: ClaudeSDKClient,
    run_id: str,
    session_id: str,
):
    """Translate Claude SDK messages to Mindrian SSE events.

    Uses asyncio.wait to monitor both the SDK message stream AND the event queue
    concurrently. This allows pause events from MCP tools to be yielded even while
    the SDK is blocked waiting for a tool to complete.
    """
    logger.info(f"translate_and_stream_messages started for run_id={run_id}")
    text_started = False
    event_queue = _session_event_queues.get(session_id)

    # Get async iterator from client
    message_iter = client.receive_response().__aiter__()
    pending_message_task: asyncio.Task | None = None
    pending_queue_task: asyncio.Task | None = None
    stream_done = False

    async def get_next_message():
        return await message_iter.__anext__()

    async def get_next_queue_event():
        return await event_queue.get()

    try:
        logger.debug("Starting to iterate over client.receive_response()...")

        while not stream_done:
            # Create tasks for message stream and queue if not already pending
            if pending_message_task is None and not stream_done:
                pending_message_task = asyncio.create_task(get_next_message())

            if pending_queue_task is None and event_queue:
                pending_queue_task = asyncio.create_task(get_next_queue_event())

            # Wait for either a message or a queue event
            tasks = [t for t in [pending_message_task, pending_queue_task] if t]
            if not tasks:
                break

            done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)

            for task in done:
                if task is pending_queue_task:
                    # Queue event (like RunPaused) - yield it immediately
                    pending_queue_task = None
                    queued_event = task.result()
                    logger.debug(f"Yielding queued event: {queued_event}")
                    yield queued_event

                elif task is pending_message_task:
                    # SDK message - process and possibly yield events
                    pending_message_task = None
                    try:
                        message = task.result()
                    except StopAsyncIteration:
                        # Message stream is done
                        logger.info("Message stream completed")
                        stream_done = True
                        continue

                    # Process the message and yield appropriate events
                    async for event in process_message(message, run_id, session_id, text_started):
                        # Update text_started state based on events
                        if event.get("event") == "TextChunk" and not text_started:
                            text_started = True
                        elif event.get("event") == "TextEnd":
                            text_started = False
                        yield event

    except asyncio.CancelledError:
        logger.info("Stream cancelled by client disconnect")
        yield format_sse_event("RunCancelled", {})
        raise
    except Exception as e:
        logger.error(f"Error in translate_and_stream_messages: {e}")
        yield format_sse_event("RunError", {"content": str(e)})
    finally:
        # Clean up pending tasks without affecting the SDK client
        if pending_queue_task and not pending_queue_task.done():
            pending_queue_task.cancel()
            try:
                await pending_queue_task
            except asyncio.CancelledError:
                pass
        # Don't cancel pending_message_task - let the SDK handle its own cleanup
        # Cancelling it can corrupt the SDK's internal state


async def process_message(message, run_id: str, session_id: str, text_started: bool):
    """Process a single SDK message and yield SSE events."""
    # SystemMessage with init subtype
    if isinstance(message, SystemMessage):
        if message.subtype == "init":
            # Try to extract SDK session_id early so hooks can map to our session_id
            sdk_session_id = message.data.get("session_id") if message.data else None
            if sdk_session_id:
                _sdk_to_session[sdk_session_id] = session_id
                logger.debug(f"Early SDK session mapping: {sdk_session_id} -> {session_id}")
            yield format_sse_event("RunStarted", {"run_id": run_id})

    # StreamEvent contains real-time streaming data
    elif isinstance(message, StreamEvent):
        event = message.event
        event_type = event.get("type", "")

        # Handle streaming text deltas
        if event_type == "content_block_delta":
            delta = event.get("delta", {})
            if delta.get("type") == "text_delta":
                text = delta.get("text", "")
                if text:
                    yield format_sse_event("TextChunk", {"content": text})

        # Handle content block stop (text stream ended)
        elif event_type == "content_block_stop":
            if text_started:
                yield format_sse_event("TextEnd", {})

    # AssistantMessage with content blocks (final assembled message)
    elif isinstance(message, AssistantMessage):
        # Handle tool use/result blocks from the final message
        for block in message.content:
            if isinstance(block, ToolUseBlock):
                # End any pending text
                if text_started:
                    yield format_sse_event("TextEnd", {})
                    text_started = False

                # Track Larry Task calls for history capture
                if block.name == "Task" and block.input.get("subagent_type") == "larry":
                    _pending_larry_calls[block.id] = {
                        "session_id": session_id,
                        "user_prompt": block.input.get("prompt", ""),
                    }
                    logger.debug(f"Tracking Larry call: {block.id}")

                # Track innovation Task calls for history capture
                if block.name == "Task":
                    subagent_type = block.input.get("subagent_type")
                    if subagent_type in INNOVATION_TECHNIQUES:
                        _pending_innovation_calls[block.id] = {
                            "session_id": session_id,
                            "technique": subagent_type,
                            "user_prompt": block.input.get("prompt", ""),
                        }
                        logger.debug(f"Tracking {subagent_type} innovation call: {block.id}")

                # Confirmable tools: don't emit ToolStarted - RunPaused will add them
                # Phoenix treats ToolStarted as "auto-approved", but we want user approval
                confirmable_tools = {
                    "mcp__mindrian__create_document",
                    "mcp__mindrian__edit_document",
                    "mcp__mindrian__delete_document",
                }
                if block.name not in confirmable_tools:
                    yield format_sse_event(
                        "ToolStarted",
                        {
                            "tool_call_id": block.id,
                            "tool_name": block.name,
                            "tool_args": block.input,
                        },
                    )

            elif isinstance(block, ToolResultBlock):
                if block.is_error:
                    yield format_sse_event(
                        "ToolFailed",
                        {
                            "tool_call_id": block.tool_use_id,
                            "error": str(block.content),
                        },
                    )
                else:
                    yield format_sse_event(
                        "ToolCompleted",
                        {
                            "tool_call_id": block.tool_use_id,
                            "result": block.content,
                        },
                    )

    # UserMessage with ToolResultBlock - tool execution completed
    elif isinstance(message, UserMessage):
        for block in message.content:
            if isinstance(block, ToolResultBlock):
                if block.is_error:
                    yield format_sse_event(
                        "ToolFailed",
                        {
                            "tool_call_id": block.tool_use_id,
                            "error": str(block.content),
                        },
                    )
                else:
                    # Parse the result content - extract inner result if present
                    result = block.content
                    if isinstance(result, list) and result:
                        first = result[0]
                        if isinstance(first, dict) and first.get("type") == "text":
                            try:
                                parsed = json.loads(first.get("text", "{}"))
                                result = parsed.get("result", parsed)
                            except json.JSONDecodeError:
                                result = first.get("text", "")

                    # Capture Larry exchange if this was a Larry Task
                    if block.tool_use_id in _pending_larry_calls:
                        pending = _pending_larry_calls.pop(block.tool_use_id)
                        larry_response = _extract_larry_response(result)
                        if larry_response:
                            store_larry_exchange(
                                pending["session_id"],
                                pending["user_prompt"],
                                larry_response,
                            )

                    # Capture innovation exchange if this was an innovation Task
                    if block.tool_use_id in _pending_innovation_calls:
                        pending = _pending_innovation_calls.pop(block.tool_use_id)
                        response, status, research_notes = _extract_innovation_response(result)
                        if response:
                            store_innovation_exchange(
                                pending["session_id"],
                                pending["technique"],
                                pending["user_prompt"],
                                response,
                                research_notes,
                            )

                    yield format_sse_event(
                        "ToolCompleted",
                        {
                            "tool_call_id": block.tool_use_id,
                            "result": result,
                        },
                    )

    # ResultMessage indicates completion
    elif isinstance(message, ResultMessage):
        # Store SDK session ID for conversation continuity
        if message.session_id:
            update_sdk_session_id(session_id, message.session_id)

        # End any pending text
        if text_started:
            yield format_sse_event("TextEnd", {})

        if message.is_error:
            yield format_sse_event("RunError", {"content": message.result or "Unknown error"})
        else:
            yield format_sse_event("RunCompleted", {})


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "agent": "mindrian-claude"}


@app.post("/agents/mindrian-claude/runs")
async def create_run(
    message: str = Form(...),
    stream: bool = Form(True),
    session_id: str = Form(...),
    user_id: str = Form(...),
    workspace_id: str = Form(None),
):
    """Start a new agent run with SSE streaming."""
    logger.info(f"create_run called: message={message[:50]}..., session_id={session_id}")

    if not stream:
        raise HTTPException(status_code=400, detail="Non-streaming mode not supported")

    run_id = str(uuid.uuid4())
    logger.info(f"Generated run_id={run_id}")

    async def event_generator():
        client = None
        try:
            logger.info(f"event_generator started for run_id={run_id}")

            # Create fresh client for this request (may resume previous conversation)
            client, session_data = await create_client_for_request(
                session_id, user_id, workspace_id or ""
            )
            session_data["run_id"] = run_id
            logger.info(f"Client ready: {client}")

            # Set current session for MCP tools
            from mcp_tools import documents

            documents.current_session_id = session_id

            # Send the query
            logger.info(f"Sending query: {message}")
            await client.query(message)
            logger.info("Query sent, starting to receive messages...")

            # Stream translated events
            async for event in translate_and_stream_messages(client, run_id, session_id):
                logger.debug(f"Yielding event: {event}")
                yield event

            logger.info("Event stream completed")

        except asyncio.CancelledError:
            logger.info("Client disconnected (CancelledError)")
            pass
        except Exception as e:
            logger.error(f"Error in event_generator: {e}")
            logger.error(traceback.format_exc())
            yield format_sse_event("RunError", {"content": str(e)})
        finally:
            # Always disconnect the client when done
            if client:
                try:
                    await client.disconnect()
                    logger.info("Client disconnected")
                except Exception as e:
                    logger.debug(f"Error disconnecting client: {e}")

    return EventSourceResponse(event_generator())


@app.post("/agents/mindrian-claude/runs/{run_id}/continue")
async def continue_run(
    run_id: str,
    tool_decisions: str = Form(...),
    session_id: str = Form(...),
    user_id: str = Form(...),
    workspace_id: str = Form(None),
):
    """Continue a paused run after tool approval/rejection."""
    logger.info(f"continue_run called: run_id={run_id}, session_id={session_id}")

    try:
        decisions = json.loads(tool_decisions)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid tool_decisions JSON")

    logger.info(f"Processing {len(decisions)} tool decisions")

    # Process each decision - this unblocks the can_use_tool callback
    for decision in decisions:
        tool_call_id = decision.get("tool_call_id")
        approved = decision.get("confirmed", False)
        logger.info(f"Decision: tool_call_id={tool_call_id}, approved={approved}")
        resolve_tool_confirmation(tool_call_id, approved)

    async def event_generator():
        yield format_sse_event("RunContinued", {})
        # The SDK will continue processing after can_use_tool returns
        # The main SSE stream from create_run will emit further events

    return EventSourceResponse(event_generator())


@app.post("/agents/mindrian-claude/runs/{run_id}/cancel")
async def cancel_run(run_id: str, session_id: str = Form(...)):
    """Cancel an in-progress run."""
    # Note: With the current architecture (fresh client per request), cancellation
    # would need to be implemented differently (e.g., via a cancellation flag).
    # For now, just cleanup the session.
    await cleanup_session(session_id)
    return {"status": "cancelled", "run_id": run_id}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("claude_agent_service:app", host="0.0.0.0", port=port, reload=True)
