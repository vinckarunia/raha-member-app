/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Provides authentication state and methods.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * 
 * Access authentication context from any component.
 * 
 * @returns {Object} Auth context value
 * @returns {Object|null} user - Current user data (null if not authenticated)
 * @returns {boolean} loading - Loading state during auth check
 * @returns {Function} login - Function to login user
 * @returns {Function} logout - Function to logout user
 * @returns {Function} updateUser - Function to update user data
 * @returns {boolean} isAuthenticated - True if user is authenticated
 * 
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <div>Welcome, {user.username}</div>;
 * }
 * 
 * return <LoginForm onSubmit={login} />;
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};