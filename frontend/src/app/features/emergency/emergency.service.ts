import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '../../shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest, EmergencyRespondRequest, EmergencyRespondResult, EmergencyResponse, MatchResult } from '../../shared/models/emergency.model';
import { ApiService } from '../../core/http/api.service';

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

  getMatches(id: number): Observable<ApiResponse<MatchResult[]>> {
    return this.api.get(`/emergencies/${id}/matches`);
  }

  respond(id: number, data: EmergencyRespondRequest): Observable<ApiResponse<EmergencyRespondResult>> {
    return this.api.post(`/emergencies/${id}/respond`, data);
  }

  getHistory(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<Emergency>>> {
    return this.api.getPage('/emergencies/history', params);
  }

  getMyEmergencies(): Observable<ApiResponse<Array<{ emergencyId: number; bloodType: string; urgency: string; status: string; centerName: string; distanceKm: number | null; responseType: string | null; respondedAt: string | null }>>> {
    return this.api.get('/donors/me/emergencies');
  }
}
