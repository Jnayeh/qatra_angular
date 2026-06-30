import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { Menu } from 'primeng/menu';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [Button, Badge, Menu, RouterLink],
  templateUrl: './notification-bell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBellComponent {
  private readonly router = inject(Router);

  // Placeholder — will connect to NotificationStore once built
  protected readonly unreadCount = () => 0;
  protected readonly recentNotifications = () => [] as Array<{ id: number; title: string; body: string; status: string }>;

  protected readonly menuItems = computed(() => {
    const notifs = this.recentNotifications();
    if (notifs.length === 0) {
      return [{ label: 'No notifications', disabled: true }];
    }
    return notifs.map((n) => ({ label: n.title }));
  });

  protected open(): void {
    this.router.navigate(['/notifications']);
  }
}
