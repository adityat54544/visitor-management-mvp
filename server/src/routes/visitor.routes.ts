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
  checkInByQr,
} from '../controllers/visitor.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// protect all visitor routes — anyone authenticated can read
router.use(requireAuth);

// Read endpoints: available to all authenticated roles (receptionist, manager, admin)
router.get('/today', getToday);
router.get('/', getVisitors);
router.get('/:id', getVisitorById);

// QR scanner check-in (front-desk)
router.post('/check-in/qr', checkInByQr);

// Write endpoints (register, edit, delete, check in/out) — receptionists & above
router.post('/', createVisitor);
router.put('/:id', updateVisitor);
router.delete('/:id', deleteVisitor);
router.patch('/:id/check-in', checkInVisitor);
router.patch('/:id/check-out', checkOutVisitor);

export default router;