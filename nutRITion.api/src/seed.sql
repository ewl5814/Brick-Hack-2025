INSERT INTO meals(mealID, name, calories, satFat, cholesterol, sugars, fat, sodium, fiber, protein)
VALUES  (1, 'Blueberry Crumb Muffin', 420, 1.5, 120, 75, 10, 460, 1, 8),
        (2, 'Grilled Cheese Sandwich', 924.25, 14, 78.9, 70.63, 9.38, 56, 1590, 4.78, 36.24);

INSERT INTO foodandallergens(foodandallergenID, allergenID, mealID)
VALUES  (1, 2, 1),
        (2, 11, 1),
        (3, 4, 1),
        (4, 9, 1),
        (5, 5, 1),
        (6, 2, 2),
        (7, 4, 2),
        (8, 5, 2),
        (9, 9, 2),
        (10, 11, 2);