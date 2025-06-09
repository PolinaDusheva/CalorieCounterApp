-- Sample data for food categories and food items
-- You can use this as a reference to populate your database

USE text_storage;
GO

-- Insert food categories
INSERT INTO food_categories (category_name, category_emoji) VALUES
('meat', '🥩'),
('drinks', '🍸'),
('fruit', '🍎'),
('vegetables', '🥦'),
('fish-seafood', '🐟'),
('nuts-seeds', '🥜'),
('dairy', '🥛'),
('bread', '🍞'),
('pasta-noodles', '🍝'),
('fast-food', '🍔'),
('chocolate', '🍫'),
('ice-cream', '🍦'),
('coffee', '☕'),
('tea', '🍵'),
('cheese', '🧀'),
('ham-sausage', '🍖'),
('milk', '🥛'),
('cakes-pies', '🍰'),
('pizza', '🍕'),
('high-calorie', '🔥'),
('low-calorie', '🥗'),
('no-calorie', '💧'),
('oils-fats', '🧈'),
('snacks', '🍟'),
('cookies', '🍪'),
('candy', '🍬'),
('pudding', '🍮'),
('frozen-yogurt', '🍨'),
('salad', '🥗'),
('baking', '🍞'),
('sauces', '🍯'),
('supplements', '🍼'),
('herbs-spices', '🌿'),
('sushi', '🍣'),
('vegan', '🥜'),
('juice', '🍹'),
('meals', '🍽'),
('wine', '🍷');

-- Sample meat data (replace with your actual data)
INSERT INTO food_items (food_name, category_id, serving_size, calories_per_serving, protein, carbs, fats) VALUES
('Alligator', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 97, 21.0, 0.0, 1.0),
('Beef', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 156, 26.0, 0.0, 6.0),
('Beef Bologna', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 299, 12.0, 3.0, 27.0),
('Beef Fillet, Beef Tenderloin', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 121, 25.0, 0.0, 3.0),
('Beef Heart', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 105, 17.0, 0.0, 4.0),
('Beef Jerky', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 269, 55.0, 11.0, 3.0),
('Beef Kidney', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 48, 17.0, 0.0, 3.0),
('Beef Liver', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 131, 20.0, 4.0, 4.0),
('Beef Patty', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 295, 18.0, 0.0, 24.0),
('Beef Roast', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 216, 28.0, 0.0, 11.0),
('Beef Stew', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 251, 15.0, 10.0, 17.0),
('Beef Tongue', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 221, 19.0, 0.0, 16.0),
('Beef Tripe', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 85, 12.0, 0.0, 4.0),
('Bison Meat', (SELECT id FROM food_categories WHERE category_name = 'meat'), '100g', 146, 28.0, 0.0, 2.0);

-- Sample drinks data
INSERT INTO food_items (food_name, category_id, serving_size, calories_per_serving, protein, carbs, fats) VALUES
('Water', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '250ml', 0, 0.0, 0.0, 0.0),
('Coca Cola', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '250ml', 105, 0.0, 27.0, 0.0),
('Orange Juice', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '250ml', 112, 1.7, 26.0, 0.5),
('Apple Juice', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '250ml', 114, 0.2, 28.0, 0.3),
('Beer', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '250ml', 103, 0.8, 5.0, 0.0),
('Red Wine', (SELECT id FROM food_categories WHERE category_name = 'drinks'), '150ml', 125, 0.1, 4.0, 0.0);

-- Sample fruit data
INSERT INTO food_items (food_name, category_id, serving_size, calories_per_serving, protein, carbs, fats) VALUES
('Apple', (SELECT id FROM food_categories WHERE category_name = 'fruit'), '100g', 52, 0.3, 14.0, 0.2),
('Banana', (SELECT id FROM food_categories WHERE category_name = 'fruit'), '100g', 89, 1.1, 23.0, 0.3),
('Orange', (SELECT id FROM food_categories WHERE category_name = 'fruit'), '100g', 47, 0.9, 12.0, 0.1),
('Strawberry', (SELECT id FROM food_categories WHERE category_name = 'fruit'), '100g', 32, 0.7, 8.0, 0.3),
('Grapes', (SELECT id FROM food_categories WHERE category_name = 'fruit'), '100g', 62, 0.6, 16.0, 0.2);

-- Note: Continue adding data for other categories as needed
-- The structure is:
-- food_name: Name of the food item
-- category_id: Foreign key reference to food_categories table
-- serving_size: Serving size (e.g., '100g', '1 cup', '1 piece')
-- calories_per_serving: Calories per serving
-- protein: Protein in grams (optional)
-- carbs: Carbohydrates in grams (optional)
-- fats: Fats in grams (optional) 