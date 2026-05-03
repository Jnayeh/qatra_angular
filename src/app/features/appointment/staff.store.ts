import { computed, effect, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { tap } from 'rxjs';
import type { StaffProfile, CenterAdminProfile, CenterDetail } from '@/app/shared/models/center.model';
import type { Appointment } from '@/app/shared/models/appointment.model';
import { CenterService } from '@/app/features/center/center.service';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { AuthStore } from '@/app/core/auth/auth.store';

interface StaffState {
  profile: StaffProfile | CenterAdminProfile | null;
  isAdmin: boolean;
  center: CenterDetail | null;
  queue: Appointment[];
  queueTotalPages: number;
  queueTotalElements: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  profile: null,
  isAdmin: false,
  center: null,
  queue: [],
  queueTotalPages: 0,
  queueTotalElements: 0,
  isLoading: false,
  error: null,
};

export const StaffStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    profile: computed(() => store.profile()),
    centerId: computed(() => store.profile()?.centerId ?? null),
    isStaff: computed(() => !store.isAdmin() && store.profile()?.userId != null),
    isAdmin: computed(() => store.isAdmin()),
  })),
  withMethods((store, authStore = inject(AuthStore), centerService = inject(CenterService), appointmentService = inject(AppointmentService)) => {
    effect(() => {
      const user = authStore.user();
      if (!user) {
        patchState(store, initialState);
      }
    });

    return {
    loadProfile() {
      const user = authStore.user();
      if (!user) return;

      patchState(store, { isLoading: true, error: null });

      const isCenterStaff = user.roles.includes('CENTER_STAFF');
      const isCenterAdmin = user.roles.includes('CENTER_ADMIN');

      if (isCenterStaff) {
        centerService.getMyStaffProfile().pipe(
          tap({
            next: (res) => {
              patchState(store, { profile: res.data, isLoading: false });
              this.loadCenter(res.data.centerId);
            },
            error: () => patchState(store, { isLoading: false, error: 'Failed to load staff profile' }),
          }),
        ).subscribe();
      } else if (isCenterAdmin) {
        centerService.getMyAdminProfile().pipe(
          tap({
            next: (res) => {
              patchState(store, { profile: res.data, isAdmin: true, isLoading: false });
              this.loadCenter(res.data.centerId);
            },
            error: () => patchState(store, { isLoading: false, error: 'Failed to load admin profile' }),
          }),
        ).subscribe();
      }
    },

    loadCenter(centerId: number) {
      centerService.getCenter(centerId).pipe(
        tap({
          next: (res) => patchState(store, { center: res.data }),
          error: () => {},
        }),
      ).subscribe();
    },

    loadQueue(params?: { fromDate?: string; toDate?: string; page?: number; size?: number }) {
      const centerId = store.centerId();
      if (!centerId) return;

      patchState(store, { isLoading: true });

      appointmentService.getQueue({
        centerId,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        page: params?.page ?? 1,
        size: params?.size ?? 50,
      }).pipe(
        tap({
          next: (res) => patchState(store, {
            queue: res.data,
            queueTotalPages: res.page?.totalPages ?? 0,
            queueTotalElements: res.page?.totalElements ?? 0,
            isLoading: false,
          }),
          error: () => patchState(store, { isLoading: false, error: 'Failed to load queue' }),
        }),
      ).subscribe();
    },

    markNoShow(appointmentId: number) {
      appointmentService.markNoShow(appointmentId).pipe(
        tap({
          next: () => {

            this.loadQueue();
          },
          error: () => alert('Failed to mark appointment as no-show'),
        }),
      ).subscribe();
    },

    clear() {
      patchState(store, initialState);
    },
    };
  }),
);
