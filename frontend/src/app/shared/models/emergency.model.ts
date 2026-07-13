export type EmergencyUrgency = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type EmergencyStatus =
  | 'OPEN'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

export type ResponseStatus =
  | 'ACCEPTED'
  | 'DECLINED';

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
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
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
  slotId: number | null;
  status: ResponseStatus;
  reason: string | null;
  respondedAt: string;
}

export interface MatchResult {
  id: number;
  emergencyId: number;
  centerId: number;
  donorId: number;
  radius: number;
  bloodType: string;
  status: MatchStatus;
  escalationLevel: number;
  createdAt: string;
  respondedAt: string | null;
}

export type MatchStatus = 'PENDING' | 'RESPONDED' | 'EXPIRED';

export interface EmergencyCreateRequest {
  centerId: number;
  bloodType: string;
  unitsNeeded: number;
  urgency: EmergencyUrgency;
  contactPhone: string;
  expiresAt: string;
}

export interface EmergencyRespondResult {
  emergencyId: number;
  status: ResponseStatus;
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
  responseStatus: ResponseStatus | null;
  respondedAt: string | null;
}
