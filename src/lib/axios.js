import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/i, '');

export const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true, // Ensure cookies are sent with requests
});