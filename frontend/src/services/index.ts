import axios from 'axios';

axios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Extract the specific error message from the backend response if available
    if (error.response && error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
    }
    return Promise.reject(error);
});

export default axios;
