import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { NotificationStore } from '../../notification.store';

@Component({
  selector: 'app-notification-center-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './notification-center-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterPageComponent implements OnInit {
  protected readonly store = inject(NotificationStore);

  ngOnInit(): void {
    this.store.loadNotifications();
  }

  protected notificationIcon(type: string): string {
    const icons: Record<string, string> = {
      EMERGENCY_ALERT: 'emergency',
      APPOINTMENT_REMINDER: 'calendar_today',
      ELIGIBILITY_REMINDER: 'bloodtype',
      PROFILE_COMPLETION: 'check_circle',
      STAFF_MESSAGE: 'message',
      GENERAL: 'notifications',
    };
    return icons[type] ?? 'notifications';
  }
}
