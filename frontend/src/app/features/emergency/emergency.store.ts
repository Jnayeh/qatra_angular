import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest } from '@/app/shared/models/emergency.model';
import { EmergencyService } from '@/app/features/emergency/emergency.service';

interface EmergencyState {
  emergencies: Emergency[];
  selectedEmergency: EmergencyDetail | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  emergencies: [],
  selectedEmergency: null,
  isLoading: false,
  error: null,
};

export const EmergencyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, emergencyService = inject(EmergencyService)) => ({
    loadEmergencies: rxMethod<Record<string, string | number | boolean | undefined>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) =>
          emergencyService.getList(params).pipe(
            tap({
              next: (res) => patchState(store, { emergencies: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load emergencies' }),
            }),
          ),
        ),
      ),
    ),

    loadEmergency: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          emergencyService.getDetail(id).pipe(
            tap({
              next: (res) => patchState(store, { selectedEmergency: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load emergency' }),
            }),
          ),
        ),
      ),
    ),

    createEmergency(data: EmergencyCreateRequest): Observable<ApiResponse<EmergencyDetail>> {
      return emergencyService.create(data);
    },

    acceptEmergency(id: number) {
      return emergencyService.accept(id);
    },

    declineEmergency(id: number, reason: string) {
      return emergencyService.decline(id, reason);
    },
  })),
);
