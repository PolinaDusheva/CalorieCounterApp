async function submitText() {
    const textInput = document.getElementById('textInput');
    const messageDiv = document.getElementById('message');
    
    try {
        const products = getProductsByMeal();
        // Optionally, send products to backend here for saving
        // For now, just send textarea as before
        const response = await fetch('/api/submit-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textInput.value })
        });
        
        const data = await response.json();
        
        // Show success message
        messageDiv.textContent = data.message;
        messageDiv.className = 'alert alert-success';
        messageDiv.style.display = 'block';
        
        // Clear input
        textInput.value = '';
        
        // Refresh the entries list
        fetchPreviousEntries();
        // Refresh the calorie chart
        updateCalorieCircle();
        
        // Move pending to submitted
        setSubmittedProducts(getPendingProducts());
        setPendingProducts([]);
        renderProductTable();
        
        clearProductsByMeal();
        
    } catch (error) {
        messageDiv.textContent = 'Error submitting text';
        messageDiv.className = 'alert alert-danger';
        messageDiv.style.display = 'block';
    }
}

async function fetchPreviousEntries() {
    const entriesDiv = document.getElementById('previousEntries');
    
    try {
        const response = await fetch('/api/get-entries');
        const entries = await response.json();
        
        entriesDiv.innerHTML = entries.map(entry => `
            <div class="list-group-item">
                <p class="mb-1">${entry.text_content}</p>
                <small class="text-muted">Submitted: ${new Date(entry.created_at).toLocaleString()}</small>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error fetching entries:', error);
    }
}

// Draw the calorie circle chart
function drawCalorieCircleChart(current, goal) {
    const canvas = document.getElementById('calorieCircleChart');
    const ctx = canvas.getContext('2d');
    const radius = 70;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 18;
    ctx.stroke();

    // Progress arc
    const percent = Math.min(current / goal, 1);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (2 * Math.PI * percent) - Math.PI / 2);
    ctx.strokeStyle = percent < 1 ? '#ff6600' : '#e74c3c';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// Fetch and update the daily calorie chart
async function updateCalorieCircle() {
    const goal = 2000; // Default daily goal, can be dynamic
    try {
        const response = await fetch('/api/daily-calories');
        const data = await response.json();
        const calories = data.total_calories || 0;
        drawCalorieCircleChart(calories, goal);
        document.getElementById('calorieCircleValue').textContent = calories + ' cal';
    } catch (error) {
        drawCalorieCircleChart(0, goal);
        document.getElementById('calorieCircleValue').textContent = '0 cal';
    }
}

// Helper to get and set product table data in localStorage
function getPendingProducts() {
    return JSON.parse(localStorage.getItem('pendingProducts') || '[]');
}
function setPendingProducts(arr) {
    localStorage.setItem('pendingProducts', JSON.stringify(arr));
}
function getSubmittedProducts() {
    return JSON.parse(localStorage.getItem('submittedProducts') || '[]');
}
function setSubmittedProducts(arr) {
    localStorage.setItem('submittedProducts', JSON.stringify(arr));
}

// Helper to get/set products by meal
const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];
function getProductsByMeal() {
    return JSON.parse(localStorage.getItem('productsByMeal') || '{}');
}
function setProductsByMeal(obj) {
    localStorage.setItem('productsByMeal', JSON.stringify(obj));
}
function clearProductsByMeal() {
    localStorage.removeItem('productsByMeal');
}

// Render the product table with edit option
function renderProductTable() {
    const products = getProductsByMeal();
    MEALS.forEach(meal => {
        const tbody = document.getElementById(meal + 'Body');
        tbody.innerHTML = '';
        const arr = products[meal] || [];
        if (arr.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" class="text-center text-muted">No products</td>';
            tbody.appendChild(tr);
        } else {
            arr.forEach((prod, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${prod.name}</td>
                    <td><input type="number" min="1" value="${prod.quantity}" class="form-control form-control-sm" style="width:70px" data-meal="${meal}" data-idx="${idx}" /></td>
                    <td>${prod.calories} cal</td>
                    <td><button class="btn btn-sm btn-danger" data-meal="${meal}" data-idx="${idx}" onclick="removeProductFromMeal('${meal}',${idx})">Remove</button></td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
    // Add input listeners for quantity
    document.querySelectorAll('#productTable input[type=number]').forEach(input => {
        input.addEventListener('change', function() {
            const meal = this.getAttribute('data-meal');
            const idx = parseInt(this.getAttribute('data-idx'));
            const products = getProductsByMeal();
            if (products[meal] && products[meal][idx]) {
                products[meal][idx].quantity = this.value;
                setProductsByMeal(products);
            }
        });
    });
}

// Remove product from meal
function removeProductFromMeal(meal, idx) {
    const products = getProductsByMeal();
    if (products[meal]) {
        products[meal].splice(idx, 1);
        setProductsByMeal(products);
        renderProductTable();
    }
}
window.removeProductFromMeal = removeProductFromMeal;

// On page load, check for selected food from chart (with calories)
document.addEventListener('DOMContentLoaded', function() {
    fetchPreviousEntries();
    updateCalorieCircle();
    // Check for selected food from calorie chart
    const selectedFood = localStorage.getItem('selectedFood');
    const selectedCalories = localStorage.getItem('selectedCalories');
    if (selectedFood) {
        // Prompt for meal type
        let meal = prompt('Which meal? (breakfast, lunch, dinner, snack)', 'breakfast');
        meal = meal && MEALS.includes(meal.toLowerCase()) ? meal.toLowerCase() : 'breakfast';
        const products = getProductsByMeal();
        if (!products[meal]) products[meal] = [];
        products[meal].push({ name: selectedFood, quantity: 100, calories: selectedCalories ? parseInt(selectedCalories) : 0 });
        setProductsByMeal(products);
        localStorage.removeItem('selectedFood');
        localStorage.removeItem('selectedCalories');
    }
    renderProductTable();
    // Fill textarea as before
    const products = getProductsByMeal();
    let names = [];
    MEALS.forEach(meal => {
        if (products[meal]) names = names.concat(products[meal].map(p => p.name));
    });
    if (names.length > 0) {
        const textInput = document.getElementById('textInput');
        textInput.value = names.join(', ');
        textInput.focus();
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.has-dropdown');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
}); 