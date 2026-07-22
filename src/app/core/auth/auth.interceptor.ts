import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@/app/core/auth/auth.service';
import { AuthStore } from '@/app/core/auth/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const accessToken = authStore.accessToken() ?? localStorage.getItem('accessToken');

  let authReq = req;
  if (accessToken && !req.url.includes('/auth/')) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        if (error.status === 401) {
          const refreshToken = authStore.refreshToken() ?? localStorage.getItem('refreshToken');
          if (refreshToken) {
            return authService.refreshToken(refreshToken).pipe(
              switchMap((res) => {
                const data = res.data;
                authStore.refreshTokens(data.token, data.refreshToken);
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${data.token}` },
                });
                return next(retryReq);
              }),
              catchError(() => {
                authStore.clearAuth();
                return throwError(() => error);
              }),
            );
          }
        }
        authStore.clearAuth();
      }
      return throwError(() => error);
    }),
  );
};
