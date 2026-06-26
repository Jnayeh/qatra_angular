interface TemporalInstant {
  add(duration: { days?: number }): TemporalInstant;
  toZonedDateTimeISO(tz: string): { toPlainDate(): { toString(): string } };
  toString(): string;
  toLocaleString(locale: string, opts?: Intl.DateTimeFormatOptions): string;
}

interface TemporalPlainDate {
  add(duration: { days?: number }): TemporalPlainDate;
  since(other: TemporalPlainDate): { days: number };
  toString(): string;
  toLocaleString(locale: string, opts?: Intl.DateTimeFormatOptions): string;
}

interface TemporalPlainTime {
  toLocaleString(locale: string, opts?: Intl.DateTimeFormatOptions): string;
}

declare var Temporal: {
  Now: {
    instant(): TemporalInstant;
    plainDateISO(): TemporalPlainDate;
  };
  Instant: {
    from(iso: string): TemporalInstant;
    compare(a: TemporalInstant, b: TemporalInstant): number;
  };
  PlainDate: {
    from(iso: string): TemporalPlainDate;
    compare(a: TemporalPlainDate, b: TemporalPlainDate): number;
  };
  PlainTime: {
    from(opts: { hour: number; minute: number }): TemporalPlainTime;
  };
};
