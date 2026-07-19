export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'IN_SCREENING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

export type AppointmentType = 'REGULAR' | 'EMERGENCY';

export type DonationOutcome = 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: number;
  donorId: number;
  centerId: number;
  emergencyId: number | null;
  slotId: number;
  completedByStaffId: number | null;
  status: AppointmentStatus;
  appointmentType: AppointmentType;
  bloodType: string | null;
  outcome: DonationOutcome | null;
  mlCollected: number | null;
  notes: string | null;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
  checkedInAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface AppointmentRequest {
  type: AppointmentType;
  donorId: number;
  slotId: number;
  emergencyId?: number;
}

export interface HealthScreening {
  id: number;
  appointmentId: number;
  donorId: number;
  weight: number;
  bloodPressure: string;
  hemoglobin: number;
  screenedByStaffId: number;
  temperature: number;
  notes: string | null;
  eligible: boolean;
  screenedAt: string;
}

export interface CompletionRequest {
  outcome: string;
  mlCollected: number;
  notes?: string;
}

export interface ScreeningRequest {
  weight: number;
  bloodPressure?: string;
  hemoglobin: number;
  temperature: number;
  eligible: boolean;
  notes?: string;
}
