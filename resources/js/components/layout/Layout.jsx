/**
 * Layout Component
 * 
 * Main layout wrapper for authenticated pages.
 * Includes navbar and renders child routes.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Layout Component
 * 
 * Wraps authenticated pages with consistent layout.
 * Uses React Router's Outlet to render child routes.
 * 
 * Structure:
 * - Navbar (fixed at top)
 * - Main content area (scrollable)
 * 
 * @returns {React.ReactElement} Layout wrapper
 */
const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Outlet renders child routes */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;