import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, afterNextRender, viewChild } from '@angular/core';
import { StaffStore } from '@/app/features/appointment/staff.store';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { CenterMetrics, DayCount } from '@/app/shared/models/analytics.model';

@Component({
  selector: 'app-staff-center-analytics-page',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  templateUrl: './staff-center-analytics-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffCenterAnalyticsPageComponent implements OnInit {
  private readonly staffStore = inject(StaffStore);
  private readonly adminService = inject(AdminService);

  protected readonly loading = signal(true);
  protected readonly metrics = signal<CenterMetrics | null>(null);

  protected readonly appointmentsChart = viewChild<ElementRef<HTMLCanvasElement>>('appointmentsChart');
  protected readonly emergenciesChart = viewChild<ElementRef<HTMLCanvasElement>>('emergenciesChart');

  constructor() {
    afterNextRender(() => this.renderCharts());
  }

  ngOnInit(): void {
    const centerId = this.staffStore.centerId();
    if (centerId) {
      this.adminService.getCenterMetrics(centerId).subscribe({
        next: (res) => {
          this.metrics.set(res.data);
          this.loading.set(false);
          this.renderCharts();
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loading.set(false);
    }
  }

  private renderCharts(): void {
    const m = this.metrics();
    if (!m) return;

    const drawBarChart = (canvas: HTMLCanvasElement, data: DayCount[], color: string) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !data.length) return;

      const width = canvas.width = canvas.parentElement?.clientWidth ?? 400;
      const height = canvas.height = 200;
      const padding = 40;
      const barWidth = (width - padding * 2) / data.length - 4;
      const maxCount = Math.max(...data.map((d) => (d as any).count ?? 0), 1);

      ctx.clearRect(0, 0, width, height);

      data.forEach((d, i) => {
        const count = (d as any).count ?? 0;
        const barHeight = (count / maxCount) * (height - padding * 2);
        const x = padding + i * (barWidth + 4);
        const y = height - padding - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#6b7280';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const label = ((d as any).date ?? '') as string;
        ctx.fillText(label.slice(5), x + barWidth / 2, height - padding + 14);
        ctx.fillText(String(count), x + barWidth / 2, y - 4);
      });
    };

    const ac = this.appointmentsChart();
    if (ac && m.appointmentsByDay?.length) {
      drawBarChart(ac.nativeElement, m.appointmentsByDay, '#3b82f6');
    }

    const ec = this.emergenciesChart();
    if (ec && m.emergenciesByDay?.length) {
      drawBarChart(ec.nativeElement, m.emergenciesByDay, '#ef4444');
    }
  }
}
