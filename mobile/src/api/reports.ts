import { api } from './client';

export interface VisitorReport {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  expected: number;
  byDay: Array<{ date: string; count: number }>;
  topPurposes: Array<{ purpose: string; count: number }>;
  avgVisitMinutes: number | null;
}

/** Aggregate report for a date range (ISO date strings). */
export function fetchReport(from: string, to: string): Promise<VisitorReport> {
  const q = new URLSearchParams({ from, to });
  return api<VisitorReport>(`/reports?${q.toString()}`);
}

/** Reports for the last N days ending today. */
export function fetchRecentReport(days = 7): Promise<VisitorReport> {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return fetchReport(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
}