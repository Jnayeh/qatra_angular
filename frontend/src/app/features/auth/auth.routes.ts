import type { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    data: { intendedRole: 'DONOR' },
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'staff-login',
    data: { intendedRole: 'STAFF' },
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'admin-login',
    data: { intendedRole: 'ADMIN' },
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./pages/verify-email-page/verify-email-page').then((m) => m.VerifyEmailPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password-page/reset-password-page').then((m) => m.ResetPasswordPageComponent),
  },
] as Routes;
