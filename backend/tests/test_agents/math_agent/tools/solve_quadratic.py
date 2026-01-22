import math
from agent_pipeline.agent import Agent

@Agent.TOOL_REGISTRY.register_tool
def solve_quadratic(a: float, b: float, c: float) -> str:
    """
    Calculates the roots of a quadratic equation ax^2 + bx + c = 0.
    
    Args:
        a: The coefficient of x^2.
        b: The coefficient of x.
        c: The constant term.
        
    Returns:
        str: A string describing the roots of the equation.
    """
    if a == 0:
        return "Not a quadratic equation (coefficient 'a' is 0)."
    
    discriminant = b**2 - 4*a*c
    
    if discriminant > 0:
        root1 = (-b + math.sqrt(discriminant)) / (2*a)
        root2 = (-b - math.sqrt(discriminant)) / (2*a)
        return f"The equation has two distinct real roots: x1 = {root1}, x2 = {root2}"
    elif discriminant == 0:
        root = -b / (2*a)
        return f"The equation has one real repeated root: x = {root}"
    else:
        real_part = -b / (2*a)
        imag_part = math.sqrt(abs(discriminant)) / (2*a)
        return f"The equation has two complex roots: x1 = {real_part} + {imag_part}i, x2 = {real_part} - {imag_part}i"
