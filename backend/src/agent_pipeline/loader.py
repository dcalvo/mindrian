import importlib.util
import inspect
import os
import sys
import json
from typing import Dict, Callable, Optional, List
from .agent import Agent
from .tool import AgentGoal, ToolDefinition, ToolArgument
import importlib.util
import os
import sys

def import_tools_from_directory(tools_dir: str):
    """
    Dynamically imports all Python modules in the specified directory.
    This triggers the @register_tool decorators to run.
    """
    if not os.path.exists(tools_dir):
        return

    # Add the tools directory to sys.path so imports within tools work if needed
    if tools_dir not in sys.path:
        sys.path.append(tools_dir)

    for filename in os.listdir(tools_dir):
        if filename.endswith(".py") and not filename.startswith("__"):
            file_path = os.path.join(tools_dir, filename)
            module_name = filename[:-3]
            
            # Create a module spec
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            if spec and spec.loader:
                # Create and execute the module
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)

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
    # 1. Load Tools from Directory (triggers decorators)
    tools_dir = os.path.join(agent_dir, "tools")
    import_tools_from_directory(tools_dir)
    
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
        # TODO possibly change this to method later
        if tool_def.name not in  Agent.TOOL_REGISTRY.tools:
            raise ValueError(f"Tool '{tool_def.name}' defined in config but not found in tools directory.")
        else:
            # TODO: maybe define this in the tool file??
            Agent.TOOL_REGISTRY.register_tool_definition(tool_def)
            
    # 5. Load Metadata Files
    trigger_content = _load_file_content(os.path.join(agent_dir, "TRIGGER.md"))
    skill_content = _load_file_content(os.path.join(agent_dir, "SKILL.md"))
    
    # 6. Append Tool Definitions to Starter Prompt
    tool_descriptions = "\n\nAvailable Tools:\n"
    for tool_def in tool_definitions:
        tool_descriptions += f"- {tool_def.name}: {tool_def.description}\n"
        tool_descriptions += "  Arguments:\n"
        for arg in tool_def.arguments:
            tool_descriptions += f"    - {arg.name} ({arg.type}): {arg.description}\n"
    
    full_starter_prompt = skill_content + tool_descriptions

    # 7. Construct AgentGoal
    agent_goal = AgentGoal(
        agent_name=config.get("name", os.path.basename(agent_dir)),
        tools=tool_definitions,
        dependencies=config.get("dependencies", []),
        description=config.get("description", ""), 
        starter_prompt=full_starter_prompt,
        timeout_seconds=config.get("timeout", 60),
        example_conversation_history=config.get("example_conversation_history", ""),
        trigger=trigger_content
    )
    
    # 8. Create Agent
    return Agent(
        agent_goal=agent_goal,
        tool_definitions=tool_definitions
    )