import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin')); // all user management is admin-only

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;