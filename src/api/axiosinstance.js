import axios from 'axios';

// Global variables for tokens and keys
let authToken = null;
let pluginSecretKey = null;

// Functions to set the tokens and keys
export const setAuthToken = (token) => {
  authToken = token;
};

export const setPluginSecretKey = (key) => {
  pluginSecretKey = key;
};

// Create an axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
    // Add any default headers here
  },
});

// Request interceptor for adding auth tokens, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    // Add plugin secret key if available
    if (pluginSecretKey) {
      config.headers['ark-plugin-secret-key'] = pluginSecretKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 unauthorized, 403 forbidden, 400 bad request)
    const status = error.response?.status;
    if (status === 401 || status === 403 || status === 400) {
      // Reset tokens upon auth errors
      setAuthToken(null);
      setPluginSecretKey(null);
      // Dispatch a custom event to notify the app
      window.dispatchEvent(new CustomEvent('auth-error', { detail: { status } }));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
