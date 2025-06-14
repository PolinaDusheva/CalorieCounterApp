let currentCategory = '';
let currentData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 15; // This will be dynamically calculated
let currentView = '100g'; // or 'serving'

// Calculate how many rows can fit in the viewport
function calculateItemsPerPage() {
    const chartContainer = document.querySelector('.chart-container');
    const chartHeader = document.querySelector('.chart-header');
    const chartControls = document.querySelector('.chart-controls');
    const searchBox = document.querySelector('.search-box');
    const paginationContainer = document.querySelector('.pagination-container');
    const tableHeader = document.querySelector('.food-table thead');
    
    if (!chartContainer || !tableHeader) return 10; // fallback
    
    // Get the heights of fixed elements
    const containerHeight = chartContainer.clientHeight;
    const headerHeight = chartHeader ? chartHeader.offsetHeight : 0;
    const controlsHeight = chartControls ? chartControls.offsetHeight : 0;
    const searchHeight = searchBox ? searchBox.offsetHeight : 0;
    const paginationHeight = paginationContainer ? paginationContainer.offsetHeight : 60; // estimate if not visible
    const tableHeaderHeight = tableHeader.offsetHeight;
    
    // Calculate available height for table rows
    const padding = 60; // padding and margins
    const availableHeight = containerHeight - headerHeight - controlsHeight - searchHeight - paginationHeight - tableHeaderHeight - padding;
    
    // Try to measure actual row height if we have data
    let estimatedRowHeight = 50; // default estimate
    const existingRow = document.querySelector('.food-table tbody tr');
    if (existingRow) {
        estimatedRowHeight = existingRow.offsetHeight;
    }
    
    // Calculate how many rows can fit
    const calculatedItems = Math.floor(availableHeight / estimatedRowHeight);
    
    // Ensure minimum of 5 and maximum of 30 items
    return Math.max(5, Math.min(30, calculatedItems));
}

// Load chart data for a specific category
async function loadChart(categoryName) {
    currentCategory = categoryName;
    showLoading();
    
    try {
        const response = await fetch(`/api/calorie-chart/${categoryName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        currentData = data;
        filteredData = data;
        currentPage = 1;
        
        // Calculate items per page based on viewport
        itemsPerPage = calculateItemsPerPage();
        
        updateChartTitle(categoryName);
        displayChart();
        setupPagination();
        
    } catch (error) {
        console.error('Error loading chart:', error);
        showError('Failed to load calorie data. Please try again.');
    }
}

// Update the chart title based on category
function updateChartTitle(categoryName) {
    const categoryTitles = {
        'meat': 'Meat Calorie Chart',
        'drinks': 'Drinks Calorie Chart',
        'fruit': 'Fruit Calorie Chart',
        'vegetables': 'Vegetables Calorie Chart',
        'fish-seafood': 'Fish & Seafood Calorie Chart',
        'nuts-seeds': 'Nuts & Seeds Calorie Chart',
        'dairy': 'Dairy Calorie Chart',
        'bread': 'Bread & Pastries Calorie Chart',
        'pasta-noodles': 'Pasta & Noodles Calorie Chart',
        'fast-food': 'Fast Food Calorie Chart',
        'chocolate': 'Chocolate Calorie Chart',
        'ice-cream': 'Ice Cream Calorie Chart',
        'coffee': 'Coffee Calorie Chart',
        'tea': 'Tea Calorie Chart'
    };
    
    const title = categoryTitles[categoryName] || `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Calorie Chart`;
    document.getElementById('chartTitle').textContent = title;
    document.getElementById('pageTitle').textContent = `${title} - CalCounter`;
}

// Display the chart data
function displayChart() {
    const tbody = document.getElementById('foodTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        
        const foodCell = document.createElement('td');
        foodCell.textContent = item.food_name;
        
        const servingCell = document.createElement('td');
        servingCell.textContent = item.serving_size;
        
        const caloriesCell = document.createElement('td');
        caloriesCell.textContent = `${item.calories_per_serving} cal`;
        
        row.appendChild(foodCell);
        row.appendChild(servingCell);
        row.appendChild(caloriesCell);
        
        // Add click event to send food name to home page
        row.style.cursor = 'pointer';
        row.title = 'Add to entry';
        row.addEventListener('click', function() {
            localStorage.setItem('selectedFood', item.food_name);
            localStorage.setItem('selectedCalories', item.calories_per_serving);
            window.location.href = '/';
        });
        
        tbody.appendChild(row);
    });
    
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('chartContent').style.display = 'flex';
}

// Switch between 100g and serving view
function switchView(viewType) {
    currentView = viewType;
    
    // Update button states
    document.getElementById('per100gBtn').classList.toggle('active', viewType === '100g');
    document.getElementById('perServingBtn').classList.toggle('active', viewType === 'serving');
    
    // If we have data, refresh the display
    if (currentData.length > 0) {
        displayChart();
    }
}

// Setup pagination
function setupPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginationNav = document.getElementById('paginationNav');
    
    paginationNav.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')">‹</a>';
    paginationNav.appendChild(prevLi);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        paginationNav.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')">›</a>';
    paginationNav.appendChild(nextLi);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        displayChart();
        setupPagination();
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredData = currentData;
        } else {
            filteredData = currentData.filter(item => 
                item.food_name.toLowerCase().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        // Recalculate items per page in case viewport changed
        itemsPerPage = calculateItemsPerPage();
        displayChart();
        setupPagination();
    });
}

// Show loading state
function showLoading() {
    document.getElementById('loadingDiv').style.display = 'flex';
    document.getElementById('loadingDiv').innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.getElementById('chartContent').style.display = 'none';
}

// Show error message
function showError(message) {
    document.getElementById('loadingDiv').style.display = 'flex';
    document.getElementById('loadingDiv').innerHTML = `<div class="alert alert-danger">${message}</div>`;
    document.getElementById('chartContent').style.display = 'none';
}

// Handle window resize to recalculate items per page
function handleResize() {
    if (currentData.length > 0) {
        const newItemsPerPage = calculateItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            // Adjust current page to maintain position
            const currentFirstItem = (currentPage - 1) * itemsPerPage;
            currentPage = Math.floor(currentFirstItem / newItemsPerPage) + 1;
            displayChart();
            setupPagination();
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    
    // Add resize listener to recalculate items per page
    window.addEventListener('resize', handleResize);
    
    // Check if there's a category in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        loadChart(category);
    }
});

// Handle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}); 