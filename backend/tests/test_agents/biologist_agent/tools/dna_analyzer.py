from tool_registry import ToolRegistry

# look into python decorators
def analyze_dna(sequence):
    """
    Analyzes a DNA sequence.
    This is a placeholder tool.
    """
    print(f"Analyzing DNA sequence: {sequence}")
    return {"gc_content": 0.5, "length": len(sequence)}
