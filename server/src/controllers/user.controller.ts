import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel, type UserRole } from '../models/user.model.js';

function toUserJson(u: { _id: unknown; name: string; email: string; role: string }) {
  return { id: String(u._id), name: u.name, email: u.email, role: u.role };
}

// GET /api/users
export async function getUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await UserModel.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, data: users.map(toUserJson) });
  } catch (err) {
    next(err);
  }
}

// POST /api/users  { name, email, password, role }
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'name, email and password required' });
      return;
    }
    if (role && !['admin', 'receptionist', 'manager'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role' });
      return;
    }
    const exists = await UserModel.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash, role: role || 'receptionist' });
    res.status(201).json({ success: true, data: toUserJson(user) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/users/:id/role  { role }
export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { role } = req.body as { role?: UserRole };
    if (!role || !['admin', 'receptionist', 'manager'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role' });
      return;
    }
    const callerId = (req as unknown as { userId: string }).userId;
    if (req.params.id === callerId && role !== 'admin') {
      res.status(400).json({ success: false, message: 'You cannot demote yourself' });
      return;
    }
    const user = await UserModel.findByIdAndUpdate(req.params.id, { role }, { new: true }).lean();
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: toUserJson(user) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const callerId = (req as unknown as { userId: string }).userId;
    if (req.params.id === callerId) {
      res.status(400).json({ success: false, message: 'You cannot delete yourself' });
      return;
    }
    const user = await UserModel.findByIdAndDelete(req.params.id).lean();
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}