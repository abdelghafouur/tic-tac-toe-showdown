// Function to toggle dark mode
function toggleTheme() {
    document.body.classList.toggle('dark');
    // Store user's preference in localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Apply theme on page load and set button animation delays
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // Set animation delays for buttons
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        const delay = button.getAttribute('data-animation-delay');
        if (delay) {
            button.style.setProperty('--animation-delay', delay);
        }
    });
});