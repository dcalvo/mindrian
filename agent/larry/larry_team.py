from .prompts import LARRY_SYSTEM_PROMPT
from agno.team import Team
from .complexity_assessor import complexity_assessor_agent
from .definition_classifier import definition_classifier_agent
from .risk_uncertainty_evaluator import risk_uncertainty_evaluator_agent
from .wickedness_classifier import wickedness_classifier_agent
from agno.models.anthropic import Claude
from db.db import DB
from agent_settings.agent_settings import larry_team_model

larry_team = Team(
    model=larry_team_model,
    members=[wickedness_classifier_agent, complexity_assessor_agent, definition_classifier_agent, risk_uncertainty_evaluator_agent],
    instructions=LARRY_SYSTEM_PROMPT,
    name="Larry Navigator",
    store_member_responses=True,
    db=DB,
    enable_user_memories=True
)