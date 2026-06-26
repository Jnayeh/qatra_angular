import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () => import('./pages/center-list-page/center-list-page').then((m) => m.CenterListPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/center-detail-page/center-detail-page').then((m) => m.CenterDetailPageComponent),
  },
  {
    path: ':id/manage',
    loadComponent: () => import('./pages/center-manage-page/center-manage-page').then((m) => m.CenterManagePageComponent),
  },
  {
    path: ':id/book',
    loadComponent: () => import('./pages/slot-booking-page/slot-booking-page').then((m) => m.SlotBookingPageComponent),
  },
] as Routes;
