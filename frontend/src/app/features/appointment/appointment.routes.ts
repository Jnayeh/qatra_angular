import type { Routes } from '@angular/router';
import { roleGuard } from '@/app/core/auth/guards/role.guard';

export default [
  { path: '', redirectTo: 'my-appointments', pathMatch: 'full' },
  {
    path: 'book',
    loadComponent: () => import('@/app/features/appointment/pages/appointment-booking-page/appointment-booking-page').then((m) => m.AppointmentBookingPageComponent),
  },
  {
    path: 'my-appointments',
    loadComponent: () => import('@/app/features/appointment/pages/donor-appointments-page/donor-appointments-page').then((m) => m.DonorAppointmentsPageComponent),
  },
  {
    path: 'staff-queue',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/staff-queue-page/staff-queue-page').then((m) => m.StaffQueuePageComponent),
  },
  {
    path: 'checkin',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/checkin-page/checkin-page').then((m) => m.CheckinPageComponent),
  },
  {
    path: ':id/screening',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/screening-page/screening-page').then((m) => m.ScreeningPageComponent),
  },
  {
    path: ':id/complete',
    canActivate: [roleGuard('CENTER_STAFF', 'CENTER_ADMIN')],
    loadComponent: () => import('@/app/features/appointment/pages/completion-page/completion-page').then((m) => m.CompletionPageComponent),
  },
  {
    path: 'donation-history',
    loadComponent: () => import('@/app/features/appointment/pages/donation-history-page/donation-history-page').then((m) => m.DonationHistoryPageComponent),
  },
] as Routes;
