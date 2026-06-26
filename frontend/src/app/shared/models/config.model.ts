export interface SystemConfigEntry {
  key: string;
  value: Record<string, unknown>;
  description: string;
  isActive: boolean;
  updatedAt: string;
  updatedByUserId: number | null;
}

export interface FeatureFlag {
  id: number;
  featureName: string;
  enabled: boolean;
  rules: FeatureFlagRules | null;
  updatedAt: string;
}

export interface FeatureFlagRules {
  enabledForRoles: string[] | null;
  enabledForUserIds: number[] | null;
  rolloutPercentage: number | null;
}

export interface DataDeletionRequest {
  id: number;
  requestedByUserId: number;
  processedByUserId: number | null;
  status: DeletionStatus;
  reason: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export type DeletionStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
