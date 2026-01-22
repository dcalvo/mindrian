import os

from dotenv import load_dotenv

load_dotenv()

anthropic_key = os.getenv("ANTHROPIC_API_KEY")
# openai_key = os.getenv("OPENAI_API_KEY")

# Agent settings
from agno.models.anthropic import Claude
from agno.models.openai import OpenAI

larry_helpers_model = Claude(id="claude-haiku-4-5", api_key=anthropic_key)
larry_team_model = Claude(id="claude-sonnet-4-5", api_key=anthropic_key)
mindrian_model = Claude(id="claude-sonnet-4-5", api_key=anthropic_key)
mckinsey_model = Claude(id="claude-sonnet-4-5", api_key=anthropic_key)
document_model = Claude(id="claude-haiku-4-5", api_key=anthropic_key)
complex_model = Claude(id="claude-sonnet-4-5", api_key=anthropic_key)
simple_model = Claude(id="claude-haiku-4-5", api_key=anthropic_key)


