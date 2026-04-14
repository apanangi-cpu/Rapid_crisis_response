import { getAnalyticsSummary, incidentFrequencySeries } from '../services/analyticsService.js';

export async function summary(req, res, next) {
  try {
    const { from, to } = req.query;
    const data = await getAnalyticsSummary({ from, to });
    const frequency = await incidentFrequencySeries({ from, to, bucket: req.query.bucket || 'day' });
    res.json({ success: true, data: { ...data, frequency } });
  } catch (e) {
    next(e);
  }
}
