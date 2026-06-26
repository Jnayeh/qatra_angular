import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';

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
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        const refreshToken = authStore.refreshToken() ?? localStorage.getItem('refreshToken');
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((res) => {
              const data = res.data;
              authStore.refreshTokens(data.accessToken, data.refreshToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${data.accessToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              authStore.clearAuth();
              return throwError(() => error);
            }),
          );
        }
        authStore.clearAuth();
      }
      return throwError(() => error);
    }),
  );
};
