/**
 * Profile Page
 * 
 * User profile page with view and edit modes.
 * Allows users to view and update their profile information.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useState, useEffect } from 'react';
import { Edit, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { profileService } from '../services/profile';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';

/**
 * Profile Page Component
 * 
 * Renders profile page with toggle between view and edit modes.
 * Fetches profile data on mount and handles updates.
 * 
 * @returns {React.ReactElement} Profile page
 */
const Profile = () => {
    const { t } = useLanguage();

    /**
     * State management
     */
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /**
     * Effect: Fetch profile data on mount
     */
    useEffect(() => {
        fetchProfile();
    }, []);

    /**
     * Effect: Auto-hide success message after 5 seconds
     */
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    /**
     * Fetch profile data from API
     */
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError(err.message || t('errors.unknown'));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle profile update
     * 
     * @param {Object} formData Updated profile data
     */
    const handleSave = async (formData) => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Call API to update profile
            const updatedProfile = await profileService.updateProfile(formData);
            
            // Update local state with new data
            setProfile(updatedProfile);
            
            // Exit edit mode
            setIsEditing(false);
            
            // Show success message
            setSuccessMessage(t('profile.updateSuccess'));

        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.message || t('profile.updateError'));
            
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    /**
     * Handle cancel edit
     */
    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    /**
     * Handle enter edit mode
     */
    const handleEdit = () => {
        setIsEditing(true);
        setError(null);
        setSuccessMessage(null);
    };

    /**
     * Render loading state
     */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    /**
     * Render error state
     */
    if (!profile && error) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchProfile}
                        className="btn btn-primary"
                    >
                        {t('common.retry')}
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render profile page
     */
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('profile.title')}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {isEditing ? t('profile.editProfile') : t('profile.viewProfile')}
                    </p>
                </div>
                
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        <span>{t('common.edit')}</span>
                    </button>
                )}
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-green-600 dark:text-green-400">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Content */}
            {isEditing ? (
                <ProfileEdit
                    profile={profile}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    loading={saving}
                />
            ) : (
                <ProfileView profile={profile} />
            )}
        </div>
    );
};

export default Profile;