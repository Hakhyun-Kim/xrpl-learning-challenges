/**
 * Code Editor Manager
 * Handles the code editor initialization and operations
 */
const CodeEditor = (function() {
    // Editor instance
    let editor = null;
    let autoCheckEnabled = false;
    let changeCallback = null;
    let changeTimer = null;
    
    /**
     * Initialize the code editor
     * @param {string} containerId - ID of the container element
     * @param {string} initialCode - Initial code to display
     * @param {Function} onChangeCallback - Callback to run when code changes
     */
    function init(containerId, initialCode, onChangeCallback) {
        // Store the callback
        changeCallback = onChangeCallback;
        
        // Initialize CodeMirror
        editor = CodeMirror(document.getElementById(containerId), {
            value: initialCode,
            mode: 'javascript',
            lineNumbers: true,
            theme: getCurrentTheme(),
            lineWrapping: true,
            indentUnit: 2,
            tabSize: 2,
            indentWithTabs: false,
            autofocus: true
        });
        
        // Set up change listener with debounce
        editor.on('change', debounceChange);
    }
    
    /**
     * Debounce the change event to avoid excessive callbacks
     */
    function debounceChange() {
        clearTimeout(changeTimer);
        changeTimer = setTimeout(() => {
            if (changeCallback) {
                changeCallback(editor.getValue());
            }
        }, 500); // 500ms debounce
    }
    
    /**
     * Get the current theme based on dark mode preference
     * @returns {string} CodeMirror theme name
     */
    function getCurrentTheme() {
        return document.documentElement.classList.contains('dark-theme') ? 
            'darcula' : 'default';
    }
    
    /**
     * Refresh the editor theme
     */
    function refreshTheme() {
        if (editor) {
            editor.setOption('theme', getCurrentTheme());
        }
    }
    
    /**
     * Get the current editor value
     * @returns {string} Current code in the editor
     */
    function getValue() {
        return editor ? editor.getValue() : '';
    }
    
    /**
     * Set the editor value
     * @param {string} code - Code to set in the editor
     */
    function setValue(code) {
        if (editor) {
            editor.setValue(code);
        }
    }
    
    /**
     * Toggle auto-check feature
     * @returns {boolean} New auto-check state
     */
    function toggleAutoCheck() {
        autoCheckEnabled = !autoCheckEnabled;
        return autoCheckEnabled;
    }
    
    /**
     * Check if auto-check is enabled
     * @returns {boolean} Auto-check enabled state
     */
    function isAutoCheckEnabled() {
        return autoCheckEnabled;
    }
    
    // Public API
    return {
        init,
        getValue,
        setValue,
        refreshTheme,
        toggleAutoCheck,
        isAutoCheckEnabled
    };
})();