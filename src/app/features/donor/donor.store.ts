import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Certificate, DonorProfile, EligibilityStatus, HealthQuestionnaire, ImpactSummary, NotificationPreferences } from '@/app/shared/models/donor.model';
import { DonorService } from '@/app/features/donor/donor.service';

interface DonorState {
  profile: DonorProfile | null;
  healthQuestionnaire: HealthQuestionnaire | null;
  eligibility: EligibilityStatus | null;
  impact: ImpactSummary | null;
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DonorState = {
  profile: null,
  healthQuestionnaire: null,
  eligibility: null,
  impact: null,
  certificates: [],
  isLoading: false,
  error: null,
};

export const DonorStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    profileComplete: () => store.profile()?.profileComplete ?? false,
    bloodTypeVerified: () => store.profile()?.bloodTypeVerified ?? false,
    reliabilityScore: () => store.profile()?.reliabilityScore ?? 0,
  })),
  withMethods((store, donorService = inject(DonorService)) => ({
    loadProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          donorService.getMyProfile().pipe(
            tap({
              next: (res) => patchState(store, { profile: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load profile' }),
            }),
          ),
        ),
      ),
    ),

    loadHealthQuestionnaire: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          donorService.getHealthQuestionnaire().pipe(
            tap({
              next: (res) => patchState(store, { healthQuestionnaire: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load health questionnaire' }),
            }),
          ),
        ),
      ),
    ),

    loadEligibility: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          donorService.getEligibility().pipe(
            tap({
              next: (res) => patchState(store, { eligibility: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load eligibility' }),
            }),
          ),
        ),
      ),
    ),

    loadImpact: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          donorService.getImpact().pipe(
            tap({
              next: (res) => patchState(store, { impact: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load impact' }),
            }),
          ),
        ),
      ),
    ),

    loadCertificates: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          donorService.getCertificates().pipe(
            tap({
              next: (res) => patchState(store, { certificates: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load certificates' }),
            }),
          ),
        ),
      ),
    ),

    updateBloodType(bloodType: string): void {
      donorService.updateBloodType(bloodType).subscribe({
        next: (res) => {
          if (store.profile()) {
            patchState(store, {
              profile: { ...store.profile()!, bloodType: res.data.bloodType as any, bloodTypeVerified: res.data.bloodTypeVerified },
            });
          }
        },
        error: (err) => patchState(store, { error: err.friendlyMessage }),
      });
    },

    updateHealthQuestionnaire(data: Partial<HealthQuestionnaire>): void {
      donorService.updateHealthQuestionnaire(data).subscribe({
        next: (res) => patchState(store, { healthQuestionnaire: res.data }),
        error: (err) => patchState(store, { error: err.friendlyMessage }),
      });
    },

    updateLocation(data: { latitude: number; longitude: number; city?: string; country?: string }): void {
      donorService.updateLocation(data).subscribe({
        next: (res) => patchState(store, { profile: res.data }),
        error: (err) => patchState(store, { error: err.friendlyMessage }),
      });
    },

    updateNotificationPrefs(prefs: NotificationPreferences): void {
      donorService.updateNotificationPrefs(prefs).subscribe({
        next: (res) => patchState(store, { profile: res.data }),
        error: (err) => patchState(store, { error: err.friendlyMessage }),
      });
    },
  })),
);
