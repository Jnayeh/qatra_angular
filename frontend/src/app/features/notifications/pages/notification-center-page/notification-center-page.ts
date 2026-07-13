import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { NotificationStore } from '@/app/features/notifications/notification.store';

@Component({
  selector: 'app-notification-center-page',
  standalone: true,
  imports: [Card, Button, EmptyStateComponent, StatusBadgeComponent],
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
      EMERGENCY_ALERT: 'pi-exclamation-triangle',
      APPOINTMENT_REMINDER: 'pi-calendar',
      ELIGIBILITY_REMINDER: 'pi-heart',
      PROFILE_COMPLETION: 'pi-check-circle',
      PASSWORD_RESET: 'pi-envelope',
      GENERAL: 'pi-bell',
    };
    return icons[type] ?? 'pi-bell';
  }
}
