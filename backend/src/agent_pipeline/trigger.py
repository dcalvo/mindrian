import os
import json
from typing import Optional, List
from dataclasses import dataclass
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
from .agent import Agent
from .context import Context
load_dotenv()

@dataclass
class TriggerDecision:
    should_run: bool
    confidence: float
    reasoning: str

class TriggerEvaluator:
    API_KEY = os.environ.get("GOOGLE_API_KEY")
    def __init__(self):
        """
        Initializes the TriggerEvaluator with a Gemini client.
        """
        genai.configure(api_key=self.API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def describe_image(self, image_path: str, context: Context) -> str:
        """
        Generates a description of an image and appends it to the context.

        Args:
            image_path: Path to the image file.
            context: The current context.

        Returns:
            The generated description.
        """
        img = Image.open(image_path)
        prompt = f"Describe this image in detail, focusing on elements relevant to: {context.conversation_summary}"
            
        response = self.model.generate_content([prompt, img])
        description = response.text.strip()
            
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
        system_prompt = (
            "You are an orchestration manager. Your job is to decide if a specific agent "
            "should be activated based on the conversation history. "
            "You must respond with a JSON object containing the following fields:\n"
            "- \"should_run\": boolean (true/false)\n"
            "- \"confidence\": float (0.0 to 1.0)\n"
            "- \"reasoning\": string (explanation of your decision)"
        )


        if Image_paths:
            for image_path in Image_paths:
                context.context_window_snapshot += self.describe_image(image_path, context)
            
        user_prompt = (
            f"Agent Name: {agent.agent_goal.agent_name}\n"
            f"Agent Description: {agent.get_description()}\n"
            f"Trigger Condition: {agent.agent_goal.trigger}\n\n"
            f"Context Window:\n{context.context_window_snapshot}\n\n"
            f"Should this agent be activated? Respond in JSON."
        )
        
        try:
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            
            response = self.model.generate_content(full_prompt, generation_config={"response_mime_type": "application/json"})
            
            response_text = response.text.strip()
            
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
