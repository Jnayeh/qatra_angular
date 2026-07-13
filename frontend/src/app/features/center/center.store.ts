import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { CenterDetail, CenterSummary, Slot } from '@/app/shared/models/center.model';
import { CenterService } from '@/app/features/center/center.service';

interface CenterState {
  centers: CenterSummary[];
  selectedCenter: CenterDetail | null;
  slots: Slot[];
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CenterState = {
  centers: [],
  selectedCenter: null,
  slots: [],
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  error: null,
};

export const CenterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, centerService = inject(CenterService)) => ({
    loadCenters: rxMethod<Record<string, string | number | boolean | undefined>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) =>
          centerService.getCenters(params).pipe(
            tap({
              next: (res) => patchState(store, { centers: res.data.content, totalPages: res.data.totalPages, totalElements: res.data.totalElements, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load centers' }),
            }),
          ),
        ),
      ),
    ),

    loadCenter: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          centerService.getCenter(id).pipe(
            tap({
              next: (res) => patchState(store, { selectedCenter: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load center' }),
            }),
          ),
        ),
      ),
    ),

    loadSlots: rxMethod<{ centerId: number; params?: Record<string, string | number | boolean | undefined> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ centerId, params }) =>
          centerService.getSlots(centerId, params).pipe(
            tap({
              next: (res) => patchState(store, { slots: res.data, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load slots' }),
            }),
          ),
        ),
      ),
    ),
  })),
);
