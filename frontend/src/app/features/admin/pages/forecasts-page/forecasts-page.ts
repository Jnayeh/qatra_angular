import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';

@Component({
  selector: 'app-forecasts-page',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Demand Forecasts</h1>
      <app-empty-state icon="chart-line" title="Forecasts coming soon" message="Blood type demand forecasts by region with charts." />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastsPageComponent {}
