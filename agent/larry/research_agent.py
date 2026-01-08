"""
Research Agent - Larry Navigator v2.0
Decides when to trigger web research and generates Tavily queries
"""

from typing import List
from agno.agent import Agent
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from config.prompts import RESEARCH_AGENT_PROMPT

class ResearchDecision(BaseModel):
    should_research: bool = Field(
        ..., description="True if external research is needed, False otherwise."
    )
    reasoning: str = Field(
        ..., description="Reasoning for the decision."
    )
    queries: List[str] = Field(
        ..., description="List of search queries to execute (if should_research is True)."
    )
    research_focus: str = Field(
        ..., description="Focus or goal of the research."
    )

research_agent = Agent(
    model=Claude(id="claude-haiku-4-5"),
    description="You are the Research Agent. Decide if web research is valuable.",
    instructions=RESEARCH_AGENT_PROMPT,
    output_schema=ResearchDecision,
    use_json_mode=True,
)
