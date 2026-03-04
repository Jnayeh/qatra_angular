export interface DaySchedule {
  opens: string;
  closes: string;
}

export interface ClosureWindow {
  date: string;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  reason: string;
}

export interface OperatingHours {
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
  sunday: DaySchedule | null;
  closedWindows: ClosureWindow[];
}
