import type { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/pages/landing-page/landing-page').then((m) => m.LandingPageComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'donor',
        canActivate: [roleGuard('DONOR')],
        loadChildren: () => import('./features/donor/donor.routes'),
      },
      {
        path: 'centers',
        loadChildren: () => import('./features/center/center.routes'),
      },
      {
        path: 'emergencies',
        loadChildren: () => import('./features/emergency/emergency.routes'),
      },
      {
        path: 'appointments',
        loadChildren: () => import('./features/appointment/appointment.routes'),
      },
      {
        path: 'admin',
        canActivate: [roleGuard('SYSTEM_ADMIN')],
        loadChildren: () => import('./features/admin/admin.routes'),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notification.routes'),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
