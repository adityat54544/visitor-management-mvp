import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || typeof decoded.sub !== 'string') {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    const user = await UserModel.findById(decoded.sub).lean();
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }
    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
}

export { JWT_SECRET, asyncHandler };

const ROLE_ORDER = ['receptionist', 'manager', 'admin'];

// requireRole('admin') — only admins
// requireRole('receptionist','manager') — any of these
export function requireRole(...roles: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }
    const userRole = req.userRole ?? '';
    // allow if the user's role is in the allowed list OR is an admin (highest)
    const allowed =
      roles.includes(userRole) ||
      (roles.length > 0 && userRole === 'admin') ||
      // role-ordered access: higher roles imply lower ones (admin>manager>receptionist)
      (ROLE_ORDER.indexOf(userRole) >= 0 &&
        roles.some((r) => ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(r)));

    if (!allowed) {
      res.status(403).json({
        success: false,
        message: `Requires role: ${roles.join(' or ')}`,
      });
      return;
    }
    next();
  };
}