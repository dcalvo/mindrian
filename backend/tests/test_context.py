import sys
import os
import unittest
from typing import List, Dict, Any

# Add src to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from agent_pipeline.context import Event, Context

class TestContext(unittest.TestCase):
    def test_event_creation(self):
        event = Event(
            trigger_input="Calculate 2+2",
            tools_used=["calculator"],
            tool_inputs=[{"expression": "2+2"}],
            tool_outputs=[4]
        )
        self.assertEqual(event.trigger_input, "Calculate 2+2")
        self.assertEqual(event.tools_used, ["calculator"])
        self.assertEqual(event.tool_outputs[0], 4)

    def test_context_creation(self):
        event1 = Event(
            trigger_input="Hi",
            tools_used=[],
            tool_inputs=[],
            tool_outputs=[]
        )
        context = Context(
            events=[event1],
            conversation_summary="User said hi",
            context_window_snapshot="User: Hi",
            system_prompt="You are a helpful assistant"
        )
        self.assertEqual(len(context.events), 1)
        self.assertEqual(context.conversation_summary, "User said hi")
        self.assertEqual(context.events[0].trigger_input, "Hi")

    def test_context_defaults(self):
        context = Context()
        self.assertEqual(context.events, [])
        self.assertEqual(context.conversation_summary, "")

if __name__ == "__main__":
    unittest.main()
