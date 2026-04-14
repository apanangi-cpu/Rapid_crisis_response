import { AuditLog } from '../models/AuditLog.js';

export async function recordAudit({ actorId, action, resourceType = 'Incident', resourceId = null, details = '', metadata = {} }) {
  return AuditLog.create({
    actor: actorId,
    action,
    resourceType,
    resourceId,
    details,
    metadata,
  });
}

export async function listAuditLogs({ limit = 100, skip = 0, resourceId } = {}) {
  const q = {};
  if (resourceId) q.resourceId = resourceId;
  const [items, total] = await Promise.all([
    AuditLog.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 500))
      .populate('actor', 'name email role'),
    AuditLog.countDocuments(q),
  ]);
  return { items, total };
}
