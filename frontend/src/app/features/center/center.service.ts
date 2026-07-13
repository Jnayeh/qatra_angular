import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '@/app/shared/models/api-response.model';
import type { BloodDonationCenter, CenterDetail, CenterSummary, ClosureResult, ClosureRequest, Slot } from '@/app/shared/models/center.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class CenterService {
  private readonly api = inject(ApiService);

  getCenters(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<CenterSummary>>> {
    return this.api.getPage('/centers', params);
  }

  getCenter(id: number): Observable<ApiResponse<CenterDetail>> {
    return this.api.get(`/centers/${id}`);
  }

  createCenter(data: Partial<BloodDonationCenter>): Observable<ApiResponse<BloodDonationCenter>> {
    return this.api.post('/centers', data);
  }

  updateCenter(id: number, data: Partial<BloodDonationCenter>): Observable<ApiResponse<BloodDonationCenter>> {
    return this.api.put(`/centers/${id}`, data);
  }

  updateCenterStatus(id: number, status: string): Observable<ApiResponse<BloodDonationCenter>> {
    return this.api.patch(`/centers/${id}/status`, { status });
  }

  getSlots(centerId: number, params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Slot[]>> {
    return this.api.get(`/centers/${centerId}/slots`, params);
  }

  blockSlot(centerId: number, slotId: number, isBlocked: boolean): Observable<ApiResponse<Slot>> {
    return this.api.patch(`/centers/${centerId}/slots/${slotId}/block`, { isBlocked });
  }

  addClosure(centerId: number, data: ClosureRequest): Observable<ApiResponse<ClosureResult>> {
    return this.api.post(`/centers/${centerId}/closures`, data);
  }

  getPendingCenters(): Observable<ApiResponse<Page<CenterSummary>>> {
    return this.api.getPage('/centers/pending');
  }

  approveCenter(id: number, approved: boolean, reason?: string): Observable<ApiResponse<CenterDetail>> {
    return this.api.patch(`/centers/${id}/approve`, { approved, reason });
  }

  getStaff(centerId: number): Observable<ApiResponse<Array<{ userId: number; displayName: string }>>> {
    return this.api.get(`/centers/${centerId}/staff`);
  }

  addStaff(centerId: number, userId: number): Observable<ApiResponse<{ userId: number; displayName: string }>> {
    return this.api.post(`/centers/${centerId}/staff`, { userId });
  }

  removeStaff(centerId: number, userId: number): Observable<ApiResponse<{ message: string }>> {
    return this.api.delete(`/centers/${centerId}/staff/${userId}`);
  }
}
