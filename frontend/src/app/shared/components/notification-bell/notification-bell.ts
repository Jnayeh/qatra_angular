import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule, RouterLink],
  templateUrl: './notification-bell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent {
  // Placeholder — will connect to NotificationStore once built
  protected readonly unreadCount = () => 0;
  protected readonly recentNotifications = () => [] as Array<{ id: number; title: string; body: string; status: string }>;

  protected open(): void {
    // Will be implemented with NotificationStore
  }
}
