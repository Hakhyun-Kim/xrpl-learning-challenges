/**
 * Storage Manager
 * Handles all local storage operations for persisting user progress
 */
const StorageManager = (function() {
    // Storage keys
    const STORAGE_KEYS = {
        COMPLETED_CHALLENGES: 'xrpl-completed-challenges',
        ACTIVE_CHALLENGE: 'xrpl-active-challenge',
        DARK_MODE: 'xrpl-dark-mode',
        CODE_SNAPSHOTS: 'xrpl-code-snapshots'
    };
    
    /**
     * Initialize storage
     */
    function init() {
        // Create storage if it doesn't exist
        if (!getCompletedChallenges()) {
            setCompletedChallenges([]);
        }
        
        if (!getCodeSnapshots()) {
            setCodeSnapshots({});
        }
    }
    
    /**
     * Get the list of completed challenges
     * @returns {Array} Array of completed challenge IDs
     */
    function getCompletedChallenges() {
        const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
        return data ? JSON.parse(data) : null;
    }
    
    /**
     * Save the list of completed challenges
     * @param {Array} challenges - Array of completed challenge IDs
     */
    function setCompletedChallenges(challenges) {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_CHALLENGES, JSON.stringify(challenges));
    }
    
    /**
     * Mark a challenge as completed
     * @param {string} challengeId - ID of the challenge to mark as completed
     */
    function markChallengeCompleted(challengeId) {
        const completed = getCompletedChallenges() || [];
        if (!completed.includes(challengeId)) {
            completed.push(challengeId);
            setCompletedChallenges(completed);
        }
    }
    
    /**
     * Check if a challenge is completed
     * @param {string} challengeId - ID of the challenge to check
     * @returns {boolean} True if the challenge is completed
     */
    function isChallengeCompleted(challengeId) {
        const completed = getCompletedChallenges() || [];
        return completed.includes(challengeId);
    }
    
    /**
     * Get the active challenge index
     * @returns {number} Index of the active challenge
     */
    function getActiveChallenge() {
        const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHALLENGE);
        return active ? parseInt(active, 10) : 0;
    }
    
    /**
     * Set the active challenge index
     * @param {number} index - Index of the active challenge
     */
    function setActiveChallenge(index) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CHALLENGE, index.toString());
    }
    
    /**
     * Get dark mode preference
     * @returns {boolean} True if dark mode is preferred
     */
    function getDarkModePreference() {
        return localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    }
    
    /**
     * Set dark mode preference
     * @param {boolean} isDarkMode - True to enable dark mode
     */
    function setDarkModePreference(isDarkMode) {
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode.toString());
    }
    
    /**
     * Get all code snapshots
     * @returns {Object} Object with challenge IDs as keys and code snapshots as values
     */
    function getCodeSnapshots() {
        const data = localStorage.getItem(STORAGE_KEYS.CODE_SNAPSHOTS);
        return data ? JSON.parse(data) : null;
    }
    
    /**
     * Set all code snapshots
     * @param {Object} snapshots - Object with challenge IDs as keys and code snapshots as values
     */
    function setCodeSnapshots(snapshots) {
        localStorage.setItem(STORAGE_KEYS.CODE_SNAPSHOTS, JSON.stringify(snapshots));
    }
    
    /**
     * Save a code snapshot for a challenge
     * @param {string} challengeId - ID of the challenge
     * @param {string} code - Code to save
     */
    function saveCodeSnapshot(challengeId, code) {
        const snapshots = getCodeSnapshots() || {};
        snapshots[challengeId] = code;
        setCodeSnapshots(snapshots);
    }
    
    /**
     * Get a code snapshot for a challenge
     * @param {string} challengeId - ID of the challenge
     * @returns {string|null} The saved code or null if not found
     */
    function getCodeSnapshot(challengeId) {
        const snapshots = getCodeSnapshots() || {};
        return snapshots[challengeId] || null;
    }
    
    /**
     * Clear all stored data
     */
    function clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.COMPLETED_CHALLENGES);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHALLENGE);
        localStorage.removeItem(STORAGE_KEYS.CODE_SNAPSHOTS);
        // Keep dark mode preference
    }
    
    // Public API
    return {
        init,
        getCompletedChallenges,
        setCompletedChallenges,
        markChallengeCompleted,
        isChallengeCompleted,
        getActiveChallenge,
        setActiveChallenge,
        getDarkModePreference,
        setDarkModePreference,
        saveCodeSnapshot,
        getCodeSnapshot,
        clearAllData
    };
})();