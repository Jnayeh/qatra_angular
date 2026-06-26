import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '../../shared/models/api-response.model';
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResult,
  TokenPair,
} from '../../shared/models/user.model';
import { ApiService } from '../http/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  register(req: RegisterRequest): Observable<ApiResponse<RegisterResult>> {
    return this.api.post('/auth/register', req);
  }

  login(req: LoginRequest): Observable<ApiResponse<TokenPair>> {
    return this.api.post('/auth/login', req);
  }

  verifyEmail(token: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/auth/verify-email', { token });
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/auth/reset-password', { token, newPassword });
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<TokenPair>> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.api.post('/auth/logout');
  }
}
