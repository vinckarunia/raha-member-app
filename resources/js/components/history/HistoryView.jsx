/**
 * HistoryView Component
 * * Displays user event attendance history.
 * Renders a chronological list of events grouped by month.
 * Provides responsive layout for mobile and desktop viewing.
 * * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import React, { useMemo } from 'react';
import { Tag, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * HistoryView Component
 * * Renders history data in a grouped list layout.
 * * Features:
 * - Groups events by Month and Year
 * - Sticky month headers
 * - Responsive date box and meta info
 * * @param {Object} props Component props
 * @param {Array} props.historyData Array of attendance records
 * @param {number} props.historyData[].attend_id Attendance ID
 * @param {string} props.historyData[].event_title Title of the event
 * @param {string} props.historyData[].type_name Type of event (e.g., Kebaktian Umum)
 * @param {string} props.historyData[].checkin_date ISO timestamp of check-in
 * * @returns {React.ReactElement} History view component
 */
const HistoryView = ({ historyData }) => {
    const { t, language } = useLanguage();

    /**
     * Group history data by Month and Year
     * * Transforms flat history array into grouped object structure.
     * Sorts months in descending order (newest first).
     * * @returns {Array<{monthKey: string, items: Array}>} Grouped history data
     */
    const groupedHistory = useMemo(() => {
        if (!historyData) return [];
        const groups = {};

        historyData.forEach((item) => {
            if (!item.checkin_date) return;
            const date = new Date(item.checkin_date);
            // Create sort key: "2025-11"
            const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!groups[sortKey]) groups[sortKey] = [];
            groups[sortKey].push(item);
        });

        // Sort keys descending to show newest months first
        const sortedKeys = Object.keys(groups).sort().reverse();
        
        return sortedKeys.map(key => ({
            monthKey: key,
            items: groups[key]
        }));
    }, [historyData]);

    /**
     * Format time string (HH:mm)
     * * @param {string} dateString ISO date string
     * @returns {string} Formatted time (e.g., "09:30")
     */
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date(dateString));
    };

    /**
     * Format month header (Month Year)
     * * @param {string} yearMonthString Key in "YYYY-MM" format
     * @returns {string} Formatted header (e.g., "November 2025")
     */
    const formatMonthHeader = (yearMonthString) => {
        const [year, month] = yearMonthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    /**
     * Get day number from date
     * * @param {string} dateString ISO date string
     * @returns {number} Day of the month (1-31)
     */
    const formatDayNumber = (dateString) => {
        return new Date(dateString).getDate();
    };

    /**
     * Get short day name
     * * @param {string} dateString ISO date string
     * @returns {string} Short day name (e.g., "Rab" or "Wed")
     */
    const formatDayName = (dateString) => {
        return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
            weekday: 'short'
        }).format(new Date(dateString));
    };

    // Render empty state if no data
    if (!historyData || historyData.length === 0) {
        return (
            <div className="card text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t('history.noData')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {groupedHistory.map((group) => (
                <div key={group.monthKey} className="space-y-4">
                    {/* Month Header - Sticky */}
                    <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2 flex items-center gap-4 shadow-sm sm:shadow-none">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-1 whitespace-nowrap">
                            {formatMonthHeader(group.monthKey)}
                        </h2>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    {/* Event Grid */}
                    <div className="grid gap-3">
                        {group.items.map((item) => (
                            <div 
                                key={item.attend_id} 
                                className="card p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex gap-3 sm:gap-4">
                                    
                                    {/* Date Box */}
                                    {/* shrink-0 prevents box from collapsing on small screens */}
                                    <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shrink-0 border border-indigo-100 dark:border-indigo-800">
                                        <span className="text-[10px] sm:text-xs font-bold text-indigo-500 dark:text-indigo-300 uppercase tracking-wider">
                                            {formatDayName(item.checkin_date)}
                                        </span>
                                        <span className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 leading-none mt-0.5">
                                            {formatDayNumber(item.checkin_date)}
                                        </span>
                                    </div>

                                    {/* Content Wrapper */}
                                    {/* min-w-0 ensures text wrapping works inside flex item */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        
                                        {/* Event Title */}
                                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white leading-snug mb-1.5 wrap-break-word">
                                            {item.event_title}
                                        </h3>
                                        
                                        {/* Meta Information */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            
                                            {/* Event Type */}
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                                                <span className="truncate max-w-[150px]">{item.type_name}</span>
                                            </div>
                                            
                                            {/* Check-in Time */}
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                                                <span className="font-medium whitespace-nowrap">
                                                    {formatTime(item.checkin_date)} WIB
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryView;