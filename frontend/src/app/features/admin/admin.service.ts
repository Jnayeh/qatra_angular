import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { UserDetail, UserSummary } from '@/app/shared/models/user.model';
import type { AuditLogEntry, SystemDashboard, SystemHealth, PlatformReport, DemandForecast } from '@/app/shared/models/analytics.model';
import type { SystemConfigEntry, FeatureFlag, DataDeletionRequest } from '@/app/shared/models/config.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getDashboard(): Observable<ApiResponse<SystemDashboard>> {
    return this.api.get('/api/v1/analytics/metrics');
  }

  getUsers(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<UserSummary[]>> {
    return this.api.getPage('/api/v1/admin/users', params);
  }

  getUser(id: number): Observable<ApiResponse<UserDetail>> {
    return this.api.get(`/api/v1/admin/users/${id}`);
  }

  updateUserStatus(id: number, status: string): Observable<ApiResponse<UserSummary>> {
    return this.api.patch(`/api/v1/admin/users/${id}/status`, { status });
  }

  assignRole(id: number, role: string, action: 'ASSIGN' | 'REVOKE'): Observable<ApiResponse<{ userId: number; roles: string[] }>> {
    return this.api.patch(`/api/v1/admin/users/${id}/roles`, { role, action });
  }

  deleteUser(id: number): Observable<ApiResponse<{ message: string }>> {
    return this.api.delete(`/api/v1/admin/users/${id}`);
  }

  getAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<AuditLogEntry[]>> {
    return this.api.getPage('/api/v1/admin/audit-logs', params);
  }

  exportAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<Blob> {
    return this.api.get('/api/v1/admin/audit-logs/export', params) as any;
  }

  getConfig(): Observable<ApiResponse<SystemConfigEntry[]>> {
    return this.api.get('/api/v1/admin/config');
  }

  updateConfig(key: string, value: Record<string, unknown>, description: string): Observable<ApiResponse<SystemConfigEntry>> {
    return this.api.put(`/api/v1/admin/config/${key}`, { value, description });
  }

  getFeatureFlags(): Observable<ApiResponse<FeatureFlag[]>> {
    return this.api.get('/api/v1/admin/feature-flags');
  }

  updateFeatureFlag(name: string, enabled: boolean, rules?: any): Observable<ApiResponse<FeatureFlag>> {
    return this.api.put(`/api/v1/admin/feature-flags/${name}`, { enabled, rules });
  }

  getDeletionRequests(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<DataDeletionRequest[]>> {
    return this.api.getPage('/api/v1/admin/deletion-requests', params);
  }

  processDeletionRequest(id: number, approved: boolean, reason: string): Observable<ApiResponse<DataDeletionRequest>> {
    return this.api.post(`/api/v1/admin/deletion-requests/${id}/process`, { approved, reason });
  }

  getSystemHealth(): Observable<ApiResponse<SystemHealth>> {
    return this.api.get('/api/v1/analytics/health');
  }

  getReports(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<PlatformReport>> {
    return this.api.get('/api/v1/analytics/reports', params);
  }

  getForecasts(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<DemandForecast[]>> {
    return this.api.get('/api/v1/analytics/forecasts', params);
  }
}
