export function nowUTC(): TemporalInstant {
  return Temporal.Now.instant();
}

export function todayUTC(): TemporalPlainDate {
  return Temporal.Now.plainDateISO();
}

export function formatDateTime(iso: string): string {
  const instant = Temporal.Instant.from(iso);
  return instant.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  const plain = Temporal.PlainDate.from(iso);
  return plain.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const dt = Temporal.PlainTime.from({ hour: h, minute: m });
  return dt.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function isAfterNowUTC(iso: string): boolean {
  return Temporal.Instant.compare(Temporal.Instant.from(iso), nowUTC()) > 0;
}

export function isBeforeNowUTC(iso: string): boolean {
  return Temporal.Instant.compare(Temporal.Instant.from(iso), nowUTC()) < 0;
}

export function daysFromNow(days: number): TemporalInstant {
  return nowUTC().add({ days });
}

export function toIsoDate(instant: TemporalInstant): string {
  return instant.toZonedDateTimeISO('UTC').toPlainDate().toString();
}

export function toIsoDateTime(instant: TemporalInstant): string {
  return instant.toString();
}

export function addDays(iso: string, days: number): string {
  const dt = Temporal.PlainDate.from(iso);
  return dt.add({ days }).toString();
}

export function diffInDays(isoA: string, isoB: string): number {
  const a = Temporal.PlainDate.from(isoA);
  const b = Temporal.PlainDate.from(isoB);
  return Temporal.PlainDate.compare(a, b) >= 0
    ? a.since(b).days
    : b.since(a).days;
}

export function parseHHmm(hhmm: string): TemporalPlainTime {
  const [h, m] = hhmm.split(':').map(Number);
  return Temporal.PlainTime.from({ hour: h, minute: m });
}
