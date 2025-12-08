import sys
import os
import unittest
import requests
import time

# Add src to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from agent_pipeline.loader import AgentLoader
from agent_pipeline.trigger import TriggerEvaluator
from agent_pipeline.context import Context

class TestTriggerRealAgents(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Load agents
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "test_agents"))
        cls.physicist = AgentLoader(os.path.join(base_dir, "physicist_agent"))
        cls.biologist = AgentLoader(os.path.join(base_dir, "biologist_agent"))
        cls.historian = AgentLoader(os.path.join(base_dir, "historian_agent"))

    def test_physicist_trigger(self):
        evaluator = TriggerEvaluator()
        context = Context(context_window_snapshot="User: Calculate the velocity of a falling object.")
        
        decision = evaluator.evaluate(self.physicist, context)
        
        self.assertTrue(decision.should_run)
        self.assertTrue(len(decision.reasoning) > 0)
        self.assertIsInstance(decision.confidence, float)

    def test_biologist_trigger(self):
        evaluator = TriggerEvaluator()
        context = Context(context_window_snapshot="User: Analyze this DNA sequence: ATCG.")
        
        decision = evaluator.evaluate(self.biologist, context)
        
        self.assertTrue(decision.should_run)
        self.assertTrue(len(decision.reasoning) > 0)

    def test_historian_trigger_negative(self):
        evaluator = TriggerEvaluator()
        context = Context(context_window_snapshot="User: What is 2 + 2?")
        
        decision = evaluator.evaluate(self.historian, context)
        
        self.assertFalse(decision.should_run)
        self.assertTrue(len(decision.reasoning) > 0)

if __name__ == "__main__":
    unittest.main()
