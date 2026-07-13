import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@/app/shared/models/api-response.model';
import type { Notification } from '@/app/shared/models/notification.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(ApiService);

  getNotifications(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Notification[]>> {
    return this.api.getPage('/api/v1/notifications', params);
  }

  markAsRead(id: number): Observable<ApiResponse<Notification>> {
    return this.api.patch(`/api/v1/notifications/${id}/read`);
  }

  markAllAsRead(): Observable<ApiResponse<{ message: string }>> {
    return this.api.patch('/api/v1/notifications/read-all');
  }

  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.api.get('/api/v1/notifications/unread-count');
  }
}
