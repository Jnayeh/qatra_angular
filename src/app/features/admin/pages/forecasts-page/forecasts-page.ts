import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { AdminService } from '@/app/features/admin/admin.service';
import type { DemandForecast } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-forecasts-page',
  standalone: true,
  imports: [Card, TableModule, Button, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './forecasts-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly forecasts = signal<DemandForecast[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadForecasts();
  }

  protected loadForecasts(): void {
    this.isLoading.set(true);
    this.adminService.getForecasts().subscribe({
      next: (res) => {
        this.forecasts.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
