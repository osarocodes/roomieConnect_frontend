const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/i, '');
