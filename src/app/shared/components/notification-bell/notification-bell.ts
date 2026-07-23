import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';
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
  private readonly authStore = inject(AuthStore);
  protected readonly store = inject(NotificationStore);
  protected panelOpen = false;

  ngOnInit(): void {
    this.store.loadNotifications();
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    this.store.loadNotifications();
  }

  protected notificationsPath(): string {
    if (this.authStore.isDonor()) return '/donor/notifications';
    if (this.authStore.isCenterStaff() || this.authStore.isCenterAdmin()) return '/center-management/notifications';
    return '/admin/notifications';
  }

  protected openNotification(notification: Notification): void {
    if (notification.status !== 'READ') {
      this.store.markAsRead(notification.id);
    }
    if (notification.emergencyId) {
      const prefix = this.authStore.isDonor() ? '/donor/emergencies' : '/center-management/emergencies';
      this.router.navigate([prefix, notification.emergencyId]);
    } else if (notification.appointmentId) {
      const prefix = this.authStore.isDonor() ? '/donor/my-appointments' : '/center-management/appointments';
      this.router.navigate([prefix]);
    } else {
      this.router.navigate([this.notificationsPath()]);
    }
  }

  protected markAllRead(event: Event): void {
    event.stopPropagation();
    this.store.markAllAsRead();
  }
}
