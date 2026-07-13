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
    path: 'config',
    loadComponent: () => import('@/app/features/admin/pages/config-page/config-page').then((m) => m.ConfigPageComponent),
  },
  {
    path: 'feature-flags',
    loadComponent: () => import('@/app/features/admin/pages/feature-flags-page/feature-flags-page').then((m) => m.FeatureFlagsPageComponent),
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
    path: 'system-health',
    loadComponent: () => import('@/app/features/admin/pages/system-health-page/system-health-page').then((m) => m.SystemHealthPageComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('@/app/features/admin/pages/reports-page/reports-page').then((m) => m.ReportsPageComponent),
  },
  {
    path: 'forecasts',
    loadComponent: () => import('@/app/features/admin/pages/forecasts-page/forecasts-page').then((m) => m.ForecastsPageComponent),
  },
] as Routes;
