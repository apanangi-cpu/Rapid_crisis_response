import { api } from './client.js';

export async function createIncident(body) {
  const { data } = await api.post('/incident/create', body);
  return data;
}

export async function listIncidents(params) {
  const { data } = await api.get('/incident/all', { params });
  return data;
}

export async function getIncident(id) {
  const { data } = await api.get(`/incident/${id}`);
  return data;
}

export async function updateIncident(body) {
  const { data } = await api.patch('/incident/update', body);
  return data;
}

export async function deleteIncident(id) {
  const { data } = await api.delete(`/incident/${id}`);
  return data;
}
