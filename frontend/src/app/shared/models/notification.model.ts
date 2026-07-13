export type NotificationType =
  | 'EMERGENCY_ALERT'
  | 'APPOINTMENT_REMINDER'
  | 'ELIGIBILITY_REMINDER'
  | 'PROFILE_COMPLETION'
  | 'PASSWORD_RESET'
  | 'GENERAL';

export type NotificationChannel = 'IN_APP' | 'PUSH' | 'EMAIL';

export type NotificationStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED';

export interface Notification {
  id: number;
  userId: number;
  emergencyId: number | null;
  appointmentId: number | null;
  email: string | null;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  correlationId: string | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
}
