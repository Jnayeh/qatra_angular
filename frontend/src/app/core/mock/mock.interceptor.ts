import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { handleMockRequest } from '@/app/core/mock/mock-data';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  let mockPath: string | null = null;

  if (req.url.startsWith('/api/auth/')) {
    mockPath = req.url.replace('/api/auth', '/auth');
  } else if (req.url.startsWith('/api/admin/')) {
    mockPath = req.url.replace('/api/admin', '/admin');
  } else if (req.url.startsWith('/api/v1/')) {
    mockPath = req.url.replace('/api/v1', '');
  }

  if (mockPath !== null) {
    const headers = new Map<string, string>();
    req.headers.keys().forEach(key => headers.set(key, req.headers.get(key) ?? ''));
    return handleMockRequest(req.method, mockPath, req.body, headers);
  }
  return next(req);
};
