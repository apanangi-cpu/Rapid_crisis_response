import { listForUser, markRead, markAllRead } from '../services/notificationService.js';

export async function listMine(req, res, next) {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const limit = req.query.limit;
    const skip = req.query.skip;
    const result = await listForUser(req.user._id, { unreadOnly, limit, skip });
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
}

export async function readOne(req, res, next) {
  try {
    const doc = await markRead(req.user._id, req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification: doc });
  } catch (e) {
    next(e);
  }
}

export async function readAll(req, res, next) {
  try {
    const count = await markAllRead(req.user._id);
    res.json({ success: true, marked: count });
  } catch (e) {
    next(e);
  }
}
