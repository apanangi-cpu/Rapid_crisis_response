import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

let io;

export const SOCKET_EVENTS = {
  NEW_INCIDENT: 'new_incident',
  INCIDENT_UPDATED: 'incident_updated',
  STATUS_CHANGED: 'status_changed',
  NOTIFICATION_NEW: 'notification_new',
};

export function initSocket(httpServer, { corsOrigin }) {
  io = new Server(httpServer, {
    cors: { origin: corsOrigin || '*', methods: ['GET', 'POST'], credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = verifyToken(String(token));
      const user = await User.findById(decoded.sub);
      if (!user) return next(new Error('Unauthorized'));
      socket.data.userId = user._id.toString();
      socket.data.role = user.role;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join('crisis_room');
    if (socket.data.userId) socket.join(`user:${socket.data.userId}`);
    socket.emit('connected', { ok: true, userId: socket.data.userId });

    socket.on('ping', (cb) => {
      if (typeof cb === 'function') cb({ ok: true, at: Date.now() });
    });

    socket.on('incident_ack', (payload, cb) => {
      const ack = { ok: true, receivedAt: Date.now(), userId: socket.data.userId, ackId: payload?.ackId };
      if (typeof cb === 'function') cb(ack);
    });
  });

  return io;
}

export function getIo() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitNewIncident(payload) {
  if (!io) return;
  io.to('crisis_room').emit(SOCKET_EVENTS.NEW_INCIDENT, payload);
}

export function emitIncidentUpdated(payload) {
  if (!io) return;
  io.to('crisis_room').emit(SOCKET_EVENTS.INCIDENT_UPDATED, payload);
}

export function emitStatusChanged(payload) {
  if (!io) return;
  io.to('crisis_room').emit(SOCKET_EVENTS.STATUS_CHANGED, payload);
}

export function emitNotificationToUser(userId, payload) {
  if (!io) return;
  io.to(`user:${userId}`).emit(SOCKET_EVENTS.NOTIFICATION_NEW, payload);
}
