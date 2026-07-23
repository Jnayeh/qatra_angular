import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import type { MenuItem } from 'primeng/api';
import type { Role } from '@/app/shared/models/user.model';
import { AuthStore } from '@/app/core/auth/auth.store';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink, Button, Menu],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNavbarComponent {
  protected readonly authStore = inject(AuthStore);

  private readonly roleRouteMap: Record<string, string> = {
    DONOR: '/donor/home',
    CENTER_STAFF: '/center-management/dashboard',
    CENTER_ADMIN: '/center-management/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
  };

  protected readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.authStore.user()?.displayName ?? 'User',
      items: this.authStore.userRoles().filter((r:Role) => {
        if(r == "CENTER_STAFF" && this.authStore.userRoles().includes("CENTER_ADMIN")) {
          return false;
        }
        return true;
      }).map((role) => ({
        label: role === 'DONOR' ? 'Donor Home'
             : role === 'SUPER_ADMIN' ? 'Admin Dashboard'
             : 'Center Dashboard',
        icon: role === 'DONOR' ? 'pi pi-heart'
            : role === 'SUPER_ADMIN' ? 'pi pi-shield'
            : 'pi pi-building',
        routerLink: this.roleRouteMap[role],
      })),
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authStore.logout(),
    },
  ]);
}
