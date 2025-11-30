/**
 * useTheme Hook
 * 
 * Custom hook to access theme context.
 * Provides theme state and toggle function.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * useTheme Hook
 * 
 * Access theme context from any component.
 * 
 * @returns {Object} Theme context value
 * @returns {boolean} isDark - Current theme state (true = dark, false = light)
 * @returns {Function} toggleTheme - Function to toggle theme
 * @returns {Function} setTheme - Function to set specific theme
 * 
 * @throws {Error} If used outside ThemeProvider
 * 
 * @example
 * const { isDark, toggleTheme } = useTheme();
 * 
 * return (
 *   <button onClick={toggleTheme}>
 *     {isDark ? 'Light Mode' : 'Dark Mode'}
 *   </button>
 * );
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    
    return context;
};