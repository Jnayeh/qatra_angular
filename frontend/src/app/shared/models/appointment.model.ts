export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

export type AppointmentType = 'REGULAR' | 'EMERGENCY';

export interface Appointment {
  id: number;
  donorId: number;
  centerId: number;
  emergencyId: number | null;
  slotId: number;
  status: AppointmentStatus;
  appointmentType: AppointmentType;
  bloodType: string | null;
  mlCollected: number | null;
  notes: string | null;
  cancellationReason: string | null;
  qrCode: string;
  completedByStaffId: number | null;
  createdAt: string;
  checkedInAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface AppointmentRequest {
  centerId: number;
  slotId: number;
  appointmentType: AppointmentType;
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

export interface HealthScreening {
  id: number;
  appointmentId: number;
  donorId: number;
  screenedByStaffId: number;
  temperatureCelsius: number;
  hemoglobinGdL: number;
  bloodPressure: string;
  pulse: number;
  medicalCheckPassed: boolean;
  notes: string | null;
  screenedAt: string;
}

export interface CheckInResult {
  appointment: Appointment;
  donorProfile: DonorCheckInProfile;
  eligibility: EligibilityInfo;
}

interface DonorCheckInProfile {
  displayName: string;
  bloodType: string;
  bloodTypeVerified: boolean;
}

interface EligibilityInfo {
  eligible: boolean;
  nextEligibleDate: string | null;
}

export interface CompletionRequest {
  mlCollected: number;
  notes?: string;
  bloodType?: string;
}

export interface AppointmentTask {
  appointment: AppointmentSummary;
  donor: string;
  slotTime: string;
  status: AppointmentStatus;
}
