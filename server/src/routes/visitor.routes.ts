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

// Write endpoints (register, edit, check in/out) — front-desk roles & above
const canModify = requireRole('admin', 'manager', 'receptionist');
router.post('/', canModify, createVisitor);
router.put('/:id', canModify, updateVisitor);
router.patch('/:id/check-in', canModify, checkInVisitor);
router.patch('/:id/check-out', canModify, checkOutVisitor);

// Destructive — admins only
router.delete('/:id', requireRole('admin'), deleteVisitor);

export default router;