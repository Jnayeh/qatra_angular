import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth.store';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [Button, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly toggle = output<void>();
  readonly authStore = inject(AuthStore);

  private readonly iconMap: Record<string, string> = {
    dashboard: 'pi-th-large',
    person: 'pi-user',
    calendar_today: 'pi-calendar',
    warning: 'pi-exclamation-triangle',
    favorite: 'pi-heart-fill',
    local_hospital: 'pi-building',
    list_alt: 'pi-list',
    emergency: 'pi-exclamation-triangle',
    admin_panel_settings: 'pi-shield',
    people: 'pi-users',
    verified: 'pi-check-circle',
    history: 'pi-history',
    notifications: 'pi-bell',
  };

  protected iconClass(icon: string): string {
    return this.iconMap[icon] ?? 'pi-' + icon;
  }

  protected readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/donor/dashboard', icon: 'dashboard', roles: ['DONOR'] },
    { label: 'My Profile', path: '/donor/profile', icon: 'person', roles: ['DONOR'] },
    { label: 'My Appointments', path: '/appointments/my-appointments', icon: 'calendar_today', roles: ['DONOR'] },
    { label: 'Emergencies', path: '/emergencies/list', icon: 'warning', roles: ['DONOR'] },
    { label: 'Impact', path: '/donor/impact', icon: 'favorite', roles: ['DONOR'] },
    { label: 'Centers', path: '/centers', icon: 'local_hospital' },
    { label: 'Staff Queue', path: '/appointments/staff-queue', icon: 'list_alt', roles: ['CENTER_STAFF'] },
    { label: 'Emergencies', path: '/emergencies', icon: 'emergency', roles: ['CENTER_STAFF', 'CENTER_ADMIN', 'SYSTEM_ADMIN'] },
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: 'admin_panel_settings', roles: ['SYSTEM_ADMIN'] },
    { label: 'Users', path: '/admin/users', icon: 'people', roles: ['SYSTEM_ADMIN'] },
    { label: 'Center Approval', path: '/admin/centers', icon: 'verified', roles: ['SYSTEM_ADMIN'] },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: 'history', roles: ['SYSTEM_ADMIN'] },
    { label: 'Notifications', path: '/notifications', icon: 'notifications' },
  ];

  protected readonly activeRole = computed(() => {
    if (this.authStore.isSuperAdmin()) return 'SYSTEM_ADMIN';
    if (this.authStore.isCenterAdmin()) return 'CENTER_ADMIN';
    if (this.authStore.isCenterStaff()) return 'CENTER_STAFF';
    return 'DONOR';
  });

  protected readonly navItems = computed(() =>
    this.allNavItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(this.activeRole());
    }),
  );
}
