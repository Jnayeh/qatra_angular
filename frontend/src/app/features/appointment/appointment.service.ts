import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '../../shared/models/api-response.model';
import type { Appointment, AppointmentResponse, AppointmentRequest, CheckInResult, HealthScreening, CompletionRequest } from '../../shared/models/appointment.model';
import { ApiService } from '../../core/http/api.service';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly api = inject(ApiService);

  create(data: AppointmentRequest): Observable<ApiResponse<AppointmentResponse>> {
    return this.api.post('/appointments', data);
  }

  getList(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<Appointment>>> {
    return this.api.getPage('/appointments', params);
  }

  getDetail(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.get(`/appointments/${id}`);
  }

  reschedule(id: number, newSlotId: number): Observable<ApiResponse<AppointmentResponse>> {
    return this.api.patch(`/appointments/${id}/reschedule`, { newSlotId });
  }

  cancel(id: number, reason: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post(`/appointments/${id}/cancel`, { cancellationReason: reason });
  }

  checkIn(data: { qrCode?: string; appointmentId?: number }): Observable<ApiResponse<CheckInResult>> {
    return this.api.post('/appointments/checkin', data);
  }

  markNoShow(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/appointments/${id}/no-show`);
  }

  addScreening(id: number, data: Partial<HealthScreening>): Observable<ApiResponse<HealthScreening>> {
    return this.api.post(`/appointments/${id}/screening`, data);
  }

  complete(id: number, data: CompletionRequest): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/appointments/${id}/complete`, data);
  }

  getMyAppointments(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<Appointment>>> {
    return this.api.getPage('/donors/me/appointments', params);
  }

  getMyDonations(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<{ date: string; center: string; mlCollected: number; certificateUrl: string }>>> {
    return this.api.getPage('/donors/me/donations', params);
  }

  getStaffQueue(): Observable<ApiResponse<Array<{ appointment: any; donor: string; slotTime: string; status: string }>>> {
    return this.api.get('/staff/me/queue');
  }
}
