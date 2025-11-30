/**
 * QRCodeCard Component
 * 
 * Displays QR code containing user's person ID.
 * Used for attendance or identification at church.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { profileService } from '../../services/profile';

/**
 * QRCodeCard Component
 * 
 * Fetches QR data from API and renders QR code.
 * Shows person ID and full name below QR code.
 * 
 * @returns {React.ReactElement} QR code card
 */
const QRCodeCard = () => {
    const { t } = useLanguage();
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Effect: Fetch QR data on mount
     */
    useEffect(() => {
        fetchQRData();
    }, []);

    /**
     * Fetch QR data from API
     */
    const fetchQRData = async () => {
        try {
            setLoading(true);
            const data = await profileService.getQRData();
            setQrData(data);
        } catch (err) {
            console.error('Failed to fetch QR data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Render loading state
     */
    if (loading) {
        return (
            <div className="card flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    /**
     * Render error state
     */
    if (error) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400">
                        {t('errors.unknown')}
                    </p>
                    <button
                        onClick={fetchQRData}
                        className="mt-4 btn btn-primary"
                    >
                        {t('common.retry')}
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render QR code
     */
    return (
        <div className="card">
            <div className="text-center">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('qr.yourQR')}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {t('qr.description')}
                </p>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <QRCodeSVG
                            value={qrData.person_id}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>

                {/* Person Info */}
                <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('qr.memberNumber')}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {qrData.member_number || t('qr.noNumber')}
                    </div>
                    <div className="text-lg text-gray-700 dark:text-gray-300">
                        {qrData.full_name}
                    </div>
                </div>

                {/* Download/Print Instructions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t('qr.instruction')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRCodeCard;