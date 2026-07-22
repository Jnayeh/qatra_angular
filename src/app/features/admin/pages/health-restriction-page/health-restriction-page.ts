import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { AdminService } from '@/app/features/admin/admin.service';
import type { RestrictedUser } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-health-restriction-page',
  standalone: true,
  imports: [FormsModule, Button, Dialog, InputText],
  templateUrl: './health-restriction-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthRestrictionPageComponent {
  private readonly adminService = inject(AdminService);

  protected readonly searchDonorId = signal<number | null>(null);
  protected readonly selectedUser = signal<RestrictedUser | null>(null);
  protected readonly isOverriding = signal(false);
  protected readonly showOverrideDialog = signal(false);
  protected overrideReason = '';

  protected searchAndOpen(donorId: number): void {
    this.adminService.overrideRestriction(donorId, false).subscribe({
      next: () => {
        this.selectedUser.set({ id: 0, email: '', displayName: '', status: 'ACTIVE', donorId, permanentlyRestricted: false, restrictionReason: null });
        this.overrideReason = '';
        this.showOverrideDialog.set(true);
      },
    });
  }

  protected overrideStatus(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.isOverriding.set(true);
    this.adminService.overrideRestriction(user.donorId, false, this.overrideReason || undefined).subscribe({
      next: () => {
        this.showOverrideDialog.set(false);
        this.isOverriding.set(false);
      },
      error: () => this.isOverriding.set(false),
    });
  }
}
