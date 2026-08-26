import { api } from './client';
import type { TodayResponse, Visitor, VisitorInput, VisitorStatus } from './types';

export function fetchToday(): Promise<TodayResponse> {
  return api<TodayResponse>('/visitors/today');
}

export function fetchVisitors(params?: {
  search?: string;
  status?: VisitorStatus;
}): Promise<Visitor[]> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.status) q.set('status', params.status);
  const qs = q.toString();
  return api<Visitor[]>(`/visitors${qs ? `?${qs}` : ''}`);
}

export function createVisitor(input: VisitorInput): Promise<Visitor> {
  return api<Visitor>('/visitors', { method: 'POST', body: input });
}

export function fetchVisitor(id: string): Promise<Visitor> {
  return api<Visitor>(`/visitors/${id}`);
}

export function checkInVisitor(id: string, checkInTime?: string): Promise<Visitor> {
  return api<Visitor>(`/visitors/${id}/check-in`, {
    method: 'PATCH',
    body: checkInTime ? { checkInTime } : {},
  });
}

export function checkOutVisitor(id: string): Promise<Visitor> {
  return api<Visitor>(`/visitors/${id}/check-out`, { method: 'PATCH', body: {} });
}