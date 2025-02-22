import psycopg2
import csv
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

def get_meals():
    exec_get_all("""
    SELECT * FROM meals;
    """)

def get_foodandallergens():
    exec_get_all("""
    SELECT * FROM foodandallergens;
    """)
