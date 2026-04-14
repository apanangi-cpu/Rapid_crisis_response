import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already registered', 409);
    const passwordHash = await hashPassword(password);
    const allowedRoles = ['Staff', 'Security'];
    const safeRole = role === 'Admin' ? 'Staff' : allowedRoles.includes(role) ? role : 'Staff';
    const user = await User.create({ name, email, passwordHash, role: safeRole });
    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.status(201).json({ success: true, token, user: user.toSafeJSON() });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new AppError('Invalid credentials', 401);
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new AppError('Invalid credentials', 401);
    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.json({ success: true, token, user: user.toSafeJSON() });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    res.json({ success: true, user: req.user.toSafeJSON() });
  } catch (e) {
    next(e);
  }
}
