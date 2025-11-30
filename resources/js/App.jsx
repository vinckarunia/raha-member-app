/**
 * Main App Component
 * 
 * Root component that handles routing and layout.
 * Applies theme classes and manages route guards.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render
 * @returns {React.ReactElement} Protected route or redirect
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingScreen />;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

/**
 * Public Route Component
 * 
 * Wraps routes that should redirect authenticated users.
 * Redirects to dashboard if user is already logged in.
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render
 * @returns {React.ReactElement} Public route or redirect
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingScreen />;
    }
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

/**
 * Main App Component
 * 
 * Renders the application with routing.
 * Applies dark mode class to document element.
 * 
 * @returns {React.ReactElement} Main app component
 */
function App() {
    const { isDark } = useTheme();
    
    // Apply dark mode class to html element
    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                
                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    {/* Redirect root to dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Profile */}
                    <Route path="profile" element={<Profile />} />
                    
                    {/* History */}
                    <Route path="history" element={<History />} />
                    
                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;