/**
 * Success Modal Component
 * Handles the success modal display and interactions
 */
const SuccessModal = (function() {
    // Modal element references
    const modal = document.getElementById('successModal');
    const message = document.getElementById('successMessage');
    const nextButton = document.getElementById('modalNextButton');
    const closeButton = document.getElementById('modalCloseButton');
    
    // Challenge data
    let currentChallengeIndex = 0;
    let totalChallenges = 0;
    
    /**
     * Initialize the modal
     */
    function init() {
        setupEventListeners();
    }
    
    /**
     * Set up event listeners for the modal
     */
    function setupEventListeners() {
        // Next challenge button
        nextButton.addEventListener('click', () => {
            hide();
            
            // Move to next challenge if not at the end
            if (currentChallengeIndex < totalChallenges - 1) {
                UIManager.loadChallenge(currentChallengeIndex + 1);
            }
        });
        
        // Close modal button
        closeButton.addEventListener('click', hide);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hide();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                hide();
            }
        });
    }
    
    /**
     * Show the success modal
     * @param {Object} challenge - Completed challenge
     * @param {number} index - Current challenge index
     * @param {string} customMessage - Optional custom message
     */
    function show(challenge, index, customMessage = null) {
        currentChallengeIndex = index;
        totalChallenges = ChallengeLoader.getChallenges().length;
        
        // Set message
        if (customMessage) {
            message.textContent = customMessage;
        } else {
            message.textContent = `You've successfully completed Challenge ${index + 1}: ${challenge.title.replace(/^Challenge \d+: /, '')}`;
            
            // Add more detail if it's the last challenge
            if (index === totalChallenges - 1) {
                const completed = StorageManager.getCompletedChallenges() || [];
                
                if (completed.length === totalChallenges) {
                    message.textContent += `\n\nCongratulations! You've completed all ${totalChallenges} challenges!`;
                }
            }
        }
        
        // Handle next button visibility
        if (index >= totalChallenges - 1) {
            nextButton.textContent = "All Completed!";
            
            // If all challenges are completed
            const completed = StorageManager.getCompletedChallenges() || [];
            if (completed.length === totalChallenges) {
                nextButton.disabled = true;
            }
        } else {
            nextButton.textContent = "Next Challenge";
            nextButton.disabled = false;
        }
        
        // Show the modal
        modal.classList.add('show');
    }
    
    /**
     * Hide the success modal
     */
    function hide() {
        modal.classList.remove('show');
    }
    
    // Public API
    return {
        init,
        show,
        hide
    };
})();

// Initialize the component
document.addEventListener('DOMContentLoaded', SuccessModal.init);