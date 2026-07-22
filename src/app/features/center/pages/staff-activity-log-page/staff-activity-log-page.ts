import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import type { AuditLogEntry } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-staff-activity-log-page',
  standalone: true,
  imports: [Button, TableModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './staff-activity-log-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffActivityLogPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  protected readonly logs = signal<AuditLogEntry[]>([]);
  protected readonly loading = signal(true);
  protected readonly page = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly pageSize = 20;

  private centerId = 0;

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.params['id']);
    this.loadLogs();
  }

  private loadLogs(): void {
    this.loading.set(true);
    this.adminService.getAuditLogs({ page: this.page(), size: this.pageSize, centerId: this.centerId }).subscribe({
      next: (res) => {
        this.logs.set(res.data);
        this.totalPages.set(res.page?.totalPages ?? 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p) => p + 1);
      this.loadLogs();
    }
  }

  protected prevPage(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
      this.loadLogs();
    }
  }
}
