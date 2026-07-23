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
    { label: 'Dashboard', path: '/center-management/dashboard', icon: 'dashboard', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Staff Queue', path: '/center-management/appointments/queue', icon: 'list_alt', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Check-In', path: '/center-management/appointments/checkin', icon: 'pi-qrcode', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Emergencies', path: '/center-management/emergencies', icon: 'emergency', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Create Emergency', path: '/center-management/emergencies/create', icon: 'pi-plus-circle', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Manage Center', path: '/center-management/manage', icon: 'center', roles: ['CENTER_ADMIN'] },
    { label: 'Schedule & Slots', path: '/center-management/slots', icon: 'pi-calendar', roles: ['CENTER_ADMIN'] },
    { label: 'Staff Management', path: '/center-management/staff', icon: 'people', roles: ['CENTER_ADMIN'] },
    { label: 'Center Analytics', path: '/center-management/analytics', icon: 'chart', roles: ['CENTER_ADMIN'] },
    { label: 'Center Reports', path: '/center-management/reports', icon: 'chart', roles: ['CENTER_ADMIN'] },
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: 'admin_panel_settings', roles: ['SUPER_ADMIN'] },
    { label: 'Users', path: '/admin/users', icon: 'people', roles: ['SUPER_ADMIN'] },
    { label: 'Center Approval', path: '/admin/centers', icon: 'verified', roles: ['SUPER_ADMIN'] },
    { label: 'Health Restrictions', path: '/admin/health-restrictions', icon: 'pi-shield', roles: ['SUPER_ADMIN'] },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: 'history', roles: ['SUPER_ADMIN'] },
    { label: 'Notifications', path: '/center-management/notifications', icon: 'notifications', roles: ['CENTER_STAFF', 'CENTER_ADMIN'] },
    { label: 'Notifications', path: '/admin/notifications', icon: 'notifications', roles: ['SUPER_ADMIN'] },
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
