import unittest
import os
import sys
import inspect
from agent_pipeline.loader import load_tools_from_directory

# Add the src directory to sys.path to allow importing modules from it
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

class TestLoadTools(unittest.TestCase):
    def setUp(self):
        # Path to the dummy_functions directory
        self.dummy_tools_dir = os.path.join(os.path.dirname(__file__), 'dummy_functions')
        self.faulty_tools_dir = os.path.join(os.path.dirname(__file__), 'dummy_functions_faulty')

    def test_load_tools_from_directory(self):
        """Test that tools are correctly loaded from the dummy directory."""
        tools = load_tools_from_directory(self.dummy_tools_dir)
        
        # Check if expected functions are present
        self.assertIn('subtract', tools)
        self.assertIn('multiply', tools)
        self.assertIn('divide', tools)

        # Verify functionality
        self.assertEqual(tools['subtract'](10, 5), 5)
        self.assertEqual(tools['multiply'](3, 4), 12)
        self.assertEqual(tools['divide'](10, 2), 5)

    def test_duplicate_function_error(self):
        """
        Test that loading tools with duplicate names raises a ValueError.
        """
        with self.assertRaises(ValueError) as cm:
            load_tools_from_directory(self.faulty_tools_dir)
        
        self.assertIn("Duplicate function name", str(cm.exception))

if __name__ == '__main__':
    unittest.main()
