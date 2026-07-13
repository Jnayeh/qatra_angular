export type BloodType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'
  | 'UNKNOWN';

export type AvailabilityStatus =
  | 'AVAILABLE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'VACATION_MODE'
  | 'PERMANENTLY_RESTRICTED';

export type DonorStatus =
  | 'ACTIVE'
  | 'PENDING_DELETION'
  | 'INACTIVE'
  | 'DELETED';

export type NotificationFrequency =
  | 'IMMEDIATE'
  | 'DAILY_DIGEST'
  | 'EMERGENCY_ONLY'
  | 'DISABLED';

export interface QuietHours {
  start: string;
  end: string;
}

export interface NotificationPreferences {
  frequency: NotificationFrequency;
  quietHours: QuietHours | null;
  allowEmergencyNotifications: boolean;
  maxNotificationDistanceKm: number;
}

export interface DonorProfile {
  id: number;
  userId: number;
  bloodType: BloodType;
  bloodTypeVerified: boolean;
  profileComplete: boolean;
  allowEmergencyNotifications: boolean;
  consecutiveEmergencyDeclines: number;
  flaggedForManualReview: boolean;
  permanentlyRestricted: boolean;
  restrictionReason: string | null;
  reliabilityScore: number;
  totalDonations: number;
  availability: AvailabilityStatus;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  lastDonationDate: string | null;
  eligibleFromDate: string | null;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
  lastAcceptAt: string | null;
  deletedAt: string | null;
  deletionRequestedAt: string | null;
  nextEligibleDate: string | null;
  eligibilityStatus: string;
  impactSummary: ImpactSummary | null;
  displayName: string;
  phone: string;
  country: string | null;
}

export interface ImpactSummary {
  totalDonations: number;
  estimatedLivesSaved: number;
  milestones: Milestone[];
}

export interface Milestone {
  label: string;
  achieved: boolean;
  achievedAt: string | null;
}

export interface HealthQuestionnaire {
  id: number;
  donorId: number;
  hasChronicIllness: boolean;
  lastSurgeryAt: string | null;
  lastTravelAt: string | null;
  lastTattooOrPiercingAt: string | null;
  onMedication: boolean;
  medicalConditionsDetails: string | null;
  medicationDetails: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  donationDate: string;
  centerId: number;
  centerName: string;
  mlCollected: number;
  certificateUrl: string;
}

export interface EligibilityStatus {
  eligible: boolean;
  nextEligibleDate: string | null;
  reason: string | null;
}
