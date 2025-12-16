import os
import json
import base64
from typing import Optional, List
from dataclasses import dataclass
import anthropic
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
from .agent import Agent
from .context import Context

load_dotenv()

@dataclass
class TriggerDecision:
    should_run: bool
    confidence: float
    reasoning: str

class TriggerEvaluator:
    def __init__(self):
        """
        Initializes the TriggerEvaluator with a Claude client.
        """
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.model = "claude-3-opus-20240229"

    def _encode_image(self, image_path: str) -> str:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def evaluate(self, agent: Agent, context: Context) -> TriggerDecision:
        """
        Determines if the agent should be run based on the context window and images.
        
        Args:
            agent: The agent to evaluate.
            context: The conversation history or context.
            
        Returns:
            TriggerDecision object containing should_run, confidence, and reasoning.
        """
        system_prompt = (
            "You are an orchestration manager. Your job is to decide if a specific agent "
            "should be activated based on the conversation history. "
            "You must respond with a JSON object containing the following fields:\n"
            "- \"should_run\": boolean (true/false)\n"
            "- \"confidence\": float (0.0 to 1.0)\n"
            "- \"reasoning\": string (explanation of your decision)"
        )
            
        user_prompt_text = (
            f"Agent Name: {agent.agent_goal.agent_name}\n"
            f"Agent Description: {agent.get_description()}\n"
            f"Trigger Condition: {agent.agent_goal.trigger}\n\n"
            f"Context Window:\n{context.context_window_snapshot}\n\n"
            f"Should this agent be activated? Respond in JSON."
        )

        content = []
        
        # Add images from context
        if context.images:
            for image_path in context.images:
                try:
                    base64_image = self._encode_image(image_path)
                    ext = os.path.splitext(image_path)[1].lower().replace('.', '')
                    if ext == 'jpg': ext = 'jpeg'
                    media_type = f"image/{ext}"
                    
                    content.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64_image,
                        },
                    })
                except Exception as e:
                    print(f"Error loading image {image_path}: {e}")

        # Add text content
        content.append({
            "type": "text",
            "text": user_prompt_text
        })
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": content}
                ]
            )
            
            response_text = response.content[0].text.strip()
            
            # TODO: LOOK over how to handle pidantic parsing from anthropic
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
                return TriggerDecision(
                    should_run=data.get("should_run", False),
                    confidence=data.get("confidence", 0.0),
                    reasoning=data.get("reasoning", "No reasoning provided.")
                )
            else:
                 return TriggerDecision(should_run=False, confidence=0.0, reasoning="Failed to parse JSON response.")
            
        except Exception as e:
            print(f"Error evaluating trigger for agent {agent.agent_goal.agent_name}: {e}")
            return TriggerDecision(should_run=False, confidence=0.0, reasoning=f"Error: {e}")
