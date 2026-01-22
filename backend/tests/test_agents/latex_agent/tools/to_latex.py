import re
from agent_pipeline.agent import Agent

@Agent.TOOL_REGISTRY.register_tool
def to_latex(expression: str) -> str:
    """
    Converts a mathematical expression string into LaTeX format.
    
    Args:
        expression: The mathematical expression to convert.
        
    Returns:
        str: The LaTeX formatted string.
    """
    # Simply mapping common python-like math syntax to latex
    latex = expression
    
    # fractions a/b -> \frac{a}{b} (simple heuristic)
    # This is a basic regex approach, a real parser would be better but this suffices for a demo
    # converting simple divisions like (a+b)/c
    latex = re.sub(r'\(([^)]+)\)/(\w+)', r'\\frac{\1}{\2}', latex)
    latex = re.sub(r'(\w+)/(\w+)', r'\\frac{\1}{\2}', latex)
    
    # powers x**2 or x^2 -> x^2 (latex handles ^ natively, but we ensure it)
    latex = latex.replace('**', '^')
    
    # integrals 'integral(f(x), x)' -> \int f(x) dx
    if 'integral' in latex:
        # crude parsing for integral(expression, var)
        match = re.search(r'integral\((.*),\s*(\w+)\)', latex)
        if match:
             inner, var = match.groups()
             latex = latex.replace(match.group(0), f'\\int {inner} d{var}')
    
    # square roots sqrt(x) -> \sqrt{x}
    latex = re.sub(r'sqrt\(([^)]+)\)', r'\\sqrt{\1}', latex)
    
    # multiplication * -> \cdot or nothing, let's remove it for standard algebra appearance 2*x -> 2x
    # but be careful with numbers 2*3 -> 2 \cdot 3
    latex = re.sub(r'(?<=\d)\*(?=\d)', r' \\cdot ', latex)
    latex = latex.replace('*', '')

    return latex
