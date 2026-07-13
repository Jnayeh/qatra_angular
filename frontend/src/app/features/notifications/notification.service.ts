import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse, Page } from '@/app/shared/models/api-response.model';
import type { Notification } from '@/app/shared/models/notification.model';
import { ApiService } from '@/app/core/http/api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(ApiService);

  getNotifications(params?: Record<string, string | number | boolean | undefined>): Observable<ApiResponse<Page<Notification>>> {
    return this.api.getPage('/notifications', params);
  }

  markAsRead(id: number): Observable<ApiResponse<Notification>> {
    return this.api.patch(`/notifications/${id}/read`);
  }

  markAllAsRead(): Observable<ApiResponse<{ message: string }>> {
    return this.api.patch('/notifications/read-all');
  }

  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.api.get('/notifications/unread-count');
  }
}
