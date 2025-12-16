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

# tool registry class
class ToolRegistry:
    def __init__(self):
        self.tools = {}
        self.tool_definitions = {}
    
    # TODO talk about the order of registration
    def register_tool(self, tool: Callable) -> Callable:
        if tool.__name__ in self.tools:
            raise ValueError(f"Tool '{tool.__name__}' already registered.")
        self.tools[tool.__name__] = tool
    
    def register_tool_definition(self, tool_definition: ToolDefinition) -> ToolDefinition:
        if not tool_definition.name in self.tools:
            raise ValueError(f"Tool '{tool_definition.name}' not found in tool registry.")
        
        if tool_definition.name in self.tool_definitions:
            raise ValueError(f"Tool '{tool_definition.name}' already defined.")
        
        self.tool_definitions[tool_definition.name] = tool_definition
    
    def get_tool(self, tool_name: str) -> Callable:
        if tool_name not in self.tools:
            raise ValueError(f"Tool '{tool_name}' not found in tool registry.")
        return self.tools[tool_name]
    
    def get_tool_definition(self, tool_name: str) -> ToolDefinition:
        if tool_name not in self.tool_definitions:
            raise ValueError(f"Tool '{tool_name}' not found in tool registry.")
        return self.tool_definitions[tool_name]

        