import unittest
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from agent_pipeline.loader import AgentLoader
from agent_pipeline.agent import Agent

class TestLatexAgent(unittest.TestCase):
    def setUp(self):
        self.latex_agent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_agents/latex_agent'))
        self.math_agent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_agents/math_agent'))
        
        # Clear registry
        Agent.TOOL_REGISTRY.tools = {}
        Agent.TOOL_REGISTRY.tool_definitions = {}

    def test_load_latex_agent(self):
        agent = AgentLoader(self.latex_agent_dir)
        self.assertIsNotNone(agent)
        self.assertEqual(agent.agent_goal.agent_name, "latex_agent")
        
        # Verify tool is available
        tool = Agent.TOOL_REGISTRY.get_tool("to_latex")
        self.assertIsNotNone(tool)
        
    def test_to_latex_conversion(self):
        # Load agent to register tool
        AgentLoader(self.latex_agent_dir)
        tool = Agent.TOOL_REGISTRY.get_tool("to_latex")
        
        # Test basic power
        self.assertEqual(tool("x^2"), "x^2")
        self.assertEqual(tool("x**2"), "x^2")
        
        # Test fraction with division
        self.assertEqual(tool("(x+1)/y"), "\\frac{x+1}{y}")
        
        # Test sqrt
        self.assertEqual(tool("sqrt(x+4)"), "\\sqrt{x+4}")
        
        # Test integral
        self.assertEqual(tool("integral(x**2, x)"), "\\int x^2 dx")

    def test_math_agent_dependency(self):
        agent = AgentLoader(self.math_agent_dir)
        self.assertIn("latex_agent", agent.get_dependencies())

if __name__ == '__main__':
    unittest.main()
