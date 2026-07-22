import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Tabs, TabList, Tab, TabPanel } from 'primeng/tabs';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { StaffStore } from '@/app/features/appointment/staff.store';
import type { Appointment } from '@/app/shared/models/appointment.model';

@Component({
  selector: 'app-staff-queue-page',
  standalone: true,
  imports: [
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
  private readonly staffStore = inject(StaffStore);
  private readonly router = inject(Router);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.staffStore.loadQueue({ page: 1, size: 50 });
    this.isLoading.set(false);
  }

  protected get queue() {
    return this.staffStore.queue;
  }

  protected filtered(...statuses: string[]): Appointment[] {
    return this.staffStore.queue().filter((item) => statuses.includes(item.status));
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

  protected markAsNoShow(id: number): void {
    if (confirm('Are you sure you want to mark this donor as no-show? This will affect their reliability score.')) {
      this.staffStore.markNoShow(id);
    }
  }

  protected viewDonorProfile(donorId: number): void {
    this.router.navigate(['/donors', donorId]);
  }
}
