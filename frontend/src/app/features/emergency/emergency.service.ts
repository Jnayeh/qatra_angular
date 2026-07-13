import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '@/app/shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest, EmergencyRespondResult, EmergencyResponse, MatchResult } from '@/app/shared/models/emergency.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private readonly api = inject(ApiService);

  create(data: EmergencyCreateRequest): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.post('/emergencies', data);
  }

  getList(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<Emergency>>> {
    return this.api.getPage('/emergencies', params);
  }

  getDetail(id: number): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.get(`/emergencies/${id}`);
  }

  updateStatus(id: number, action: string, deadlineExtension?: string): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.patch(`/emergencies/${id}/status`, { action, deadlineExtension });
  }

  resolve(id: number, notes: string): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.post(`/emergencies/${id}/resolve`, { notes });
  }

  getResponses(id: number): Observable<ApiResponse<MatchResult[]>> {
    return this.api.get(`/emergencies/${id}/responses`);
  }

  accept(id: number): Observable<ApiResponse<EmergencyRespondResult>> {
    return this.api.post(`/emergencies/${id}/accept`);
  }

  decline(id: number, reason: string): Observable<ApiResponse<EmergencyRespondResult>> {
    return this.api.post(`/emergencies/${id}/decline`, { reason });
  }
}
