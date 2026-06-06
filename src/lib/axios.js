import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: ['http://localhost:3001/api', 'http://10.177.157.106:4173/api'],
    withCredentials: true,
});