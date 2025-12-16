from agent_pipeline.agent import Agent

@Agent.TOOL_REGISTRY.register_tool
def solve_equation(equation_str):
    """
    Solves a simple linear equation.
    This is a placeholder tool.
    """
    print(f"Solving equation: {equation_str}")
    return "x = 42" # Placeholder result
