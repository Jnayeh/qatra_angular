import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { AppointmentResponse, DonorAppointmentView } from '@/app/shared/models/appointment.model';
import { AppointmentService } from '@/app/features/appointment/appointment.service';

interface AppointmentState {
  myAppointments: DonorAppointmentView[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  lastBooking: AppointmentResponse | null;
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
  withMethods((store, appointmentService = inject(AppointmentService)) => ({
    loadMyAppointments: rxMethod<{ page?: number; size?: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ page = 0, size = 20 }) =>
          appointmentService.getMyAppointments({ page, size }).pipe(
            tap({
              next: (res) =>
                patchState(store, {
                  myAppointments: res.data.content,
                  totalPages: res.data.totalPages,
                  totalElements: res.data.totalElements,
                  currentPage: res.data.number,
                  isLoading: false,
                }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load appointments' }),
            }),
          ),
        ),
      ),
    ),

    bookAppointment(data: { centerId: number; slotId: number; appointmentType: 'REGULAR' | 'EMERGENCY' }) {
      patchState(store, { isLoading: true, error: null });
      appointmentService.create(data).subscribe({
        next: (res) => patchState(store, { lastBooking: res.data, isLoading: false }),
        error: (err: { friendlyMessage?: string }) =>
          patchState(store, { isLoading: false, error: err.friendlyMessage ?? 'Failed to book appointment' }),
      });
    },

    cancelAppointment(id: number, reason: string) {
      appointmentService.cancel(id, reason).subscribe({
        next: () => this.loadMyAppointments({ page: store.currentPage(), size: 20 }),
        error: (err: { friendlyMessage?: string }) => patchState(store, { error: err.friendlyMessage ?? 'Failed to cancel' }),
      });
    },

    clearLastBooking() {
      patchState(store, { lastBooking: null });
    },
  })),
);
