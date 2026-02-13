import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { tap } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { TokenPair, Role } from '@/app/shared/models/user.model';
import { AuthService } from '@/app/core/auth/auth.service';

interface AuthUser {
  id: number;
  displayName: string;
  roles: Role[];
}

interface AuthState {
  user: AuthUser | null;
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
  CENTER: ['CENTER_STAFF', 'CENTER_ADMIN'],
  CENTER_ADMIN: ['CENTER_ADMIN'],
  ADMIN: ['SUPER_ADMIN'],
};

function loadFromStorage(): AuthState {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userJson = localStorage.getItem('authUser');

  if (accessToken && refreshToken && userJson) {
    try {
      const user = JSON.parse(userJson) as AuthUser;
      return {
        ...initialState,
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem('authUser');
    }
  }

  return initialState;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(loadFromStorage),
  withComputed((store) => ({
    userRoles: computed(() => store.user()?.roles ?? []),
    isSuperAdmin: computed(() => store.user()?.roles.includes('SUPER_ADMIN') ?? false),
    isCenterAdmin: computed(() => store.user()?.roles.includes('CENTER_ADMIN') ?? false),
    isCenterStaff: computed(() => store.user()?.roles.includes('CENTER_STAFF') ?? false),
    isDonor: computed(() => store.user()?.roles.includes('DONOR') ?? false),
  })),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login(email: string, password: string, intendedRole?: string) {
      patchState(store, { isLoading: true, error: null });
      return authService.login({ email, password }).pipe(
        tap({
          next: (res: ApiResponse<TokenPair>) => {
            const data = res.data;
            const allowedRoles = intendedRole ? ROLE_MAP[intendedRole] : null;

            if (allowedRoles && !data.roles.some((r: Role) => allowedRoles.includes(r))) {
              patchState(store, {
                user: null,
                isLoading: false,
                error:
                  intendedRole === 'DONOR'
                    ? 'This login is for donors only. Please use the correct portal for your role.'
                    : intendedRole === 'CENTER'
                      ? 'This portal is for center staff and administrators only.'
                      : 'This portal is for super administrators only.',
              });
              return;
            }

            const user: AuthUser = { id: data.userId, displayName: data.displayName, roles: data.roles };
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('authUser', JSON.stringify(user));
            patchState(store, {
              user,
              accessToken: data.token,
              refreshToken: data.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          },
          error: (err: { error?: { message?: string }; friendlyMessage?: string }) => {
            patchState(store, {
              isLoading: false,
              error: err.error?.message ?? err.friendlyMessage ?? 'Login failed',
            });
          },
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
      localStorage.removeItem('authUser');
      patchState(store, initialState);
      router.navigate(['']);
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
