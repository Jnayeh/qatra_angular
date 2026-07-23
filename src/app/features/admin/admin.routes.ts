import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('@/app/features/admin/pages/dashboard-page/dashboard-page').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('@/app/features/admin/pages/user-management-page/user-management-page').then((m) => m.UserManagementPageComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () => import('@/app/features/admin/pages/user-detail-page/user-detail-page').then((m) => m.UserDetailPageComponent),
  },
  {
    path: 'centers',
    loadComponent: () => import('@/app/features/admin/pages/center-approval-page/center-approval-page').then((m) => m.CenterApprovalPageComponent),
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('@/app/features/admin/pages/audit-logs-page/audit-logs-page').then((m) => m.AuditLogsPageComponent),
  },
  {
    path: 'deletion-requests',
    loadComponent: () => import('@/app/features/admin/pages/deletion-requests-page/deletion-requests-page').then((m) => m.DeletionRequestsPageComponent),
  },
  {
    path: 'health-restrictions',
    loadComponent: () => import('@/app/features/admin/pages/health-restriction-page/health-restriction-page').then((m) => m.HealthRestrictionPageComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('@/app/features/notifications/pages/notification-center-page/notification-center-page').then((m) => m.NotificationCenterPageComponent),
  },
] as Routes;
