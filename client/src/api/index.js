import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        // Only redirect to login if it's a real session 401, 
        // not a simulated API key failure or a proxy result from an external API.
        const isSimReq = error.config && error.config.url && error.config.url.includes('simulate');
        const isProxyReq = error.config && error.config.url && error.config.url.includes('proxy');

        if (error.response && error.response.status === 401 && !isSimReq && !isProxyReq) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

