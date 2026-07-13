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
import type { UserSummary } from '@/app/shared/models/user.model';

@Component({
  selector: 'app-health-restriction-page',
  standalone: true,
  imports: [FormsModule, Card, TableModule, Button, Dialog, InputText, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './health-restriction-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthRestrictionPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly users = signal<UserSummary[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly totalRecords = signal(0);
  protected readonly currentPage = signal(0);
  protected readonly pageSize = 20;

  protected readonly showOverrideDialog = signal(false);
  protected readonly selectedUser = signal<UserSummary | null>(null);
  protected readonly isOverriding = signal(false);
  protected overrideReason = '';

  protected readonly hasUsers = computed(() => this.users().length > 0);

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.isLoading.set(true);
    this.adminService.getUsers({ page: this.currentPage(), size: this.pageSize }).subscribe({
      next: (res) => {
        const filtered = res.data.filter((u) => (u.status as string) === 'PERMANENTLY_INELIGIBLE');
        this.users.set(filtered);
        this.totalRecords.set(res.page?.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected onPageChange(event: { first: number; rows: number }): void {
    this.currentPage.set(Math.floor(event.first / event.rows));
    this.loadUsers();
  }

  protected openOverrideDialog(user: UserSummary): void {
    this.selectedUser.set(user);
    this.overrideReason = '';
    this.showOverrideDialog.set(true);
  }

  protected overrideStatus(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.isOverriding.set(true);
    this.adminService.updateUserStatus(user.id, 'ACTIVE').subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.showOverrideDialog.set(false);
        this.isOverriding.set(false);
      },
      error: () => this.isOverriding.set(false),
    });
  }
}
