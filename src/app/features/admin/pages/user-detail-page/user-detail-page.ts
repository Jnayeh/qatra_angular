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
    <div class="max-w-2xl mx-auto space-y-6">
      @if (user(); as u) {
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">{{ u.displayName }}</h1>
          <app-status-badge [status]="u.status" />
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="space-y-3">
            <div class="flex justify-between"><span class="text-gray-400">Email</span><span class="text-white">{{ u.email }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Roles</span><span class="text-white">{{ u.roles.join(', ') }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Email Verified</span><i class="pi" [class.pi-check-circle]="u.emailVerified" [class.pi-times-circle]="!u.emailVerified" [class.text-green-400]="u.emailVerified" [class.text-gray-600]="!u.emailVerified"></i></div>
            <div class="flex justify-between"><span class="text-gray-400">Created</span><span class="text-white">{{ u.createdAt }}</span></div>
          </div>
        </div>
      }
      <a pButton label="Back to Users" severity="secondary" styleClass="p-button-outlined" routerLink="/admin/users"></a>
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
