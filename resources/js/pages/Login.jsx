/**
 * Login Page
 * 
 * Authentication page for users to login.
 * Includes username/password form and remember me option.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import ThemeToggle from '../components/common/ThemeToggle';
import LanguageToggle from '../components/common/LanguageToggle';

/**
 * Login Page Component
 * 
 * Renders login form with validation.
 * Handles authentication and redirects to dashboard on success.
 * 
 * @returns {React.ReactElement} Login page
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLanguage();

    /**
     * Form state
     */
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        remember: false,
    });

    /**
     * UI state
     */
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Handle input change
     * 
     * @param {Object} e Event object
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        // Clear error on input change
        if (error) {
            setError(null);
        }
    };

    /**
     * Handle form submit
     * 
     * @param {Object} e Event object
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.username || !formData.password) {
            setError(t('validation.required'));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Call login function from AuthContext
            await login(formData.username, formData.password, formData.remember);

            // Redirect to dashboard on success
            navigate('/dashboard');

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || t('auth.loginError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {/* Language Toggle - Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <LanguageToggle />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md">
                <div className="card">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <img src={"/storage/logo_50x50.png"} alt="Logo" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('common.appName')}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.login')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="label">
                                {t('auth.username')}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="Admin"
                                disabled={loading}
                                autoComplete="username"
                                autoFocus
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="label">
                                {t('auth.password')}
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    name="showPassword"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    disabled={loading}
                                />
                                <label 
                                    htmlFor="showPassword" 
                                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                    {t('auth.showPassword')}
                                </label>
                            </div>
                            <div className="flex justify-between">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    disabled={loading}
                                />
                                <label 
                                    htmlFor="remember" 
                                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                    {t('auth.rememberMe')}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('common.loading')}</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>{t('auth.loginButton')}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} GKI Raha. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;