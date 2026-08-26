import { Router } from 'express';
import { getReport } from '../controllers/report.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// reports are viewable by managers and admins
router.use(requireAuth);
router.use(requireRole('manager'));

router.get('/summary', getReport);

export default router;