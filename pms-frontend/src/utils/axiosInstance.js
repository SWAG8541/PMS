import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');

    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// Add response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        
        // If unauthorized (401) or forbidden (403), logout user
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);

export default API;