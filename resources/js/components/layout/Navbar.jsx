/**
 * Navbar Component
 * 
 * Top navigation bar with app name, user info, and action buttons.
 * Includes language toggle and logout button.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageToggle from '../common/LanguageToggle';

/**
 * Navbar Component
 * 
 * Renders the top navigation bar.
 * Responsive design with mobile menu.
 * 
 * @returns {React.ReactElement} Navbar
 */
const Navbar = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Handle logout
     * Shows confirmation before logging out
     */
    const handleLogout = async () => {
        if (window.confirm(t('auth.logout') + '?')) {
            try {
                await logout();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    /**
     * Toggle mobile menu
     */
    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and App Name */}
                    <div className="flex items-center">
                        <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img src={"/storage/logo_50x50.png"} alt="Logo" />
                            </div>
                            <span className="hidden sm:block text-lg font-semibold text-gray-900 dark:text-white">
                                {t('common.appName')}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                                {user?.person?.first_name || user?.username}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

                        {/* Language Toggle */}
                        <LanguageToggle />

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{t('auth.logout')}</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 space-y-3">
                        {/* User Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 pb-3 border-b border-gray-200 dark:border-gray-700">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                                {user?.person?.first_name || user?.username}
                            </span>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {t('settings.language')}
                            </span>
                            <LanguageToggle />
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{t('auth.logout')}</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;