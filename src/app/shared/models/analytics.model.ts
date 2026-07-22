export interface AuditLogEntry {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string;
  timestamp: string;
}

export interface MetricsResponse {
  metricName: string;
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface CenterMetrics {
  totalAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  weekAppointments: number;
  monthAppointments: number;
  totalEmergencies: number;
  fulfilledEmergencies: number;
  todayEmergencies: number;
  weekEmergencies: number;
  monthEmergencies: number;
  totalDonorResponses: number;
  responseRate30d: number;
  totalMlCollected: number;
  activeEmergencies: number;
  appointmentsByDay: DayCount[];
  emergenciesByDay: DayCount[];
}

export interface DayCount {
  date: string;
  count: number;
}

export interface RestrictedUser {
  id: number;
  email: string;
  displayName: string;
  status: string;
  donorId: number;
  permanentlyRestricted: boolean;
  restrictionReason: string | null;
}

export interface SystemHealth {
  services: { name: string; status: string; details?: string }[];
  errorRates: { total: number; byEndpoint: Record<string, number> };
  apiUsage: { requestsPerMinute: number; topEndpoints: string[] };
  dbPoolStats: { active: number; idle: number; max: number };
}
