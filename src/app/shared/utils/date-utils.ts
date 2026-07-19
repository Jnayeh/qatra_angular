export function nowUTC(): Date {
  return new Date();
}

export function todayUTC(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const dt = new Date(2000, 0, 1, h, m);
  return dt.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function isAfterNowUTC(iso: string): boolean {
  return new Date(iso).getTime() > Date.now();
}

export function isBeforeNowUTC(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function toIsoDateTime(date: Date): string {
  return date.toISOString();
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function diffInDays(isoA: string, isoB: string): number {
  const a = new Date(isoA);
  const b = new Date(isoB);
  const diffMs = Math.abs(a.getTime() - b.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function parseHHmm(hhmm: string): { hour: number; minute: number } {
  const [h, m] = hhmm.split(':').map(Number);
  return { hour: h, minute: m };
}
