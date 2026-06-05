import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { AdminService } from '@/app/features/admin/admin.service';
import type { RestrictedUser } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-health-restriction-page',
  standalone: true,
  imports: [FormsModule, Card, TableModule, Button, Dialog, InputText, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './health-restriction-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthRestrictionPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly users = signal<RestrictedUser[]>([]);
  protected readonly isLoading = signal(true);

  protected readonly showOverrideDialog = signal(false);
  protected readonly selectedUser = signal<RestrictedUser | null>(null);
  protected readonly isOverriding = signal(false);
  protected overrideReason = '';

  protected readonly hasUsers = computed(() => this.users().length > 0);

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.isLoading.set(true);
    this.adminService.getRestrictedUsers().subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
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
        this.users.update((list) => list.filter((u) => u.donorId !== user.donorId));
        this.showOverrideDialog.set(false);
        this.isOverriding.set(false);
      },
      error: () => this.isOverriding.set(false),
    });
  }
}
