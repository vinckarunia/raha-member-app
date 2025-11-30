/**
 * API Service
 * 
 * Axios instance configured for Laravel API.
 * Handles authentication headers and error responses.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

import axios from 'axios';

/**
 * Base API URL
 * Uses Laravel backend at localhost:8000
 */
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Axios instance with default configuration
 * 
 * Features:
 * - Base URL set to Laravel API
 * - JSON content type
 * - Automatic token injection
 * - Error response handling
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Set to true if using cookies
});

/**
 * Request Interceptor
 * 
 * Automatically adds authentication token to requests.
 * Token is retrieved from localStorage.
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Add token to Authorization header if exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * 
 * Handles API response errors globally.
 * Extracts error messages from Laravel validation responses.
 * Handles 401 Unauthorized (token expired/invalid).
 */
api.interceptors.response.use(
    (response) => {
        // Return response data directly
        return response.data;
    },
    (error) => {
        // Handle errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            // 401 Unauthorized - token expired or invalid
            if (status === 401) {
                // Clear token
                localStorage.removeItem('token');
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            
            // 422 Validation Error
            if (status === 422 && data.errors) {
                // Format validation errors
                const formattedErrors = {};
                Object.keys(data.errors).forEach(key => {
                    formattedErrors[key] = data.errors[key][0]; // Get first error message
                });
                
                error.validationErrors = formattedErrors;
            }
            
            // Attach error message
            error.message = data.message || error.message;
        } else if (error.request) {
            // Request was made but no response received
            error.message = 'Network error. Please check your connection.';
        } else {
            // Something else happened
            error.message = error.message || 'An unexpected error occurred.';
        }
        
        return Promise.reject(error);
    }
);

/**
 * API Methods
 * 
 * Wrapper methods for common HTTP operations.
 * These methods return promises that resolve to response data.
 */

/**
 * GET request
 * 
 * @param {string} url Endpoint URL
 * @param {Object} config Optional axios config
 * @returns {Promise<any>} Response data
 */
export const get = (url, config = {}) => {
    return api.get(url, config);
};

/**
 * POST request
 * 
 * @param {string} url Endpoint URL
 * @param {Object} data Request body data
 * @param {Object} config Optional axios config
 * @returns {Promise<any>} Response data
 */
export const post = (url, data = {}, config = {}) => {
    return api.post(url, data, config);
};

/**
 * PUT request
 * 
 * @param {string} url Endpoint URL
 * @param {Object} data Request body data
 * @param {Object} config Optional axios config
 * @returns {Promise<any>} Response data
 */
export const put = (url, data = {}, config = {}) => {
    return api.put(url, data, config);
};

/**
 * PATCH request
 * 
 * @param {string} url Endpoint URL
 * @param {Object} data Request body data
 * @param {Object} config Optional axios config
 * @returns {Promise<any>} Response data
 */
export const patch = (url, data = {}, config = {}) => {
    return api.patch(url, data, config);
};

/**
 * DELETE request
 * 
 * @param {string} url Endpoint URL
 * @param {Object} config Optional axios config
 * @returns {Promise<any>} Response data
 */
export const del = (url, config = {}) => {
    return api.delete(url, config);
};

/**
 * Set authentication token
 * 
 * Manually set token for requests.
 * Usually not needed as interceptor handles this automatically.
 * 
 * @param {string} token JWT token
 */
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

/**
 * Remove authentication token
 * 
 * Clears token from axios defaults and localStorage.
 */
export const removeAuthToken = () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
};

// Export axios instance for advanced usage
export default api;