import { Router } from 'express';
import { query } from 'express-validator';
import * as ctrl from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(authenticate(true));

router.get(
  '/summary',
  [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('bucket').optional().isIn(['day', 'month']),
  ],
  handleValidation,
  ctrl.summary
);

export default router;
