import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev_key_test';
const TIMEOUT = parseInt(import.meta.env.VITE_TIMEOUT || '30000');

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Response Error:', error.response?.status, error.message);
    
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 422:
          throw new Error(data.message || 'Invalid image format or size. Please check your files.');
        case 408:
          throw new Error('Analysis timeout. Please try with smaller images or fewer files.');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 401:
          throw new Error('Authentication failed. Please check your API key.');
        case 429:
          throw new Error('Too many requests. Please wait a moment and try again.');
        default:
          throw new Error(data.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      // Error in request setup
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export default apiClient;

// Made with Bob
