import axios from 'axios';

const appMode = import.meta.env.VITE_APP_MODE;
let baseURL;
if (appMode == 'production') {
    baseURL = import.meta.env.VITE_PROD_API_BASE_URL;
} else {
    baseURL = import.meta.env.VITE_API_BASE_URL;
}

console.log("appMode", appMode);
console.log("baseURL", baseURL);

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

export default api;
