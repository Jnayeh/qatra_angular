import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { EmergencyService } from '@/app/features/emergency/emergency.service';
import { CenterService } from '@/app/features/center/center.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-staff-dashboard-page',
  standalone: true,
  imports: [Card, Button, RouterLink, LoadingSpinnerComponent],
  templateUrl: './staff-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffDashboardPageComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly emergencyService = inject(EmergencyService);
  private readonly centerService = inject(CenterService);

  protected readonly isLoading = signal(true);
  protected readonly todayDonations = signal(0);
  protected readonly mlCollectedToday = signal(0);
  protected readonly activeEmergencies = signal(0);
  protected readonly nextAppointment = signal<{ id: number; donor: string; slotTime: string } | null>(null);
  protected readonly queue = signal<Array<{ appointment: any; donor: string; slotTime: string; status: string }>>([]);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);

    this.centerService.getMyCenter().subscribe({
      next: (res) => {
        const centerId = res.data.id;
        this.emergencyService.getList({ centerId, status: 'OPEN', size: 100 }).subscribe({
          next: (eRes) => this.activeEmergencies.set(eRes.page?.totalElements ?? eRes.data.length),
          error: () => {},
        });
      },
      error: () => {},
    });

    this.appointmentService.getStaffQueue().subscribe({
      next: (res) => {
        this.queue.set(res.data as any);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.appointmentService.getStaffStats().subscribe({
      next: (res) => {
        this.todayDonations.set(res.data.todayDonations);
        this.mlCollectedToday.set(res.data.mlCollectedToday);
        this.nextAppointment.set(res.data.nextAppointment);
      },
      error: () => {},
    });
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
