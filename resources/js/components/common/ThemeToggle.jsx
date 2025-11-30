/**
 * Theme Toggle Component
 * 
 * Button to toggle between dark and light mode.
 * Displays sun icon for light mode, moon icon for dark mode.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * ThemeToggle Component
 * 
 * Renders a button that toggles theme between dark and light.
 * Icon changes based on current theme.
 * 
 * @returns {React.ReactElement} Theme toggle button
 */
const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-gray-300" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700" />
            )}
        </button>
    );
};

export default ThemeToggle;