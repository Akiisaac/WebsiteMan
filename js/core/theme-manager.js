/**
 * Theme Manager - Handles color theme management
 */

/**
 * Utility function to change theme colors dynamically
 * This can be used in the future for theme customization
 */
function updateThemeColors(newColors) {
    const root = document.documentElement;
    
    Object.keys(newColors).forEach(colorName => {
        if (newColors[colorName]) {
            root.style.setProperty(`--${colorName}`, newColors[colorName]);
        }
    });
}

// Export for global use
window.ThemeManager = {
    updateThemeColors: updateThemeColors
};
