import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('vwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('vwt_token');
            localStorage.removeItem('vwt_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
