import { api } from './client';

export interface VisitorReport {
  from: string;
  to: string;
  totals: { total: number; checkedIn: number; checkedOut: number; expected: number };
  byPurpose: Array<{ _id: string | null; count: number }>;
  byCompany: Array<{ _id: string | null; count: number }>;
  byHost: Array<{ _id: string | null; count: number }>;
  daily: Array<{ _id: string; count: number }>;
}

/** Aggregate report for a date range (ISO YYYY-MM-DD strings) — managers & above. */
export function fetchReport(from: string, to: string): Promise<VisitorReport> {
  const q = new URLSearchParams({ from, to });
  return api<VisitorReport>(`/reports/summary?${q.toString()}`);
}

/** Report for the last N days ending today. */
export function fetchRecentReport(days = 7): Promise<VisitorReport> {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return fetchReport(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
}