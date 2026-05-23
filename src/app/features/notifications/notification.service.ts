import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { Notification } from '@/app/shared/models/notification.model';
import { ApiService } from '@/app/core/http/api.service';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getNotifications(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Notification[]>> {
    return this.api.getPage('/api/v1/notifications', params);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/api/v1/notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ markedCount: number }> {
    return this.http.patch<{ markedCount: number }>(`${this.baseUrl}/api/v1/notifications/read-all`, {});
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/api/v1/notifications/unread-count`);
  }
}
