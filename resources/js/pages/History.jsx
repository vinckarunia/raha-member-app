/**
 * History Page
 * * User history page.
 * Allows users to view their historical event attendance.
 * * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, History as HistoryIcon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { historyService } from '../services/history';
import HistoryView from '../components/history/HistoryView';

/**
 * History Page Component
 * * Renders history page.
 * Fetches history data on mount.
 * * @returns {React.ReactElement} History page
 */
const History = () => {
    const { t } = useLanguage();

    /**
     * State management
     */
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Effect: Fetch history data on mount
     */
    useEffect(() => {
        fetchHistory();
    }, []);

    /**
     * Fetch history data from API
     */
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await historyService.getHistory();
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
            setError(err.message || t('errors.unknown'));
        } finally {
            setLoading(false);
        }
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
    if (error) {
        return (
            <div className="card">
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchHistory}
                        className="btn btn-primary"
                    >
                        {t('common.retry')}
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render history page
     */
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <HistoryIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('history.title')}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {t('history.viewHistory')}
                    </p>
                </div>
            </div>

            {/* History Content */}
            <HistoryView historyData={history} />
        </div>
    );
};

export default History;