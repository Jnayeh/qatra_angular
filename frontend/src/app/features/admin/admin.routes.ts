import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-management-page/user-management-page').then((m) => m.UserManagementPageComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./pages/user-detail-page/user-detail-page').then((m) => m.UserDetailPageComponent),
  },
  {
    path: 'centers',
    loadComponent: () => import('./pages/center-approval-page/center-approval-page').then((m) => m.CenterApprovalPageComponent),
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config-page/config-page').then((m) => m.ConfigPageComponent),
  },
  {
    path: 'feature-flags',
    loadComponent: () => import('./pages/feature-flags-page/feature-flags-page').then((m) => m.FeatureFlagsPageComponent),
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('./pages/audit-logs-page/audit-logs-page').then((m) => m.AuditLogsPageComponent),
  },
  {
    path: 'deletion-requests',
    loadComponent: () => import('./pages/deletion-requests-page/deletion-requests-page').then((m) => m.DeletionRequestsPageComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports-page/reports-page').then((m) => m.ReportsPageComponent),
  },
  {
    path: 'forecasts',
    loadComponent: () => import('./pages/forecasts-page/forecasts-page').then((m) => m.ForecastsPageComponent),
  },
] as Routes;
