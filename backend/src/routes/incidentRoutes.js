import { Router } from 'express';
import mongoose from 'mongoose';
import { body, query, param } from 'express-validator';
import * as ctrl from '../controllers/incidentController.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { EMERGENCY_TYPES, INCIDENT_STATUSES } from '../models/Incident.js';

const router = Router();

router.use(authenticate(true));

router.post(
  '/create',
  [
    body('emergencyType').isIn(EMERGENCY_TYPES),
    body('floorId').isMongoId(),
    body('roomId').isMongoId(),
    body('title').optional().isString().isLength({ max: 200 }),
    body('description').optional().isString().isLength({ max: 4000 }),
    body('sosSource').optional().isString().isLength({ max: 120 }),
  ],
  handleValidation,
  ctrl.create
);

router.get(
  '/all',
  [
    query('type').optional().isIn(EMERGENCY_TYPES),
    query('status').optional().isIn(INCIDENT_STATUSES),
    query('sort').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('skip').optional().isInt({ min: 0 }),
  ],
  handleValidation,
  ctrl.listAll
);

router.patch(
  '/update',
  [
    body('incidentId').isMongoId(),
    body('status').optional().isIn(INCIDENT_STATUSES),
    body('assignedTo')
      .optional({ values: 'null' })
      .custom((v) => v === null || v === '' || mongoose.isValidObjectId(String(v))),
    body('note').optional().isString().isLength({ min: 1, max: 4000 }),
    body().custom((value) => {
      if (!value.status && value.assignedTo === undefined && !value.note) {
        throw new Error('At least one of status, assignedTo, or note is required');
      }
      return true;
    }),
  ],
  handleValidation,
  ctrl.update
);

router.get('/:id', [param('id').isMongoId()], handleValidation, ctrl.getById);

router.delete('/:id', requireRoles('Admin'), [param('id').isMongoId()], handleValidation, ctrl.remove);

export default router;
