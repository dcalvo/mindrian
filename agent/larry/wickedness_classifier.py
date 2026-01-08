"""
Wickedness Classifier Agent - Larry Navigator v2.0
Classifies problem wickedness: tame | messy | complex | wicked
"""

from typing import List, Literal
from agno.agent import Agent
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from .prompts import WICKEDNESS_CLASSIFIER_PROMPT

class WickednessClassification(BaseModel):
    wickedness: Literal["tame", "messy", "complex", "wicked"] = Field(
        ..., description="The wickedness classification."
    )
    score: float = Field(
        ..., description="Wickedness score between 0.0 (Tame) to 1.0 (Wicked)."
    )
    reasoning: str = Field(
        ..., description="Reasoning for the classification."
    )
    characteristics_present: List[str] = Field(
        ..., description="List of wicked problem characteristics found."
    )
    stakeholder_count: Literal["few", "several", "many"] = Field(
        ..., description="Estimated number/complexity of stakeholders."
    )

wickedness_classifier_agent = Agent(
    model=Claude(id="claude-haiku-4-5"),
    description="You are the Wickedness Classifier agent.",
    instructions=WICKEDNESS_CLASSIFIER_PROMPT,
    output_schema=WickednessClassification,
    use_json_mode=True,
)
