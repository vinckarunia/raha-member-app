/**
 * History Service
 * * Handles history-related API calls.
 * Provides methods for viewing attendance history.
 * * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import { get } from './api';

/**
 * History Service Object
 * * Contains methods for history operations.
 */
export const historyService = {
    /**
     * Get user attendance history
     * * Fetches list of events the user has attended.
     * * @returns {Promise<Array>} List of attendance records
     * @returns {number} item.attend_id - Attendance ID
     * @returns {string} item.event_title - Title of the event
     * @returns {string} item.type_name - Type of the event
     * @returns {string} item.name - Attendee name
     * * @throws {Error} If request fails
     * * @example
     * try {
     * const history = await historyService.getHistory();
     * console.log('History:', history);
     * } catch (error) {
     * console.error('Failed to get history:', error.message);
     * }
     */
    getHistory: async () => {
        try {
            const response = await get('/history');
            
            // API returns: { success, data: [ ... ] }
            if (response.success && Array.isArray(response.data)) {
                return response.data;
            }
            
            throw new Error('Failed to get history data');
            
        } catch (error) {
            console.error('Get history error:', error);
            throw error;
        }
    },
};