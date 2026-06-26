import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../../../core/auth/auth.store';
import { NotificationBellComponent } from '../../../shared/components/notification-bell/notification-bell';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NotificationBellComponent,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly menuToggle = output<void>();
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly title = signal('Qatra');

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
