"""
Complexity Assessor Agent - Larry Navigator v2.0
Classifies complexity using Cynefin framework: simple | complicated | complex | chaotic
"""

from typing import List, Literal
from agno.agent import Agent
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from .prompts import COMPLEXITY_ASSESSOR_PROMPT
from agent_settings.agent_settings import larry_helpers_model 

class ComplexityAssessment(BaseModel):
    complexity: Literal["simple", "complicated", "complex", "chaotic"] = Field(
        ..., description="The Cynefin domain classification."
    )
    confidence: float = Field(
        ..., description="Confidence score between 0.0 and 1.0."
    )
    reasoning: str = Field(
        ..., description="Reasoning for the complexity assessment."
    )
    characteristics: List[str] = Field(
        ..., description="List of characteristics identified."
    )

complexity_assessor_agent = Agent(
    model=larry_helpers_model,
    description="You are the Complexity Assessor agent using the Cynefin framework.",
    instructions=COMPLEXITY_ASSESSOR_PROMPT,
    output_schema=ComplexityAssessment,
    use_json_mode=True,
)
