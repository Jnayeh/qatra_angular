import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../admin.service';
import type { SystemDashboard } from '../../../../shared/models/analytics.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly dashboard = signal<SystemDashboard | null>(null);

  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
  readonly pieCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChart');
  readonly lineCanvas = viewChild<ElementRef<HTMLCanvasElement>>('lineChart');

  private barChart: Chart<'bar'> | null = null;
  private pieChart: Chart<'doughnut'> | null = null;
  private lineChart: Chart<'line'> | null = null;

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe((res) => {
      this.dashboard.set(res.data);
      setTimeout(() => this.initCharts(res.data));
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
            datasets: [{ label: 'Donations', data: data.topCenters.map((c) => c.donations), backgroundColor: 'rgba(239, 68, 68, 0.7)' }],
          },
          options: { responsive: true, plugins: { legend: { display: false } } },
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
          datasets: [{ data: [rate, 100 - rate], backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(107, 114, 128, 0.3)'] }],
        },
        options: { responsive: true },
      });
    }

    const lineCtx = this.lineCanvas()?.nativeElement;
    if (lineCtx) {
      this.lineChart?.destroy();
      this.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Donations',
            data: [65, 78, 90, 85, 110, 95],
            borderColor: 'rgba(59, 130, 246, 0.8)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
          }],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });
    }
  }
}
