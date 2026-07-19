import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Appointment } from '@/app/shared/models/appointment.model';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { DonorStore } from '@/app/features/donor/donor.store';

interface AppointmentState {
  myAppointments: Appointment[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  lastBooking: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  myAppointments: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  lastBooking: null,
  isLoading: false,
  error: null,
};

export const AppointmentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    upcoming: () =>
      store.myAppointments().filter((a) => a.status === 'SCHEDULED' || a.status === 'IN_SCREENING' || a.status === 'RESCHEDULED'),
    past: () => store.myAppointments().filter((a) => a.status === 'COMPLETED'),
    cancelled: () => store.myAppointments().filter((a) => a.status === 'CANCELLED' || a.status === 'NO_SHOW'),
  })),
  withMethods((store, appointmentService = inject(AppointmentService), donorStore = inject(DonorStore)) => ({
    loadMyAppointments: rxMethod<{ page?: number; size?: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ page = 0, size = 20 }) =>
          appointmentService.getMyAppointments({ page, size }).pipe(
            tap({
              next: (res) =>
                patchState(store, {
                  myAppointments: res.data,
                  totalPages: res.page?.totalPages ?? 0,
                  totalElements: res.page?.totalElements ?? 0,
                  currentPage: res.page?.number ?? 0,
                  isLoading: false,
                }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load appointments' }),
            }),
          ),
        ),
      ),
    ),

    bookAppointment(data: { type: 'REGULAR' | 'EMERGENCY'; slotId: number; emergencyId?: number }) {
      const donorId = donorStore.profile()?.id;
      if (!donorId) return;
      patchState(store, { isLoading: true, error: null });
      appointmentService.create({ ...data, donorId }).subscribe({
        next: (res) => patchState(store, { lastBooking: res.data, isLoading: false }),
        error: (err: { friendlyMessage?: string }) =>
          patchState(store, { isLoading: false, error: err.friendlyMessage ?? 'Failed to book appointment' }),
      });
    },

    cancelAppointment(id: number) {
      appointmentService.cancel(id).subscribe({
        next: () => this.loadMyAppointments({ page: store.currentPage(), size: 20 }),
        error: (err: { friendlyMessage?: string }) => patchState(store, { error: err.friendlyMessage ?? 'Failed to cancel' }),
      });
    },

    clearLastBooking() {
      patchState(store, { lastBooking: null });
    },
  })),
);
