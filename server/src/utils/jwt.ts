import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middlewares/auth.js';

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}