/**
 * Authentication Context
 * 
 * Manages authentication state across the application.
 * Handles login, logout, and user data.
 * Persists auth token in localStorage.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

/**
 * Auth Context
 * Provides authentication state and methods
 */
export const AuthContext = createContext();

/**
 * Auth Provider Component
 * 
 * Wraps the app to provide authentication functionality.
 * Checks for existing token on mount and validates it.
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {React.ReactElement} Auth provider
 */
export const AuthProvider = ({ children }) => {
    /**
     * User state
     * Contains user data when authenticated, null when not
     */
    const [user, setUser] = useState(null);

    /**
     * Loading state
     * True while checking authentication status
     */
    const [loading, setLoading] = useState(true);

    /**
     * Effect: Check for existing token on mount
     * Validates token and loads user data if valid
     */
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Check authentication status
     * 
     * Checks if user has valid token in localStorage.
     * If token exists, fetches user data from API.
     * Sets loading to false when done.
     */
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoading(false);
                return;
            }
            
            // Validate token by fetching user data
            const userData = await authService.getCurrentUser();
            setUser(userData);
            
        } catch (error) {
            // Token is invalid or expired
            console.error('Auth check failed:', error);
            
            // Clear invalid token
            localStorage.removeItem('token');
            setUser(null);
            
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login function
     * 
     * Authenticates user with credentials.
     * Stores token and user data on success.
     * 
     * @param {string} username Username
     * @param {string} password Password
     * @param {boolean} remember Remember me flag
     * @returns {Promise<Object>} User data
     * @throws {Error} If login fails
     */
    const login = async (username, password, remember = false) => {
        try {
            const response = await authService.login(username, password, remember);
            
            // Store token
            localStorage.setItem('token', response.token);
            
            // Store user data
            setUser(response.user);
            
            return response;
            
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    /**
     * Logout function
     * 
     * Logs out user and clears token.
     * Calls API to revoke token on server.
     */
    const logout = async () => {
        try {
            // Call API to revoke token
            await authService.logout();
            
        } catch (error) {
            console.error('Logout API call failed:', error);
            // Continue with local logout even if API call fails
            
        } finally {
            // Clear local state
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    /**
     * Update user data
     * 
     * Updates user data in state.
     * Used after profile updates.
     * 
     * @param {Object} userData Updated user data
     */
    const updateUser = (userData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...userData,
        }));
    };

    // Context value
    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};