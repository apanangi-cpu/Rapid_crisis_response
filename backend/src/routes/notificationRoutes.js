import { Router } from 'express';
import { param, query } from 'express-validator';
import * as ctrl from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(authenticate(true));

router.get(
  '/',
  [
    query('unreadOnly').optional().isBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('skip').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  ctrl.listMine
);

router.patch('/read/:id', [param('id').isMongoId()], handleValidation, ctrl.readOne);
router.patch('/read-all', ctrl.readAll);

export default router;
