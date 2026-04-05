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
import { AuthStore } from '@/app/core/auth/auth.store';

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);

  getMyProfile(): Observable<ApiResponse<DonorProfile>> {
    return this.api.get('/api/v1/donors/me');
  }

  updateMyProfile(data: { displayName: string; phone: string }): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/api/v1/donors/me', data);
  }

  updateBloodType(bloodType: string): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/api/v1/donors/me/blood-type', { bloodType });
  }

  updateLocation(data: { latitude: number; longitude: number; city?: string; country?: string }): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/api/v1/donors/me/location', data);
  }

  updateAvailability(status: string): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/api/v1/donors/me/availability', { status });
  }

  updateNotificationPrefs(prefs: NotificationPreferences): Observable<ApiResponse<DonorProfile>> {
    return this.api.put('/api/v1/donors/me/notification-prefs', { preferences: prefs });
  }

  getHealthQuestionnaire(): Observable<ApiResponse<HealthQuestionnaire>> {
    return this.api.get('/api/v1/donors/me/health-questionnaire');
  }

  updateHealthQuestionnaire(data: Partial<HealthQuestionnaire>): Observable<ApiResponse<HealthQuestionnaire>> {
    return this.api.put('/api/v1/donors/me/health-questionnaire', data);
  }

  getEligibility(): Observable<ApiResponse<EligibilityStatus>> {
    return this.api.get('/api/v1/donors/me/eligibility');
  }

  getImpact(): Observable<ApiResponse<ImpactSummary>> {
    return this.api.get('/api/v1/donors/me/impact');
  }

  getCertificates(): Observable<ApiResponse<Certificate[]>> {
    return this.api.get('/api/v1/donors/me/certificates');
  }

  requestAccountDeletion(): Observable<ApiResponse<unknown>> {
    const userId = this.authStore.user()?.id;
    return this.api.post('/api/v1/system/gdpr/request', { userId, reason: 'User requested account deletion' });
  }
}
