import { Router } from 'express';
import { param } from 'express-validator';
import * as ctrl from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

router.use(authenticate(true));

router.get('/suggestions/:type', [param('type').isString().trim().notEmpty()], handleValidation, ctrl.suggestions);

export default router;
