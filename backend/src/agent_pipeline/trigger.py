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

    def describe_image(self, image_path: str, context: Context) -> str:
        """
        Generates a description of an image and appends it to the context.

        Args:
            image_path: Path to the image file.
            context: The current context.

        Returns:
            The generated description.
        """
        base64_image = self._encode_image(image_path)
        
        # Determine media type based on extension (simple check)
        # Claude supports jpeg, png, gif, webp.
        ext = os.path.splitext(image_path)[1].lower().replace('.', '')
        if ext == 'jpg': ext = 'jpeg'
        media_type = f"image/{ext}"

        prompt = f"Describe this image in detail, focusing on elements relevant to: {context.conversation_summary}"
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ],
                }
            ],
        )
        description = response.content[0].text.strip()
            
        context.context_window_snapshot += f"\n[Image Description]: {description}"
        return description

    def evaluate(self, agent: Agent, context: Context, Image_paths: List[str]=None) -> TriggerDecision:
        """
        Determines if the agent should be run based on the context window.
        
        Args:
            agent: The agent to evaluate.
            context: The conversation history or context.
            Image_paths: List of image paths to include in the context.
            
        Returns:
            TriggerDecision object containing should_run, confidence, and reasoning.
        """
        if Image_paths:
            for image_path in Image_paths:
                # We update context with descriptions before evaluating trigger
                context.context_window_snapshot += self.describe_image(image_path, context)
            
        system_prompt = (
            "You are an orchestration manager. Your job is to decide if a specific agent "
            "should be activated based on the conversation history. "
            "You must respond with a JSON object containing the following fields:\n"
            "- \"should_run\": boolean (true/false)\n"
            "- \"confidence\": float (0.0 to 1.0)\n"
            "- \"reasoning\": string (explanation of your decision)"
        )
            
        user_prompt = (
            f"Agent Name: {agent.agent_goal.agent_name}\n"
            f"Agent Description: {agent.get_description()}\n"
            f"Trigger Condition: {agent.agent_goal.trigger}\n\n"
            f"Context Window:\n{context.context_window_snapshot}\n\n"
            f"Should this agent be activated? Respond in JSON."
        )
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            response_text = response.content[0].text.strip()
            
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
