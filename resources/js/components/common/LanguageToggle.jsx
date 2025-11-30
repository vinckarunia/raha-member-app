/**
 * Language Toggle Component
 * 
 * Button to toggle between English and Indonesian.
 * Displays current language code (EN/ID).
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * LanguageToggle Component
 * 
 * Renders a button that toggles language between EN and ID.
 * Shows current language with flag/icon.
 * 
 * @returns {React.ReactElement} Language toggle button
 */
const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
            title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
        >
            <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language.toUpperCase()}
            </span>
        </button>
    );
};

export default LanguageToggle;