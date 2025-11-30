/**
 * Language Context
 * 
 * Manages language state and translations.
 * Supports English (base) and Indonesian.
 * Persists language preference in localStorage.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha Portal Development Team
 */

import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/i18n';

/**
 * Language Context
 * Provides language state and translation function
 */
export const LanguageContext = createContext();

/**
 * Language Provider Component
 * 
 * Wraps the app to provide i18n functionality.
 * Loads language from localStorage on mount.
 * Defaults to English as base language.
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {React.ReactElement} Language provider
 */
export const LanguageProvider = ({ children }) => {
    /**
     * Language state
     * Available: 'en' (English), 'id' (Indonesian)
     * Default: 'en'
     */
    const [language, setLanguage] = useState(() => {
        // Try to load language from localStorage
        const savedLanguage = localStorage.getItem('language');
        
        // If no saved language, default to English
        if (!savedLanguage) {
            return 'en';
        }
        
        // Validate saved language
        return ['en', 'id'].includes(savedLanguage) ? savedLanguage : 'en';
    });

    /**
     * Change language
     * Saves preference to localStorage
     * 
     * @param {string} lang Language code ('en' or 'id')
     */
    const changeLanguage = (lang) => {
        if (['en', 'id'].includes(lang)) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    /**
     * Toggle between English and Indonesian
     */
    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'id' : 'en';
        changeLanguage(newLang);
    };

    /**
     * Translate function
     * 
     * Gets translated string for given key.
     * Supports nested keys using dot notation (e.g., 'common.welcome')
     * Falls back to English if translation not found.
     * 
     * @param {string} key Translation key
     * @param {Object} params Optional parameters for interpolation
     * @returns {string} Translated string
     */
    const t = (key, params = {}) => {
        // Get translation from current language
        let translation = getNestedTranslation(translations[language], key);
        
        // Fallback to English if not found
        if (!translation && language !== 'en') {
            translation = getNestedTranslation(translations.en, key);
        }
        
        // Fallback to key itself if still not found
        if (!translation) {
            return key;
        }
        
        // Interpolate parameters if provided
        return interpolate(translation, params);
    };

    /**
     * Get nested translation value from object
     * 
     * @param {Object} obj Translations object
     * @param {string} key Dot-notated key (e.g., 'common.welcome')
     * @returns {string|undefined} Translation value
     */
    const getNestedTranslation = (obj, key) => {
        return key.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    /**
     * Interpolate parameters into translation string
     * 
     * Example: interpolate('Hello {name}', { name: 'John' }) -> 'Hello John'
     * 
     * @param {string} str String with placeholders
     * @param {Object} params Parameters to interpolate
     * @returns {string} Interpolated string
     */
    const interpolate = (str, params) => {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    };

    // Context value
    const value = {
        language,
        changeLanguage,
        toggleLanguage,
        t,
        isIndonesian: language === 'id',
        isEnglish: language === 'en',
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};