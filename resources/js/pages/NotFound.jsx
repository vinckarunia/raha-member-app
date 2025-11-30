/**
 * NotFound Page
 * 
 * 404 error page displayed when route is not found.
 * Provides link to return to dashboard.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

/**
 * NotFound Component
 * 
 * Renders 404 error page with navigation back to dashboard.
 * 
 * @returns {React.ReactElement} 404 page
 */
const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                {/* Icon */}
                <AlertCircle className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                
                {/* 404 Text */}
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    404
                </h1>
                
                {/* Description */}
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    {t('errors.notFound')}
                </p>
                
                {/* Back to Dashboard Button */}
                <Link 
                    to="/dashboard"
                    className="btn btn-primary inline-flex items-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    <span>{t('nav.dashboard')}</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;