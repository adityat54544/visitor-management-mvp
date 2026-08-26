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
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
}

export interface TodayResponse {
  visitors: Visitor[];
  counts: { checkedIn: number; checkedOut: number; expected: number };
}