import psycopg2
import csv

from psycopg2._psycopg import AsIs

from nutRITion_db_utils import *


def create_tables():
    exec_commit(
        """     
    DROP TABLE IF EXISTS foodandallergens; 
        
    DROP TABLE IF EXISTS meals;
    
    DROP TABLE IF EXISTS allergens;
        
    CREATE TABLE meals(
        mealID SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(50),
        location VARCHAR(50),
        period VARCHAR(50),
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
        name VARCHAR(50) PRIMARY KEY NOT NULL
    );
    
    CREATE TABLE foodandallergens (
        foodandallergenID SERIAL PRIMARY KEY NOT NULL,
        allergenName VARCHAR(50),
        mealID INT,
        FOREIGN KEY (mealID) REFERENCES meals(mealID)
    );
    
    INSERT INTO allergens(name)
    VALUES  ('Coconut'),
            ('Egg'),
            ('Fish'),
            ('Gluten'),
            ('Milk'),
            ('Peanut'),
            ('Sesame'),
            ('Shellfish'),
            ('Soy'),
            ('Treenut'),
            ('Wheat');
            
    ALTER TABLE meals ADD CONSTRAINT unique_name_location UNIQUE (name, location);
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
    """
    name 0,location 1,period 2,allergens 3,carbohydrates 4,dietaryFiber 5,fat 6,protein 7,saturatedFat 8,vitaminA 9,calories 10,transFattyAcid 11,calcium 12,cholesterol 13,iron 14,sodium 15,vitaminC 16,totalSugars 17
    """
    rows = []
    data = []
    count = 0
    with open(path, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        next(csvreader)
        count = 0
        while count < 1000:
            rows.append(next(csvreader))
            count += 1
    for row in rows:
        mealDict = {'name': row[0], 'allergens': row[3], 'location': row[1], 'period': row[2], 'calories': row[10], 'satFat': row[8], 'cholesterol': row[13],
                    'sugars': row[17], 'fat': row[6], 'sodium': row[15], 'fiber': row[5], 'protein': row[7]}
        count = len(mealDict.get('allergens').split('/'))
        mealDict.update({'count': count})
        data.append(mealDict)


    sql = """
    INSERT INTO meals(mealId, location, name, period, calories, satFat, cholesterol, sugars, fat, sodium, fiber, protein)
    VALUES 
    ((SELECT COUNT(*) FROM meals)+1, %(location)s, %(name)s, %(period)s, %(calories)s, %(satFat)s, %(cholesterol)s, %(sugars)s, %(fat)s, %(sodium)s, %(fiber)s, %(protein)s);
    
    DO $$
    DECLARE
        i INT := 0;
        aller VARCHAR(50);
        foodandallergenID INT := (SELECT COUNT(*) FROM foodandallergens); 
        count INT := %(count)s; 
        mealID INT := (SELECT COUNT(*) FROM meals); 
    BEGIN
        WHILE i <= count LOOP
            aller := SPLIT_PART(%(allergens)s, '/', i + 1);
            INSERT INTO foodandallergens(foodandallergenID, allergenName, mealID)
            VALUES (foodandallergenID + i, aller, mealID);
            i := i + 1;
        END LOOP;
    END $$;
    """
    exec_list(sql, data)



def new_meal(dict):
    nextMID = get_next_id('meals')[0]
    dict.update({'mealID': nextMID + 1})
    nextAID = get_next_id('foodandallergens')[0]
    dict.update({'foodandallergenID': nextAID + 1})
    count = len(dict.get('allergens').split('/'))
    dict.update({'count': count})

    return exec_commit(
        """    
    INSERT INTO meals(mealID, name, calories, satFat, cholesterol, sugars, fat, sodium, fiber, protein)
    VALUES 
    (%(mealID)s, %(name)s, %(calories)s, %(satFat)s, %(cholesterol)s, %(sugars)s, %(fat)s, %(sodium)s, %(fiber)s, %(protein)s);
    
    DO $$
    DECLARE
        i INT := 0;
        aller VARCHAR(50);
        foodandallergenID INT := %(foodandallergenID)s; 
        count INT := %(count)s; 
        mealID INT := %(mealID)s; 
    BEGIN
        WHILE i <= count LOOP
            aller := SPLIT_PART(%(allergens)s, '/', i + 1);
            INSERT INTO foodandallergens(foodandallergenID, allergenName, mealID)
            VALUES (foodandallergenID + i, aller, mealID);
            i := i + 1;
        END LOOP;
    END $$;
    """, dict)

def delete_meal(id):
    return exec_commit(
        """    
    DELETE FROM foodandallergens WHERE mealID = %(id)s;
    DELETE FROM meals WHERE mealID = %(id)s;
    """, {'id': id})

def query(location, meal_time, allergens):
    return exec_get_all(
    """
    SELECT *
    FROM meals m
    WHERE m.location = ANY(%s)
    AND m.mealTime = ANY(%s)
    AND NOT EXISTS (
        SELECT 1 FROM foodandallergens fa
        WHERE fa.mealID = m.mealID
        AND fa.allergenName = ANY(%s)
    )
    """, (location, meal_time, allergens)
    )