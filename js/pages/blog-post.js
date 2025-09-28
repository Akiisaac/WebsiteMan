/**
 * Blog Post Page JavaScript
 * Handles individual blog post functionality
 */

window.BlogPost = {
    /**
     * Initialize blog post page
     */
    initialize: function() {
        // For now, just basic initialization
        // Future: Load dynamic content, handle interactions
    }
};

// Auto-initialize if this script is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/blog/posts/')) {
        window.BlogPost.initialize();
    }
});
