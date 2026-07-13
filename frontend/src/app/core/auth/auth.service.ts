import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResult,
  TokenPair,
} from '@/app/shared/models/user.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  register(req: RegisterRequest): Observable<ApiResponse<RegisterResult>> {
    return this.api.post('/api/v1/auth/signup', req);
  }

  login(req: LoginRequest): Observable<ApiResponse<TokenPair>> {
    return this.api.post('/api/v1/auth/login', req);
  }

  verifyEmail(token: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/api/v1/auth/verify-email', { token });
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/api/v1/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/api/v1/auth/reset-password', { token, newPassword });
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<TokenPair>> {
    return this.api.post('/api/v1/auth/refresh', { refreshToken });
  }

  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/api/v1/auth/logout');
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/api/v1/auth/change-password', { currentPassword, newPassword });
  }
}
