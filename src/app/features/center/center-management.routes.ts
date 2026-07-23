import type { Routes } from '@angular/router';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [roleGuard('CENTER_ADMIN', 'CENTER_STAFF')],
    loadComponent: () => import('@/app/features/center/pages/center-dashboard-page/center-dashboard-page').then((m) => m.CenterDashboardPageComponent),
  },
  {
    path: 'manage',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-manage-page/center-manage-page').then((m) => m.CenterManagePageComponent),
  },
  {
    path: 'slots',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/slot-management-page/slot-management-page').then((m) => m.SlotManagementPageComponent),
  },
  {
    path: 'staff',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/staff-management-page/staff-management-page').then((m) => m.StaffManagementPageComponent),
  },
  {
    path: 'activity-log',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/staff-activity-log-page/staff-activity-log-page').then((m) => m.StaffActivityLogPageComponent),
  },
  {
    path: 'analytics',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-analytics-page/center-analytics-page').then((m) => m.CenterAnalyticsPageComponent),
  },
  {
    path: 'reports',
    canActivate: [roleGuard('CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-reports-page/center-reports-page').then((m) => m.CenterReportsPageComponent),
  },
  {
    path: 'appointments',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/staff-dashboard-page/staff-dashboard-page').then((m) => m.StaffDashboardPageComponent),
  },
  {
    path: 'appointments/queue',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/staff-queue-page/staff-queue-page').then((m) => m.StaffQueuePageComponent),
  },
  {
    path: 'appointments/checkin',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/checkin-page/checkin-page').then((m) => m.CheckinPageComponent),
  },
  {
    path: 'appointments/:id/screening',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/screening-page/screening-page').then((m) => m.ScreeningPageComponent),
  },
  {
    path: 'appointments/:id/complete',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/completion-page/completion-page').then((m) => m.CompletionPageComponent),
  },
  {
    path: 'appointments/:id/reschedule',
    loadComponent: () => import('@/app/features/appointment/pages/reschedule-page/reschedule-page').then((m) => m.ReschedulePageComponent),
  },
  {
    path: 'emergencies',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/emergency/pages/emergency-list-page/emergency-list-page').then((m) => m.EmergencyListPageComponent),
  },
  {
    path: 'emergencies/create',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/emergency/pages/emergency-create-page/emergency-create-page').then((m) => m.EmergencyCreatePageComponent),
  },
  {
    path: 'emergencies/:id',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/emergency/pages/emergency-detail-page/emergency-detail-page').then((m) => m.EmergencyDetailPageComponent),
  },
  {
    path: 'emergencies/history',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/emergency/pages/emergency-history-page/emergency-history-page').then((m) => m.EmergencyHistoryPageComponent),
  },
  {
    path: 'notifications',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/notifications/pages/notification-center-page/notification-center-page').then((m) => m.NotificationCenterPageComponent),
  },
] as Routes;
