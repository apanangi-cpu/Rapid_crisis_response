import { Router } from 'express';
import { body } from 'express-validator';
import * as auth from '../controllers/authController.js';
import * as users from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8, max: 128 }),
    body('role').optional().isIn(['Staff', 'Security']),
  ],
  handleValidation,
  auth.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 1 })],
  handleValidation,
  auth.login
);

router.get('/me', authenticate(true), auth.me);

router.get('/responders', authenticate(true), users.listResponders);

export default router;
