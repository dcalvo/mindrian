import unittest
import os
import sys

def run_tests():
    """
    Discover and run all tests in the 'tests' directory.
    """
    # Get the directory where this script is located
    start_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Add the src directory to sys.path
    src_dir = os.path.abspath(os.path.join(start_dir, '../src'))
    if src_dir not in sys.path:
        sys.path.insert(0, src_dir)
    
    # Create a test loader
    loader = unittest.TestLoader()
    
    # Discover tests in the current directory matching the pattern '*_tests.py'
    # You can adjust the pattern if your test files are named differently (e.g., 'test_*.py')
    suite = loader.discover(start_dir, pattern='*_tests.py')
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code based on success
    return 0 if result.wasSuccessful() else 1

if __name__ == '__main__':
    sys.exit(run_tests())
