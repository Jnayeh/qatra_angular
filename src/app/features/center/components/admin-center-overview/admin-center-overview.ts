import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Chart, registerables } from 'chart.js';
import { AuthStore } from '@/app/core/auth/auth.store';
import { CenterService } from '@/app/features/center/center.service';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { CenterMetrics } from '@/app/shared/models/analytics.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-center-overview',
  standalone: true,
  imports: [RouterLink, Button, LoadingSpinnerComponent],
  templateUrl: './admin-center-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCenterOverviewComponent implements OnInit, AfterViewInit {
  protected readonly authStore = inject(AuthStore);
  private readonly centerService = inject(CenterService);
  private readonly adminService = inject(AdminService);

  protected readonly loading = signal(true);
  protected readonly metrics = signal<CenterMetrics | null>(null);

  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
  readonly pieCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChart');

  private barChart: Chart<'bar'> | null = null;
  private pieChart: Chart<'pie'> | null = null;
  private pendingInit = false;

  ngOnInit(): void {
    this.centerService.getMyAdminProfile().subscribe({
      next: (res) => {
        this.adminService.getCenterMetrics(res.data.centerId).subscribe({
          next: (mRes) => {
            this.metrics.set(mRes.data);
            this.loading.set(false);
            if (this.pendingInit) {
              this.initCharts(mRes.data);
              this.pendingInit = false;
            }
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  ngAfterViewInit(): void {
    const m = this.metrics();
    if (m) {
      this.initCharts(m);
    } else {
      this.pendingInit = true;
    }
  }

  private initCharts(data: CenterMetrics): void {
    if (data.appointmentsByDay?.length) {
      const ctx = this.barCanvas()?.nativeElement;
      if (ctx) {
        this.barChart?.destroy();
        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.appointmentsByDay.map((d) => d.date),
            datasets: [{
              label: 'Appointments',
              data: data.appointmentsByDay.map((d) => d.count),
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
              borderRadius: 4,
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

    const regular = data.todayAppointments - data.todayEmergencies;
    const emergency = data.todayEmergencies;
    if (regular > 0 || emergency > 0) {
      const ctx = this.pieCanvas()?.nativeElement;
      if (ctx) {
        this.pieChart?.destroy();
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Regular', 'Emergency'],
            datasets: [{
              data: [regular, emergency],
              backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'],
              borderColor: ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)'],
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
          },
        });
      }
    }
  }
}
