import importlib.util
import inspect
import os
import sys
import json
from typing import Dict, Callable, Optional, List
from .agent import Agent
from .tool import AgentGoal, ToolDefinition, ToolArgument
from .tool_registry import TOOL_REGISTRY

def _load_file_content(path: str) -> str:
    """Reads the content of a file if it exists, otherwise returns empty string."""
    if os.path.exists(path):
        with open(path, 'r') as f:
            return f.read().strip()
    return ""

def _parse_tool_definitions(config_tools: List[Dict]) -> List[ToolDefinition]:
    """Parses tool definitions from the configuration dictionary."""
    definitions = []
    for tool_conf in config_tools:
        arguments = []
        for arg_conf in tool_conf.get("arguments", []):
            arguments.append(ToolArgument(
                name=arg_conf["name"],
                type=arg_conf["type"],
                description=arg_conf["description"]
            ))
            
        definitions.append(ToolDefinition(
            name=tool_conf["name"],
            description=tool_conf["description"],
            arguments=arguments
        ))
    return definitions

def AgentLoader(agent_dir: str) -> Agent:
    """
    Loads an agent from the specified directory.
    """
    # 1. tools already loaded in tool_registry from decorators
    
    # 2. Load Config
    config_path = os.path.join(agent_dir, "config.json")
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Config file not found at {config_path}")
        
    with open(config_path, 'r') as f:
        config = json.load(f)
            
    # 3. Parse Tool Definitions from Config
    config_tools = config.get("tools", [])
    tool_definitions = _parse_tool_definitions(config_tools)
    tool_directory = {}
    
    # 4. Validate Tools
    # Ensure every tool defined in config exists in the python files
    for tool_def in tool_definitions:
        if tool_def.name not in TOOL_REGISTRY.tools:
            raise ValueError(f"Tool '{tool_def.name}' defined in config but not found in tools directory.")
        else:
            # TODO: maybe define this in the tool file??
            Agent.TOOL_REGISTRY.register_tool_definition(tool_def)
            
    # 5. Load Metadata Files
    trigger_content = _load_file_content(os.path.join(agent_dir, "TRIGGER.md"))
    skill_content = _load_file_content(os.path.join(agent_dir, "SKILL.md"))
    
    # 6. Construct AgentGoal
    agent_goal = AgentGoal(
        agent_name=config.get("name", os.path.basename(agent_dir)),
        tools=tool_definitions,
        dependencies=config.get("dependencies", []),
        description=config.get("description", ""), 
        starter_prompt=skill_content,
        timeout_seconds=config.get("timeout", 60),
        example_conversation_history=config.get("example_conversation_history", ""),
        trigger=trigger_content
    )
    
    # 7. Create Agent
    return Agent(
        agent_goal=agent_goal,
        tool_definitions=tool_definitions,
    )