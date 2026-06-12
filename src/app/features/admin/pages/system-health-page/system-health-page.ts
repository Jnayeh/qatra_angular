import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { AdminService } from '@/app/features/admin/admin.service';
import type { SystemHealth } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-system-health-page',
  standalone: true,
  imports: [Card, TableModule, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './system-health-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemHealthPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly health = signal<SystemHealth | null>(null);
  protected readonly isLoading = signal(true);

  protected readonly errorRateEntries = computed(() => {
    const h = this.health();
    return h ? Object.entries(h.errorRates.byEndpoint) : [];
  });

  protected readonly dbPoolActivePercent = computed(() => {
    const h = this.health();
    if (!h || h.dbPoolStats.max === 0) return 0;
    return (h.dbPoolStats.active / h.dbPoolStats.max) * 100;
  });

  protected readonly dbPoolIdlePercent = computed(() => {
    const h = this.health();
    if (!h || h.dbPoolStats.max === 0) return 0;
    return (h.dbPoolStats.idle / h.dbPoolStats.max) * 100;
  });

  ngOnInit(): void {
    this.adminService.getSystemHealth().subscribe({
      next: (res) => {
        this.health.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
