import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from src.nutRITion import *


class TestNutRITion(unittest.TestCase):
    def test_build_tables(self):
        create_tables()
        result = get_meals()
        self.assertEqual(None, result, "no rows in meals")

        result = get_foodandallergens()
        self.assertEqual(None, result, "no rows in foodandallergens")

    def test_csv(self):
        create_tables()
        load_data('/Users/paper/Brick-Hack-2025/nutRITion.api/src/data.csv')
        get_meals()
        get_foodandallergens()


if __name__ == "__main__":
    unittest.main()
