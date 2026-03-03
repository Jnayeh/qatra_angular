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
  appointmentsByDay: ChartDataPoint[];
  emergenciesByDay: ChartDataPoint[];
}

export interface ChartDataPoint {
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
