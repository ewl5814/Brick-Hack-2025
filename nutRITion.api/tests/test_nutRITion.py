import unittest
from src.nutRITion import *
from src.nutRITion_db_utils import *


class TestNutRITion(unittest.TestCase):
    def test_build_tables(self):
        create_tables()
        result = get_meals()
        self.assertEqual([], result, "no rows in meals")

        result = get_foodandallergens()
        self.assertEqual([], result, "no rows in foodandallergens")


if __name__ == "__main__":
    unittest.main()
