import sys
import os
import inspect

# Add src to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from agent_pipeline.loader import AgentLoader

def test_agent_loader_config():
    # Path to physicist agent
    agent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "test_agents/physicist_agent"))
    
    print(f"Loading agent from: {agent_dir}")
    
    try:
        agent = AgentLoader(agent_dir)
        
        # Verify Description (from config)
        print(f"Agent Description: {agent.get_description()}")
        assert agent.get_description() == "An agent capable of solving physics equations and explaining physical concepts."
        
        # Verify Starter Prompt (from SKILL.md)
        print(f"Starter Prompt: {agent.agent_goal.starter_prompt[:50]}...")
        assert "You are a Physicist Agent" in agent.agent_goal.starter_prompt
        
        # Verify Example Conversation History (from config)
        print(f"Example History: {agent.agent_goal.example_conversation_history[:50]}...")
        assert "User: Calculate the force" in agent.agent_goal.example_conversation_history
        
        # Verify Tools
        print(f"Tools: {list(agent.tools.keys())}")
        assert "solve_equation" in agent.tools
        
        # Verify Tool Definitions from Config
        tool_def = next(t for t in agent.tool_definitions if t.name == "solve_equation")
        print(f"Tool Definition: {tool_def}")
        
        # Check description from config
        assert tool_def.description == "Solves a simple linear equation."
        
        # Check arguments from config
        assert len(tool_def.arguments) == 1
        arg = tool_def.arguments[0]
        assert arg.name == "equation_str"
        assert arg.type == "string"
        assert arg.description == "The equation to solve, e.g., '2x + 4 = 10'."
        
        print("\nSUCCESS: Agent loaded correctly with config!")
        
    except Exception as e:
        print(f"\nFAILURE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_agent_loader_config()
