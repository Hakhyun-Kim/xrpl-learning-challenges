/**
 * UI Manager
 * Handles all UI rendering and interactions
 */
const UIManager = (function() {
    // Current state
    let currentChallenge = null;
    let currentChallengeIndex = 0;
    
    /**
     * Initialize the UI manager
     */
    function init() {
        // Set up global UI elements
        setupUI();
    }
    
    /**
     * Set up the UI elements
     */
    function setupUI() {
        // No additional setup needed for now
    }
    
    /**
     * Load a challenge by index
     * @param {number} index - Index of the challenge to load
     */
    function loadChallenge(index) {
        const challenges = ChallengeLoader.getChallenges();
        if (!challenges || index < 0 || index >= challenges.length) {
            showError('Invalid challenge index');
            return;
        }
        
        currentChallengeIndex = index;
        currentChallenge = challenges[index];
        
        // Save active challenge to storage
        StorageManager.setActiveChallenge(index);
        
        // Update progress bar
        ProgressBar.setActiveChallenge(index);
        
        // Render the challenge
        renderChallenge(currentChallenge);
    }
    
    /**
     * Render a challenge in the UI
     * @param {Object} challenge - Challenge object to render
     */
    function renderChallenge(challenge) {
        const container = document.getElementById('challengeContainer');
        
        // Check if the challenge is completed
        const isCompleted = StorageManager.isChallengeCompleted(challenge.id);
        
        // Get any saved code
        const savedCode = StorageManager.getCodeSnapshot(challenge.id) || challenge.code;
        
        // Create challenge HTML
        container.innerHTML = `
            <div class="challenge-header">
                <h2 class="challenge-title">
                    ${challenge.title}
                    ${isCompleted ? '<span class="completed-badge">✓</span>' : ''}
                </h2>
                <div class="challenge-nav">
                    ${currentChallengeIndex > 0 ? 
                        `<button id="prevChallengeBtn" class="secondary-button">Previous</button>` : ''}
                    ${currentChallengeIndex < ChallengeLoader.getChallenges().length - 1 ? 
                        `<button id="nextChallengeBtn" class="secondary-button">Next</button>` : ''}
                </div>
            </div>
            
            <div class="challenge-description">
                <p>${challenge.description}</p>
            </div>
            
            <div class="code-section">
                <div class="code-header">
                    <h3>Code</h3>
                    <div class="code-actions">
                        <button id="hintBtn" class="secondary-button">Show Hint</button>
                        <button id="resetCodeBtn" class="secondary-button">Reset Code</button>
                    </div>
                </div>
                
                <div id="hintContainer" class="hint">
                    ${challenge.hint}
                </div>
                
                <div id="codeEditorContainer" class="code-editor"></div>
                
                <div class="challenge-controls">
                    <div class="run-actions">
                        <button id="runCodeBtn" class="primary-button">Run Code</button>
                        <button id="autoCheckBtn" class="secondary-button">
                            <span id="autoCheckLabel">Auto-Check: Off</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="resultContainer" class="result-container">
                <div class="result-header">
                    <h4>Result</h4>
                    <button id="clearResultBtn" class="secondary-button">Clear</button>
                </div>
                <div id="resultContent" class="result-content"></div>
            </div>
        `;
        
        // Initialize the code editor
        CodeEditor.init('codeEditorContainer', savedCode, (code) => {
            // Save code as user types
            StorageManager.saveCodeSnapshot(challenge.id, code);
            
            // Check if auto-check is enabled
            if (CodeEditor.isAutoCheckEnabled()) {
                validateChallenge(code);
            }
        });
        
        // Add event listeners
        setupChallengeEventListeners(challenge);
    }
    
    /**
     * Set up event listeners for the challenge UI
     * @param {Object} challenge - Current challenge
     */
    function setupChallengeEventListeners(challenge) {
        // Hint button
        const hintBtn = document.getElementById('hintBtn');
        const hintContainer = document.getElementById('hintContainer');
        
        hintBtn.addEventListener('click', () => {
            const isVisible = hintContainer.style.display === 'block';
            hintContainer.style.display = isVisible ? 'none' : 'block';
            hintBtn.textContent = isVisible ? 'Show Hint' : 'Hide Hint';
        });
        
        // Reset code button
        const resetCodeBtn = document.getElementById('resetCodeBtn');
        resetCodeBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your code? This will lose any changes you made.')) {
                CodeEditor.setValue(challenge.code);
                StorageManager.saveCodeSnapshot(challenge.id, challenge.code);
            }
        });
        
        // Run code button
        const runCodeBtn = document.getElementById('runCodeBtn');
        runCodeBtn.addEventListener('click', () => {
            const code = CodeEditor.getValue();
            validateChallenge(code);
        });
        
        // Auto check toggle
        const autoCheckBtn = document.getElementById('autoCheckBtn');
        const autoCheckLabel = document.getElementById('autoCheckLabel');
        
        // Initialize auto-check button state
        updateAutoCheckButton(CodeEditor.isAutoCheckEnabled());
        
        autoCheckBtn.addEventListener('click', () => {
            const isEnabled = CodeEditor.toggleAutoCheck();
            updateAutoCheckButton(isEnabled);
        });
        
        // Clear result button
        const clearResultBtn = document.getElementById('clearResultBtn');
        clearResultBtn.addEventListener('click', () => {
            document.getElementById('resultContainer').style.display = 'none';
        });
        
        // Navigation buttons
        const prevChallengeBtn = document.getElementById('prevChallengeBtn');
        if (prevChallengeBtn) {
            prevChallengeBtn.addEventListener('click', () => {
                loadChallenge(currentChallengeIndex - 1);
            });
        }
        
        const nextChallengeBtn = document.getElementById('nextChallengeBtn');
        if (nextChallengeBtn) {
            nextChallengeBtn.addEventListener('click', () => {
                loadChallenge(currentChallengeIndex + 1);
            });
        }
    }
    
    /**
     * Update the auto-check button state
     * @param {boolean} isEnabled - Whether auto-check is enabled
     */
    function updateAutoCheckButton(isEnabled) {
        const autoCheckLabel = document.getElementById('autoCheckLabel');
        autoCheckLabel.textContent = `Auto-Check: ${isEnabled ? 'On' : 'Off'}`;
        
        const autoCheckBtn = document.getElementById('autoCheckBtn');
        if (isEnabled) {
            autoCheckBtn.classList.add('primary-button');
            autoCheckBtn.classList.remove('secondary-button');
        } else {
            autoCheckBtn.classList.remove('primary-button');
            autoCheckBtn.classList.add('secondary-button');
        }
    }
    
    /**
     * Validate the user's code against the challenge
     * @param {string} code - User's code
     */
    function validateChallenge(code) {
        const resultContainer = document.getElementById('resultContainer');
        const resultContent = document.getElementById('resultContent');
        
        resultContainer.style.display = 'block';
        resultContent.innerHTML = 'Running test...';
        
        TestRunner.runTest(currentChallenge, code)
            .then(result => {
                if (result.success) {
                    // Mark challenge as completed
                    StorageManager.markChallengeCompleted(currentChallenge.id);
                    
                    // Update progress bar
                    ProgressBar.updateProgress();
                    
                    // Show success result
                    resultContent.innerHTML = `
                        <div class="success-message">✓ Success! Your solution is correct.</div>
                        <pre>${result.output || ''}</pre>
                    `;
                    
                    // Show success modal
                    SuccessModal.show(currentChallenge, currentChallengeIndex);
                    
                    // Update the UI to show completion
                    const completedBadge = document.querySelector('.challenge-title .completed-badge');
                    if (!completedBadge) {
                        const titleElement = document.querySelector('.challenge-title');
                        titleElement.innerHTML += '<span class="completed-badge">✓</span>';
                    }
                } else {
                    // Show error result
                    resultContent.innerHTML = `
                        <div class="error-message">✗ Not quite right.</div>
                        <p>${result.error || 'Your solution doesn\'t match the expected pattern.'}</p>
                        <pre>${result.output || ''}</pre>
                    `;
                }
            })
            .catch(error => {
                resultContent.innerHTML = `
                    <div class="error-message">✗ Error:</div>
                    <p>${error.message}</p>
                `;
            });
    }
    
    /**
     * Show an error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        NotificationManager.show(message, 'error');
    }
    
    // Public API
    return {
        init,
        loadChallenge,
        showError
    };
})();