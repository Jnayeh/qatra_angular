import { z } from 'zod';

export const AppointmentBookingSchema = z.object({
  centerId: z.number({ required_error: 'Center is required' }).positive(),
  slotId: z.number({ required_error: 'Slot is required' }).positive(),
  appointmentType: z.enum(['REGULAR', 'EMERGENCY']),
  emergencyId: z.number().positive().optional(),
});

export const AppointmentRescheduleSchema = z.object({
  newSlotId: z.number().positive(),
});

export const AppointmentCancelSchema = z.object({
  cancellationReason: z
    .string()
    .min(1, 'Cancellation reason is required')
    .max(500),
});

export const CheckInSchema = z.object({
  qrCode: z.string().optional(),
  appointmentId: z.number().positive().optional(),
});

export const ScreeningSchema = z.object({
  temperature: z
    .number()
    .min(34, 'Temperature too low')
    .max(42, 'Temperature too high'),
  hemoglobin: z.number().min(5).max(20),
  weight: z.number().min(30).max(200),
  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Invalid blood pressure format (e.g. 120/80)'),
  eligible: z.boolean(),
  notes: z.string().max(500).optional(),
});

export const CompletionSchema = z.object({
  mlCollected: z.number().int().min(1, 'Must collect at least 1 ml'),
  notes: z.string().max(500).optional(),
  bloodType: z
    .enum([
      'A_POSITIVE',
      'A_NEGATIVE',
      'B_POSITIVE',
      'B_NEGATIVE',
      'AB_POSITIVE',
      'AB_NEGATIVE',
      'O_POSITIVE',
      'O_NEGATIVE',
      'UNKNOWN',
    ])
    .optional(),
});

export type AppointmentBookingForm = z.infer<typeof AppointmentBookingSchema>;
export type CheckInForm = z.infer<typeof CheckInSchema>;
export type ScreeningForm = z.infer<typeof ScreeningSchema>;
export type CompletionForm = z.infer<typeof CompletionSchema>;
