"""
Definition Classifier Agent - Larry Navigator v2.0
Classifies problem definition state: undefined | ill-defined | well-defined
"""

from typing import List, Literal
from agno.agent import Agent
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from .prompts import DEFINITION_CLASSIFIER_PROMPT
import os

class ProblemDefinition(BaseModel):
    classification: Literal["undefined", "ill-defined", "well-defined"] = Field(
        ..., description="The classification of the problem definition state."
    )
    confidence: float = Field(
        ..., description="Confidence score between 0.0 and 1.0."
    )
    reasoning: str = Field(
        ..., description="Reasoning for the classification."
    )
    key_signals: List[str] = Field(
        ..., description="Key signals identified in the conversation."
    )

definition_classifier_agent = Agent(
    model=Claude(id="claude-haiku-4-5"),
    description="You are the Definition Classifier agent for Larry Navigator.",
    instructions=DEFINITION_CLASSIFIER_PROMPT,
    output_schema=ProblemDefinition,
    use_json_mode=True, # Structured output
)
