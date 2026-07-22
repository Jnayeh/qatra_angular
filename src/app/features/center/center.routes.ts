import type { Routes } from '@angular/router';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('@/app/features/center/pages/center-list-page/center-list-page').then((m) => m.CenterListPageComponent),
  },
  {
    path: 'dashboard',
    canActivate: [roleGuard('CENTER_ADMIN', 'CENTER_STAFF')],
    loadComponent: () => import('@/app/features/center/pages/center-dashboard-page/center-dashboard-page').then((m) => m.CenterDashboardPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('@/app/features/center/pages/center-detail-page/center-detail-page').then((m) => m.CenterDetailPageComponent),
  },
  {
    path: ':id/manage',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-manage-page/center-manage-page').then((m) => m.CenterManagePageComponent),
  },
  {
    path: ':id/slots',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/slot-management-page/slot-management-page').then((m) => m.SlotManagementPageComponent),
  },
  {
    path: ':id/book',
    loadComponent: () => import('@/app/features/center/pages/slot-booking-page/slot-booking-page').then((m) => m.SlotBookingPageComponent),
  },
  {
    path: ':id/staff',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/staff-management-page/staff-management-page').then((m) => m.StaffManagementPageComponent),
  },
  {
    path: ':id/activity-log',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/staff-activity-log-page/staff-activity-log-page').then((m) => m.StaffActivityLogPageComponent),
  },
  {
    path: ':id/analytics',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-analytics-page/center-analytics-page').then((m) => m.CenterAnalyticsPageComponent),
  },
  {
    path: ':id/reports',
    canActivate: [roleGuard('CENTER_ADMIN', 'SUPER_ADMIN')],
    loadComponent: () => import('@/app/features/center/pages/center-reports-page/center-reports-page').then((m) => m.CenterReportsPageComponent),
  },
] as Routes;
