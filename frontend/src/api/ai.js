import { api } from './client.js';

export async function getAiSuggestions(type) {
  const { data } = await api.get(`/ai/suggestions/${encodeURIComponent(type)}`);
  return data;
}
