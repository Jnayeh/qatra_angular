import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import type { User, UserDetail, UserSummary, TokenPair, RegisterResult, Role, UserStatus } from '../../shared/models/user.model';
import type { DonorProfile, HealthQuestionnaire, Certificate, ImpactSummary, NotificationPreferences, AvailabilityStatus, EligibilityStatus, BloodType } from '../../shared/models/donor.model';
import type { BloodDonationCenter, CenterSummary, CenterDetail, Slot, ClosureResult, FacilityType, CenterStatus } from '../../shared/models/center.model';
import type { Emergency, EmergencyDetail, EmergencyResponse, EmergencyCreateRequest, EmergencyRespondResult, MatchResult, ResponseStats, EmergencyUrgency, EmergencyStatus, SlotSummary, ResponseType } from '../../shared/models/emergency.model';
import type { Appointment, AppointmentRequest, AppointmentResponse, AppointmentSummary, HealthScreening, CheckInResult, CompletionRequest, AppointmentStatus, AppointmentType } from '../../shared/models/appointment.model';
import type { Notification, NotificationType, NotificationStatus, NotificationChannel } from '../../shared/models/notification.model';
import type { SystemConfigEntry, FeatureFlag, DataDeletionRequest, DeletionStatus } from '../../shared/models/config.model';
import type { AuditLogEntry, SystemDashboard, TopCenter, ServiceHealth, PlatformReport, DemandForecast } from '../../shared/models/analytics.model';
import type { ApiResponse, Page } from '../../shared/models/api-response.model';

function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}
import type { OperatingHours, DaySchedule } from '../../shared/models/operating-hours.model';

// ===== HELPERS =====

