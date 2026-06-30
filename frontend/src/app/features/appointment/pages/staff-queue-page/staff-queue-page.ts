import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Tabs, TabList, Tab, TabPanel } from 'primeng/tabs';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { AppointmentService } from '../../appointment.service';

interface QueueItem {
  appointment: any;
  donor: string;
  slotTime: string;
  status: string;
}

@Component({
  selector: 'app-staff-queue-page',
  standalone: true,
  imports: [
    Card,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './staff-queue-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffQueuePageComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);
  protected readonly queue = signal<QueueItem[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadQueue();
  }

  private loadQueue(): void {
    this.appointmentService.getStaffQueue().subscribe({
      next: (res) => {
        this.queue.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected filtered(...statuses: string[]): QueueItem[] {
    return this.queue().filter((item) => statuses.includes(item.status));
  }

  protected goToCheckIn(id: number): void {
    this.router.navigate(['/appointments', 'checkin'], { queryParams: { appointmentId: id } });
  }

  protected goToScreening(id: number): void {
    this.router.navigate(['/appointments', id, 'screening']);
  }

  protected goToComplete(id: number): void {
    this.router.navigate(['/appointments', id, 'complete']);
  }
}
