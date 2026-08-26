import type { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/notification.model.js';

// GET /api/notifications
export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    const items = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

// GET /api/notifications/unread-count
export async function getUnreadCount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    const count = await NotificationModel.countDocuments({ userId, read: false });
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/:id/read
export async function markRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    const notif = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { read: true },
      { new: true }
    ).lean();
    if (!notif) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/read-all
export async function markAllRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    await NotificationModel.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true, data: { updated: true } });
  } catch (err) {
    next(err);
  }
}