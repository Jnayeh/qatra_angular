import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('@/app/features/donor/pages/donor-dashboard-page/donor-dashboard-page').then((m) => m.DonorDashboardPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('@/app/features/donor/pages/donor-profile-page/donor-profile-page').then((m) => m.DonorProfilePageComponent),
  },
  {
    path: 'health-questionnaire',
    loadComponent: () => import('@/app/features/donor/pages/health-questionnaire-page/health-questionnaire-page').then((m) => m.HealthQuestionnairePageComponent),
  },
  {
    path: 'blood-type',
    loadComponent: () => import('@/app/features/donor/pages/blood-type-page/blood-type-page').then((m) => m.BloodTypePageComponent),
  },
  {
    path: 'location',
    loadComponent: () => import('@/app/features/donor/pages/location-page/location-page').then((m) => m.LocationPageComponent),
  },
  {
    path: 'availability',
    loadComponent: () => import('@/app/features/donor/pages/availability-page/availability-page').then((m) => m.AvailabilityPageComponent),
  },
  {
    path: 'notification-prefs',
    loadComponent: () => import('@/app/features/donor/pages/notification-prefs-page/notification-prefs-page').then((m) => m.NotificationPrefsPageComponent),
  },
  {
    path: 'impact',
    loadComponent: () => import('@/app/features/donor/pages/impact-page/impact-page').then((m) => m.ImpactPageComponent),
  },
  {
    path: 'certificates',
    loadComponent: () => import('@/app/features/donor/pages/certificates-page/certificates-page').then((m) => m.CertificatesPageComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('@/app/features/notifications/pages/notification-center-page/notification-center-page').then((m) => m.NotificationCenterPageComponent),
  },
  {
    path: 'my-appointments',
    loadComponent: () => import('@/app/features/appointment/pages/donor-appointments-page/donor-appointments-page').then((m) => m.DonorAppointmentsPageComponent),
  },
  {
    path: 'book',
    loadComponent: () => import('@/app/features/appointment/pages/appointment-booking-page/appointment-booking-page').then((m) => m.AppointmentBookingPageComponent),
  },
  {
    path: 'donation-history',
    loadComponent: () => import('@/app/features/appointment/pages/donation-history-page/donation-history-page').then((m) => m.DonationHistoryPageComponent),
  },
  {
    path: ':id/reschedule',
    loadComponent: () => import('@/app/features/appointment/pages/reschedule-page/reschedule-page').then((m) => m.ReschedulePageComponent),
  },
  {
    path: 'emergencies',
    loadComponent: () => import('@/app/features/emergency/pages/emergency-list-page/emergency-list-page').then((m) => m.EmergencyListPageComponent),
  },
  {
    path: 'emergencies/:id',
    loadComponent: () => import('@/app/features/emergency/pages/emergency-detail-page/emergency-detail-page').then((m) => m.EmergencyDetailPageComponent),
  },
  {
    path: 'centers',
    loadComponent: () => import('@/app/features/center/pages/center-list-page/center-list-page').then((m) => m.CenterListPageComponent),
  },
  {
    path: 'centers/:id',
    loadComponent: () => import('@/app/features/center/pages/center-detail-page/center-detail-page').then((m) => m.CenterDetailPageComponent),
  },
  {
    path: 'centers/:id/book',
    loadComponent: () => import('@/app/features/center/pages/slot-booking-page/slot-booking-page').then((m) => m.SlotBookingPageComponent),
  },
] as Routes;
