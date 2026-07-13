import type { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
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
] as Routes;
