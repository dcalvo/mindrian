from agent_pipeline.agent import Agent

@Agent.TOOL_REGISTRY.register_tool
def generate_timeline(event_name):
    """
    Generates a timeline for a given event.
    This is a placeholder tool.
    """
    print(f"Generating timeline for: {event_name}")
    return ["1900: Start", "1950: Middle", "2000: End"]
