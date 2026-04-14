import { validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new AppError('Validation failed', 422, errors.array().map((e) => ({ field: e.path, msg: e.msg })))
    );
  }
  next();
}
