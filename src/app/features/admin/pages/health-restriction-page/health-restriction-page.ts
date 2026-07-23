import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AdminService } from '@/app/features/admin/admin.service';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { RestrictedUser } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-health-restriction-page',
  standalone: true,
  imports: [FormsModule, Button, Dialog, InputText, TableModule, StatusBadgeComponent],
  templateUrl: './health-restriction-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthRestrictionPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly restrictedUsers = signal<RestrictedUser[]>([]);
  protected readonly selectedUser = signal<RestrictedUser | null>(null);
  protected readonly isOverriding = signal(false);
  protected readonly showOverrideDialog = signal(false);
  protected overrideReason = '';

  ngOnInit(): void {
    this.loadRestrictedUsers();
  }

  protected loadRestrictedUsers(page: number = 0, size: number = 20): void {
    this.adminService.getRestrictedDonors({ page, size }).subscribe((res) => {
      this.restrictedUsers.set(res.data);
    });
  }

  protected openOverrideDialog(user: RestrictedUser): void {
    this.selectedUser.set(user);
    this.overrideReason = '';
    this.showOverrideDialog.set(true);
  }

  protected overrideStatus(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.isOverriding.set(true);
    this.adminService.overrideRestriction(user.donorId, false, this.overrideReason || undefined).subscribe({
      next: () => {
        this.showOverrideDialog.set(false);
        this.isOverriding.set(false);
        this.loadRestrictedUsers();
      },
      error: () => this.isOverriding.set(false),
    });
  }
}
