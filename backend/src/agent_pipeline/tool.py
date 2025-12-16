from dataclasses import dataclass
from typing import List, Callable

@dataclass
class ToolArgument:
    name: str
    type: str
    description: str

@dataclass
class ToolDefinition:
    name: str
    description: str
    arguments: List[ToolArgument]

@dataclass
class AgentGoal:
    agent_name: str
    tools: List[ToolDefinition]
    dependencies: List[str]
    description: str
    starter_prompt: str
    timeout_seconds: int
    example_conversation_history: str
    trigger: str

# tool registry decorator
def register_tool(func: Callable) -> Callable:
    """
    Decorator to mark a function as an agent tool.
    """
    func._is_agent_tool = True
    return func