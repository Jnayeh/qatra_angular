export interface AuditLogEntry {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface SystemDashboard {
  activeEmergencies: number;
  totalDonors: number;
  responseRate30d: number;
  topCenters: TopCenter[];
  recentAlerts: string[];
}

export interface TopCenter {
  id: number;
  name: string;
  donations: number;
}

export interface SystemHealth {
  services: ServiceHealth[];
  errorRates: ErrorRate;
  apiUsage: ApiUsage;
  dbPoolStats: DbPoolStats;
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
}

export interface ErrorRate {
  total: number;
  byEndpoint: Record<string, number>;
}

export interface ApiUsage {
  requestsPerMinute: number;
  topEndpoints: string[];
}

export interface DbPoolStats {
  active: number;
  idle: number;
  max: number;
}

export interface PlatformReport {
  period: { from: string; to: string };
  totalDonations: number;
  newDonors: number;
  activeCenters: number;
  emergencyResponseRate: number;
}

export interface DemandForecast {
  id: number;
  bloodType: string;
  region: string;
  forecastedUnits: number;
  forecastDate: string;
  validUntil: string;
  basedOnEmergencyCount: number;
  generatedAt: string;
}
