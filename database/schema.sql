IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'text_storage')
BEGIN
    CREATE DATABASE text_storage;
END
GO

USE text_storage;
GO

-- Food categories table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'food_categories')
BEGIN
    CREATE TABLE food_categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        category_name NVARCHAR(50) NOT NULL UNIQUE,
        category_emoji NVARCHAR(10),
        created_at DATETIME2 DEFAULT GETDATE()
    )
END

-- Food items table for calorie charts
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'food_items')
BEGIN
    CREATE TABLE food_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        food_name NVARCHAR(100) NOT NULL,
        category_id INT NOT NULL,
        serving_size NVARCHAR(20) DEFAULT '100g',
        calories_per_serving INT NOT NULL,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fats DECIMAL(5,2),
        created_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (category_id) REFERENCES food_categories(id)
    )
END

-- Food entries table (for user tracking)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'food_entries')
BEGIN
    CREATE TABLE food_entries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        food_name NVARCHAR(100) NOT NULL,
        calories INT NOT NULL,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fats DECIMAL(5,2),
        meal_type NVARCHAR(20),
        created_at DATETIME2 DEFAULT GETDATE()
    )
END

-- User goals table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_goals')
BEGIN
    CREATE TABLE user_goals (
        id INT IDENTITY(1,1) PRIMARY KEY,
        daily_calorie_goal INT NOT NULL,
        protein_goal DECIMAL(5,2),
        carbs_goal DECIMAL(5,2),
        fats_goal DECIMAL(5,2),
        created_at DATETIME2 DEFAULT GETDATE()
    )
END

-- User input table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_input')
BEGIN
    CREATE TABLE user_input (
        id INT IDENTITY(1,1) PRIMARY KEY,
        text_content NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    )
END