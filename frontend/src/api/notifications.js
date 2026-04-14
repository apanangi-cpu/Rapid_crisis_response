import { api } from './client.js';

export async function listNotifications(params) {
  const { data } = await api.get('/notifications', { params });
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/notifications/read/${id}`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await api.patch('/notifications/read-all');
  return data;
}
