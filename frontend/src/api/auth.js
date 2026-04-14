import { api } from './client.js';

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}
