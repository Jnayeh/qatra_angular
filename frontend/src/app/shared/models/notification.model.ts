export type NotificationType =
  | 'EMERGENCY_ALERT'
  | 'APPOINTMENT_REMINDER'
  | 'ELIGIBILITY_REMINDER'
  | 'PROFILE_COMPLETION'
  | 'STAFF_MESSAGE'
  | 'GENERAL';

export type NotificationChannel = 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP';

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
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
}
