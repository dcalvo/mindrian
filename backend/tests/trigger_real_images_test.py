import unittest
from unittest.mock import MagicMock, patch
import sys
import os
import json
import base64

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from agent_pipeline.trigger import TriggerEvaluator
from agent_pipeline.agent import Agent, AgentGoal
from agent_pipeline.context import Context

class TestTriggerRealImages(unittest.TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
        with patch('anthropic.Anthropic', return_value=self.mock_client):
            with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test_key"}):
                self.evaluator = TriggerEvaluator()
        
        # Paths to real images
        self.base_dir = os.path.dirname(__file__)
        self.image_dir = os.path.join(self.base_dir, "test_data", "images")
        self.goldfish_path = os.path.join(self.image_dir, "goldfish.jpg")
        self.labrador_path = os.path.join(self.image_dir, "labrador.jpg")

    def test_evaluate_with_real_images(self, ):
        # Ensure images exist
        if not os.path.exists(self.goldfish_path):
            self.skipTest(f"Goldfish image not found at {self.goldfish_path}")
        if not os.path.exists(self.labrador_path):
            self.skipTest(f"Labrador image not found at {self.labrador_path}")

        context = Context(
            conversation_summary="Identify the animals.",
            context_window_snapshot="User uploaded two images.",
            images=[self.goldfish_path, self.labrador_path]
        )

        agent_goal = AgentGoal(
            agent_name="ClassifierAgent",
            description="Classifies images",
            trigger="On images",
            tools=[],
            dependencies=[],
            starter_prompt="Start",
            timeout_seconds=60,
            example_conversation_history=[]
        )
        agent = Agent(
            agent_goal=agent_goal, 
            tool_definitions=[], 
            tool_directory="/tmp/tools"
        )
        
        # Mock API response
        response_json = json.dumps({
            "should_run": True,
            "confidence": 0.99,
            "reasoning": "Images of a goldfish and a labrador detected."
        })
        mock_response = MagicMock()
        mock_response.content = [MagicMock(text=f"Response: {response_json}")]
        self.evaluator.client.messages.create.return_value = mock_response

        # Execute
        decision = self.evaluator.evaluate(agent, context)

        # Verify decision
        self.assertTrue(decision.should_run)
        
        # Verify API call payload content
        call_args = self.evaluator.client.messages.create.call_args
        messages = call_args.kwargs['messages']
        user_content = messages[0]['content']
        
        self.assertEqual(len(user_content), 3) # 2 images + 1 text

        # Verify correct media types were detected
        # Note: curl download might not respect extensions perfectly but we saved as .jpg
        self.assertEqual(user_content[0]['source']['media_type'], 'image/jpeg')
        self.assertEqual(user_content[1]['source']['media_type'], 'image/jpeg')
        
        # Verify data is base64
        # We can decode it and check if it starts with JPEG magic bytes (FF D8)
        img1_data = base64.b64decode(user_content[0]['source']['data'])
        self.assertTrue(img1_data.startswith(b'\xff\xd8'), "Image 1 should be a JPEG")

        img2_data = base64.b64decode(user_content[1]['source']['data'])
        # The labrador image from wikimedia might be a redirect or error page if link is bad,
        # but let's assume it downloaded. If it's not a jpeg, this assertion helps us know.
        # Actually, let's just check length > 0 to confirm we read *something*.
        self.assertTrue(len(img1_data) > 0)
        self.assertTrue(len(img2_data) > 0)
        self.assertTrue(img2_data.startswith(b'\xff\xd8'), "Image 2 should be a JPEG")

if __name__ == '__main__':
    unittest.main()
