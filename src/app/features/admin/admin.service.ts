import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { UserSummary, UserDetail } from '@/app/shared/models/user.model';
import type { AuditLogEntry, SystemDashboard, CenterMetrics, RestrictedUser } from '@/app/shared/models/analytics.model';
import type { DataDeletionRequest } from '@/app/shared/models/config.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getDashboard(): Observable<ApiResponse<SystemDashboard>> {
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
    return this.api.get('/api/v1/analytics/audit-logs/export', params) as any;
  }

  getDeletionRequests(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<DataDeletionRequest[]>> {
    return this.api.getPage('/api/v1/system/gdpr', params);
  }

  processDeletionRequest(id: number, approved: boolean): Observable<ApiResponse<DataDeletionRequest>> {
    const action = approved ? 'complete' : 'cancel';
    return this.api.post(`/api/v1/system/gdpr/${id}/${action}`);
  }

  getRestrictedUsers(): Observable<ApiResponse<RestrictedUser[]>> {
    return this.api.get('/api/v1/admin/users/restricted');
  }

  overrideRestriction(donorId: number, permanentlyRestricted: boolean, restrictionReason?: string): Observable<ApiResponse<unknown>> {
    return this.api.patch(`/api/v1/donors/${donorId}/restriction`, { permanentlyRestricted, restrictionReason });
  }

  getCenterMetrics(centerId: number): Observable<ApiResponse<CenterMetrics>> {
    return this.api.get(`/api/v1/analytics/centers/${centerId}/metrics`);
  }
}
