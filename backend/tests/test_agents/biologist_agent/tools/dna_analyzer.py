from agent_pipeline.agent import Agent

# look into python decorators
@Agent.TOOL_REGISTRY.register_tool
def analyze_dna(sequence):
    """
    Analyzes a DNA sequence.
    This is a placeholder tool.
    """
    print(f"Analyzing DNA sequence: {sequence}")
    return {"gc_content": 0.5, "length": len(sequence)}
