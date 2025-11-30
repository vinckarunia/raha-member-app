/**
 * Authentication Service
 * 
 * Handles authentication API calls.
 * Provides login, logout, and user data retrieval methods.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { get, post } from './api';

/**
 * Auth Service Object
 * 
 * Contains methods for authentication operations.
 */
export const authService = {
    /**
     * Login user
     * 
     * Authenticates user with username and password.
     * Returns user data and access token.
     * 
     * @param {string} username Username
     * @param {string} password Password
     * @param {boolean} remember Remember me flag (default: false)
     * @returns {Promise<Object>} Login response
     * @returns {Object} response.user - User data
     * @returns {string} response.token - Access token
     * @returns {string} response.expires_at - Token expiration date
     * 
     * @throws {Error} If login fails (invalid credentials, network error, etc.)
     * 
     * @example
     * try {
     *   const response = await authService.login('john', 'password123', true);
     *   console.log('Logged in:', response.user);
     *   console.log('Token:', response.token);
     * } catch (error) {
     *   console.error('Login failed:', error.message);
     * }
     */
    login: async (username, password, remember = false) => {
        try {
            const response = await post('/login', {
                username,
                password,
                remember,
            });
            
            // API returns: { success, message, data: { user, token, expires_at } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error(response.message || 'Login failed');
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     * 
     * Revokes current access token on server.
     * Should be called before clearing local token.
     * 
     * @returns {Promise<Object>} Logout response
     * @returns {boolean} response.success - Success flag
     * @returns {string} response.message - Success message
     * 
     * @throws {Error} If logout fails
     * 
     * @example
     * try {
     *   await authService.logout();
     *   console.log('Logged out successfully');
     * } catch (error) {
     *   console.error('Logout failed:', error.message);
     * }
     */
    logout: async () => {
        try {
            const response = await post('/logout');
            return response;
            
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    /**
     * Get current authenticated user
     * 
     * Fetches user data for currently authenticated user.
     * Uses token from localStorage automatically.
     * 
     * @returns {Promise<Object>} User data
     * @returns {number} user.id - User ID
     * @returns {string} user.username - Username
     * @returns {boolean} user.is_admin - Admin flag
     * @returns {Object} user.person - Person data
     * 
     * @throws {Error} If request fails or user is not authenticated
     * 
     * @example
     * try {
     *   const user = await authService.getCurrentUser();
     *   console.log('Current user:', user);
     * } catch (error) {
     *   console.error('Failed to get user:', error.message);
     * }
     */
    getCurrentUser: async () => {
        try {
            const response = await get('/user');
            
            // API returns: { success, data: { user data } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error('Failed to get user data');
            
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },
};