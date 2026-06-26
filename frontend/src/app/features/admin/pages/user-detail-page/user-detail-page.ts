import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import type { UserDetail } from '../../../../shared/models/user.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      @if (user(); as u) {
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">{{ u.displayName }}</h1>
          <app-status-badge [status]="u.status" />
        </div>

        <mat-card class="bg-surface-card">
          <mat-card-content class="space-y-3">
            <div class="flex justify-between"><span class="text-gray-400">Email</span><span class="text-white">{{ u.email }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Roles</span><span class="text-white">{{ u.roles.join(', ') }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Email Verified</span><mat-icon [class.text-green-400]="u.emailVerified" [class.text-gray-600]="!u.emailVerified">{{ u.emailVerified ? 'check_circle' : 'cancel' }}</mat-icon></div>
            <div class="flex justify-between"><span class="text-gray-400">Created</span><span class="text-white">{{ u.createdAt }}</span></div>
          </mat-card-content>
        </mat-card>
      }
      <button mat-stroked-button routerLink="/admin/users">Back to Users</button>
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
