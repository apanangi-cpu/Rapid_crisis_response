import { Router } from 'express';
import { body, query } from 'express-validator';
import * as ctrl from '../controllers/locationController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.get('/floors', authenticate(true), ctrl.listFloors);
router.get('/rooms', authenticate(true), [query('floorId').isMongoId()], handleValidation, ctrl.listRooms);

router.post(
  '/floors',
  authenticate(true),
  requireRoles('Admin'),
  [
    body('label').trim().isLength({ min: 1, max: 80 }),
    body('level').isInt(),
    body('building').optional().isString().isLength({ max: 80 }),
  ],
  handleValidation,
  ctrl.createFloor
);

router.post(
  '/rooms',
  authenticate(true),
  requireRoles('Admin'),
  [
    body('floor').isMongoId(),
    body('name').trim().isLength({ min: 1, max: 120 }),
    body('code').trim().isLength({ min: 1, max: 40 }),
  ],
  handleValidation,
  ctrl.createRoom
);

export default router;
