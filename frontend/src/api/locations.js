import { api } from './client.js';

export async function listFloors() {
  const { data } = await api.get('/location/floors');
  return data;
}

export async function listRooms(floorId) {
  const { data } = await api.get('/location/rooms', { params: { floorId } });
  return data;
}
