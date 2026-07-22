import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { StaffStore } from '@/app/features/appointment/staff.store';
import { EmergencyService } from '@/app/features/emergency/emergency.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-staff-dashboard-page',
  standalone: true,
  imports: [Button, RouterLink, LoadingSpinnerComponent],
  templateUrl: './staff-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffDashboardPageComponent implements OnInit {
  private readonly staffStore = inject(StaffStore);
  private readonly emergencyService = inject(EmergencyService);

  protected readonly isLoading = signal(true);
  protected readonly todayDonations = signal(0);
  protected readonly mlCollectedToday = signal(0);
  protected readonly activeEmergencies = signal(0);
  protected readonly nextAppointment = signal<{ id: number; donor: string; slotTime: string } | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);

    this.staffStore.loadQueue({ page: 1, size: 50 });

    const centerId = this.staffStore.centerId();
    if (centerId) {
      this.emergencyService.getList({ centerId, status: 'OPEN', size: 100 }).subscribe({
        next: (eRes) => this.activeEmergencies.set(eRes.page?.totalElements ?? eRes.data.length),
        error: () => {},
      });
    }

    this.isLoading.set(false);
  }

  protected get queue() {
    return this.staffStore.queue;
  }

  protected statusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
      case 'CHECKED_IN': return 'bg-yellow-100 text-yellow-700';
      case 'IN_SCREENING': return 'bg-orange-100 text-orange-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-gray-100 text-gray-500';
      case 'NO_SHOW': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  }
}
