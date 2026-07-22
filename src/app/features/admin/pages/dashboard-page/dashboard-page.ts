import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '@/app/features/admin/admin.service';
import type { MetricsResponse } from '@/app/shared/models/analytics.model';
import { AuthStore } from '@/app/core/auth/auth.store';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [Button, RouterLink, DecimalPipe],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly authStore = inject(AuthStore);
  protected readonly metrics = signal<MetricsResponse[]>([]);
  protected readonly isLoading = signal(true);

  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
  readonly pieCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChart');

  private barChart: Chart<'bar'> | null = null;
  private pieChart: Chart<'doughnut'> | null = null;

  ngOnInit(): void {
    this.adminService.getMetrics().subscribe({
      next: (res) => {
        this.metrics.set(res.data);
        this.isLoading.set(false);
        setTimeout(() => this.initCharts(res.data));
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected getMetric(name: string): MetricsResponse | undefined {
    return this.metrics().find((m) => m.metricName === name);
  }

  private initCharts(data: MetricsResponse[]): void {
    const metricsWithTotal = data.filter((m) => m.total > 0).slice(0, 6);
    if (metricsWithTotal.length) {
      const ctx = this.barCanvas()?.nativeElement;
      if (ctx) {
        this.barChart?.destroy();
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metricsWithTotal.map((m) => m.metricName.replace(/_/g, ' ')),
            datasets: [{ label: 'Total', data: metricsWithTotal.map((m) => m.total), backgroundColor: 'rgba(204, 0, 0, 0.7)', borderRadius: 6 }],
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }
    }

    const pieCtx = this.pieCanvas()?.nativeElement;
    const completed = data.find((m) => m.metricName === 'completed_appointments');
    const total = data.find((m) => m.metricName === 'total_appointments');
    if (pieCtx && completed && total && total.total > 0) {
      const rate = Math.round((completed.total / total.total) * 100);
      this.pieChart?.destroy();
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Other'],
          datasets: [{ data: [rate, 100 - rate], backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(107, 114, 128, 0.3)'], borderWidth: 0 }],
        },
        options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom' } } },
      });
    }
  }
}
