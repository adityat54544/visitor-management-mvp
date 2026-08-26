export type VisitorStatus = 'expected' | 'checked-in' | 'checked-out';

export interface Visitor {
  _id: string;
  name: string;
  phone: string;
  company: string;
  personToMeet: string;
  purpose: string;
  status: VisitorStatus;
  expectedTime?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  registeredBy?: string | null;
  photo?: string;
  qrToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'manager' | 'host';
}

export interface Notification {
  _id: string;
  type: 'check-in' | 'check-out';
  title: string;
  body: string;
  read: boolean;
  visitorId?: string | { _id: string; name: string } | null;
  createdAt: string;
}

export interface VisitorInput {
  name: string;
  phone?: string;
  company?: string;
  personToMeet?: string;
  purpose?: string;
  expectedTime?: string;
  checkInTime?: string;
  status?: VisitorStatus;
  photo?: string;
}

export interface TodayResponse {
  visitors: Visitor[];
  counts: { checkedIn: number; checkedOut: number; expected: number };
}