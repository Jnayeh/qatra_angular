import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { DonorStore } from '../../donor.store';

Chart.register(...registerables);

@Component({
  selector: 'app-impact-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './impact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpactPageComponent implements OnInit, AfterViewInit {
  protected readonly store = inject(DonorStore);

  readonly donutCanvas = viewChild<ElementRef<HTMLCanvasElement>>('donutChart');
  readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');

  private donutChart: Chart<'doughnut'> | null = null;
  private barChart: Chart<'bar'> | null = null;

  ngOnInit(): void {
    this.store.loadImpact();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts());
  }

  private initCharts(): void {
    const donutCtx = this.donutCanvas()?.nativeElement;
    if (donutCtx) {
      this.donutChart?.destroy();
      this.donutChart = new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Regular', 'Emergency'],
          datasets: [{
            data: [70, 30],
            backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'],
          }],
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
      });
    }

    const barCtx = this.barCanvas()?.nativeElement;
    if (barCtx) {
      this.barChart?.destroy();
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Donations',
            data: [3, 5, 2, 7, 4, 6],
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
          }],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });
    }
  }
}
