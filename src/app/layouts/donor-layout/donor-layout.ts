import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Menu } from 'primeng/menu';
import { Avatar } from 'primeng/avatar';
import { AuthStore } from '@/app/core/auth/auth.store';
import { AuthService } from '@/app/core/auth/auth.service';
import { DonorStore } from '@/app/features/donor/donor.store';
import { NotificationBellComponent } from '@/app/shared/components/notification-bell/notification-bell';

@Component({
  selector: 'app-donor-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Menu,
    Avatar,
    NotificationBellComponent,
  ],
  templateUrl: './donor-layout.html',
  styleUrl: './donor-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorLayoutComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly donorStore = inject(DonorStore);
  private readonly authService = inject(AuthService);

  protected readonly verificationSent = signal(false);
  protected readonly isSendingVerification = signal(false);

  protected readonly showProfileBanner = computed(() => {
    return this.donorStore.loadedOnce() && !this.donorStore.profileComplete();
  });

  protected readonly showEmailBanner = computed(() => {
    return !this.authStore.user()?.emailVerified;
  });

  ngOnInit(): void {
    this.donorStore.loadProfile();
  }

  protected readonly navLinks = [
    { path: '/donor/home', label: 'Home', icon: 'pi pi-home' },
    { path: '/donor/my-appointments', label: 'Appointments', icon: 'pi pi-calendar' },
    { path: '/donor/donation-history', label: 'History', icon: 'pi pi-history' },
    { path: '/donor/emergencies', label: 'Emergencies', icon: 'pi pi-bolt' },
    { path: '/donor/impact', label: 'Impact', icon: 'pi pi-star' },
    { path: '/donor/centers', label: 'Centers', icon: 'pi pi-map-marker' },
  ];

  protected readonly menuItems = computed(() => [
    {
      label: this.authStore.user()?.displayName ?? 'Donor',
      disabled: true,
      styleClass: 'font-bold',
    },
    { separator: true },
    {
      label: 'Profile & Settings',
      icon: 'pi pi-user',
      routerLink: '/donor/profile',
    },
    {
      label: 'Change Password',
      icon: 'pi pi-key',
      routerLink: '/donor/profile',
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authStore.logout(),
    },
  ]);

  protected getInitials(): string {
    const name = this.authStore.user()?.displayName ?? 'D';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  protected requestVerification(): void {
    this.isSendingVerification.set(true);
    this.authService.requestVerification().subscribe({
      next: () => {
        this.verificationSent.set(true);
        this.isSendingVerification.set(false);
      },
      error: () => {
        this.isSendingVerification.set(false);
      },
    });
  }
}
