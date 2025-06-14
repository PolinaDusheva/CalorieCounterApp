require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Azure SQL Database configuration
const dbConfig = {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
        encrypt: false, // Set to false for local SQL Server
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Create connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Initialize database and tables
async function initializeDatabase() {
    try {
        await poolConnect;
        const request = pool.request();
        
        // Create database if it doesn't exist
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'text_storage')
            BEGIN
                CREATE DATABASE text_storage;
            END
        `);
        
        // Switch to text_storage database
        await request.query('USE text_storage;');
        
        // Create food categories table
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'food_categories')
            BEGIN
                CREATE TABLE food_categories (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    category_name NVARCHAR(50) NOT NULL UNIQUE,
                    category_emoji NVARCHAR(10),
                    created_at DATETIME2 DEFAULT GETDATE()
                )
            END
        `);
        
        // Create food items table
        await request.query(`
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
        `);
        
        // Create food entries table (for user tracking)
        await request.query(`
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
        `);
        
        // Create user goals table
        await request.query(`
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
        `);
        
        // Create user input table
        await request.query(`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user_input')
            BEGIN
                CREATE TABLE user_input (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    text_content NVARCHAR(MAX) NOT NULL,
                    created_at DATETIME2 DEFAULT GETDATE()
                )
            END
        `);
        
        console.log('Database and tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Error handler for connection issues
pool.on('error', err => {
    console.error('Database connection error:', err);
});

// API endpoint to submit text
app.post('/api/submit-text', async (req, res) => {
    try {
        await poolConnect;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const request = pool.request();
        await request
            .input('text', sql.NVarChar, text)
            .query('INSERT INTO user_input (text_content) VALUES (@text)');
        res.json({ message: 'Text submitted successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get previous entries
app.get('/api/get-entries', async (req, res) => {
    try {
        await poolConnect;
        
        const request = pool.request();
        const result = await request.query(
            'SELECT TOP 10 * FROM user_input ORDER BY created_at DESC'
        );
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get calorie chart data by category
app.get('/api/calorie-chart/:category', async (req, res) => {
    try {
        await poolConnect;
        const categoryName = req.params.category;
        
        const request = pool.request();
        const result = await request
            .input('categoryName', sql.NVarChar, categoryName)
            .query(`
                SELECT fi.food_name, fi.serving_size, fi.calories_per_serving, fi.protein, fi.carbs, fi.fats
                FROM food_items fi
                INNER JOIN food_categories fc ON fi.category_id = fc.id
                WHERE fc.category_name = @categoryName
                ORDER BY fi.food_name
            `);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching calorie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get all food categories
app.get('/api/categories', async (req, res) => {
    try {
        await poolConnect;
        
        const request = pool.request();
        const result = await request.query(
            'SELECT * FROM food_categories ORDER BY category_name'
        );
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get today's total calories
app.get('/api/daily-calories', async (req, res) => {
    try {
        await poolConnect;
        const request = pool.request();
        const result = await request.query(`
            SELECT ISNULL(SUM(calories), 0) AS total_calories
            FROM food_entries
            WHERE CAST(created_at AS DATE) = CAST(GETDATE() AS DATE)
        `);
        res.json({ total_calories: result.recordset[0].total_calories });
    } catch (error) {
        console.error('Error fetching daily calories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the calorie chart page
app.get('/calorie-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calorie-chart.html'));
});

// Initialize database before starting the server
initializeDatabase().then(() => {
    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Handle cleanup on app shutdown
process.on('SIGINT', async () => {
    try {
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('Error closing connection pool:', err);
        process.exit(1);
    }
}); 