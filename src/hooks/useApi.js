import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';

/**
 * Custom hook for making authenticated API calls
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.data - Request data for POST/PUT requests
 * @param {boolean} options.immediate - Whether to execute the request immediately
 * @param {Array} options.deps - Dependencies array for useEffect
 */
export const useApi = (url, options = {}) => {
    const { method = 'GET', data, immediate = true, deps = [] } = options;
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const execute = async (customData = data) => {
        if (!isAuthenticated) {
            setError(new Error('User not authenticated'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const config = {
                method,
                url,
            };

            if (customData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                config.data = customData;
            }

            const result = await axiosInstance(config);
            setResponse(result.data);
            return result.data;
        } catch (err) {
            setError(err);

            // Handle authentication errors
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout();
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate && isAuthenticated) {
            execute();
        }
    }, [immediate, isAuthenticated, ...deps]);

    return {
        response,
        error,
        loading,
        execute,
    };
};

/**
 * Hook for GET requests
 */
export const useGet = (url, deps = []) => {
    return useApi(url, { method: 'GET', deps });
};

/**
 * Hook for POST requests (not executed immediately)
 */
export const usePost = (url) => {
    return useApi(url, { method: 'POST', immediate: false });
};

/**
 * Hook for PUT requests (not executed immediately)
 */
export const usePut = (url) => {
    return useApi(url, { method: 'PUT', immediate: false });
};

/**
 * Hook for DELETE requests (not executed immediately)
 */
export const useDelete = (url) => {
    return useApi(url, { method: 'DELETE', immediate: false });
};

export default useApi;