import type { Routes } from '@angular/router';
import { authGuard } from '@/app/core/auth/guards/auth.guard';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/features/landing/pages/landing-page/landing-page').then((m) => m.LandingPageComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('@/app/features/auth/auth.routes'),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@/app/layouts/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'donor',
        canActivate: [roleGuard('DONOR')],
        loadChildren: () => import('@/app/features/donor/donor.routes'),
      },
      {
        path: 'centers',
        loadChildren: () => import('@/app/features/center/center.routes'),
      },
      {
        path: 'emergencies',
        loadChildren: () => import('@/app/features/emergency/emergency.routes'),
      },
      {
        path: 'appointments',
        loadChildren: () => import('@/app/features/appointment/appointment.routes'),
      },
      {
        path: 'admin',
        canActivate: [roleGuard('SUPER_ADMIN')],
        loadChildren: () => import('@/app/features/admin/admin.routes'),
      },
      {
        path: 'notifications',
        loadChildren: () => import('@/app/features/notifications/notification.routes'),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
