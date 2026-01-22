"""
Diagnosis Consolidator Agent - Larry Navigator v2.0
Synthesizes all diagnostic agent outputs into coherent assessment
"""
# CURRENTLY NOT IN USE
from agno.models.anthropic import Claude
from pydantic import BaseModel, Field
from .prompts import DIAGNOSIS_CONSOLIDATOR_PROMPT
from agno.team import Team
from typing import List
from .complexity_assessor import complexity_assessor_agent
from .definition_classifier import definition_classifier_agent
from .risk_uncertainty_evaluator import risk_uncertainty_evaluator_agent
from .wickedness_classifier import wickedness_classifier_agent
from db.db import DB

class ConsistencyCheck(BaseModel):
    is_consistent: bool = Field(..., description="Whether the diagnosis is consistent across dimensions.")
    tensions: List[str] = Field(..., description="List of identified tensions or contradictions.")

class DiagnosisConsolidation(BaseModel):
    summary: str = Field(..., description="Integrated summary of the diagnosis.")
    consistency_check: ConsistencyCheck = Field(..., description="Check for consistency across diagnostic inputs.")
    dominant_characteristic: str = Field(..., description="The most important aspect shaping this problem.")
    recommended_approach: str = Field(..., description="Guidance on next steps.")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0.")

# team to consolidate all diagnosis
diagnosis_consolidator_team = Team(
    model=Claude(id="claude-haiku-4-5"),
    name="Diagnosis Consolidator",
    members=[wickedness_classifier_agent, complexity_assessor_agent, definition_classifier_agent, risk_uncertainty_evaluator_agent],
    instructions=DIAGNOSIS_CONSOLIDATOR_PROMPT,
    output_schema=DiagnosisConsolidation,
    store_member_responses=True,
    use_json_mode=True,
    enable_user_memories=True,
    db=DB
)