function b64encode(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

function b64decode(str: string): unknown {
  return JSON.parse(atob(str));
}

function createToken(payload: { id: number; email: string; roles: string[] }): string {
  return 'mock-jwt-' + b64encode(payload);
}

function parseToken(token: string): { id: number; email: string; roles: string[] } | null {
  try {
    const parts = token.split('mock-jwt-');
    if (parts.length !== 2) return null;
    return JSON.parse(atob(parts[1])) as { id: number; email: string; roles: string[] };
  } catch {
    return null;
  }
}

function getAuthUser(headers: Map<string, string>): { id: number; email: string; roles: string[] } | null {
  const auth = headers.get('authorization') || headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  return parseToken(auth.substring(7));
}

function nowISO(): string {
  return new Date().toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function daysFromNowDate(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function ok<T>(data: T): Observable<HttpResponse<unknown>> {
  const body: ApiResponse<T> = { success: true, data, timestamp: nowISO() };
  return of(new HttpResponse({ status: 200, body })).pipe(delay(200 + Math.random() * 400));
}

function fail(status: number, message: string): Observable<never> {
  const ms = 200 + Math.random() * 400;
  const body = { success: false, message, timestamp: nowISO() };
  return timer(ms).pipe(switchMap(() => throwError(() => new HttpErrorResponse({ status, statusText: message, error: body }))));
}

function unauthorized(): Observable<never> {
  return fail(401, 'Unauthorized');
}

function notFound(): Observable<never> {
  return fail(404, 'Not found');
}

function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalPages: Math.ceil(items.length / size) || 1,
    totalElements: items.length,
    size,
    number: page,
    first: page === 0,
    last: start + size >= items.length,
    empty: content.length === 0,
  };
}

function parseIntParam(val: string | null, defaultVal: number): number {
  if (val === null) return defaultVal;
  const n = parseInt(val, 10);
  return isNaN(n) ? defaultVal : n;
}

function parseFloatParam(val: string | null, defaultVal: number): number {
  if (val === null) return defaultVal;
  const n = parseFloat(val);
  return isNaN(n) ? defaultVal : n;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ===== MOCK DATA =====

let users: User[] = [
  { id: 1, email: 'donor@qatra.com', phone: '+212612345678', displayName: 'Ahmed Benali', status: 'ACTIVE', emailVerified: true, roles: ['DONOR'], createdAt: '2026-01-15T10:00:00.000Z', lastActiveAt: daysFromNow(-1) },
  { id: 2, email: 'staff@qatra.com', phone: '+212698765432', displayName: 'Fatima Zahra', status: 'ACTIVE', emailVerified: true, roles: ['CENTER_STAFF'], createdAt: '2026-02-01T10:00:00.000Z', lastActiveAt: daysFromNow(0) },
  { id: 3, email: 'admin@qatra.com', phone: '+212611111111', displayName: 'Admin User', status: 'ACTIVE', emailVerified: true, roles: ['SYSTEM_ADMIN'], createdAt: '2026-01-01T10:00:00.000Z', lastActiveAt: daysFromNow(0) },
];

let passwords: Record<number, string> = { 1: 'password123', 2: 'password123', 3: 'password123' };

function makeHours(weekday: DaySchedule, saturday: DaySchedule | null, sunday: DaySchedule | null): OperatingHours {
  return {
    monday: weekday, tuesday: weekday, wednesday: weekday, thursday: weekday, friday: weekday,
    saturday, sunday, closedWindows: [],
  };
}

const weekdayHours: DaySchedule = { open: '08:00', close: '18:00' };
const fridayHours: DaySchedule = { open: '08:00', close: '17:00' };
const saturdayHours: DaySchedule = { open: '09:00', close: '14:00' };
const mobileWeekday: DaySchedule = { open: '09:00', close: '17:00' };
const mobileFriday: DaySchedule = { open: '09:00', close: '16:00' };
const mobileSaturday: DaySchedule = { open: '10:00', close: '14:00' };

const defaultOH: OperatingHours = makeHours(weekdayHours, saturdayHours, null);
const marrakechOH: OperatingHours = { ...makeHours(weekdayHours, saturdayHours, null), friday: fridayHours };
const tangierOH: OperatingHours = makeHours(mobileWeekday, mobileSaturday, null);

let centers: BloodDonationCenter[] = [
  { id: 1, createdByUserId: 2, name: 'Centre de Don de Sang Casablanca', latitude: 33.5731, longitude: -7.5898, address: '12 Rue des Hôpitaux', city: 'Casablanca', country: 'Morocco', postalCode: '20000', phone: '+212522123456', email: 'casablanca@qatra.com', operatingHours: deepClone(defaultOH), totalCapacity: 100, maxRegular: 80, slotPeriod: 60, facilityType: 'DEDICATED_CENTER', status: 'ACTIVE', createdAt: '2026-01-20T08:00:00.000Z' },
  { id: 2, createdByUserId: 2, name: 'Banque de Sang Rabat', latitude: 34.0209, longitude: -6.8416, address: '45 Avenue Mohammed V', city: 'Rabat', country: 'Morocco', postalCode: '10000', phone: '+212537654321', email: 'rabat@qatra.com', operatingHours: deepClone(defaultOH), totalCapacity: 80, maxRegular: 60, slotPeriod: 60, facilityType: 'BLOOD_BANK', status: 'ACTIVE', createdAt: '2026-02-10T08:00:00.000Z' },
  { id: 3, createdByUserId: 2, name: "Hôpital Ibn Sina Marrakech", latitude: 31.6295, longitude: -7.9811, address: "Rue de l'Hôpital", city: 'Marrakech', country: 'Morocco', postalCode: '40000', phone: '+212524987654', email: 'marrakech@qatra.com', operatingHours: deepClone(marrakechOH), totalCapacity: 60, maxRegular: 50, slotPeriod: 60, facilityType: 'HOSPITAL', status: 'ACTIVE', createdAt: '2026-03-05T08:00:00.000Z' },
  { id: 4, createdByUserId: 3, name: 'Unité Mobile Tanger', latitude: 35.7673, longitude: -5.7998, address: 'Place du 9 Avril', city: 'Tangier', country: 'Morocco', postalCode: '90000', phone: '+212539876543', email: 'tanger@qatra.com', operatingHours: deepClone(tangierOH), totalCapacity: 40, maxRegular: 30, slotPeriod: 60, facilityType: 'MOBILE_UNIT', status: 'PENDING_APPROVAL', createdAt: '2026-04-01T08:00:00.000Z' },
];

let slots: Slot[] = [];
(function generateInitialSlots(): void {
  let id = 1;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const timeBlocks = [
    { start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' }, { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
  ];
  for (const c of centers) {
    for (let d = 0; d < 14; d++) {
      const date = new Date(start.getTime() + d * 86400000);
      if (date.getDay() === 0) continue;
      const dateStr = date.toISOString().split('T')[0];
      const dailyTimes = timeBlocks.slice(0, 3 + (d % 3));
      for (const t of dailyTimes) {
        slots.push({
          id: id++, centerId: c.id, date: dateStr, startTime: t.start, endTime: t.end,
          maxBookings: 5, maxRegularBookings: 4,
          bookedCount: Math.floor(Math.random() * 3), regularBookedCount: Math.floor(Math.random() * 2),
          isBlocked: false,
        });
      }
    }
  }
})();

let donorProfiles: DonorProfile[] = [
  {
    id: 1, userId: 1, displayName: 'Ahmed Benali', phone: '+212612345678',
    bloodType: 'O_POSITIVE', bloodTypeVerified: true, availability: 'AVAILABLE',
    latitude: 33.5731, longitude: -7.5898, city: 'Casablanca', country: 'Morocco',
    notificationPreferences: { frequency: 'IMMEDIATE', quietHours: null, allowEmergencyNotifications: true, maxNotificationDistanceKm: 50 },
    lastDonationDate: daysFromNow(-60), eligibleFromDate: daysFromNow(-30),
    reliabilityScore: 85, permanentlyRestricted: false, restrictionReason: null,
    profileComplete: true, flaggedForManualReview: false, consecutiveEmergencyDeclines: 0,
    createdAt: '2026-01-15T10:00:00.000Z', updatedAt: daysFromNow(-1),
    lastAcceptAt: daysFromNow(-60), nextEligibleDate: daysFromNow(30),
    eligibilityStatus: 'ELIGIBLE',
    impactSummary: { totalDonations: 8, estimatedLivesSaved: 24, milestones: [
      { label: 'First Donation', achieved: true, achievedAt: '2025-06-15T10:00:00.000Z' },
      { label: '5 Donations', achieved: true, achievedAt: '2026-03-10T10:00:00.000Z' },
      { label: '10 Donations', achieved: false, achievedAt: null },
      { label: 'Silver Donor', achieved: false, achievedAt: null },
    ]},
  },
];

let appointments: Appointment[] = [
  { id: 1, donorId: 1, centerId: 1, emergencyId: null, slotId: 1, status: 'SCHEDULED', appointmentType: 'REGULAR', bloodType: null, mlCollected: null, notes: null, cancellationReason: null, qrCode: 'QATRA-APPT-001', completedByStaffId: null, createdAt: daysFromNow(-5), checkedInAt: null, completedAt: null, cancelledAt: null },
  { id: 2, donorId: 1, centerId: 1, emergencyId: null, slotId: 5, status: 'COMPLETED', appointmentType: 'REGULAR', bloodType: 'O_POSITIVE', mlCollected: 450, notes: 'Routine donation', cancellationReason: null, qrCode: 'QATRA-APPT-002', completedByStaffId: 2, createdAt: daysFromNow(-60), checkedInAt: daysFromNow(-60), completedAt: daysFromNow(-60), cancelledAt: null },
  { id: 3, donorId: 1, centerId: 2, emergencyId: null, slotId: 10, status: 'CANCELLED', appointmentType: 'REGULAR', bloodType: null, mlCollected: null, notes: null, cancellationReason: 'Personal reasons', qrCode: 'QATRA-APPT-003', completedByStaffId: null, createdAt: daysFromNow(-20), checkedInAt: null, completedAt: null, cancelledAt: daysFromNow(-19) },
];

let emergencies: Emergency[] = [
  { id: 1, centerId: 1, createdByStaffId: 2, bloodType: 'O_NEGATIVE', unitsNeeded: 5, urgency: 'CRITICAL', contactPhone: '+212522123456', status: 'OPEN', matchRadius: 30, escalationLevel: 1, neededBy: daysFromNow(2), createdAt: daysFromNow(-1), resolvedAt: null, resolvedByUserId: null },
  { id: 2, centerId: 2, createdByStaffId: 2, bloodType: 'A_POSITIVE', unitsNeeded: 3, urgency: 'URGENT', contactPhone: '+212537654321', status: 'IN_PROGRESS', matchRadius: 20, escalationLevel: 1, neededBy: daysFromNow(5), createdAt: daysFromNow(-3), resolvedAt: null, resolvedByUserId: null },
];

let emergencyResponses: Map<number, EmergencyResponse[]> = new Map([
  [1, [{ id: 1, emergencyId: 1, donorId: 1, responseType: 'WILLING', message: 'On my way!', notifiedAt: daysFromNow(-1), respondedAt: daysFromNow(-1) }]],
  [2, []],
]);

let notifications: Notification[] = [
  { id: 1, userId: 1, emergencyId: 1, appointmentId: null, type: 'EMERGENCY_ALERT', title: 'Urgent: O- Blood Needed', body: 'Centre de Don de Sang Casablanca urgently needs O- blood.', data: null, channel: 'IN_APP', status: 'DELIVERED', createdAt: daysFromNow(-1), sentAt: daysFromNow(-1), readAt: null },
  { id: 2, userId: 1, emergencyId: null, appointmentId: 1, type: 'APPOINTMENT_REMINDER', title: 'Upcoming Appointment', body: 'Reminder: You have a blood donation appointment tomorrow.', data: null, channel: 'IN_APP', status: 'SENT', createdAt: daysFromNow(-1), sentAt: daysFromNow(-1), readAt: null },
  { id: 3, userId: 1, emergencyId: null, appointmentId: null, type: 'ELIGIBILITY_REMINDER', title: "You're Eligible to Donate", body: 'Your eligibility period has reset.', data: null, channel: 'IN_APP', status: 'READ', createdAt: daysFromNow(-30), sentAt: daysFromNow(-30), readAt: daysFromNow(-29) },
  { id: 4, userId: 1, emergencyId: null, appointmentId: null, type: 'PROFILE_COMPLETION', title: 'Complete Your Profile', body: 'Please complete your donor profile.', data: null, channel: 'EMAIL', status: 'DELIVERED', createdAt: daysFromNow(-10), sentAt: daysFromNow(-10), readAt: null },
  { id: 5, userId: 1, emergencyId: null, appointmentId: null, type: 'GENERAL', title: 'Welcome to Qatra', body: 'Thank you for joining Qatra!', data: null, channel: 'IN_APP', status: 'READ', createdAt: daysFromNow(-90), sentAt: daysFromNow(-90), readAt: daysFromNow(-89) },
];

let systemConfig: SystemConfigEntry[] = [
  { key: 'maxBookingLeadDays', value: { value: 90 }, description: 'Maximum days in advance for booking appointments', isActive: true, updatedAt: '2026-01-01T00:00:00.000Z', updatedByUserId: 3 },
  { key: 'minDonationIntervalDays', value: { value: 60 }, description: 'Minimum interval between donations in days', isActive: true, updatedAt: '2026-01-01T00:00:00.000Z', updatedByUserId: 3 },
  { key: 'emergencyNotificationRadiusKm', value: { value: 50 }, description: 'Default radius for emergency notifications', isActive: true, updatedAt: '2026-01-01T00:00:00.000Z', updatedByUserId: 3 },
  { key: 'maxEmergencyUnits', value: { value: 20 }, description: 'Maximum blood units per emergency request', isActive: true, updatedAt: '2026-01-01T00:00:00.000Z', updatedByUserId: 3 },
  { key: 'autoResolveEmergencyHours', value: { value: 48 }, description: 'Hours after which an OPEN emergency auto-resolves', isActive: false, updatedAt: '2026-01-01T00:00:00.000Z', updatedByUserId: 3 },
];

let featureFlags: FeatureFlag[] = [
  { id: 1, featureName: 'emergencyMatching', enabled: true, rules: { enabledForRoles: null, enabledForUserIds: null, rolloutPercentage: 100 }, updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, featureName: 'autoScheduling', enabled: true, rules: null, updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 3, featureName: 'notifications', enabled: true, rules: null, updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 4, featureName: 'analytics', enabled: true, rules: { enabledForRoles: ['SYSTEM_ADMIN'], enabledForUserIds: null, rolloutPercentage: null }, updatedAt: '2026-01-01T00:00:00.000Z' },
];

let auditLogs: AuditLogEntry[] = [
  { id: 1, userId: 3, action: 'LOGIN', entityType: 'USER', entityId: 3, oldValue: null, newValue: null, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', timestamp: daysFromNow(0) },
  { id: 2, userId: 1, action: 'LOGIN', entityType: 'USER', entityId: 1, oldValue: null, newValue: null, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', timestamp: daysFromNow(-1) },
  { id: 3, userId: 2, action: 'CREATE_EMERGENCY', entityType: 'EMERGENCY', entityId: 1, oldValue: null, newValue: { bloodType: 'O_NEGATIVE', unitsNeeded: 5 }, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', timestamp: daysFromNow(-1) },
  { id: 4, userId: 1, action: 'BOOK_APPOINTMENT', entityType: 'APPOINTMENT', entityId: 1, oldValue: null, newValue: { centerId: 1, slotId: 1 }, ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', timestamp: daysFromNow(-5) },
];

let deletionRequests: DataDeletionRequest[] = [
  { id: 1, requestedByUserId: 1, processedByUserId: null, status: 'PENDING', reason: 'No longer wish to participate', requestedAt: daysFromNow(-2), processedAt: null },
];

let healthScreenings: HealthScreening[] = [
  { id: 1, appointmentId: 2, donorId: 1, screenedByStaffId: 2, temperatureCelsius: 36.8, hemoglobinGdL: 14.5, bloodPressure: '120/80', pulse: 72, medicalCheckPassed: true, notes: 'All good', screenedAt: daysFromNow(-60) },
];

let healthQuestionnaires: Map<number, HealthQuestionnaire> = new Map([
  [1, { id: 1, donorId: 1, hasChronicIllness: false, medicalConditionsDetails: null, onMedication: false, medicationDetails: null, recentSurgery: false, recentTravel: true, recentTattooOrPiercing: false, completedAt: daysFromNow(-90), updatedAt: daysFromNow(-90) }],
]);

let certificates: Map<number, Certificate[]> = new Map([
  [1, [
    { donationDate: daysFromNow(-60), centerId: 1, centerName: 'Centre de Don de Sang Casablanca', mlCollected: 450, certificateUrl: '/certificates/001.pdf' },
    { donationDate: daysFromNow(-120), centerId: 1, centerName: 'Centre de Don de Sang Casablanca', mlCollected: 450, certificateUrl: '/certificates/002.pdf' },
  ]],
]);

let impactSummaries: Map<number, ImpactSummary> = new Map([
  [1, { totalDonations: 8, estimatedLivesSaved: 24, milestones: [
    { label: 'First Donation', achieved: true, achievedAt: '2025-06-15T10:00:00.000Z' },
    { label: '5 Donations', achieved: true, achievedAt: '2026-03-10T10:00:00.000Z' },
    { label: '10 Donations', achieved: false, achievedAt: null },
    { label: 'Silver Donor', achieved: false, achievedAt: null },
  ]}],
]);

let autoIncrement = { appointments: 4, emergencies: 3, notifications: 6, users: 4, centers: 5, emergencyResponses: 2, healthScreenings: 2, auditLogs: 5, deletionRequests: 2, };

export const mockDb = {
  users, passwords, centers, slots, donorProfiles, appointments, emergencies,
  emergencyResponses, notifications, systemConfig, featureFlags, auditLogs,
  deletionRequests, healthScreenings, healthQuestionnaires, certificates,
  impactSummaries, autoIncrement,
};

// ===== AUTH HANDLERS =====

function handleAuth(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  const sub = segments.join('/');

  if (method === 'POST' && sub === 'login') {
    const { email, password } = body ?? {};
    const user = users.find(u => u.email === email && passwords[u.id] === password);
    if (!user) return fail(401, 'Invalid email or password');
    if (user.status === 'DELETED') return fail(401, 'Account deleted');
    user.lastActiveAt = nowISO();
    const td = { id: user.id, email: user.email, roles: user.roles };
    const data: TokenPair = { accessToken: createToken(td), refreshToken: createToken({ ...td, id: user.id + 1000 }), expiresIn: 3600 };
    return ok(data);
  }

  if (method === 'POST' && sub === 'register') {
    const { email, password, displayName, phone } = body ?? {};
    if (!email || !password || !displayName) return fail(400, 'Missing required fields');
    if (users.find(u => u.email === email)) return fail(409, 'Email already registered');
    const id = autoIncrement.users++;
    const nu: User = { id, email, phone: phone ?? '', displayName, status: 'PENDING_VERIFICATION', emailVerified: false, roles: ['DONOR'], createdAt: nowISO(), lastActiveAt: null };
    users.push(nu);
    passwords[id] = password;
    donorProfiles.push({
      id, userId: id, displayName, phone: phone ?? '',
      bloodType: 'UNKNOWN', bloodTypeVerified: false, availability: 'AVAILABLE',
      latitude: null, longitude: null, city: null, country: null,
      notificationPreferences: { frequency: 'IMMEDIATE', quietHours: null, allowEmergencyNotifications: true, maxNotificationDistanceKm: 50 },
      lastDonationDate: null, eligibleFromDate: null,
      reliabilityScore: 0, permanentlyRestricted: false, restrictionReason: null,
      profileComplete: false, flaggedForManualReview: false, consecutiveEmergencyDeclines: 0,
      createdAt: nowISO(), updatedAt: nowISO(),
      lastAcceptAt: null, nextEligibleDate: null, eligibilityStatus: 'UNKNOWN', impactSummary: null,
    });
    return ok<RegisterResult>({ userId: id, email, emailVerificationSent: true });
  }

  if (method === 'POST' && sub === 'refresh') {
    const { refreshToken } = body ?? {};
    if (!refreshToken) return fail(401, 'Invalid refresh token');
    const payload = parseToken(refreshToken);
    if (!payload) return fail(401, 'Invalid refresh token');
    const user = users.find(u => u.id === (payload.id >= 1000 ? payload.id - 1000 : payload.id));
    if (!user) return fail(401, 'User not found');
    const td = { id: user.id, email: user.email, roles: user.roles };
    const data: TokenPair = { accessToken: createToken(td), refreshToken: createToken({ ...td, id: user.id + 1000 }), expiresIn: 3600 };
    return ok(data);
  }

  if (method === 'POST' && sub === 'logout') return ok({ message: 'Logged out successfully' });

  if (method === 'POST' && sub === 'forgot-password') {
    return ok({ message: 'If the email exists, a reset link has been sent' });
  }

  if (method === 'POST' && sub === 'reset-password') {
    const { token, newPassword } = body ?? {};
    if (!token || !newPassword) return fail(400, 'Token and new password are required');
    return ok({ message: 'Password reset successfully' });
  }

  if (method === 'POST' && sub === 'verify-email') {
    const { token } = body ?? {};
    if (!token) return fail(400, 'Token is required');
    const u = users.find(x => x.status === 'PENDING_VERIFICATION');
    if (u) { u.status = 'ACTIVE'; u.emailVerified = true; }
    return ok({ message: 'Email verified successfully' });
  }

  return notFound();
}

// ===== USER HANDLERS =====

function handleUsers(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();

  if (method === 'GET' && segments.length === 1 && segments[0] === 'me') {
    const user = users.find(u => u.id === userId);
    if (!user) return notFound();
    return ok(user);
  }

  if (method === 'GET' && segments.length === 0) {
    let filtered = [...users];
    const role = params.get('role');
    const status = params.get('status');
    if (role) filtered = filtered.filter(u => u.roles.includes(role as Role));
    if (status) filtered = filtered.filter(u => u.status === status);
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    return ok(paginate(filtered.map(u => { const { lastActiveAt, ...rest } = u; return rest as UserSummary; }), page, size));
  }

  if (method === 'GET' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const user = users.find(u => u.id === id);
    if (!user) return notFound();
    return ok<UserDetail>({ ...user, deletedAt: user.status === 'DELETED' ? daysFromNow(0) : null });
  }

  if (method === 'PUT' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const user = users.find(u => u.id === id);
    if (!user) return notFound();
    const { displayName, phone } = body ?? {};
    if (displayName) user.displayName = displayName;
    if (phone !== undefined) user.phone = phone;
    if (displayName || phone !== undefined) {
      const dp = donorProfiles.find(p => p.userId === id);
      if (dp) { dp.updatedAt = nowISO(); }
    }
    return ok(user);
  }

  if (method === 'PUT' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'status') {
    const id = parseInt(segments[0], 10);
    const u = users.find(x => x.id === id);
    if (!u) return notFound();
    const { status } = body ?? {};
    if (status) u.status = status as UserStatus;
    return ok(u);
  }

  if (method === 'DELETE' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const u = users.find(x => x.id === id);
    if (!u) return notFound();
    u.status = 'DELETED';
    deletionRequests.push({
      id: autoIncrement.deletionRequests++,
      requestedByUserId: id, processedByUserId: null,
      status: 'PENDING', reason: 'User requested deletion',
      requestedAt: nowISO(), processedAt: null,
    });
    return ok({ message: 'User deleted successfully' });
  }

  return notFound();
}

// ===== DONOR HANDLERS =====

function handleDonors(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();

  const profile = donorProfiles.find(p => p.userId === userId);
  const user = users.find(u => u.id === userId);

  if (method === 'GET' && segments.length === 1 && segments[0] === 'me') {
    if (!profile) return notFound();
    return ok({ ...profile, displayName: user?.displayName ?? profile.displayName, phone: user?.phone ?? profile.phone });
  }

  if (method === 'PUT' && segments.length === 1 && segments[0] === 'me') {
    if (!profile) return notFound();
    const { displayName, phone } = body ?? {};
    if (displayName && user) user.displayName = displayName;
    if (phone !== undefined && user) user.phone = phone;
    profile.updatedAt = nowISO();
    return ok({ ...profile, displayName: user?.displayName ?? profile.displayName, phone: user?.phone ?? profile.phone });
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'blood-type') {
    if (!profile) return notFound();
    const { bloodType } = body ?? {};
    if (bloodType) { profile.bloodType = bloodType as BloodType; profile.bloodTypeVerified = false; profile.updatedAt = nowISO(); }
    return ok(profile);
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'location') {
    if (!profile) return notFound();
    const { latitude, longitude, city, country } = body ?? {};
    if (latitude !== undefined) profile.latitude = latitude;
    if (longitude !== undefined) profile.longitude = longitude;
    if (city !== undefined) profile.city = city;
    if (country !== undefined) profile.country = country;
    profile.updatedAt = nowISO();
    return ok(profile);
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'location') {
    if (!profile) return notFound();
    return ok({ latitude: profile.latitude, longitude: profile.longitude, city: profile.city, country: profile.country });
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'availability') {
    if (!profile) return notFound();
    const { availability } = body ?? {};
    if (availability) { profile.availability = availability as AvailabilityStatus; profile.updatedAt = nowISO(); }
    return ok(profile);
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'health-questionnaire') {
    const q = healthQuestionnaires.get(userId);
    return ok(q ?? null);
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'health-questionnaire') {
    const existing = healthQuestionnaires.get(userId);
    if (existing) {
      Object.assign(existing, body ?? {}, { donorId: userId, updatedAt: nowISO() });
      if (!existing.completedAt) existing.completedAt = nowISO();
    } else {
      const b = body ?? {};
      healthQuestionnaires.set(userId, {
        id: userId, donorId: userId,
        hasChronicIllness: b.hasChronicIllness ?? false, medicalConditionsDetails: b.medicalConditionsDetails ?? null,
        onMedication: b.onMedication ?? false, medicationDetails: b.medicationDetails ?? null,
        recentSurgery: b.recentSurgery ?? false, recentTravel: b.recentTravel ?? false,
        recentTattooOrPiercing: b.recentTattooOrPiercing ?? false,
        completedAt: nowISO(), updatedAt: nowISO(),
      });
    }
    return ok(healthQuestionnaires.get(userId)!);
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'impact') {
    return ok(impactSummaries.get(userId) ?? { totalDonations: 0, estimatedLivesSaved: 0, milestones: [] });
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'certificates') {
    return ok(certificates.get(userId) ?? []);
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'notification-preferences') {
    if (!profile) return notFound();
    return ok(profile.notificationPreferences);
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'notification-preferences') {
    if (!profile) return notFound();
    const prefs = (body ?? {}) as Partial<NotificationPreferences>;
    Object.assign(profile.notificationPreferences, prefs);
    profile.updatedAt = nowISO();
    return ok(profile.notificationPreferences);
  }

  if (method === 'GET' && segments.length === 2 && segments[0] === 'me' && segments[1] === 'eligibility') {
    if (!profile) return notFound();
    const isEligible = profile.eligibilityStatus === 'ELIGIBLE';
    return ok<EligibilityStatus>({ eligible: isEligible, nextEligibleDate: profile.nextEligibleDate, reason: isEligible ? null : 'Not yet eligible' });
  }

  return notFound();
}

// ===== CENTER HANDLERS =====

function handleCenters(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();
  const isStaffOrAdmin = users.some(u => u.id === userId && (u.roles.includes('CENTER_STAFF') || u.roles.includes('SYSTEM_ADMIN') || u.roles.includes('CENTER_ADMIN')));

  if (method === 'GET' && segments.length === 0) {
    let filtered = [...centers];
    const city = params.get('city');
    const facilityType = params.get('facilityType');
    const status = params.get('status');
    if (city) filtered = filtered.filter(c => c.city.toLowerCase().includes(city.toLowerCase()));
    if (facilityType) filtered = filtered.filter(c => c.facilityType === facilityType);
    if (status) filtered = filtered.filter(c => c.status === status);
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    const summaries: CenterSummary[] = filtered.map(c => ({
      id: c.id, name: c.name, city: c.city, country: c.country,
      facilityType: c.facilityType, status: c.status,
      distanceKm: null, isOperatingNow: true, availableSlots: slots.filter(s => s.centerId === c.id && !s.isBlocked && new Date(s.date) >= new Date()).length,
    }));
    return ok(paginate(summaries, page, size));
  }

  if (method === 'GET' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const c = centers.find(x => x.id === id);
    if (!c) return notFound();
    return ok<CenterDetail>({ ...c, isOperatingNow: true });
  }

  if (method === 'POST' && segments.length === 0) {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const b = body ?? {};
    const id = autoIncrement.centers++;
    const nc: BloodDonationCenter = {
      id, createdByUserId: userId, name: b.name ?? 'New Center',
      latitude: b.latitude ?? 0, longitude: b.longitude ?? 0,
      address: b.address ?? '', city: b.city ?? '', country: b.country ?? 'Morocco',
      postalCode: b.postalCode ?? '', phone: b.phone ?? '', email: b.email ?? '',
      operatingHours: deepClone(defaultOH), totalCapacity: b.totalCapacity ?? 50,
      maxRegular: b.maxRegular ?? 40, slotPeriod: b.slotPeriod ?? 60,
      facilityType: b.facilityType ?? 'COMMUNITY_CENTER', status: 'PENDING_APPROVAL',
      createdAt: nowISO(),
    };
    centers.push(nc);
    return ok(nc);
  }

  if (method === 'PUT' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const id = parseInt(segments[0], 10);
    const c = centers.find(x => x.id === id);
    if (!c) return notFound();
    const b = body ?? {};
    if (b.name) c.name = b.name;
    if (b.address) c.address = b.address;
    if (b.phone) c.phone = b.phone;
    if (b.email) c.email = b.email;
    if (b.latitude !== undefined) c.latitude = b.latitude;
    if (b.longitude !== undefined) c.longitude = b.longitude;
    if (b.city) c.city = b.city;
    if (b.totalCapacity !== undefined) c.totalCapacity = b.totalCapacity;
    return ok(c);
  }

  if (method === 'PUT' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'status') {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const id = parseInt(segments[0], 10);
    const c = centers.find(x => x.id === id);
    if (!c) return notFound();
    const { status } = body ?? {};
    if (status) c.status = status as CenterStatus;
    return ok(c);
  }

  if (method === 'GET' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'slots') {
    const id = parseInt(segments[0], 10);
    const date = params.get('date');
    let result = slots.filter(s => s.centerId === id);
    if (date) result = result.filter(s => s.date === date);
    return ok(result);
  }

  if (method === 'GET' && segments.length === 3 && /^\d+$/.test(segments[0]) && segments[1] === 'slots' && segments[2] === 'available') {
    const id = parseInt(segments[0], 10);
    const date = params.get('date');
    let result = slots.filter(s => s.centerId === id && !s.isBlocked && s.bookedCount < s.maxBookings);
    if (date) result = result.filter(s => s.date === date);
    return ok(result);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'closure') {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const id = parseInt(segments[0], 10);
    const b = body ?? {};
    const date = b.date;
    if (!date) return fail(400, 'Date is required');
    let count = 0;
    slots.forEach(s => {
      if (s.centerId === id && s.date === date) {
        if (b.allDay || (!b.startTime && !b.endTime)) {
          s.isBlocked = true; count++;
        } else if (b.startTime && b.endTime && s.startTime >= b.startTime && s.endTime <= b.endTime) {
          s.isBlocked = true; count++;
        }
      }
    });
    return ok<ClosureResult>({ blockedSlotCount: count, date, reason: b.reason ?? '' });
  }

  return notFound();
}

// ===== EMERGENCY HANDLERS =====

function handleEmergencies(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();
  const user = users.find(u => u.id === userId);
  const isStaff = user?.roles.includes('CENTER_STAFF') || user?.roles.includes('CENTER_ADMIN') || user?.roles.includes('SYSTEM_ADMIN');

  if (method === 'GET' && segments.length === 1 && segments[0] === 'my-responses') {
    const allResponses: EmergencyResponse[] = [];
    for (const [, responses] of emergencyResponses) {
      allResponses.push(...responses.filter(r => r.donorId === userId));
    }
    return ok(allResponses);
  }

  if (method === 'GET' && segments.length === 0) {
    let filtered = [...emergencies];
    const status = params.get('status');
    const bloodType = params.get('bloodType');
    const urgency = params.get('urgency');
    if (status) filtered = filtered.filter(e => e.status === status);
    if (bloodType) filtered = filtered.filter(e => e.bloodType === bloodType);
    if (urgency) filtered = filtered.filter(e => e.urgency === urgency);
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    const enriched = filtered.map(e => {
      const c = centers.find(x => x.id === e.centerId);
      return {
        ...e,
        centerName: c?.name ?? 'Unknown Center',
        distanceKm: null,
        matchedDonorCount: (emergencyResponses.get(e.id) ?? []).length,
        responseStats: emergencyResponseStats(e.id),
      } as EmergencyDetail;
    });
    return ok(paginate(enriched, page, size));
  }

  if (method === 'GET' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const e = emergencies.find(x => x.id === id);
    if (!e) return notFound();
    const c = centers.find(x => x.id === e.centerId);
    return ok<EmergencyDetail>({
      ...e,
      centerName: c?.name ?? 'Unknown Center',
      distanceKm: null,
      matchedDonorCount: (emergencyResponses.get(e.id) ?? []).length,
      responseStats: emergencyResponseStats(e.id),
    });
  }

  if (method === 'POST' && segments.length === 0) {
    if (!isStaff) return fail(403, 'Forbidden');
    const b = body as EmergencyCreateRequest ?? {} as EmergencyCreateRequest;
    const id = autoIncrement.emergencies++;
    const ne: Emergency = {
      id, centerId: b.centerId, createdByStaffId: userId,
      bloodType: b.bloodType ?? 'O_NEGATIVE', unitsNeeded: b.unitsNeeded ?? 1,
      urgency: b.urgency ?? 'MODERATE', contactPhone: b.contactPhone ?? '',
      status: 'OPEN', matchRadius: 30, escalationLevel: 1, neededBy: b.neededBy ?? daysFromNow(7),
      createdAt: nowISO(), resolvedAt: null, resolvedByUserId: null,
    };
    emergencies.push(ne);
    emergencyResponses.set(ne.id, []);
    return ok(ne);
  }

  if (method === 'PUT' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'status') {
    if (!isStaff) return fail(403, 'Forbidden');
    const id = parseInt(segments[0], 10);
    const e = emergencies.find(x => x.id === id);
    if (!e) return notFound();
    const { status, resolvedByUserId } = body ?? {};
    if (status) e.status = status as EmergencyStatus;
    if (status === 'RESOLVED' || status === 'CANCELLED') {
      e.resolvedAt = nowISO();
      e.resolvedByUserId = resolvedByUserId ?? userId;
    }
    return ok(e);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'respond') {
    const eid = parseInt(segments[0], 10);
    const e = emergencies.find(x => x.id === eid);
    if (!e) return notFound();
    const b = (body ?? {}) as { responseType: 'WILLING' | 'DECLINED' | 'CONFIRMED'; slotId?: number };
    const responses = emergencyResponses.get(eid) ?? [];
    const existingResponse = responses.find(r => r.donorId === userId);
    if (existingResponse) return fail(409, 'Already responded');

    const responseType: ResponseType = b.responseType === 'CONFIRMED' ? 'CONVERTED_TO_APPOINTMENT' : b.responseType;
    const er: EmergencyResponse = {
      id: autoIncrement.emergencyResponses++,
      emergencyId: eid, donorId: userId,
      responseType, message: null,
      notifiedAt: nowISO(), respondedAt: nowISO(),
    };
    responses.push(er);
    emergencyResponses.set(eid, responses);

    let appointmentId: number | undefined;
    let qrCode: string | undefined;
    if (b.slotId && b.responseType !== 'DECLINED') {
      const slot = slots.find(s => s.id === b.slotId);
      if (slot) {
        const aid = autoIncrement.appointments++;
        qrCode = `QATRA-APPT-${String(aid).padStart(3, '0')}`;
        const apt: Appointment = {
          id: aid, donorId: userId, centerId: e.centerId, emergencyId: eid,
          slotId: b.slotId, status: 'CONFIRMED', appointmentType: 'EMERGENCY',
          bloodType: e.bloodType, mlCollected: null, notes: null,
          cancellationReason: null, qrCode, completedByStaffId: null,
          createdAt: nowISO(), checkedInAt: null, completedAt: null, cancelledAt: null,
        };
        appointments.push(apt);
        slot.bookedCount++;
        appointmentId = aid;
      }
    }

    const result: EmergencyRespondResult = {
      emergencyId: eid,
      responseType: er.responseType,
      appointmentId,
      qrCode,
    };
    if (b.responseType === 'WILLING' || b.responseType === 'CONFIRMED') {
      const centerSlots = slots.filter(s => s.centerId === e.centerId && !s.isBlocked && s.date >= todayDate() && s.bookedCount < s.maxBookings);
      result.availableSlots = centerSlots.map(s => ({ slotId: s.id, startTime: s.startTime, endTime: s.endTime, availableCount: s.maxBookings - s.bookedCount }));
    }
    return ok(result);
  }

  if (method === 'GET' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'matches') {
    const eid = parseInt(segments[0], 10);
    const e = emergencies.find(x => x.id === eid);
    if (!e) return notFound();
    const matches: MatchResult[] = [];
    for (const dp of donorProfiles) {
      if (dp.bloodType === e.bloodType || dp.bloodType === 'O_NEGATIVE') {
        matches.push({
          id: matches.length + 1, emergencyId: eid, centerId: e.centerId,
          donorId: dp.userId, radius: e.matchRadius,
          bloodType: dp.bloodType, escalationLevel: e.escalationLevel,
          createdAt: nowISO(),
        });
      }
    }
    return ok(matches);
  }

  return notFound();
}

function emergencyResponseStats(emergencyId: number): ResponseStats {
  const responses = emergencyResponses.get(emergencyId) ?? [];
  return {
    willing: responses.filter(r => r.responseType === 'WILLING').length,
    declined: responses.filter(r => r.responseType === 'DECLINED').length,
    noResponse: 0,
    convertedToAppointment: responses.filter(r => r.responseType === 'CONVERTED_TO_APPOINTMENT').length,
  };
}

// ===== APPOINTMENT HANDLERS =====

function handleAppointments(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();
  const user = users.find(u => u.id === userId);
  const isStaffOrAdmin = user?.roles.includes('CENTER_STAFF') || user?.roles.includes('CENTER_ADMIN') || user?.roles.includes('SYSTEM_ADMIN');

  if (method === 'GET' && segments.length === 1 && segments[0] === 'my') {
    const myAppts = appointments.filter(a => a.donorId === userId);
    return ok(myAppts);
  }

  if (method === 'GET' && segments.length === 1 && segments[0] === 'center-queue') {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const centerId = parseIntParam(params.get('centerId'), 0);
    const date = params.get('date');
    let filtered = [...appointments];
    if (centerId) filtered = filtered.filter(a => a.centerId === centerId);
    if (date) filtered = filtered.filter(a => {
      const slot = slots.find(s => s.id === a.slotId);
      return slot?.date === date;
    });
    return ok(filtered);
  }

  if (method === 'GET' && segments.length === 1 && segments[0] === 'history') {
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    const completed = appointments.filter(a => a.donorId === userId && a.status === 'COMPLETED');
    const history: AppointmentSummary[] = completed.map(a => {
      const slot = slots.find(s => s.id === a.slotId);
      const center = centers.find(c => c.id === a.centerId);
      return {
        id: a.id, date: slot?.date ?? '', startTime: slot?.startTime ?? '', endTime: slot?.endTime ?? '',
        centerName: center?.name ?? '', centerCity: center?.city ?? '',
        status: a.status, appointmentType: a.appointmentType,
      };
    });
    return ok(paginate(history, page, size));
  }

  if (method === 'GET' && segments.length === 0) {
    let filtered = [...appointments];
    const status = params.get('status');
    const appType = params.get('type');
    if (status) filtered = filtered.filter(a => a.status === status);
    if (appType) filtered = filtered.filter(a => a.appointmentType === appType);
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    return ok(paginate(filtered, page, size));
  }

  if (method === 'POST' && segments.length === 0) {
    const b = body as AppointmentRequest ?? {} as AppointmentRequest;
    const center = centers.find(c => c.id === b.centerId);
    if (!center) return fail(400, 'Invalid center');
    const slot = slots.find(s => s.id === b.slotId);
    if (!slot) return fail(400, 'Invalid slot');
    if (slot.isBlocked || slot.bookedCount >= slot.maxBookings) return fail(400, 'Slot not available');

    const id = autoIncrement.appointments++;
    const qrCode = `QATRA-APPT-${String(id).padStart(3, '0')}`;
    const apt: Appointment = {
      id, donorId: userId, centerId: b.centerId,
      emergencyId: b.emergencyId ?? null, slotId: b.slotId,
      status: 'SCHEDULED', appointmentType: b.appointmentType ?? 'REGULAR',
      bloodType: null, mlCollected: null, notes: null,
      cancellationReason: null, qrCode, completedByStaffId: null,
      createdAt: nowISO(), checkedInAt: null, completedAt: null, cancelledAt: null,
    };
    appointments.push(apt);
    slot.bookedCount++;
    return ok({
      id: apt.id, qrCode: apt.qrCode, status: apt.status,
      slot: { id: slot.id, startTime: slot.startTime, endTime: slot.endTime, availableCount: slot.maxBookings - slot.bookedCount },
      center: { id: center.id, name: center.name, city: center.city },
    } as AppointmentResponse);
  }

  if (method === 'GET' && segments.length === 1 && /^\d+$/.test(segments[0])) {
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    return ok(apt);
  }

  if (method === 'PUT' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'reschedule') {
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    const { slotId } = body ?? {};
    if (!slotId) return fail(400, 'slotId is required');
    const newSlot = slots.find(s => s.id === slotId);
    if (!newSlot) return fail(400, 'Invalid slot');
    const oldSlot = slots.find(s => s.id === apt.slotId);
    if (oldSlot) { oldSlot.bookedCount = Math.max(0, oldSlot.bookedCount - 1); }
    apt.slotId = slotId;
    apt.status = 'RESCHEDULED';
    newSlot.bookedCount++;
    return ok(apt);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'cancel') {
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    const { reason } = body ?? {};
    apt.status = 'CANCELLED';
    apt.cancellationReason = reason ?? null;
    apt.cancelledAt = nowISO();
    const slot = slots.find(s => s.id === apt.slotId);
    if (slot) slot.bookedCount = Math.max(0, slot.bookedCount - 1);
    return ok(apt);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'check-in') {
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    apt.status = 'CHECKED_IN';
    apt.checkedInAt = nowISO();
    const profile = donorProfiles.find(p => p.userId === apt.donorId);
    const result: CheckInResult = {
      appointment: apt,
      donorProfile: { displayName: profile?.displayName ?? '', bloodType: profile?.bloodType ?? 'UNKNOWN', bloodTypeVerified: profile?.bloodTypeVerified ?? false },
      eligibility: { eligible: profile?.eligibilityStatus === 'ELIGIBLE', nextEligibleDate: profile?.nextEligibleDate ?? null },
    };
    return ok(result);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'screening') {
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    const b = body ?? {};
    const sid = autoIncrement.healthScreenings++;
    const screening: HealthScreening = {
      id: sid, appointmentId: id, donorId: apt.donorId, screenedByStaffId: userId,
      temperatureCelsius: b.temperatureCelsius ?? 36.5, hemoglobinGdL: b.hemoglobinGdL ?? 14.0,
      bloodPressure: b.bloodPressure ?? '120/80', pulse: b.pulse ?? 72,
      medicalCheckPassed: b.medicalCheckPassed ?? true, notes: b.notes ?? null,
      screenedAt: nowISO(),
    };
    healthScreenings.push(screening);
    return ok(screening);
  }

  if (method === 'POST' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'complete') {
    if (!isStaffOrAdmin) return fail(403, 'Forbidden');
    const id = parseInt(segments[0], 10);
    const apt = appointments.find(a => a.id === id);
    if (!apt) return notFound();
    const b = (body ?? {}) as CompletionRequest;
    apt.status = 'COMPLETED';
    apt.mlCollected = b.mlCollected ?? 450;
    apt.notes = b.notes ?? null;
    apt.bloodType = b.bloodType ?? null;
    apt.completedByStaffId = userId;
    apt.completedAt = nowISO();
    const profile = donorProfiles.find(p => p.userId === apt.donorId);
    if (profile) {
      profile.lastDonationDate = nowISO();
      profile.updatedAt = nowISO();
      if (profile.impactSummary) {
        profile.impactSummary.totalDonations++;
        profile.impactSummary.estimatedLivesSaved = profile.impactSummary.totalDonations * 3;
      }
    }
    return ok(apt);
  }

  return notFound();
}

// ===== NOTIFICATION HANDLERS =====

function handleNotifications(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();

  if (method === 'GET' && segments.length === 1 && segments[0] === 'unread-count') {
    const count = notifications.filter(n => n.userId === userId && n.status !== 'READ').length;
    return ok({ count });
  }

  if (method === 'PUT' && segments.length === 1 && segments[0] === 'read-all') {
    notifications.forEach(n => { if (n.userId === userId && n.status !== 'READ') { n.status = 'READ'; n.readAt = nowISO(); } });
    return ok({ message: 'All notifications marked as read' });
  }

  if (method === 'GET' && segments.length === 0) {
    let filtered = notifications.filter(n => n.userId === userId);
    const status = params.get('status');
    const ntype = params.get('type');
    if (status) filtered = filtered.filter(n => n.status === status);
    if (ntype) filtered = filtered.filter(n => n.type === ntype);
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    return ok(paginate(filtered, page, size));
  }

  if (method === 'PUT' && segments.length === 2 && /^\d+$/.test(segments[0]) && segments[1] === 'read') {
    const id = parseInt(segments[0], 10);
    const n = notifications.find(x => x.id === id && x.userId === userId);
    if (!n) return notFound();
    n.status = 'READ';
    n.readAt = nowISO();
    return ok(n);
  }

  return notFound();
}

// ===== ADMIN HANDLERS =====

function handleAdmin(method: string, segments: string[], params: URLSearchParams, body: any, userId: number): Observable<HttpResponse<unknown>> {
  if (!userId) return unauthorized();
  const user = users.find(u => u.id === userId);
  if (!user?.roles.includes('SYSTEM_ADMIN')) return fail(403, 'Forbidden');

  const sub = segments.join('/');

  if (method === 'GET' && sub === 'dashboard') {
    const stats: SystemDashboard = {
      activeEmergencies: emergencies.filter(e => e.status === 'OPEN' || e.status === 'IN_PROGRESS').length,
      totalDonors: users.filter(u => u.roles.includes('DONOR')).length,
      responseRate30d: 72,
      topCenters: centers.filter(c => c.status === 'ACTIVE').slice(0, 3).map(c => ({ id: c.id, name: c.name, donations: Math.floor(Math.random() * 50) + 10 })),
      recentAlerts: ['Emergency 1 is still open', 'New staff registration pending'],
    };
    return ok(stats);
  }

  if (method === 'GET' && sub === 'health') {
    return ok({
      services: [
        { name: 'Database', status: 'UP' },
        { name: 'Notification Service', status: 'UP' },
        { name: 'Email Service', status: 'DEGRADED' },
        { name: 'SMS Gateway', status: 'UP' },
      ] as ServiceHealth[],
      errorRates: { total: 12, byEndpoint: { '/api/v1/auth/login': 5, '/api/v1/emergencies': 7 } },
      apiUsage: { requestsPerMinute: 42, topEndpoints: ['/api/v1/emergencies', '/api/v1/centers', '/api/v1/auth/login'] },
      dbPoolStats: { active: 8, idle: 42, max: 100 },
    });
  }

  if (method === 'GET' && sub === 'config') {
    return ok(systemConfig);
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'config') {
    const key = segments[1];
    const entry = systemConfig.find(c => c.key === key);
    if (!entry) return notFound();
    Object.assign(entry, body ?? {}, { updatedAt: nowISO(), updatedByUserId: userId });
    return ok(entry);
  }

  if (method === 'GET' && sub === 'feature-flags') {
    return ok(featureFlags);
  }

  if (method === 'PUT' && segments.length === 2 && segments[0] === 'feature-flags' && /^\d+$/.test(segments[1])) {
    const id = parseInt(segments[1], 10);
    const flag = featureFlags.find(f => f.id === id);
    if (!flag) return notFound();
    const b = body ?? {};
    if (b.enabled !== undefined) flag.enabled = b.enabled;
    if (b.rules) flag.rules = b.rules;
    flag.updatedAt = nowISO();
    return ok(flag);
  }

  if (method === 'GET' && sub === 'audit-logs') {
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    let filtered = [...auditLogs];
    const action = params.get('action');
    const entityType = params.get('entityType');
    if (action) filtered = filtered.filter(l => l.action === action);
    if (entityType) filtered = filtered.filter(l => l.entityType === entityType);
    return ok(paginate(filtered, page, size));
  }

  if (method === 'GET' && sub === 'deletion-requests') {
    const page = parseIntParam(params.get('page'), 0);
    const size = parseIntParam(params.get('size'), 20);
    let filtered = [...deletionRequests];
    const status = params.get('status');
    if (status) filtered = filtered.filter(d => d.status === status);
    return ok(paginate(filtered, page, size));
  }

  if (method === 'PUT' && segments.length === 3 && segments[0] === 'deletion-requests' && /^\d+$/.test(segments[1]) && segments[2] === 'process') {
    const id = parseInt(segments[1], 10);
    const req = deletionRequests.find(d => d.id === id);
    if (!req) return notFound();
    const { status, processedByUserId } = body ?? {};
    if (status) req.status = status as DeletionStatus;
    req.processedByUserId = processedByUserId ?? userId;
    req.processedAt = nowISO();
    if (status === 'APPROVED' || status === 'COMPLETED') {
      const u = users.find(x => x.id === req.requestedByUserId);
      if (u) u.status = 'DELETED';
    }
    return ok(req);
  }

  if (method === 'GET' && segments.length === 1 && segments[0] === 'reports') {
    const from = params.get('from') ?? daysFromNow(-30);
    const to = params.get('to') ?? daysFromNow(0);
    const type = params.get('type') ?? 'monthly';
    const report: PlatformReport = {
      period: { from, to },
      totalDonations: appointments.filter(a => a.status === 'COMPLETED').length,
      newDonors: users.filter(u => u.roles.includes('DONOR') && u.createdAt >= from).length,
      activeCenters: centers.filter(c => c.status === 'ACTIVE').length,
      emergencyResponseRate: 68,
    };
    return ok(report);
  }

  if (method === 'GET' && segments.length === 1 && segments[0] === 'forecasts') {
    const bloodType = params.get('bloodType');
    const region = params.get('region');
    let forecasts: DemandForecast[] = [
      { id: 1, bloodType: 'O_NEGATIVE', region: 'Casablanca-Settat', forecastedUnits: 45, forecastDate: daysFromNow(7), validUntil: daysFromNow(14), basedOnEmergencyCount: 3, generatedAt: nowISO() },
      { id: 2, bloodType: 'A_POSITIVE', region: 'Rabat-Salé', forecastedUnits: 30, forecastDate: daysFromNow(7), validUntil: daysFromNow(14), basedOnEmergencyCount: 2, generatedAt: nowISO() },
      { id: 3, bloodType: 'O_POSITIVE', region: 'Marrakech-Safi', forecastedUnits: 25, forecastDate: daysFromNow(7), validUntil: daysFromNow(14), basedOnEmergencyCount: 1, generatedAt: nowISO() },
    ];
    if (bloodType) forecasts = forecasts.filter(f => f.bloodType === bloodType);
    if (region) forecasts = forecasts.filter(f => f.region.toLowerCase().includes(region.toLowerCase()));
    return ok(forecasts);
  }

  if (method === 'GET' && sub === 'centers/pending') {
    const pending = centers.filter(c => c.status === 'PENDING_APPROVAL');
    return ok(pending);
  }

  return notFound();
}

// ===== MAIN ROUTER =====

export function handleMockRequest(method: string, url: string, body: any, headers: Map<string, string>): Observable<HttpResponse<unknown>> {
  const [pathname, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return fail(404, 'Not found');

  const authUser = getAuthUser(headers);
  const userId = authUser?.id ?? 0;

  switch (segments[0]) {
    case 'auth': return handleAuth(method, segments.slice(1), params, body, userId);
    case 'users': return handleUsers(method, segments.slice(1), params, body, userId);
    case 'donors': return handleDonors(method, segments.slice(1), params, body, userId);
    case 'centers': return handleCenters(method, segments.slice(1), params, body, userId);
    case 'emergencies': return handleEmergencies(method, segments.slice(1), params, body, userId);
    case 'appointments': return handleAppointments(method, segments.slice(1), params, body, userId);
    case 'notifications': return handleNotifications(method, segments.slice(1), params, body, userId);
    case 'admin': return handleAdmin(method, segments.slice(1), params, body, userId);
    default: return fail(404, `Unknown endpoint: /${segments[0]}`);
  }
}
