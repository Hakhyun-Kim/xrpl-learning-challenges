/**
 * Progress Bar Component
 * Handles the display and updating of the progress bar
 */
const ProgressBar = (function() {
    // Element references
    let progressBar = null;
    let progressLabels = null;
    let progressStats = null;
    
    // Challenge data
    let challenges = [];
    let activeIndex = 0;
    
    /**
     * Initialize the progress bar
     * @param {Array} challengeData - Array of challenge objects
     */
    function init(challengeData) {
        challenges = challengeData;
        
        // Get element references
        progressBar = document.getElementById('progressBar');
        progressLabels = document.getElementById('progressLabels');
        progressStats = document.getElementById('progressStats');
        
        // Render the progress labels
        renderLabels();
        
        // Update the progress bar
        updateProgress();
    }
    
    /**
     * Render challenge labels
     */
    function renderLabels() {
        if (!progressLabels) return;
        
        // Clear existing labels
        progressLabels.innerHTML = '';
        
        // Create label for each challenge
        challenges.forEach((challenge, index) => {
            const label = document.createElement('div');
            label.className = 'progress-label';
            label.setAttribute('data-index', index);
            label.textContent = index + 1;
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'progress-label-tooltip';
            tooltip.textContent = challenge.title.replace(/^Challenge \d+: /, '');
            
            label.appendChild(tooltip);
            
            // Add click handler
            label.addEventListener('click', () => {
                // Load the challenge
                UIManager.loadChallenge(index);
            });
            
            progressLabels.appendChild(label);
        });
    }
    
    /**
     * Update the progress bar based on completed challenges
     */
    function updateProgress() {
        if (!progressBar || !progressLabels || !progressStats) return;
        
        // Get completed challenges
        const completed = StorageManager.getCompletedChallenges() || [];
        
        // Update stats
        progressStats.textContent = `${completed.length}/${challenges.length} challenges completed`;
        
        // Update progress bar width
        const progressPercentage = (completed.length / challenges.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update labels
        const labels = progressLabels.querySelectorAll('.progress-label');
        
        labels.forEach((label, index) => {
            const challengeId = challenges[index].id;
            
            // Reset classes
            label.classList.remove('completed', 'active');
            
            // Add completed class if challenge is completed
            if (completed.includes(challengeId)) {
                label.classList.add('completed');
            }
            
            // Add active class if this is the active challenge
            if (index === activeIndex) {
                label.classList.add('active');
            }
        });
    }
    
    /**
     * Set the active challenge
     * @param {number} index - Index of the active challenge
     */
    function setActiveChallenge(index) {
        activeIndex = index;
        updateProgress();
    }
    
    // Public API
    return {
        init,
        updateProgress,
        setActiveChallenge
    };
})();