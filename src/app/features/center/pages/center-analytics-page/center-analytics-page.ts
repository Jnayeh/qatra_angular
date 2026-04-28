import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { CenterMetrics } from '@/app/shared/models/analytics.model';

Chart.register(...registerables);

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

  protected readonly metrics = signal<CenterMetrics | null>(null);
  protected readonly loading = signal(true);

  readonly appointmentsCanvas = viewChild<ElementRef<HTMLCanvasElement>>('appointmentsChart');
  readonly emergenciesCanvas = viewChild<ElementRef<HTMLCanvasElement>>('emergenciesChart');

  private appointmentsChart: Chart<'line'> | null = null;
  private emergenciesChart: Chart<'line'> | null = null;

  ngOnInit(): void {
    const centerId = Number(this.route.snapshot.params['id']);
    this.adminService.getCenterMetrics(centerId).subscribe({
      next: (res) => {
        this.metrics.set(res.data);
        this.loading.set(false);
        setTimeout(() => this.initCharts(res.data));
      },
      error: () => this.loading.set(false),
    });
  }

  private initCharts(data: CenterMetrics): void {
    if (data.appointmentsByDay?.length) {
      const ctx = this.appointmentsCanvas()?.nativeElement;
      if (ctx) {
        this.appointmentsChart?.destroy();
        this.appointmentsChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.appointmentsByDay.map((d) => d.date),
            datasets: [{
              label: 'Appointments Completed',
              data: data.appointmentsByDay.map((d) => d.count),
              borderColor: 'rgba(34, 197, 94, 0.8)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
      }
    }

    if (data.emergenciesByDay?.length) {
      const ctx = this.emergenciesCanvas()?.nativeElement;
      if (ctx) {
        this.emergenciesChart?.destroy();
        this.emergenciesChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.emergenciesByDay.map((d) => d.date),
            datasets: [{
              label: 'Emergencies Created',
              data: data.emergenciesByDay.map((d) => d.count),
              borderColor: 'rgba(239, 68, 68, 0.8)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
      }
    }
  }
}
