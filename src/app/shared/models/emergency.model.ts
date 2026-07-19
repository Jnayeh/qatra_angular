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
  centerName?: string;
}

export interface DonorResponseDTO {
  id: number;
  emergencyId: number;
  donorId: number;
  slotId: number | null;
  status: ResponseStatus;
  respondedAt: string;
}

export interface EmergencyCreateRequest {
  centerId: number;
  bloodType: string;
  unitsNeeded: number;
  urgency: EmergencyUrgency;
  matchRadius: number;
  contactPhone: string;
}

export interface EmergencyNotificationSummary {
  emergencyId: number;
  bloodType: string;
  urgency: EmergencyUrgency;
  status: EmergencyStatus;
  centerId: number;
  centerName: string;
  distanceKm: number | null;
  unitsNeeded: number;
  matchedDonorCount: number;
  responseStatus: ResponseStatus | null;
  respondedAt: string | null;
  createdAt: string;
  expiresAt: string;
}
