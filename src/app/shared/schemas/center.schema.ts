import { z } from 'zod';

const DayScheduleSchema = z.object({
  opens: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
  closes: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm format'),
});

export const OperatingHoursSchema = z.object({
  monday: DayScheduleSchema.nullable(),
  tuesday: DayScheduleSchema.nullable(),
  wednesday: DayScheduleSchema.nullable(),
  thursday: DayScheduleSchema.nullable(),
  friday: DayScheduleSchema.nullable(),
  saturday: DayScheduleSchema.nullable(),
  sunday: DayScheduleSchema.nullable(),
  closedWindows: z
    .array(
      z.object({
        date: z.string(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        allDay: z.boolean(),
        reason: z.string(),
      })
    )
    .default([]),
});

export const CenterCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  address: z.string().min(5).max(300),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  phone: z.string().regex(/^\+?[\d\s-]{8,15}$/),
  email: z.string().email(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  facilityType: z.enum([
    'HOSPITAL',
    'BLOOD_BANK',
    'MOBILE_UNIT',
    'COMMUNITY_CENTER',
    'CLINIC',
  ]),
  operatingHours: OperatingHoursSchema,
  totalCapacity: z.number().int().positive(),
  maxRegular: z.number().int().positive(),
  slotPeriod: z.number().int().min(15).max(480),
});

export const CenterUpdateSchema = CenterCreateSchema.partial();

export const ClosureSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean(),
  reason: z.string().min(1).max(500),
});

export type CenterCreateForm = z.infer<typeof CenterCreateSchema>;
export type CenterUpdateForm = z.infer<typeof CenterUpdateSchema>;
export type ClosureForm = z.infer<typeof ClosureSchema>;
