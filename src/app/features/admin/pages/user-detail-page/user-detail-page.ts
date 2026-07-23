import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { UserDetail } from '@/app/shared/models/user.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [Button, RouterLink, StatusBadgeComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 pb-8">
      @if (user(); as u) {
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ u.displayName }}</h1>
            <p class="text-sm text-gray-500 mt-1">User details and account information</p>
          </div>
          <app-status-badge [status]="u.status" />
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Email</span>
              <span class="text-sm font-medium text-gray-900">{{ u.email }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Roles</span>
              <span class="text-sm font-medium text-gray-900">{{ u.roles.join(', ') }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Email Verified</span>
              <i class="pi" [class.pi-check-circle]="u.emailVerified" [class.pi-times-circle]="!u.emailVerified" [class.text-green-500]="u.emailVerified" [class.text-gray-400]="!u.emailVerified"></i>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-500">Created</span>
              <span class="text-sm font-medium text-gray-900">{{ u.createdAt }}</span>
            </div>
          </div>
        </div>
      }
      <a pButton label="Back to Users" icon="pi pi-arrow-left" severity="secondary" styleClass="p-button-outlined" routerLink="/admin/users"></a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  protected readonly user = signal<UserDetail | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.adminService.getUser(id).subscribe((res) => this.user.set(res.data));
    }
  }
}
