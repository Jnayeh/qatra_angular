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
  displayName: string;
  phone: string;
  bloodType: BloodType;
  bloodTypeVerified: boolean;
  availability: AvailabilityStatus;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  notificationPreferences: NotificationPreferences;
  lastDonationDate: string | null;
  eligibleFromDate: string | null;
  reliabilityScore: number;
  permanentlyRestricted: boolean;
  restrictionReason: string | null;
  profileComplete: boolean;
  flaggedForManualReview: boolean;
  consecutiveEmergencyDeclines: number;
  createdAt: string;
  updatedAt: string;
  lastAcceptAt: string | null;
  nextEligibleDate: string | null;
  eligibilityStatus: string;
  impactSummary: ImpactSummary | null;
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
  medicalConditionsDetails: string | null;
  onMedication: boolean;
  medicationDetails: string | null;
  recentSurgery: boolean;
  recentTravel: boolean;
  recentTattooOrPiercing: boolean;
  completedAt: string | null;
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
