import importlib.util
import inspect
import os
import sys
from typing import Dict, Callable, Optional

def load_tools_from_directory(tools_dir: str) -> Dict[str, Callable]:
    """
    Dynamically loads all functions from Python files in the specified directory.
    
    Args:
        tools_dir: Path to the directory containing tool modules.
        
    Returns:
        A dictionary mapping function names to the callable functions.
    """
    tools: Dict[str, Callable] = {}
    
    if not os.path.exists(tools_dir):
        return tools

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
                
                # Extract functions from the module
                for name, obj in inspect.getmembers(module):
                    # We only want functions defined in this module, not imported ones
                    if inspect.isfunction(obj) and obj.__module__ == module_name:
                        # throwing an error if there are two instances of the same function name
                        if name in tools:
                            raise ValueError(f"Duplicate function name: {name}")
                        tools[name] = obj
                
    return tools

def AgentLoader(agent_dir: str):
    """
    Loads an agent from the specified directory.
    """
    tools_dir = os.path.join(agent_dir, "tools")
    tool_directory = load_tools_from_directory(tools_dir)
    
    # TODO: Load config.json and other metadata to construct AgentGoal and ToolDefinitions
    
    return tool_directory