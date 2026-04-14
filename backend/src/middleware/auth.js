import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { AppError } from './errorHandler.js';

export function authenticate(required = true) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        if (required) throw new AppError('Authentication required', 401);
        req.user = null;
        return next();
      }
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.sub);
      if (!user) throw new AppError('User not found', 401);
      req.user = user;
      req.token = token;
      next();
    } catch (e) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        return next(new AppError('Invalid or expired token', 401));
      }
      next(e);
    }
  };
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}
