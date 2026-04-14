import { getSuggestionsForType } from '../services/aiService.js';

export async function suggestions(req, res, next) {
  try {
    const data = await getSuggestionsForType(req.params.type);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
