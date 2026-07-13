import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('@/app/features/notifications/pages/notification-center-page/notification-center-page').then((m) => m.NotificationCenterPageComponent),
  },
] as Routes;
