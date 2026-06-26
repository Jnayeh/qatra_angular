import type { OperatingHours } from './operating-hours.model';

export type FacilityType =
  | 'HOSPITAL'
  | 'BLOOD_BANK'
  | 'MOBILE_UNIT'
  | 'COMMUNITY_CENTER'
  | 'DEDICATED_CENTER';

export type CenterStatus =
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED';

export interface BloodDonationCenter {
  id: number;
  createdByUserId: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  operatingHours: OperatingHours;
  totalCapacity: number;
  maxRegular: number;
  slotPeriod: number;
  facilityType: FacilityType;
  status: CenterStatus;
  createdAt: string;
}

export interface CenterSummary {
  id: number;
  name: string;
  city: string;
  country: string;
  facilityType: FacilityType;
  status: CenterStatus;
  distanceKm: number | null;
  isOperatingNow: boolean;
  availableSlots: number;
}

export interface CenterDetail extends BloodDonationCenter {
  isOperatingNow: boolean;
}

export interface Slot {
  id: number;
  centerId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxBookings: number;
  maxRegularBookings: number;
  bookedCount: number;
  regularBookedCount: number;
  isBlocked: boolean;
}

export interface ClosureRequest {
  date: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  reason: string;
}

export interface ClosureResult {
  blockedSlotCount: number;
  date: string;
  reason: string;
}
