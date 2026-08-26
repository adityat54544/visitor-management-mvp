import { api } from './client';
import type { Notification } from './types';

/** Fetch the current user's notifications (newest first). */
export function fetchNotifications(): Promise<Notification[]> {
  return api<Notification[]>('/notifications');
}

/** Mark one notification as read. */
export function markNotificationRead(id: string): Promise<Notification> {
  return api<Notification>(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

/** Mark all of the current user's notifications as read. */
export function markAllNotificationsRead(): Promise<void> {
  return api<void>('/notifications/read-all', {
    method: 'POST',
  });
}