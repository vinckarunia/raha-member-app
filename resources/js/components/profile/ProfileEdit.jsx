/**
 * ProfileEdit Component
 * 
 * Form for editing user profile information.
 * Only editable fields: address and contact information.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

/**
 * InputField Component
 * 
 * Reusable input field with label and error display
 */
const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error, disabled }) => (
    <div>
        <label htmlFor={name} className="label">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input ${error ? 'border-red-500' : ''}`}
            disabled={disabled}
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
            </p>
        )}
    </div>
);

/**
 * ProfileEdit Component
 * 
 * Renders editable form for profile data.
 * Validates input and calls onSave callback on submit.
 * 
 * @param {Object} props Component props
 * @param {Object} props.profile Profile data object
 * @param {Function} props.onSave Callback when form is saved
 * @param {Function} props.onCancel Callback when form is cancelled
 * @param {boolean} props.loading Loading state during save
 * @returns {React.ReactElement} Profile edit form
 */
const ProfileEdit = ({ profile, onSave, onCancel, loading = false }) => {
    const { t } = useLanguage();

    /**
     * Form state
     * Initialize with current profile values
     */
    const [formData, setFormData] = useState({
        per_Address1: profile.address?.line1 || '',
        per_Address2: profile.address?.line2 || '',
        per_City: profile.address?.city || '',
        per_State: profile.address?.state || '',
        per_Zip: profile.address?.zip || '',
        per_HomePhone: profile.contact?.home_phone || '',
        per_CellPhone: profile.contact?.cell_phone || '',
        per_Email: profile.contact?.email || '',
    });

    /**
     * Validation errors state
     */
    const [errors, setErrors] = useState({});

    /**
     * Handle input change
     * 
     * @param {Object} e Event object
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    /**
     * Validate form data
     * 
     * @returns {boolean} True if valid
     */
    const validate = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (formData.per_Email && !emailRegex.test(formData.per_Email)) {
            newErrors.per_Email = t('validation.email');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submit
     * 
     * @param {Object} e Event object
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address Information */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('profile.addressInfo')}
                </h3>
                <div className="space-y-4">
                    <InputField
                        label={t('profile.address1')}
                        name="per_Address1"
                        value={formData.per_Address1}
                        onChange={handleChange}
                        placeholder={t('profile.address1')}
                        error={errors.per_Address1}
                        disabled={loading}
                    />
                    <InputField
                        label={t('profile.address2')}
                        name="per_Address2"
                        value={formData.per_Address2}
                        onChange={handleChange}
                        placeholder={t('profile.address2')}
                        error={errors.per_Address2}
                        disabled={loading}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label={t('profile.city')}
                            name="per_City"
                            value={formData.per_City}
                            onChange={handleChange}
                            placeholder="Bekasi"
                            error={errors.per_City}
                            disabled={loading}
                        />
                        <InputField
                            label={t('profile.state')}
                            name="per_State"
                            value={formData.per_State}
                            onChange={handleChange}
                            placeholder="Jawa Barat"
                            error={errors.per_State}
                            disabled={loading}
                        />
                    </div>
                    <InputField
                        label={t('profile.zipCode')}
                        name="per_Zip"
                        value={formData.per_Zip}
                        onChange={handleChange}
                        placeholder="17111"
                        error={errors.per_Zip}
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Contact Information */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('profile.contactInfo')}
                </h3>
                <div className="space-y-4">
                    <InputField
                        label={t('profile.cellPhone')}
                        name="per_CellPhone"
                        value={formData.per_CellPhone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="08123456789"
                        error={errors.per_CellPhone}
                        disabled={loading}
                    />
                    <InputField
                        label={t('profile.homePhone')}
                        name="per_HomePhone"
                        value={formData.per_HomePhone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="021-12345678"
                        error={errors.per_HomePhone}
                        disabled={loading}
                    />
                    <InputField
                        label={t('profile.email')}
                        name="per_Email"
                        value={formData.per_Email}
                        onChange={handleChange}
                        type="email"
                        placeholder="email@example.com"
                        error={errors.per_Email}
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Data Changes Request Instructions */}
            <div className="mb-4 pb-4 row text-center">
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t('profile.instruction')}
                    </p>
                </div>
                <div className="mt-2 pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        <FontAwesomeIcon icon="fa-brands fa-whatsapp" /> 
                        <a href="https://wa.me/6287830930639" target="_blank" rel="noreferrer">
                            WhatsApp
                        </a> 
                    </p>
                </div>
                <div className="mt-1 pt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        <FontAwesomeIcon icon="fa-brands fa-yahoo" />
                        <a href="mailto:gkirh@yahoo.com">
                            E-mail
                        </a>
                    </p>
                </div> 
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center justify-center gap-2 flex-1"
                >
                    <Save className="w-4 h-4" />
                    <span>{loading ? t('common.loading') : t('common.save')}</span>
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="btn btn-secondary flex items-center justify-center gap-2 flex-1"
                >
                    <X className="w-4 h-4" />
                    <span>{t('common.cancel')}</span>
                </button>
            </div>
        </form>
    );
};

export default ProfileEdit;