import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { SystemDashboard } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-center-analytics-page',
  standalone: true,
  imports: [Card, LoadingSpinnerComponent],
  templateUrl: './center-analytics-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterAnalyticsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  protected readonly dashboard = signal<SystemDashboard | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
