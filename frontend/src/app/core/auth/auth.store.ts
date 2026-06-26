import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import type { User } from '../../shared/models/user.model';
import { ApiService } from '../http/api.service';
import { AuthService } from './auth.service';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const ROLE_MAP: Record<string, string[]> = {
  DONOR: ['DONOR'],
  STAFF: ['CENTER_STAFF', 'CENTER_ADMIN', 'SYSTEM_ADMIN'],
  ADMIN: ['SYSTEM_ADMIN'],
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userRoles: computed(() => store.user()?.roles ?? []),
    isSuperAdmin: computed(() => store.user()?.roles.includes('SYSTEM_ADMIN') ?? false),
    isCenterAdmin: computed(() => store.user()?.roles.includes('CENTER_ADMIN') ?? false),
    isCenterStaff: computed(() => store.user()?.roles.includes('CENTER_STAFF') ?? false),
    isDonor: computed(() => store.user()?.roles.includes('DONOR') ?? false),
  })),
  withMethods((store, authService = inject(AuthService), api = inject(ApiService), router = inject(Router)) => ({
    login(email: string, password: string, intendedRole?: string) {
      patchState(store, { isLoading: true, error: null });
      return authService.login({ email, password }).pipe(
        switchMap((res) => {
          const data = res.data;
          patchState(store, {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          return api.get<User>('/users/me');
        }),
        tap({
          next: (res) => {
            const user = res.data;
            const allowedRoles = intendedRole ? ROLE_MAP[intendedRole] : null;

            if (allowedRoles && !user.roles.some((r) => allowedRoles.includes(r))) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              patchState(store, {
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error:
                  intendedRole === 'DONOR'
                    ? 'This login is for donors only. Staff and admins, please use the staff or admin login page.'
                    : intendedRole === 'STAFF'
                      ? 'This login is for staff only. Please use the donor login page.'
                      : 'This login is for admins only.',
              });
              return;
            }

            patchState(store, { user, isAuthenticated: true });
          },
          error: (err) => {
            patchState(store, {
              isLoading: false,
              error: err.error?.message ?? err.friendlyMessage ?? 'Login failed',
            });
          },
        }),
        catchError((err) => {
          patchState(store, { isLoading: false });
          return throwError(() => err);
        }),
      );
    },

    logout() {
      authService.logout().subscribe({
        next: () => this.clearAuth(),
        error: () => this.clearAuth(),
      });
    },

    clearAuth() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      patchState(store, initialState);
      router.navigate(['']);
    },

    setUser(user: User) {
      patchState(store, { user, isAuthenticated: true });
    },

    refreshTokens(accessToken: string, refreshToken: string) {
      patchState(store, { accessToken, refreshToken });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },

    setError(error: string | null) {
      patchState(store, { error });
    },
  })),
);
