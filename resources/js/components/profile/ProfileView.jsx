/**
 * ProfileView Component
 * 
 * Displays user profile information in read-only mode.
 * Shows personal info, address, contact, and custom fields.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React from 'react';
import { User, MapPin, Phone, Mail, Calendar, Info } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * ProfileView Component
 * 
 * Renders profile data in card layout.
 * Groups information into sections: personal, address, contact, custom fields.
 * 
 * @param {Object} props Component props
 * @param {Object} props.profile Profile data object
 * @returns {React.ReactElement} Profile view
 */
const ProfileView = ({ profile }) => {
    const { t, language } = useLanguage();

    /**
     * Render field value or fallback text
     * 
     * @param {any} value Field value
     * @returns {string} Display value
     */
    const displayValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return t('common.noData');
        }
        return value;
    };

    /**
     * InfoCard Component
     * 
     * Reusable card for displaying information sections
     */
    const InfoCard = ({ icon: Icon, title, children }) => (
        <div className="card">
            <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    /**
     * InfoRow Component
     * 
     * Displays a label-value pair
     */
    const InfoRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {label}
            </span>
            <span className="text-sm text-gray-900 dark:text-white sm:text-right">
                {displayValue(value)}
            </span>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Personal Information Card */}
            {profile.custom_fields && (
                <InfoCard icon={User} title={t('profile.personalInfo')}>
                    <InfoRow 
                        label={t('profile.fullName')} 
                        value={profile.personal?.full_name} 
                    />
                    <InfoRow 
                        label={t('profile.gender')} 
                        value={profile.personal?.gender_label} 
                    />
                    <InfoRow 
                        label={t('profile.birthDate')} 
                        value={profile.personal?.birth_date 
                            ? new Date(profile.personal.birth_date).toISOString().split('T')[0] 
                            : ''} 
                    />
                    {profile.personal?.age && (
                        <InfoRow 
                            label={t('profile.age')} 
                            value={`${profile.personal.age} ${language === 'en' ? 'years old' : 'tahun'}`} 
                        />
                    )}
                    <InfoRow 
                        label={t('profile.education')} 
                        value={profile.custom_fields.education} 
                    />
                    <InfoRow 
                        label={t('profile.expertise')} 
                        value={profile.custom_fields.expertise} 
                    />
                    <InfoRow 
                        label={t('profile.occupation')} 
                        value={profile.custom_fields.occupation} 
                    />
                    <InfoRow 
                        label={t('profile.ethnicity')} 
                        value={profile.custom_fields.ethnicity} 
                    />
                    <InfoRow 
                        label={t('profile.bloodType')} 
                        value={profile.custom_fields.blood_type} 
                    />
                </InfoCard>
            )}

            {/* Address Information Card */}
            <InfoCard icon={MapPin} title={t('profile.addressInfo')}>
                <InfoRow 
                    label={t('profile.address1')} 
                    value={profile.address?.line1} 
                />
                <InfoRow 
                    label={t('profile.address2')} 
                    value={profile.address?.line2} 
                />
                <InfoRow 
                    label={t('profile.city')} 
                    value={profile.address?.city} 
                />
                <InfoRow 
                    label={t('profile.state')} 
                    value={profile.address?.state} 
                />
                <InfoRow 
                    label={t('profile.zipCode')} 
                    value={profile.address?.zip} 
                />
                <InfoRow 
                    label={t('profile.country')} 
                    value={profile.address?.country} 
                />
            </InfoCard>

            {/* Contact Information Card */}
            <InfoCard icon={Phone} title={t('profile.contactInfo')}>
                <InfoRow 
                    label={t('profile.cellPhone')} 
                    value={profile.contact?.cell_phone} 
                />
                <InfoRow 
                    label={t('profile.homePhone')} 
                    value={profile.contact?.home_phone} 
                />
                <InfoRow 
                    label={t('profile.email')} 
                    value={profile.contact?.email} 
                />
            </InfoCard>

            {/* Church Information Card */}
            {profile.custom_fields && (
                <InfoCard icon={Info} title={t('profile.churchInfo')}>
                    <InfoRow 
                        label={t('profile.memberNumber')} 
                        value={profile.custom_fields.member_number} 
                    />
                    <InfoRow 
                        label={t('profile.membershipDate')} 
                        value={profile.personal?.membership_date} 
                    />
                    <InfoRow 
                        label={t('profile.membershipStatus')} 
                        value={profile.custom_fields.membership_status} 
                    />
                    <InfoRow 
                        label={t('profile.region')} 
                        value={profile.custom_fields.region} 
                    />
                    <InfoRow 
                        label={t('profile.baptismDate')} 
                        value={profile.custom_fields.baptism_date} 
                    />
                    <InfoRow 
                        label={t('profile.confirmationDate')} 
                        value={profile.custom_fields.confirmation_date} 
                    />
                </InfoCard>
            )}
        </div>
    );
};

export default ProfileView;