/**
 * Landing Page - Specific functionality for the landing page
 */

/**
 * Initialize landing page specific functionality
 */
function initializeLandingPage() {
    // Add click tracking for the Read Documentation button
    const readDocsBtn = document.querySelector('.btn');
    if (readDocsBtn) {
        readDocsBtn.addEventListener('click', function() {
            // Future: Add analytics tracking here
        });
    }
}

// Export for global use
window.LandingPage = {
    initialize: initializeLandingPage
};
