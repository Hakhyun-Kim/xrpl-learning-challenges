/**
 * Notification Manager Component
 * Handles the display of notifications
 */
const NotificationManager = (function() {
    // Container for notifications
    const container = document.getElementById('notificationsContainer');
    
    // Notification types and their icons
    const TYPES = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Time in ms to show the notification (default: 3000)
     */
    function show(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon if available
        const icon = TYPES[type] || '';
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <div class="notification-content">${message}</div>
        `;
        
        // Add to DOM
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after duration
        setTimeout(() => {
            hide(notification);
        }, duration);
    }
    
    /**
     * Hide a notification
     * @param {HTMLElement} notification - Notification element to hide
     */
    function hide(notification) {
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Public API
    return {
        show
    };
})();