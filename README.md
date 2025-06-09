# CalCounter - Calorie Calculator App

A comprehensive calorie tracking application with dynamic food calorie charts.

## Features

- **Main Calorie Calculator**: Enter foods you've eaten and get calorie calculations
- **Dynamic Calorie Charts**: Browse detailed calorie information by food category
- **Database-Driven**: All calorie data is stored in and retrieved from the database
- **Responsive Design**: Works on desktop and mobile devices
- **Search Functionality**: Search for specific foods within categories
- **Pagination**: Navigate through large food datasets efficiently

## Database Structure

### Tables Created

1. **food_categories**: Stores food category information
   - `id`: Primary key
   - `category_name`: Name of the category (e.g., 'meat', 'fruit')
   - `category_emoji`: Emoji representation
   - `created_at`: Timestamp

2. **food_items**: Stores individual food items and their nutritional data
   - `id`: Primary key
   - `food_name`: Name of the food item
   - `category_id`: Foreign key to food_categories
   - `serving_size`: Serving size (e.g., '100g', '1 cup')
   - `calories_per_serving`: Calories per serving
   - `protein`: Protein content in grams
   - `carbs`: Carbohydrate content in grams
   - `fats`: Fat content in grams
   - `created_at`: Timestamp

3. **food_entries**: User food tracking entries
4. **user_goals**: User calorie and macro goals
5. **user_input**: General user text input storage

## Setup Instructions

1. **Database Setup**:
   - Run the SQL scripts in `database/schema.sql` to create the database structure
   - Use `database/sample_data.sql` as a reference to populate your data

2. **Environment Configuration**:
   ```
   AZURE_SQL_SERVER=your_server
   AZURE_SQL_DATABASE=text_storage
   AZURE_SQL_USER=your_username
   AZURE_SQL_PASSWORD=your_password
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```

## How to Use

### Adding Food Data

1. First, ensure food categories are populated in the `food_categories` table
2. Add food items to the `food_items` table with the appropriate `category_id`
3. The calorie charts will automatically display data from the database

### Accessing Calorie Charts

1. Navigate to the main page
2. Click on any food category in the "Calories" dropdown menu
3. Browse the calorie chart with search and pagination functionality
4. Switch between "per 100g" and "per serving" views

### API Endpoints

- `GET /api/calorie-chart/:category` - Get calorie data for a specific category
- `GET /api/categories` - Get all food categories
- `POST /api/submit-text` - Submit user text input
- `GET /api/get-entries` - Get user previous entries

## File Structure

```
├── public/
│   ├── index.html              # Main calorie calculator page
│   ├── calorie-chart.html      # Calorie chart display page
│   ├── calorie-chart.js        # Frontend logic for charts
│   ├── script.js               # Main page functionality
│   └── styles.css              # Styles for all pages
├── database/
│   ├── schema.sql              # Database schema creation
│   └── sample_data.sql         # Sample data for reference
├── server.js                   # Express server with API endpoints
├── package.json                # Dependencies
└── README.md                   # This file
```

## Technical Details

- **Backend**: Node.js with Express
- **Database**: Microsoft SQL Server (Azure SQL or local)
- **Frontend**: Vanilla JavaScript with Bootstrap 5
- **Features**: Pagination, search, responsive design

## Data Population

You'll need to populate the database with your own food data. Use the `sample_data.sql` file as a reference for the data structure. The sample includes examples for meat, drinks, and fruit categories.

For each food item, you should provide:
- Food name
- Category (must exist in food_categories table)
- Serving size
- Calories per serving
- Optional: protein, carbs, and fats content # CalorieCounterApp
