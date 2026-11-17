import axios from 'axios';

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the stored bearer token to every request.
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('vwt_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

// Clear the session and return to the login screen on unauthorized responses.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            typeof window !== 'undefined' &&
            error?.response?.status === 401
        ) {
            window.localStorage.removeItem('vwt_token');
            window.localStorage.removeItem('vwt_user');

            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);

export default api;
