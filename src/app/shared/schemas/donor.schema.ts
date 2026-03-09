import { z } from 'zod';

export const BloodTypeSchema = z.enum([
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
  'UNKNOWN',
]);

export const UpdateDonorProfileSchema = z.object({
  displayName: z
    .string()
    .min(2)
    .max(100, 'Display name too long'),
  phone: z.string().regex(/^\+?[\d\s-]{8,15}$/, 'Invalid phone number'),
});

export const UpdateBloodTypeSchema = z.object({
  bloodType: BloodTypeSchema,
});

export const UpdateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
});

export const UseGpsSchema = z.object({
  useGps: z.literal(true),
});

export const UpdateLocationUnionSchema = z.union([
  UpdateLocationSchema,
  UseGpsSchema,
]);

export const UpdateAvailabilitySchema = z.object({
  status: z.enum([
    'AVAILABLE',
    'TEMPORARILY_UNAVAILABLE',
    'VACATION_MODE',
  ]),
});

export const HealthQuestionnaireSchema = z.object({
  hasChronicIllness: z.boolean(),
  lastSurgeryAt: z.string().nullable().optional(),
  lastTravelAt: z.string().nullable().optional(),
  lastTattooOrPiercingAt: z.string().nullable().optional(),
  onMedication: z.boolean(),
  medicalConditionsDetails: z.string().optional(),
  medicationDetails: z.string().optional(),
});

export const NotificationPreferencesSchema = z.object({
  frequency: z.enum([
    'IMMEDIATE',
    'DAILY_DIGEST',
    'EMERGENCY_ONLY',
    'DISABLED',
  ]),
  quietHours: z
    .object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
    })
    .nullable(),
  allowEmergencyNotifications: z.boolean(),
  maxNotificationDistanceKm: z.number().min(0).max(1000),
});

export type UpdateDonorProfileForm = z.infer<typeof UpdateDonorProfileSchema>;
export type UpdateBloodTypeForm = z.infer<typeof UpdateBloodTypeSchema>;
export type UpdateLocationForm = z.infer<typeof UpdateLocationSchema>;
export type UpdateAvailabilityForm = z.infer<typeof UpdateAvailabilitySchema>;
export type HealthQuestionnaireForm = z.infer<typeof HealthQuestionnaireSchema>;
export type NotificationPreferencesForm = z.infer<
  typeof NotificationPreferencesSchema
>;
