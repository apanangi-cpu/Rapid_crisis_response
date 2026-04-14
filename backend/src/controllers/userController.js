import { User } from '../models/User.js';

export async function listResponders(req, res, next) {
  try {
    const users = await User.find({ role: { $in: ['Admin', 'Security', 'Staff'] } })
      .sort({ name: 1 })
      .select('name email role')
      .lean();
    res.json({ success: true, users: users.map((u) => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role })) });
  } catch (e) {
    next(e);
  }
}
