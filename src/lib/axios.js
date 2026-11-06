import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export { API_BASE_URL } from './apiConfig';

export const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true, // Ensure cookies are sent with requests
});