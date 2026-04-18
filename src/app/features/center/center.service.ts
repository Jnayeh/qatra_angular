import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { BloodDonationCenter, CenterDetail, CenterSummary, ClosureResult, ClosureRequest, Slot, StaffProfile, CenterAdminProfile } from '@/app/shared/models/center.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class CenterService {
  private readonly api = inject(ApiService);

  getCenters(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<CenterSummary[]>> {
    return this.api.getPage('/api/v1/centers', params);
  }

  getCenter(id: number): Observable<ApiResponse<CenterDetail>> {
    return this.api.get(`/api/v1/centers/${id}`);
  }

  createCenter(data: Partial<BloodDonationCenter>): Observable<ApiResponse<BloodDonationCenter>> {
    return this.api.post('/api/v1/centers', data);
  }

  updateCenter(id: number, data: Partial<BloodDonationCenter>): Observable<ApiResponse<BloodDonationCenter>> {
    return this.api.put(`/api/v1/centers/${id}`, data);
  }

  updateCenterStatus(id: number, status: string): Observable<ApiResponse<void>> {
    return this.api.patch(`/api/v1/centers/${id}/status`, { status });
  }

  getSlots(centerId: number, params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Slot[]>> {
    return this.api.get(`/api/v1/centers/${centerId}/slots`, params);
  }

  blockSlot(centerId: number, slotId: number, isBlocked: boolean): Observable<ApiResponse<Slot>> {
    return this.api.patch(`/api/v1/centers/${centerId}/slots/${slotId}/block`, { isBlocked });
  }

  addClosure(centerId: number, data: ClosureRequest): Observable<ApiResponse<ClosureResult>> {
    return this.api.post(`/api/v1/centers/${centerId}/closures`, data);
  }

  getPendingCenters(): Observable<ApiResponse<CenterSummary[]>> {
    return this.api.getPage('/api/v1/centers/pending');
  }

  approveCenter(id: number, approved: boolean, reason?: string): Observable<ApiResponse<CenterDetail>> {
    return this.api.patch(`/api/v1/centers/${id}/approve`, { approved, reason });
  }

  getStaff(centerId: number): Observable<ApiResponse<StaffProfile[]>> {
    return this.api.get(`/api/v1/centers/${centerId}/staff`);
  }

  addStaff(centerId: number, userId: number): Observable<ApiResponse<StaffProfile>> {
    return this.api.post(`/api/v1/centers/${centerId}/staff`, { userId });
  }

  removeStaff(centerId: number, userId: number): Observable<ApiResponse<string>> {
    return this.api.delete(`/api/v1/centers/${centerId}/staff/${userId}`);
  }

  getMyStaffProfile(): Observable<ApiResponse<StaffProfile>> {
    return this.api.get('/api/v1/staff/me');
  }

  getMyAdminProfile(): Observable<ApiResponse<CenterAdminProfile>> {
    return this.api.get('/api/v1/admin/me');
  }

  getReport(centerId: number, startDate: string, endDate: string): Observable<Blob> {
    return this.api.get(`/api/v1/centers/${centerId}/report?startDate=${startDate}&endDate=${endDate}`) as any;
  }
}
