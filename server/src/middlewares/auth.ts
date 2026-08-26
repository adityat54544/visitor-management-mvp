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