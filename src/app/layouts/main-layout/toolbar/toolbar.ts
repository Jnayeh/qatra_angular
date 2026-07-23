import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Badge } from 'primeng/badge';
import { AuthStore } from '@/app/core/auth/auth.store';
import { NotificationStore } from '@/app/features/notifications/notification.store';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    Toolbar,
    Button,
    Menu,
    Badge,
    RouterLink,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly menuToggle = output<void>();
  readonly authStore = inject(AuthStore);
  readonly store = inject(NotificationStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef);

  protected readonly panelOpen = signal(false);
  protected readonly title = signal('Qatra');

  protected notificationsPath(): string {
    if (this.authStore.isCenterStaff() || this.authStore.isCenterAdmin()) return '/center-management/notifications';
    return '/admin/notifications';
  }

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

  protected togglePanel(event: PointerEvent): void {
    event.stopPropagation();
    this.panelOpen.update((v) => !v);
  }

  protected markAllRead(event: PointerEvent): void {
    event.stopPropagation();
    this.store.markAllAsRead();
  }

  protected openNotification(n: { id: number }): void {
    this.store.markAsRead(n.id);
  }

  constructor() {
    this.router.events
      .pipe(
        filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        const segment = e.urlAfterRedirects.split('/')[1];
        const titles: Record<string, string> = {
          donor: 'Donor Portal',
          centers: 'Donation Centers',
          emergencies: 'Emergency Management',
          appointments: 'Appointments',
          admin: 'Admin Panel',
          'center-management': 'Center Management',
          notifications: 'Notifications',
          manage: 'Manage Center',
          slots: 'Schedule & Slots',
          staff: 'Staff Management',
          analytics: 'Center Analytics',
          reports: 'Center Reports',
        };
        this.title.set(titles[segment] ?? 'Qatra');
      });

    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e: MouseEvent) => {
        if (this.panelOpen() && !this.hostRef.nativeElement.contains(e.target)) {
          this.panelOpen.set(false);
        }
      });
    }
  }
}
