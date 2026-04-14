import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore.js';

let socket;

export function getSocketUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
}

export function connectSocket() {
  const token = useAuthStore.getState().token;
  if (!token) return null;
  if (socket?.connected) return socket;
  if (socket) socket.disconnect();
  socket = io(getSocketUrl(), {
    transports: ['websocket', 'polling'],
    auth: { token },
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
