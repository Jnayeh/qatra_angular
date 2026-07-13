import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { Router, RouterLink } from '@angular/router';
import { NotificationStore } from '@/app/features/notifications/notification.store';
import type { Notification } from '@/app/shared/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [Button, Badge, RouterLink],
  templateUrl: './notification-bell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly store = inject(NotificationStore);
  protected panelOpen = false;

  ngOnInit(): void {
    this.store.loadNotifications();
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    this.store.loadNotifications();
  }

  protected openNotification(notification: Notification): void {
    if (notification.status !== 'READ') {
      this.store.markAsRead(notification.id);
    }
    if (notification.emergencyId) {
      this.router.navigate(['/emergencies', notification.emergencyId]);
    } else if (notification.appointmentId) {
      this.router.navigate(['/appointments/my-appointments']);
    } else {
      this.router.navigate(['/notifications']);
    }
  }

  protected markAllRead(event: Event): void {
    event.stopPropagation();
    this.store.markAllAsRead();
  }
}
