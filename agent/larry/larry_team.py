from .prompts import LARRY_SYSTEM_PROMPT
from agno.team import Team
from .diagnosis_consolidator import diagnosis_consolidator_team
from agno.models.anthropic import Claude

larry_team = Team(
    model=Claude(id="claude-haiku-4-5"),
    members=[diagnosis_consolidator_team],
    instructions=LARRY_SYSTEM_PROMPT,
    name="Larry Navigator",
)