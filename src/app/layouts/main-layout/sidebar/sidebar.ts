import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';

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
    chart: 'pi-chart-bar',
    center: 'pi-building',
    envelope: 'pi-envelope',
  };

  protected iconClass(icon: string): string {
    return this.iconMap[icon] ?? 'pi-' + icon;
  }

  protected readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/donor/home', icon: 'dashboard', roles: ['DONOR'] },
    { label: 'My Profile', path: '/donor/profile', icon: 'person', roles: ['DONOR'] },
    { label: 'My Appointments', path: '/appointments/my-appointments', icon: 'calendar_today', roles: ['DONOR'] },
    { label: 'Donation History', path: '/appointments/donation-history', icon: 'history', roles: ['DONOR'] },
    { label: 'Emergencies', path: '/emergencies/list', icon: 'warning', roles: ['DONOR'] },
    { label: 'Impact', path: '/donor/impact', icon: 'favorite', roles: ['DONOR'] },
    { label: 'Centers', path: '/centers/list', icon: 'local_hospital', roles: ['DONOR'] },
    { label: 'Dashboard', path: '/appointments/staff-dashboard', icon: 'dashboard', roles: ['CENTER_STAFF'] },
    { label: 'Staff Queue', path: '/appointments/staff-queue', icon: 'list_alt', roles: ['CENTER_STAFF'] },
    { label: 'Check-In', path: '/appointments/checkin', icon: 'pi-qrcode', roles: ['CENTER_STAFF'] },
    { label: 'Emergencies', path: '/emergencies/list', icon: 'emergency', roles: ['CENTER_STAFF'] },
    { label: 'Create Emergency', path: '/emergencies/create', icon: 'pi-plus-circle', roles: ['CENTER_STAFF'] },
    { label: 'Manage Center', path: '/centers/list', icon: 'center', roles: ['CENTER_ADMIN'] },
    { label: 'Schedule & Slots', path: '/centers/list', icon: 'pi-calendar', roles: ['CENTER_ADMIN'] },
    { label: 'Staff Management', path: '/centers/list', icon: 'people', roles: ['CENTER_ADMIN'] },
    { label: 'Center Analytics', path: '/centers/list', icon: 'chart', roles: ['CENTER_ADMIN'] },
    { label: 'Center Reports', path: '/centers/list', icon: 'chart', roles: ['CENTER_ADMIN'] },
    { label: 'Emergencies', path: '/emergencies/list', icon: 'emergency', roles: ['CENTER_ADMIN'] },
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: 'admin_panel_settings', roles: ['SUPER_ADMIN'] },
    { label: 'Users', path: '/admin/users', icon: 'people', roles: ['SUPER_ADMIN'] },
    { label: 'Center Approval', path: '/admin/centers', icon: 'verified', roles: ['SUPER_ADMIN'] },
    { label: 'Health Restrictions', path: '/admin/health-restrictions', icon: 'pi-shield', roles: ['SUPER_ADMIN'] },
    { label: 'System Health', path: '/admin/system-health', icon: 'pi-heart', roles: ['SUPER_ADMIN'] },
    { label: 'Reports', path: '/admin/reports', icon: 'chart', roles: ['SUPER_ADMIN'] },
    { label: 'Forecasts', path: '/admin/forecasts', icon: 'pi-chart-line', roles: ['SUPER_ADMIN'] },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: 'history', roles: ['SUPER_ADMIN'] },
    { label: 'Notifications', path: '/notifications/list', icon: 'notifications', roles: ['DONOR', 'CENTER_STAFF', 'CENTER_ADMIN', 'SUPER_ADMIN'] },
    { label: 'Contact Us', path: '/contact', icon: 'envelope' },
  ];

  protected readonly activeRole = computed(() => {
    if (this.authStore.isSuperAdmin()) return 'SUPER_ADMIN';
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
