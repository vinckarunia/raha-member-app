/**
 * Profile Service
 * 
 * Handles profile-related API calls.
 * Provides methods for viewing and updating profile data.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { get, put } from './api';

/**
 * Profile Service Object
 * 
 * Contains methods for profile operations.
 */
export const profileService = {
    /**
     * Get user profile
     * 
     * Fetches complete profile data for authenticated user.
     * Includes personal info, address, contact, and custom fields.
     * 
     * @returns {Promise<Object>} Profile data
     * @returns {number} profile.id - Person ID
     * @returns {Object} profile.personal - Personal information
     * @returns {Object} profile.address - Address information
     * @returns {Object} profile.contact - Contact information
     * @returns {Object} profile.custom_fields - Custom field values
     * 
     * @throws {Error} If request fails
     * 
     * @example
     * try {
     *   const profile = await profileService.getProfile();
     *   console.log('Profile:', profile);
     * } catch (error) {
     *   console.error('Failed to get profile:', error.message);
     * }
     */
    getProfile: async () => {
        try {
            const response = await get('/profile');
            
            // API returns: { success, data: { profile data } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error('Failed to get profile data');
            
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     * 
     * Updates editable profile fields.
     * Only address and contact fields can be updated by users.
     * 
     * @param {Object} data Profile data to update
     * @param {string} data.per_Address1 - Address 1
     * @param {string} data.per_Address2 - Address 2
     * @param {string} data.per_City - City
     * @param {string} data.per_State - State/Province
     * @param {string} data.per_Zip - Postal code
     * @param {string} data.per_HomePhone - Home phone
     * @param {string} data.per_CellPhone - Cell phone
     * @param {string} data.per_Email - Email
     * @returns {Promise<Object>} Updated profile data
     * 
     * @throws {Error} If update fails or validation errors occur
     * 
     * @example
     * try {
     *   const updated = await profileService.updateProfile({
     *     per_Email: 'newemail@example.com',
     *     per_CellPhone: '08123456789',
     *   });
     *   console.log('Profile updated:', updated);
     * } catch (error) {
     *   console.error('Update failed:', error.message);
     *   if (error.validationErrors) {
     *     console.error('Validation errors:', error.validationErrors);
     *   }
     * }
     */
    updateProfile: async (data) => {
        try {
            const response = await put('/profile', data);
            
            // API returns: { success, message, data: { updated profile } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error(response.message || 'Failed to update profile');
            
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    /**
     * Get QR code data
     * 
     * Fetches person ID for QR code generation.
     * QR code contains plain text person ID for attendance/identification.
     * 
     * @returns {Promise<Object>} QR data
     * @returns {string} qrData.person_id - Person ID as string
     * @returns {string} qrData.full_name - User's full name
     * 
     * @throws {Error} If request fails
     * 
     * @example
     * try {
     *   const qrData = await profileService.getQRData();
     *   console.log('QR Data:', qrData.person_id);
     *   // Use qrData.person_id to generate QR code
     * } catch (error) {
     *   console.error('Failed to get QR data:', error.message);
     * }
     */
    getQRData: async () => {
        try {
            const response = await get('/profile/qr');
            
            // API returns: { success, data: { person_id, full_name } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error('Failed to get QR data');
            
        } catch (error) {
            console.error('Get QR data error:', error);
            throw error;
        }
    },

    /**
     * Get custom field definitions
     * 
     * Fetches metadata about custom fields.
     * Includes field labels and dropdown options.
     * Used to render fields with proper labels.
     * 
     * @returns {Promise<Object>} Custom field definitions
     * @returns {Object} definitions.fields - Field definitions with labels
     * @returns {Object} definitions.dropdown_options - Dropdown option lists
     * 
     * @throws {Error} If request fails
     * 
     * @example
     * try {
     *   const defs = await profileService.getCustomFieldDefinitions();
     *   console.log('Field definitions:', defs.fields);
     *   console.log('Dropdown options:', defs.dropdown_options);
     * } catch (error) {
     *   console.error('Failed to get definitions:', error.message);
     * }
     */
    getCustomFieldDefinitions: async () => {
        try {
            const response = await get('/custom-fields');
            
            // API returns: { success, data: { fields, dropdown_options } }
            if (response.success && response.data) {
                return response.data;
            }
            
            throw new Error('Failed to get custom field definitions');
            
        } catch (error) {
            console.error('Get custom field definitions error:', error);
            throw error;
        }
    },
};