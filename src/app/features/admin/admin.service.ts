import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { UserDetail } from '@/app/shared/models/user.model';
import type { AuditLogEntry, MetricsResponse, CenterMetrics, SystemHealth } from '@/app/shared/models/analytics.model';
import type { DataDeletionRequest, SystemConfigEntry } from '@/app/shared/models/config.model';
import { ApiService } from '@/app/core/http/api.service';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getMetrics(): Observable<ApiResponse<MetricsResponse[]>> {
    return this.api.get('/api/v1/analytics/metrics');
  }

  getUsers(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<UserDetail[]>> {
    return this.api.getPage('/api/v1/admin/users', params);
  }

  getUser(id: number): Observable<ApiResponse<UserDetail>> {
    return this.api.get(`/api/v1/admin/users/${id}`);
  }

  updateUserStatus(id: number, status: string): Observable<ApiResponse<void>> {
    return this.api.patch(`/api/v1/admin/users/${id}/status`, { status });
  }

  assignRole(id: number, role: string): Observable<ApiResponse<void>> {
    return this.api.post(`/api/v1/admin/users/${id}/roles`, { role });
  }

  revokeRole(id: number, role: string): Observable<ApiResponse<void>> {
    return this.api.delete(`/api/v1/admin/users/${id}/roles`, { params: { role } });
  }

  deleteUser(id: number): Observable<ApiResponse<string>> {
    return this.api.delete(`/api/v1/admin/users/${id}`);
  }

  getAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<AuditLogEntry[]>> {
    return this.api.getPage('/api/v1/analytics/audit-logs', params);
  }

  exportAuditLogs(params?: Record<string, string | number | boolean | undefined>): Observable<Blob> {
    let httpParams: HttpParams | undefined;
    if (params) {
      httpParams = new HttpParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          httpParams = httpParams.set(k, String(v));
        }
      }
    }
    return this.http.get(`${this.baseUrl}/api/v1/analytics/audit-logs/export`, {
      params: httpParams,
      responseType: 'blob',
    });
  }

  getDeletionRequests(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<DataDeletionRequest[]>> {
    return this.api.getPage('/api/v1/system/gdpr', params);
  }

  processDeletionRequest(id: number, approved: boolean): Observable<ApiResponse<DataDeletionRequest>> {
    const action = approved ? 'complete' : 'cancel';
    return this.api.post(`/api/v1/system/gdpr/${id}/${action}`);
  }

  overrideRestriction(donorId: number, permanentlyRestricted: boolean, restrictionReason?: string): Observable<ApiResponse<unknown>> {
    return this.api.patch(`/api/v1/donors/${donorId}/restriction`, { permanentlyRestricted, restrictionReason });
  }

  getCenterMetrics(centerId: number): Observable<ApiResponse<CenterMetrics>> {
    return this.api.get(`/api/v1/analytics/centers/${centerId}/metrics`);
  }

  getConfig(): Observable<ApiResponse<SystemConfigEntry[]>> {
    return this.api.get('/api/v1/admin/config');
  }

  getReports(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Record<string, unknown>>> {
    return this.api.get('/api/v1/analytics/reports', params);
  }

  getSystemHealth(): Observable<ApiResponse<SystemHealth>> {
    return this.api.get('/api/v1/admin/health');
  }
}
