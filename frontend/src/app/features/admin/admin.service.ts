import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '../../shared/models/api-response.model';
import type { UserDetail, UserSummary } from '../../shared/models/user.model';
import type { AuditLogEntry, SystemDashboard, SystemHealth, PlatformReport, DemandForecast } from '../../shared/models/analytics.model';
import type { SystemConfigEntry, FeatureFlag, DataDeletionRequest } from '../../shared/models/config.model';
import { ApiService } from '../../core/http/api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getDashboard(): Observable<ApiResponse<SystemDashboard>> {
    return this.api.get('/admin/dashboard');
  }

  getUsers(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<UserSummary>>> {
    return this.api.getPage('/users', params);
  }

  getUser(id: number): Observable<ApiResponse<UserDetail>> {
    return this.api.get(`/users/${id}`);
  }

  updateUserStatus(id: number, status: string): Observable<ApiResponse<UserSummary>> {
    return this.api.patch(`/users/${id}/status`, { status });
  }

  assignRole(id: number, role: string, action: 'ASSIGN' | 'REVOKE'): Observable<ApiResponse<{ userId: number; roles: string[] }>> {
    return this.api.patch(`/users/${id}/roles`, { role, action });
  }

  deleteUser(id: number): Observable<ApiResponse<{ message: string }>> {
    return this.api.delete(`/users/${id}`);
  }

  getAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<AuditLogEntry>>> {
    return this.api.getPage('/admin/audit-logs', params);
  }

  exportAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<Blob> {
    return this.api.get('/admin/audit-logs/export', params) as any;
  }

  getConfig(): Observable<ApiResponse<SystemConfigEntry[]>> {
    return this.api.get('/admin/config');
  }

  updateConfig(key: string, value: Record<string, unknown>, description: string): Observable<ApiResponse<SystemConfigEntry>> {
    return this.api.put(`/admin/config/${key}`, { value, description });
  }

  getFeatureFlags(): Observable<ApiResponse<FeatureFlag[]>> {
    return this.api.get('/admin/feature-flags');
  }

  updateFeatureFlag(name: string, enabled: boolean, rules?: any): Observable<ApiResponse<FeatureFlag>> {
    return this.api.put(`/admin/feature-flags/${name}`, { enabled, rules });
  }

  getDeletionRequests(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<DataDeletionRequest>>> {
    return this.api.getPage('/admin/deletion-requests', params);
  }

  processDeletionRequest(id: number, approved: boolean, reason: string): Observable<ApiResponse<DataDeletionRequest>> {
    return this.api.post(`/admin/deletion-requests/${id}/process`, { approved, reason });
  }

  getSystemHealth(): Observable<ApiResponse<SystemHealth>> {
    return this.api.get('/admin/metrics/system');
  }

  getReports(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<PlatformReport>> {
    return this.api.get('/admin/reports', params);
  }

  getForecasts(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<DemandForecast[]>> {
    return this.api.get('/admin/forecasts', params);
  }
}
