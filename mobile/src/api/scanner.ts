import { api } from './client';
import type { Visitor } from './types';

/** Check a visitor in using the qrToken from their badge QR code. */
export function checkInByQr(qrToken: string): Promise<Visitor> {
  return api<Visitor>('/visitors/check-in/qr', {
    method: 'POST',
    body: { qrToken },
  });
}
