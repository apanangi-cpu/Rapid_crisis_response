import { Router } from 'express';
import { query } from 'express-validator';
import * as ctrl from '../controllers/auditController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(authenticate(true), requireRoles('Admin'));

router.get(
  '/logs',
  [
    query('limit').optional().isInt({ min: 1, max: 500 }),
    query('skip').optional().isInt({ min: 0 }),
    query('resourceId').optional().isMongoId(),
  ],
  handleValidation,
  ctrl.list
);

export default router;
