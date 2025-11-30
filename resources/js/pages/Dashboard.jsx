/**
 * Dashboard Page
 * 
 * Main dashboard page after login.
 * Shows welcome message and quick action cards.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { User, History } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import QRCodeCard from '../components/profile/QRCodeCard';

/**
 * Dashboard Page Component
 * 
 * Renders dashboard with greeting and quick actions.
 * Displays QR code for easy access.
 * 
 * @returns {React.ReactElement} Dashboard page
 */
const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    /**
     * QuickActionCard Component
     * 
     * Reusable card for quick actions
     */
    const QuickActionCard = ({ icon: Icon, title, description, to, color = 'indigo' }) => (
        <Link to={to} className="group">
            <div className="card hover:shadow-lg transition-shadow duration-200">
                <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </Link>
    );

    /**
     * Get greeting based on time of day
     */
    const getGreeting = () => {
        return t('dashboard.greeting').replace('{name}', user?.person?.full_name || user?.username);
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="card">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {getGreeting()}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('dashboard.welcome')}
                </p>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('dashboard.quickActions')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickActionCard
                        icon={User}
                        title={t('dashboard.viewProfile')}
                        description={t('profile.viewProfile')}
                        to="/profile"
                        color="indigo"
                    />
                    <QuickActionCard
                        icon={History}
                        title={t('dashboard.viewHistory')}
                        description={t('history.viewHistory')}
                        to="/history"
                        color="indigo"
                    />
                    {/* Future enhancement: Add more quick action cards */}
                </div>
            </div>

            {/* QR Code Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('qr.title')}
                </h2>
                <QRCodeCard />
            </div>
        </div>
    );
};

export default Dashboard;