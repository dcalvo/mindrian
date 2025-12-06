from typing import List, Dict, Callable
from .tool import ToolDefinition, ToolArgument, AgentGoal
from .context import Context

class Agent:
    def __init__(self, agent_goal: AgentGoal, tool_definitions: List[ToolDefinition], tool_directory: Dict[str, Callable], context: Context=Context()):
        """
        Initialize the Agent with its goal, tool definitions, and executable tools.

        Args:
            agent_goal: The goal configuration for the agent.
            tool_definitions: List of definitions for the tools available to the agent.
            tool_directory: Dictionary mapping tool names to their callable functions.
        """
        # initializing the agent
        self.agent_goal = agent_goal
        self.tool_definitions = tool_definitions
        self.tools = tool_directory
        self.context = context
        # TODO: initialize the LLM
    
    def get_description(self):
        """
        Get the description of the agent's goal.

        Returns:
            str: The description of the agent.
        """
        return self.agent_goal.description
    
    def get_dependencies(self):
        """
        Get the list of agent names that this agent depends on.

        Returns:
            List[str]: A list of dependency agent names.
        """
        return self.agent_goal.dependencies
    
    def get_context(self):
        """
        Get the context of the agent.

        Returns:
            Context: The context of the agent.
        """
        return self.context
    
    def set_context(self, context: Context):
        """
        Set the context of the agent.

        Args:
            context: The context to set.
        """
        self.context = context
