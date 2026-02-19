import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      const message = error.error?.message ?? error.message ?? 'An unexpected error occurred';
      console.error(`[HTTP Error] ${req.method} ${req.url}:`, message);
      return throwError(() => ({ ...error, friendlyMessage: message }));
    }),
  );
};
