import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { Emergency, EmergencyDetail, EmergencyCreateRequest, DonorResponseDTO } from '@/app/shared/models/emergency.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private readonly api = inject(ApiService);

  create(data: EmergencyCreateRequest): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.post('/api/v1/emergencies', data);
  }

  getList(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Emergency[]>> {
    return this.api.getPage('/api/v1/emergencies', params);
  }

  getDetail(id: number): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.get(`/api/v1/emergencies/${id}`);
  }


  escalate(id: number, data: EmergencyCreateRequest): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.put(`/api/v1/emergencies/${id}`, data);
  }

  cancelEmergency(id: number): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.post(`/api/v1/emergencies/${id}/cancel`);
  }

  resolve(id: number, notes: string): Observable<ApiResponse<EmergencyDetail>> {
    return this.api.post(`/api/v1/emergencies/${id}/resolve`, { notes });
  }

  getResponses(id: number): Observable<ApiResponse<DonorResponseDTO[]>> {
    return this.api.get(`/api/v1/emergencies/${id}/responses`);
  }

  accept(id: number, slotId?: number | null): Observable<ApiResponse<DonorResponseDTO>> {
    return this.api.post(`/api/v1/emergencies/${id}/responses/accept`, { slotId: slotId ?? undefined });
  }

  decline(id: number, reason: string): Observable<ApiResponse<DonorResponseDTO>> {
    return this.api.post(`/api/v1/emergencies/${id}/responses/decline`, { reason });
  }
}
