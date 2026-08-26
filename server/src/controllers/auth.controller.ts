import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';

function toUserJson(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// POST /api/auth/register — create an account (open only when no users exist)
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const count = await UserModel.countDocuments();
    if (count > 0) {
      res.status(403).json({
        success: false,
        message: 'Registration is closed. Ask an admin to create your account.',
      });
      return;
    }
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'name, email and password are required' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash });
    const token = signToken(user._id.toString());
    res.status(201).json({ success: true, data: { user: toUserJson(user), token } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'email and password required' });
      return;
    }
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    const token = signToken(user._id.toString());
    res.json({
      success: true,
      data: { user: toUserJson(user), token },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req as unknown as { userId: string };
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: toUserJson(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/change-password
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req as unknown as { userId: string };
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ success: false, message: 'currentPassword and newPassword required' });
      return;
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      res.status(401).json({ success: false, message: 'Current password is incorrect' });
      return;
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}