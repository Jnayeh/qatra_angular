import type { Routes } from '@angular/router';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('@/app/features/emergency/pages/emergency-list-page/emergency-list-page').then((m) => m.EmergencyListPageComponent),
  },
  {
    path: 'create',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/emergency/pages/emergency-create-page/emergency-create-page').then((m) => m.EmergencyCreatePageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('@/app/features/emergency/pages/emergency-detail-page/emergency-detail-page').then((m) => m.EmergencyDetailPageComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('@/app/features/emergency/pages/emergency-history-page/emergency-history-page').then((m) => m.EmergencyHistoryPageComponent),
  },
] as Routes;
