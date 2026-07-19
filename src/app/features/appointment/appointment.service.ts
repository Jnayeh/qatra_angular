import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { Appointment, AppointmentRequest, HealthScreening, CompletionRequest, ScreeningRequest } from '@/app/shared/models/appointment.model';
import { ApiService } from '@/app/core/http/api.service';
import { DonorStore } from '@/app/features/donor/donor.store';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly api = inject(ApiService);
  private readonly donorStore = inject(DonorStore);

  create(data: AppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.api.post('/api/v1/appointments', data);
  }

  getList(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Appointment[]>> {
    return this.api.getPage('/api/v1/appointments', params);
  }

  getDetail(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.get(`/api/v1/appointments/${id}`);
  }

  reschedule(id: number, slotId: number): Observable<ApiResponse<Appointment>> {
    return this.api.put(`/api/v1/appointments/${id}/reschedule`, { slotId });
  }

  cancel(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/api/v1/appointments/${id}/cancel`);
  }

  checkIn(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/api/v1/appointments/${id}/check-in`);
  }

  markNoShow(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/api/v1/appointments/${id}/no-show`);
  }

  addScreening(id: number, data: ScreeningRequest): Observable<ApiResponse<HealthScreening>> {
    return this.api.post(`/api/v1/appointments/${id}/screening-results`, data);
  }

  complete(id: number, data: CompletionRequest): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/api/v1/appointments/${id}/complete`, data);
  }

  getMyAppointments(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Appointment[]>> {

    const donorId = this.donorStore.profile()?.id;
    if (!donorId) {
      throw new Error('Donor profile not loaded. Please ensure you are logged in and your profile is loaded.');
    }
    return this.api.getPage(`/api/v1/appointments/by-donor/${donorId}`, params);
  }

  getMyDonations(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<unknown[]>> {

    return this.api.getPage('/api/v1/donors/me/certificates', params);
  }

  getQueue(params: { centerId: number; fromDate?: string; toDate?: string; page?: number; size?: number }): Observable<ApiResponse<Appointment[]>> {
    return this.api.getPage('/api/v1/appointments/queue', params);
  }
}
