import { listAuditLogs } from '../services/auditService.js';

export async function list(req, res, next) {
  try {
    const { limit, skip, resourceId } = req.query;
    const result = await listAuditLogs({ limit, skip, resourceId });
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
}
