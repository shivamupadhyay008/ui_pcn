import axios from 'axios';

// Create an axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    // Add any default headers here
  },
});

// Request interceptor for adding auth tokens, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // Handle common errors here (e.g., 401 unauthorized)
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
