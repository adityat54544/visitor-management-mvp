import { api } from './client';
import type { Visitor } from './types';

/** Check a visitor in using a base64 photo of their ID badge QR code. */
export function checkInByQr(photo: string): Promise<Visitor> {
  return api<Visitor>('/visitors/check-in/qr', {
    method: 'POST',
    body: { photo },
  });
}
