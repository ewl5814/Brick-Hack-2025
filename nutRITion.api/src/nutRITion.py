import psycopg2
import csv

from psycopg2._psycopg import AsIs

from src.nutRITion_db_utils import *


def create_tables():
    exec_commit(
        """     
    DROP TABLE IF EXISTS foodandallergens; 
        
    DROP TABLE IF EXISTS meals;
    
    DROP TABLE IF EXISTS allergens;
        
    CREATE TABLE meals(
        mealID SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(50),
        calories FLOAT,
        satFat FLOAT,
        cholesterol FLOAT,
        sugars FLOAT,
        fat FLOAT,
        sodium FLOAT,
        fiber FLOAT,
        protein FLOAT
    );
    
    CREATE TABLE allergens(
        allergenID SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(50)
    );
    
    CREATE TABLE foodandallergens (
        foodandallergenID SERIAL PRIMARY KEY NOT NULL,
        allergenID INT,
        mealID INT,
        FOREIGN KEY (allergenID) REFERENCES allergens(allergenID),
        FOREIGN KEY (mealID) REFERENCES meals(mealID)
    );
    
    INSERT INTO allergens(allergenID, name)
    VALUES  (1, 'Coconut'),
            (2, 'Egg'),
            (3, 'Fish'),
            (4, 'Gluten'),
            (5, 'Milk'),
            (6, 'Peanut'),
            (7, 'Sesame'),
            (8, 'Shellfish'),
            (9, 'Soy'),
            (10, 'Treenut'),
            (11, 'Wheat');
    """)

def get_next_id(table):
    return exec_get_one(
        """
    SELECT COUNT(*) FROM %(table)s;
    """, {'table': AsIs(table)}
    )

def get_meals():
    exec_get_all("""
    SELECT * FROM meals;
    """)

def get_foodandallergens():
    exec_get_all("""
    SELECT * FROM foodandallergens;
    """)

def load_data(path):
    """ Takes in a path to a csv file and then opens that file, filling a 2D array with every of the rows and attributes
        and creating a driver or a rider with every element in the array. """
    rows = []
    with open(path, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        for row in csvreader:
            rows.append(row)
    for row in rows:
        mealDict = {'name': None, 'calories': None, 'satFat': None, 'cholesterol': None,
                    'sugars': None, 'fat': None, 'sodium': None, 'fiber': None, 'protein': None}



def new_meal(dict):
    """
    Takes in a dictionary of attributes to be injected into a sql statement for creating a ride entity. Also gets rid
    of any etities in the available table that are involved with the new ride.
    Returns the ride.

    """
    nextRID = get_next_id('meals')[0]
    dict.update({'mealID': nextRID + 1})

    return exec_get_one_commit(
        """    
    INSERT INTO meals(mealID, name, calories, satFat, cholesterol, sugars, fat, sodium, fiber, protein)
    VALUES 
    (%(mealID)s, %(name)s, %(calories)s, %(satFat)s, %(cholesterol)s, %(sugars)s, %(fat)s, %(sodium)s, %(fiber)s, %(protein)s);
    """, dict)

def delete_meal(id):
    return exec_commit(
        """    
    DELETE FROM foodandallergens WHERE mealID = %(id)s;
    DELETE FROM meals WHERE mealID = %(id)s;
    """, {'id': id})


