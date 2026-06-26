export type EmergencyUrgency = 'CRITICAL' | 'URGENT' | 'MODERATE';

export type EmergencyStatus =
  | 'OPEN'
  | 'NOTIFYING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED'
  | 'EXPIRED';

export type ResponseType =
  | 'WILLING'
  | 'DECLINED'
  | 'CONVERTED_TO_APPOINTMENT'
  | 'NO_RESPONSE';

export interface Emergency {
  id: number;
  centerId: number;
  createdByStaffId: number;
  bloodType: string;
  unitsNeeded: number;
  urgency: EmergencyUrgency;
  contactPhone: string;
  status: EmergencyStatus;
  matchRadius: number;
  escalationLevel: number;
  neededBy: string;
  createdAt: string;
  resolvedAt: string | null;
  resolvedByUserId: number | null;
}

export interface EmergencyDetail extends Emergency {
  distanceKm: number | null;
  matchedDonorCount: number;
  responseStats: ResponseStats;
  centerName: string;
}

export interface ResponseStats {
  willing: number;
  declined: number;
  noResponse: number;
  convertedToAppointment: number;
}

export interface EmergencyResponse {
  id: number;
  emergencyId: number;
  donorId: number;
  responseType: ResponseType;
  message: string | null;
  notifiedAt: string;
  respondedAt: string | null;
}

export interface MatchResult {
  id: number;
  emergencyId: number;
  centerId: number;
  donorId: number;
  radius: number;
  bloodType: string;
  escalationLevel: number;
  createdAt: string;
}

export interface EmergencyCreateRequest {
  centerId: number;
  bloodType: string;
  unitsNeeded: number;
  urgency: EmergencyUrgency;
  contactPhone: string;
  neededBy: string;
}

export interface EmergencyRespondRequest {
  responseType: 'WILLING' | 'DECLINED' | 'CONFIRMED';
  slotId?: number;
}

export interface EmergencyRespondResult {
  emergencyId: number;
  responseType: ResponseType;
  availableSlots?: SlotSummary[];
  appointmentId?: number;
  qrCode?: string;
}

export interface SlotSummary {
  slotId: number;
  startTime: string;
  endTime: string;
  availableCount: number;
}

export interface EmergencyNotificationSummary {
  emergencyId: number;
  bloodType: string;
  urgency: EmergencyUrgency;
  status: EmergencyStatus;
  centerName: string;
  distanceKm: number | null;
  responseType: ResponseType | null;
  respondedAt: string | null;
}
