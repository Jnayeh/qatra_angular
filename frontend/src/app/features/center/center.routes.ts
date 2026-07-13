import type { Routes } from '@angular/router';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('@/app/features/center/pages/center-list-page/center-list-page').then((m) => m.CenterListPageComponent),
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
    path: ':id/book',
    loadComponent: () => import('@/app/features/center/pages/slot-booking-page/slot-booking-page').then((m) => m.SlotBookingPageComponent),
  },
] as Routes;
