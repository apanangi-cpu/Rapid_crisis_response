import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    const enriched = new Error(message);
    enriched.status = err.response?.status;
    enriched.details = err.response?.data?.details;
    return Promise.reject(enriched);
  }
);
