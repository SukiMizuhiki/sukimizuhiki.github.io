// Light/Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.getElementById('main-body');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

// AJAX Form Submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('https://your-backend-api-url.com/contact', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('form-response').textContent = 'Message sent successfully!';
    })
    .catch(error => {
        document.getElementById('form-response').textContent = 'Error sending message.';
    });
});

// Project Filtering
const projectCards = document.querySelectorAll('.project-card');
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Project Search
document.getElementById('project-search').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    projectCards.forEach(card => {
        const projectName = card.querySelector('h3').textContent.toLowerCase();
        if (projectName.includes(searchValue)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
