/**
 * Loading Screen Component
 * 
 * Full-screen loading indicator displayed during authentication check.
 * Shows spinner and app name.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * LoadingScreen Component
 * 
 * Renders a centered loading screen with spinner.
 * Used during initial app load and authentication verification.
 * 
 * @returns {React.ReactElement} Loading screen
 */
const LoadingScreen = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                {/* Animated Spinner */}
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                
                {/* Loading Text */}
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('common.loading')}
                </p>
                
                {/* App Name */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('common.appName')}
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;