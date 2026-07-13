import type { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    data: { intendedRole: 'DONOR' },
    loadComponent: () => import('@/app/features/auth/pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'center-login',
    data: { intendedRole: 'CENTER' },
    loadComponent: () => import('@/app/features/auth/pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'admin-login',
    data: { intendedRole: 'ADMIN' },
    loadComponent: () => import('@/app/features/auth/pages/login-page/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('@/app/features/auth/pages/register-page/register-page').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('@/app/features/auth/pages/verify-email-page/verify-email-page').then((m) => m.VerifyEmailPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@/app/features/auth/pages/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'center-forgot-password',
    data: { intendedRole: 'CENTER' },
    loadComponent: () => import('@/app/features/auth/pages/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'admin-forgot-password',
    data: { intendedRole: 'ADMIN' },
    loadComponent: () => import('@/app/features/auth/pages/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('@/app/features/auth/pages/reset-password-page/reset-password-page').then((m) => m.ResetPasswordPageComponent),
  },
  {
    path: 'center-reset-password',
    data: { intendedRole: 'CENTER' },
    loadComponent: () => import('@/app/features/auth/pages/reset-password-page/reset-password-page').then((m) => m.ResetPasswordPageComponent),
  },
  {
    path: 'admin-reset-password',
    data: { intendedRole: 'ADMIN' },
    loadComponent: () => import('@/app/features/auth/pages/reset-password-page/reset-password-page').then((m) => m.ResetPasswordPageComponent),
  },
] as Routes;
