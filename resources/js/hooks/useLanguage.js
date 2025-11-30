/**
 * useLanguage Hook
 * 
 * Custom hook to access language context.
 * Provides translation function and language state.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

/**
 * useLanguage Hook
 * 
 * Access language context from any component.
 * 
 * @returns {Object} Language context value
 * @returns {string} language - Current language code ('en' or 'id')
 * @returns {Function} changeLanguage - Function to change language
 * @returns {Function} toggleLanguage - Function to toggle language
 * @returns {Function} t - Translation function
 * @returns {boolean} isIndonesian - True if current language is Indonesian
 * @returns {boolean} isEnglish - True if current language is English
 * 
 * @throws {Error} If used outside LanguageProvider
 * 
 * @example
 * const { t, language, toggleLanguage } = useLanguage();
 * 
 * return (
 *   <div>
 *     <h1>{t('common.welcome')}</h1>
 *     <button onClick={toggleLanguage}>
 *       {language === 'en' ? 'ID' : 'EN'}
 *     </button>
 *   </div>
 * );
 */
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    
    return context;
};