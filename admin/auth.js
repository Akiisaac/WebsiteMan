/**
 * Admin Authentication System
 * Simple client-side authentication with localStorage session management
 */

class AdminAuth {
    constructor() {
        this.password = 'research2024'; // Hardcoded password
        this.maxAttempts = 3;
        this.lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.sessionKey = 'admin_session';
        this.attemptsKey = 'admin_attempts';
        this.lockoutKey = 'admin_lockout';
        
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.isLoggedIn()) {
            this.showAdminPanel();
        } else {
            this.showLoginForm();
        }
    }

    isLoggedIn() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) return false;
        
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        // Check if session is still valid (24 hours)
        if (now - sessionData.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(this.sessionKey);
            return false;
        }
        
        return true;
    }

    isLockedOut() {
        const lockout = localStorage.getItem(this.lockoutKey);
        if (!lockout) return false;
        
        const lockoutData = JSON.parse(lockout);
        const now = Date.now();
        
        // Check if lockout period has expired
        if (now - lockoutData.timestamp > this.lockoutDuration) {
            localStorage.removeItem(this.lockoutKey);
            localStorage.removeItem(this.attemptsKey);
            return false;
        }
        
        return true;
    }

    getFailedAttempts() {
        const attempts = localStorage.getItem(this.attemptsKey);
        return attempts ? parseInt(attempts) : 0;
    }

    incrementFailedAttempts() {
        const attempts = this.getFailedAttempts() + 1;
        localStorage.setItem(this.attemptsKey, attempts.toString());
        
        if (attempts >= this.maxAttempts) {
            this.lockout();
        }
    }

    lockout() {
        const lockoutData = {
            timestamp: Date.now()
        };
        localStorage.setItem(this.lockoutKey, JSON.stringify(lockoutData));
    }

    resetFailedAttempts() {
        localStorage.removeItem(this.attemptsKey);
        localStorage.removeItem(this.lockoutKey);
    }

    login(password) {
        // Check if locked out
        if (this.isLockedOut()) {
            this.showError('Too many failed attempts. Please try again in 5 minutes.');
            return false;
        }

        // Check password
        if (password === this.password) {
            // Create session
            const sessionData = {
                timestamp: Date.now(),
                loggedIn: true
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            
            // Reset failed attempts
            this.resetFailedAttempts();
            
            // Show admin panel
            this.showAdminPanel();
            return true;
        } else {
            // Increment failed attempts
            this.incrementFailedAttempts();
            const attempts = this.getFailedAttempts();
            const remaining = this.maxAttempts - attempts;
            
            if (remaining > 0) {
                this.showError(`Incorrect password. ${remaining} attempts remaining.`);
            } else {
                this.showError('Too many failed attempts. Account locked for 5 minutes.');
            }
            return false;
        }
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.showLoginForm();
    }

    showLoginForm() {
        const container = document.getElementById('admin-container');
        container.innerHTML = `
            <div class="login-container">
                <div class="login-form">
                    <h1>Admin Login</h1>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                    <div id="error-message" class="error-message"></div>
                </div>
            </div>
        `;

        // Add event listener for form submission
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            this.login(password);
        });
    }

    showAdminPanel() {
        if (!window.blogPostManager) {
            window.blogPostManager = new BlogPostManager();
        }
        window.blogPostManager.showAdminDashboard();
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});
