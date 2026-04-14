import { Incident } from '../models/Incident.js';

export async function getAnalyticsSummary({ from, to } = {}) {
  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const [totalIncidents, byStatus, byType, responseAgg] = await Promise.all([
    Incident.countDocuments(match),
    Incident.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Incident.aggregate([{ $match: match }, { $group: { _id: '$emergencyType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Incident.aggregate([
      { $match: { ...match, firstResponseAt: { $ne: null } } },
      {
        $project: {
          ms: { $subtract: ['$firstResponseAt', '$createdAt'] },
          emergencyType: 1,
        },
      },
      {
        $group: {
          _id: null,
          avgMs: { $avg: '$ms' },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statusMap = Object.fromEntries(byStatus.map((r) => [r._id, r.count]));
  const active = (statusMap['Pending'] || 0) + (statusMap['In Progress'] || 0);
  const resolved = statusMap['Resolved'] || 0;

  const avgResponseMs = responseAgg[0]?.avgMs ?? null;
  const avgResponseTimeSec =
    avgResponseMs != null && !Number.isNaN(avgResponseMs) ? Math.round(avgResponseMs / 1000) : null;

  const mostCommonType = byType[0]?._id ?? null;

  return {
    totalIncidents,
    activeIncidents: active,
    resolvedIncidents: resolved,
    byStatus: statusMap,
    byType: byType.map((r) => ({ type: r._id, count: r.count })),
    avgResponseTimeSec,
    responseSamples: responseAgg[0]?.count ?? 0,
    mostCommonEmergencyType: mostCommonType,
  };
}

export async function incidentFrequencySeries({ from, to, bucket = 'day' } = {}) {
  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }
  const format =
    bucket === 'month'
      ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

  const series = await Incident.aggregate([
    { $match: match },
    { $group: { _id: format, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return series.map((r) => ({ period: r._id, count: r.count }));
}
