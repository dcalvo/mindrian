from dataclasses import dataclass, field
from .tool import ToolDefinition, ToolArgument
from typing import List, Dict, Any
# from pathlib import Path
# have images be base64 encoded strings

@dataclass
class Event:
    """
    Represents a single event or action step in the agent's execution.
    """
    trigger_input: str
    tool_used: ToolDefinition
    tool_inputs: Dict[str, Any]
    tool_output: str

@dataclass
class Context:
    """
    Maintains the state and history of the agent's interaction.
    """
    events: List[Event] = field(default_factory=list)
    conversation_summary: str = ""
    context_window_snapshot: str = ""
    images: List[str] = field(default_factory=list)