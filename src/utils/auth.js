// Authentication utility functions

/**
 * Get token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
    }
};

/**
 * Get user data from localStorage
 * @returns {object|null} The user object or null if not found
 */
export const getUser = () => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
    }
};

/**
 * Set token in localStorage
 * @param {string} token - The authentication token
 */
export const setToken = (token) => {
    try {
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Error setting token in localStorage:', error);
    }
};

/**
 * Set user data in localStorage
 * @param {object} user - The user object
 */
export const setUser = (user) => {
    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error setting user in localStorage:', error);
    }
};

/**
 * Remove token and user data from localStorage
 */
export const logout = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error removing auth data from localStorage:', error);
    }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

/**
 * Check if token is expired (basic check)
 * @returns {boolean} True if token appears to be expired
 */
export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;

    try {
        // Decode JWT token (basic implementation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        return payload.exp < currentTime;
    } catch (error) {
        // If we can't decode the token, consider it expired
        console.error('Error decoding token:', error);
        return true;
    }
};

/**
 * Get authorization header for API requests
 * @returns {object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};