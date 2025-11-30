/**
 * Theme Context
 * 
 * Manages dark/light theme state across the application.
 * Persists theme preference in localStorage.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { createContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * Provides theme state and toggle function to components
 */
export const ThemeContext = createContext();

/**
 * Theme Provider Component
 * 
 * Wraps the app to provide theme functionality.
 * Loads theme from localStorage on mount.
 * Defaults to dark mode as per requirements.
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {React.ReactElement} Theme provider
 */
export const ThemeProvider = ({ children }) => {
    /**
     * Theme state
     * true = dark mode, false = light mode
     * Default: dark mode
     */
    const [isDark, setIsDark] = useState(() => {
        // Try to load theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        
        // If no saved theme, default to dark mode
        if (!savedTheme) {
            return true;
        }
        
        return savedTheme === 'dark';
    });

    /**
     * Toggle theme between dark and light
     * Saves preference to localStorage
     */
    const toggleTheme = () => {
        setIsDark(prev => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    /**
     * Set specific theme
     * 
     * @param {boolean} dark True for dark mode, false for light mode
     */
    const setTheme = (dark) => {
        setIsDark(dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    };

    /**
     * Effect: Apply theme to document on mount and change
     * Adds/removes 'dark' class from html element
     */
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Context value
    const value = {
        isDark,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};