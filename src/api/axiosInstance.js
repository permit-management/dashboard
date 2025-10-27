import axios from 'axios';
import { getToken, logout, isTokenExpired } from '../utils/auth';

const instance = axios.create({
  baseURL: '/api/v1',
});

// Request interceptor to add token to every request
instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired()) {
        logout();
        window.location.href = '#/LoginForm';
        return Promise.reject(new Error('Token expired'));
      }

      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle authentication errors
      if (status === 401 || status === 403) {
        logout();
        window.location.href = '#/LoginForm';
        return Promise.reject(new Error('Authentication failed'));
      }
    }

    return Promise.reject(error);
  }
);

export default instance;