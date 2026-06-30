import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../../../core/auth/auth.store';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification-bell';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    Toolbar,
    Button,
    Menu,
    NotificationBellComponent,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly menuToggle = output<void>();
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly title = signal('Qatra');

  protected readonly menuItems = computed(() => [
    {
      label: this.authStore.user()?.displayName ?? '',
      disabled: true,
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authStore.logout(),
    },
  ]);

  constructor() {
    this.router.events
      .pipe(filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const segment = e.urlAfterRedirects.split('/')[1];
        const titles: Record<string, string> = {
          donor: 'Donor Portal',
          centers: 'Donation Centers',
          emergencies: 'Emergency Management',
          appointments: 'Appointments',
          admin: 'Admin Panel',
          notifications: 'Notifications',
        };
        this.title.set(titles[segment] ?? 'Qatra');
      });
  }
}
