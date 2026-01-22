import unittest
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from agent_pipeline.loader import AgentLoader
from agent_pipeline.agent import Agent

class TestMathAgent(unittest.TestCase):
    def setUp(self):
        self.agent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_agents/math_agent'))
        # Clear registry to avoid conflicts if running multiple times in same process
        Agent.TOOL_REGISTRY.tools = {}
        Agent.TOOL_REGISTRY.tool_definitions = {}

    def test_load_math_agent(self):
        agent = AgentLoader(self.agent_dir)
        self.assertIsNotNone(agent)
        self.assertEqual(agent.agent_goal.agent_name, "math_agent")
        
        # Verify tool is available
        tool = Agent.TOOL_REGISTRY.get_tool("solve_quadratic")
        self.assertIsNotNone(tool)

    def test_solve_quadratic_two_roots(self):
        agent = AgentLoader(self.agent_dir)
        tool = Agent.TOOL_REGISTRY.get_tool("solve_quadratic")
        
        # x^2 - 5x + 6 = 0 -> roots are 2 and 3
        result = tool(1, -5, 6)
        self.assertIn("1 = 3.0", result.replace("x1", "1").replace("x2", "2")) # basic check, order might vary
        self.assertIn("2 = 2.0", result.replace("x1", "1").replace("x2", "2"))

    def test_solve_quadratic_one_root(self):
        agent = AgentLoader(self.agent_dir)
        tool = Agent.TOOL_REGISTRY.get_tool("solve_quadratic")
        
        # x^2 - 2x + 1 = 0 -> root is 1
        result = tool(1, -2, 1)
        self.assertIn("x = 1.0", result)

    def test_solve_quadratic_complex_roots(self):
        agent = AgentLoader(self.agent_dir)
        tool = Agent.TOOL_REGISTRY.get_tool("solve_quadratic")
        
        # x^2 + 1 = 0 -> roots are i and -i
        result = tool(1, 0, 1)
        self.assertIn("complex roots", result)

if __name__ == '__main__':
    unittest.main()
