import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export async function createNotification({ userId, title, body = '', type = 'incident', incidentId = null, meta = {} }) {
  return Notification.create({
    user: userId,
    title,
    body,
    type,
    incident: incidentId,
    meta,
  });
}

/** Notify all Admin and Security users (Staff optionally excluded for noise). */
export async function notifyIncidentStakeholders({ title, body, incidentId, meta = {}, includeStaff = false }) {
  const roles = includeStaff ? ['Admin', 'Security', 'Staff'] : ['Admin', 'Security'];
  const users = await User.find({ role: { $in: roles } }).select('_id');
  const docs = users.map((u) => ({
    user: u._id,
    title,
    body,
    type: 'incident',
    incident: incidentId,
    meta,
  }));
  if (docs.length === 0) return [];
  return Notification.insertMany(docs);
}

export async function listForUser(userId, { unreadOnly = false, limit = 50, skip = 0 } = {}) {
  const q = { user: userId };
  if (unreadOnly) q.read = false;
  const [items, total, unreadCount] = await Promise.all([
    Notification.find(q).sort({ createdAt: -1 }).skip(skip).limit(Math.min(limit, 100)).populate('incident', 'emergencyType status priority'),
    Notification.countDocuments(q),
    Notification.countDocuments({ user: userId, read: false }),
  ]);
  return { items, total, unreadCount };
}

export async function markRead(userId, notificationId) {
  const n = await Notification.findOne({ _id: notificationId, user: userId });
  if (!n) return null;
  n.read = true;
  await n.save();
  return n;
}

export async function markAllRead(userId) {
  const r = await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
  return r.modifiedCount;
}
