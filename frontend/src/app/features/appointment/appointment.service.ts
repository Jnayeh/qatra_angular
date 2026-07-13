import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '@/app/shared/models/api-response.model';
import type { Appointment, AppointmentResponse, AppointmentRequest, CheckInResult, CompletionRequest, DonorAppointmentView, HealthScreening } from '@/app/shared/models/appointment.model';
import { ApiService } from '@/app/core/http/api.service';

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

  reschedule(id: number, slotId: number): Observable<ApiResponse<Appointment>> {
    return this.api.put(`/appointments/${id}/reschedule`, { slotId });
  }

  cancel(id: number, reason: string): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/appointments/${id}/cancel`, { reason });
  }

  checkIn(id: number, qrCode: string): Observable<ApiResponse<CheckInResult>> {
    return this.api.post(`/appointments/${id}/check-in`, { qrCode });
  }

  markNoShow(id: number): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/appointments/${id}/no-show`);
  }

  addScreening(id: number, data: Partial<HealthScreening>): Observable<ApiResponse<HealthScreening>> {
    return this.api.post(`/screening-results`, { appointmentId: id, ...data });
  }

  complete(id: number, data: CompletionRequest): Observable<ApiResponse<Appointment>> {
    return this.api.post(`/appointments/${id}/complete`, data);
  }

  getMyAppointments(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<DonorAppointmentView>>> {
    return this.api.getPage('/appointments/my', params);
  }

  getMyDonations(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<{ date: string; center: string; mlCollected: number; certificateUrl: string }>>> {
    return this.api.getPage('/donors/me/donations', params);
  }

  getStaffQueue(): Observable<ApiResponse<Array<{ appointment: any; donor: string; slotTime: string; status: string }>>> {
    return this.api.get('/staff/me/queue');
  }
}
