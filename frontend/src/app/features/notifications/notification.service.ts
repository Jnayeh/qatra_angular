import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '../../shared/models/api-response.model';
import type { Notification } from '../../shared/models/notification.model';
import { ApiService } from '../../core/http/api.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(ApiService);

  getNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.api.get('/notifications');
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
