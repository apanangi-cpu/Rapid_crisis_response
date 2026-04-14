import { api } from './client.js';

export async function listResponders() {
  const { data } = await api.get('/auth/responders');
  return data;
}
