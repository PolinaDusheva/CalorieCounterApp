async function submitText() {
    const textInput = document.getElementById('textInput');
    const messageDiv = document.getElementById('message');
    
    try {
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

// Load previous entries when page loads
document.addEventListener('DOMContentLoaded', fetchPreviousEntries);

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