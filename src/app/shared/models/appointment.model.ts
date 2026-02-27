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
  outcome: DonationOutcome | null;
}

export interface AppointmentRequest {
  type: AppointmentType;
  donorId: number;
  slotId: number;
  emergencyId?: number;
}

export interface AppointmentResponse {
  id: number;
  qrCode: string;
  status: AppointmentStatus;
  slot: SlotSummary;
  center: CenterSummary;
}

export interface SlotSummary {
  id: number;
  startTime: string;
  endTime: string;
  availableCount: number;
}

export interface CenterSummary {
  id: number;
  name: string;
  city: string;
}

export interface AppointmentSummary {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  centerName: string;
  centerCity: string;
  status: AppointmentStatus;
  appointmentType: AppointmentType;
}

export interface DonorAppointmentView extends AppointmentSummary {
  qrCode: string;
  centerId: number;
  slotId: number;
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

export interface AppointmentTask {
  appointment: AppointmentSummary;
  donor: string;
  slotTime: string;
  status: AppointmentStatus;
}
