import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // External Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // In a real app, you'd get this from localStorage or a context
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)


);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Return the error object or response data, but keep structure for components
        return Promise.reject(error);
    }
);

export const blockService = {
    toggleBlock: async (userId: string) => {
        const response = await api.post(`/blocks/${userId}/toggle`);
        return response.data.data;
    }
};

export const paymentService = {
    initiateVerification: async () => {
        const response = await api.post('/payments/esewa/verification/initiate');
        return response.data;
    },
    confirmVerification: async (data: string) => {
        const response = await api.get('/payments/esewa/verification/confirm', { params: { data } });
        return response.data;
    }
};

export default api;
