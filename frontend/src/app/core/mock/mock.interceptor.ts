import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { handleMockRequest } from './mock-data';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api/v1/')) {
    const path = req.url.replace('/api/v1', '');
    const headers = new Map<string, string>();
    req.headers.keys().forEach(key => headers.set(key, req.headers.get(key) ?? ''));
    return handleMockRequest(req.method, path, req.body, headers);
  }
  return next(req);
};
