from typing import List, Dict
from tool import ToolDefinition, ToolArgument, AgentGoal

class Agent:
    def __init__(self, agent_goal: AgentGoal, tool_definitions: List[ToolDefinition], tool_directory: Dict[str, function]):
        # initializing the agent
        self.agent_goal = agent_goal
        self.tool_definitions = tool_definitions
        self.tools = tool_directory

        # TODO: initialize the LLM
    
    # returns the agent description
    def get_description(self):
        return self.agent_goal.description
