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

    def test_load_tools_from_directory(self):
        """Test that tools are correctly loaded from the dummy directory."""
        tools = load_tools_from_directory(self.dummy_tools_dir)
        
        # Check if expected functions are present
        self.assertIn('subtract', tools)
        self.assertIn('multiply', tools)
        self.assertIn('divide', tools)
        self.assertIn('add', tools)

        # Verify functionality
        self.assertEqual(tools['subtract'](10, 5), 5)
        self.assertEqual(tools['multiply'](3, 4), 12)
        self.assertEqual(tools['divide'](10, 2), 5)

    def test_name_collision(self):
        """
        Test behavior when multiple files define functions with the same name.
        The last loaded file's function will overwrite previous ones.
        """
        tools = load_tools_from_directory(self.dummy_tools_dir)
        
        # We have 'add' in addition.py (returns a+b) and add.py (returns a+b-20)
        # The result depends on file system iteration order, but we can check which one won.
        
        result = tools['add'](10, 5)
        if result == 15:
            print("Loaded 'add' from addition.py")
        elif result == -5:
            print("Loaded 'add' from add.py")
        else:
            self.fail(f"Unexpected result from 'add': {result}")

if __name__ == '__main__':
    unittest.main()
