from .prompts import LARRY_SYSTEM_PROMPT
from agno.team import Team
from .complexity_assessor import complexity_assessor_agent
from .definition_classifier import definition_classifier_agent
from .risk_uncertainty_evaluator import risk_uncertainty_evaluator_agent
from .wickedness_classifier import wickedness_classifier_agent
from agno.models.anthropic import Claude
from db.db import DB

larry_team = Team(
    model=Claude(id="claude-sonnet-4-5"),
    members=[wickedness_classifier_agent, complexity_assessor_agent, definition_classifier_agent, risk_uncertainty_evaluator_agent],
    instructions=LARRY_SYSTEM_PROMPT,
    name="Larry Navigator",
    store_member_responses=True,
    db=DB,
    enable_user_memories=True
)