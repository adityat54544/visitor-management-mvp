import { Router } from 'express';
import {
  getToday,
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  checkInVisitor,
  checkOutVisitor,
} from '../controllers/visitor.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// protect all visitor routes
router.use(requireAuth);

router.get('/today', getToday);
router.get('/', getVisitors);
router.get('/:id', getVisitorById);
router.post('/', createVisitor);
router.put('/:id', updateVisitor);
router.delete('/:id', deleteVisitor);
router.patch('/:id/check-in', checkInVisitor);
router.patch('/:id/check-out', checkOutVisitor);

export default router;