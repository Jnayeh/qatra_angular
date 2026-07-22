import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { ApiResponse, Paginated } from '@/app/shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest } from '@/app/shared/models/emergency.model';
import { EmergencyService } from '@/app/features/emergency/emergency.service';

interface EmergencyState {
  emergencies: Emergency[];
  selectedEmergency: EmergencyDetail | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const initialState: EmergencyState = {
  emergencies: [],
  selectedEmergency: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalElements: 0,
};

export const EmergencyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasMorePages: () => store.currentPage() < store.totalPages(),
  })),
  withMethods((store, emergencyService = inject(EmergencyService)) => ({
    loadEmergencies: rxMethod<Record<string, string | number | boolean | undefined>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((params) =>
          emergencyService.getList(params).pipe(
            tap({
              next: (res) =>
                patchState(store, {
                  emergencies: res.data,
                  isLoading: false,
                  currentPage: res.page?.number ?? 1,
                  totalPages: res.page?.totalPages ?? 0,
                  totalElements: res.page?.totalElements ?? 0,
                }),
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

    acceptEmergency(id: number, slotId?: number | null) {
      return emergencyService.accept(id, slotId);
    },

    declineEmergency(id: number, reason: string) {
      return emergencyService.decline(id, reason);
    },

    goToPage(page: number) {
      patchState(store, { currentPage: page });
      this.loadEmergencies({ page, size: 20 });
    },
  })),
);
