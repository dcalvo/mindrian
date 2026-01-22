"""
Risk-Uncertainty Evaluator Agent - Larry Navigator v2.0
Positions problem on risk-uncertainty spectrum: 0.0 (risk) to 1.0 (uncertainty)
"""

from typing import List
from agno.agent import Agent
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from .prompts import RISK_UNCERTAINTY_EVALUATOR_PROMPT
from agent_settings.agent_settings import larry_helpers_model

class RiskUncertaintyEvaluation(BaseModel):
    position: float = Field(
        ..., description="Position on the risk-uncertainty spectrum (0.0=Risk, 1.0=Uncertainty)."
    )
    reasoning: str = Field(
        ..., description="Reasoning for the position."
    )
    known_unknowns: List[str] = Field(
        ..., description="List of recognized risk factors (known unknowns)."
    )
    unknown_unknowns: List[str] = Field(
        ..., description="List of recognized uncertainty factors (unknown unknowns)."
    )

risk_uncertainty_evaluator_agent = Agent(
    model=larry_helpers_model,
    description="You are the Risk-Uncertainty Evaluator agent.",
    instructions=RISK_UNCERTAINTY_EVALUATOR_PROMPT,
    output_schema=RiskUncertaintyEvaluation,
    use_json_mode=True,
)
