"""Testing tools for Mindrian agent.

These tools are only loaded when MINDRIAN_TESTING=true.
Used for integration testing the tool execution flow.
"""

from agno.tools import tool


@tool(requires_confirmation=True)
def ping(message: str = "ping") -> dict[str, str]:
    """A simple ping tool for testing the tool execution flow.

    This tool requires confirmation before execution.

    Args:
        message: Optional message to echo back (default: "ping")

    Returns:
        A pong response with the echoed message
    """
    return {"status": "pong", "echo": message}


# Export testing tools
testing_tools = [ping]
