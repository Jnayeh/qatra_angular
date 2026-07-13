import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type {
  Certificate,
  DonorProfile,
  EligibilityStatus,
  HealthQuestionnaire,
  ImpactSummary,
  NotificationPreferences,
} from '@/app/shared/models/donor.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly api = inject(ApiService);

  getMyProfile(): Observable<ApiResponse<DonorProfile>> {
    return this.api.get('/donors/me');
  }

  updateMyProfile(data: { displayName: string; phone: string }): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/donors/me', data);
  }

  updateBloodType(bloodType: string): Observable<ApiResponse<{ bloodType: string; bloodTypeVerified: boolean }>> {
    return this.api.put('/donors/me/blood-type', { bloodType });
  }

  updateLocation(data: { latitude: number; longitude: number; city?: string; country?: string }): Observable<ApiResponse<{ latitude: number; longitude: number; city: string; country: string }>> {
    return this.api.put('/donors/me/location', data);
  }

  updateAvailability(status: string): Observable<ApiResponse<{ availability: string }>> {
    return this.api.put('/donors/me/availability', { status });
  }

  updateNotificationPrefs(prefs: NotificationPreferences): Observable<ApiResponse<NotificationPreferences>> {
    return this.api.put('/donors/me/notification-prefs', { preferences: prefs });
  }

  getHealthQuestionnaire(): Observable<ApiResponse<HealthQuestionnaire>> {
    return this.api.get('/donors/me/health-questionnaire');
  }

  updateHealthQuestionnaire(data: Partial<HealthQuestionnaire>): Observable<ApiResponse<HealthQuestionnaire>> {
    return this.api.put('/donors/me/health-questionnaire', data);
  }

  getEligibility(): Observable<ApiResponse<EligibilityStatus>> {
    return this.api.get('/donors/me/eligibility');
  }

  getImpact(): Observable<ApiResponse<ImpactSummary>> {
    return this.api.get('/donors/me/impact');
  }

  getCertificates(): Observable<ApiResponse<Certificate[]>> {
    return this.api.get('/donors/me/certificates');
  }

  requestAccountDeletion(): Observable<ApiResponse<{ message: string; requestId: number }>> {
    return this.api.delete('/donors/me');
  }
}
