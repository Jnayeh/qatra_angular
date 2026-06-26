import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '../../shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest } from '../../shared/models/emergency.model';
import { EmergencyService } from './emergency.service';

interface EmergencyState {
  emergencies: Emergency[];
  selectedEmergency: EmergencyDetail | null;
  myEmergencies: Array<{ emergencyId: number; bloodType: string; urgency: string; status: string; centerName: string; distanceKm: number | null; responseType: string | null; respondedAt: string | null }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  emergencies: [],
  selectedEmergency: null,
  myEmergencies: [],
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
              next: (res) => patchState(store, { emergencies: res.data.content, isLoading: false }),
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

    loadMyEmergencies: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          emergencyService.getMyEmergencies().pipe(
            tap({
              next: (res) => patchState(store, { myEmergencies: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load your emergencies' }),
            }),
          ),
        ),
      ),
    ),

    createEmergency(data: EmergencyCreateRequest): Observable<ApiResponse<EmergencyDetail>> {
      return emergencyService.create(data);
    },

    respondToEmergency(id: number, responseType: 'WILLING' | 'DECLINED', slotId?: number) {
      return emergencyService.respond(id, { responseType, slotId } as any);
    },
  })),
);
