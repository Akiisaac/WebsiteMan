/**
 * Main JavaScript file for Research Blog Website
 * Imports and initializes all modules
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Research Blog Website loaded successfully');
    
    // Initialize website functionality
    initializeWebsite();
});

/**
 * Initialize website functionality
 */
function initializeWebsite() {
    // Initialize core functionality
    if (window.Navigation) {
        window.Navigation.addSmoothScrolling();
    }
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    initializePageSpecific(currentPage);
}

/**
 * Determine current page and initialize appropriate functionality
 */
function getCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('landing-page.html') || path === '/' || path === '/index.html') {
        return 'landing-page';
    }
    else if (path.includes('blog-menu.html')) {
        return 'blog-menu';
    }
    else if (path.includes('/blog/posts/')) {
        return 'blog-post';
    }
    // Future pages can be added here
    // else if (path.includes('admin')) return 'admin';
    
    return 'unknown';
}

/**
 * Initialize page-specific functionality
 */
function initializePageSpecific(page) {
    switch (page) {
        case 'landing-page':
            if (window.LandingPage) {
                window.LandingPage.initialize();
            }
            break;
        case 'blog-menu':
            if (window.BlogMenu) {
                window.BlogMenu.initialize();
            }
            break;
        case 'blog-post':
            if (window.BlogPost) {
                window.BlogPost.initialize();
            }
            break;
        // Future pages can be added here
        default:
            console.log(`No specific initialization for page: ${page}`);
    }
}

// Export main functions for potential future use
window.ResearchBlog = {
    initializeWebsite: initializeWebsite,
    getCurrentPage: getCurrentPage
};