import { api } from './client.js';

export async function getAnalyticsSummary(params) {
  const { data } = await api.get('/analytics/summary', { params });
  return data;
}
