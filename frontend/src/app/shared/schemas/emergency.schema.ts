import { z } from 'zod';

export const EmergencyCreateSchema = z.object({
  centerId: z.number({ required_error: 'Center is required' }).positive(),
  bloodType: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
  ]),
  unitsNeeded: z.number().int().min(1, 'At least 1 unit required').positive(),
  urgency: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  contactPhone: z
    .string()
    .regex(/^\+?[\d\s-]{8,15}$/, 'Invalid phone number'),
  expiresAt: z.string().min(1, 'Deadline is required'),
});

export const EmergencyRespondSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
  slotId: z.number().positive().optional(),
});

export const EmergencyStatusUpdateSchema = z.object({
  action: z.enum(['ESCALATE', 'EXTEND', 'CANCEL']),
  deadlineExtension: z.string().optional(),
});

export type EmergencyCreateForm = z.infer<typeof EmergencyCreateSchema>;
export type EmergencyRespondForm = z.infer<typeof EmergencyRespondSchema>;
export type EmergencyStatusUpdateForm = z.infer<
  typeof EmergencyStatusUpdateSchema
>;
