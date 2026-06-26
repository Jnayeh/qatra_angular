import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('./pages/emergency-list-page/emergency-list-page').then((m) => m.EmergencyListPageComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/emergency-create-page/emergency-create-page').then((m) => m.EmergencyCreatePageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/emergency-detail-page/emergency-detail-page').then((m) => m.EmergencyDetailPageComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/emergency-history-page/emergency-history-page').then((m) => m.EmergencyHistoryPageComponent),
  },
] as Routes;
