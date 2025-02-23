import unittest
from src.nutRITion_db_utils import *


class TestPostgreSQL(unittest.TestCase):

    def test_can_connect(self):
        result = exec_get_one('SELECT VERSION()')
        self.assertTrue(result[0].startswith('PostgreSQL'))

if __name__ == '__main__':
    unittest.main()