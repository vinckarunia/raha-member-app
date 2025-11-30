/**
 * React Application Entry Point
 * 
 * Initializes and renders the React application.
 * Sets up routing, context providers, and global configuration.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha Portal Development Team
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

/**
 * Initialize React application
 * 
 * Wraps the app with necessary providers:
 * - BrowserRouter: Client-side routing
 * - ThemeProvider: Dark/Light mode management
 * - LanguageProvider: i18n support (English/Indonesian)
 * - AuthProvider: Authentication state management
 */
const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

/**
 * PWA Service Worker Registration
 * 
 * Registers service worker for offline support and caching.
 * Only active in production environment.
 */
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    serviceWorkerRegistration.register({
        onSuccess: () => {
            console.log('[PWA] Portal GKI Raha siap digunakan offline!');
        },
        onUpdate: (registration) => {
            console.log('[PWA] Update tersedia! Akan aktif setelah reload.');
            
            // Optional: Show notification to user
            // You can dispatch this to a global notification system
            const updateAvailable = new CustomEvent('swUpdateAvailable', {
                detail: { registration }
            });
            window.dispatchEvent(updateAvailable);
        }
    });
} else {
    console.log('[PWA] Development mode - Service Worker disabled');
}