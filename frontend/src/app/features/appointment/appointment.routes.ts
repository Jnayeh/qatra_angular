import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'my-appointments', pathMatch: 'full' },
  {
    path: 'book',
    loadComponent: () => import('./pages/appointment-booking-page/appointment-booking-page').then((m) => m.AppointmentBookingPageComponent),
  },
  {
    path: 'my-appointments',
    loadComponent: () => import('./pages/donor-appointments-page/donor-appointments-page').then((m) => m.DonorAppointmentsPageComponent),
  },
  {
    path: 'staff-queue',
    loadComponent: () => import('./pages/staff-queue-page/staff-queue-page').then((m) => m.StaffQueuePageComponent),
  },
  {
    path: 'checkin',
    loadComponent: () => import('./pages/checkin-page/checkin-page').then((m) => m.CheckinPageComponent),
  },
  {
    path: ':id/screening',
    loadComponent: () => import('./pages/screening-page/screening-page').then((m) => m.ScreeningPageComponent),
  },
  {
    path: ':id/complete',
    loadComponent: () => import('./pages/completion-page/completion-page').then((m) => m.CompletionPageComponent),
  },
  {
    path: 'donation-history',
    loadComponent: () => import('./pages/donation-history-page/donation-history-page').then((m) => m.DonationHistoryPageComponent),
  },
] as Routes;
