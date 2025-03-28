/**
 * Main Application Entry Point
 * This file initializes the application and orchestrates the different components
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Initialize the application
 */
function initApp() {
    console.log('XRPL Learning Challenges App Starting...');
    
    // Initialize storage
    StorageManager.init();
    
    // Initialize theme preference
    initTheme();
    
    // Initialize the UI
    UIManager.init();
    
    // Load challenge data
    ChallengeLoader.loadChallenges()
        .then(challenges => {
            // Initialize progress bar
            ProgressBar.init(challenges);
            
            // Load the first challenge or resume from last active challenge
            const activeChallenge = StorageManager.getActiveChallenge();
            const challengeToLoad = activeChallenge || 0;
            
            UIManager.loadChallenge(challengeToLoad);
            console.log('App initialized successfully');
        })
        .catch(error => {
            console.error('Failed to initialize app:', error);
            UIManager.showError('Failed to load challenges. Please refresh the page.');
        });
    
    // Set up event listeners for global UI elements
    setupEventListeners();
}

/**
 * Initialize the theme based on user preference
 */
function initTheme() {
    const darkModePreferred = StorageManager.getDarkModePreference();
    if (darkModePreferred) {
        document.documentElement.classList.add('dark-theme');
        document.getElementById('darkModeToggle').textContent = '☀️';
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Reset progress button
    const resetProgressButton = document.getElementById('resetProgress');
    resetProgressButton.addEventListener('click', resetProgress);
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = document.documentElement.classList.toggle('dark-theme');
    
    // Update button icon
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    StorageManager.setDarkModePreference(isDarkMode);
    
    // Re-initialize code editor with new theme
    CodeEditor.refreshTheme();
    
    // Show notification
    NotificationManager.show(
        `${isDarkMode ? 'Dark' : 'Light'} mode activated`,
        'info'
    );
}

/**
 * Reset user progress
 */
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        StorageManager.clearAllData();
        location.reload();
    }
}

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    NotificationManager.show(
        'An error occurred. Check the console for details.',
        'error'
    );
});