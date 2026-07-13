import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '@/app/features/admin/admin.service';
import type { SystemDashboard } from '@/app/shared/models/analytics.model';
import { AuthStore } from '@/app/core/auth/auth.store';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [Card, Button, RouterLink],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly authStore = inject(AuthStore);
  protected readonly dashboard = signal<SystemDashboard | null>(null);
  protected readonly isLoading = signal(true);

  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
  readonly pieCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChart');

  private barChart: Chart<'bar'> | null = null;
  private pieChart: Chart<'doughnut'> | null = null;

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard.set(res.data);
        this.isLoading.set(false);
        setTimeout(() => this.initCharts(res.data));
      },
      error: () => this.isLoading.set(false),
    });
  }

  private initCharts(data: SystemDashboard): void {
    if (data.topCenters?.length) {
      const ctx = this.barCanvas()?.nativeElement;
      if (ctx) {
        this.barChart?.destroy();
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.topCenters.map((c) => c.name),
            datasets: [{ label: 'Donations', data: data.topCenters.map((c) => c.donations), backgroundColor: 'rgba(204, 0, 0, 0.7)', borderRadius: 6 }],
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }
    }

    const pieCtx = this.pieCanvas()?.nativeElement;
    if (pieCtx) {
      const rate = data.responseRate30d ?? 50;
      this.pieChart?.destroy();
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Responded', 'No Response'],
          datasets: [{ data: [rate, 100 - rate], backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(107, 114, 128, 0.3)'], borderWidth: 0 }],
        },
        options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom' } } },
      });
    }
  }
}
