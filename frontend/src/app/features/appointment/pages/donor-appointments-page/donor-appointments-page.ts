import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Tabs, TabList, Tab, TabPanel } from 'primeng/tabs';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AppointmentStore } from '@/app/features/appointment/appointment.store';
import { AppointmentCardComponent } from '@/app/shared/components/appointment-card/appointment-card';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { environment } from '@/environments/environment';
import type { DonorAppointmentView } from '@/app/shared/models/appointment.model';

@Component({
  selector: 'app-donor-appointments-page',
  standalone: true,
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Dialog,
    Button,
    RouterLink,
    AppointmentCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './donor-appointments-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorAppointmentsPageComponent implements OnInit {
  protected readonly store = inject(AppointmentStore);
  private readonly router = inject(Router);

  protected readonly qrDialogVisible = signal(false);
  protected readonly qrCode = signal('');
  protected readonly cancelTarget = signal<DonorAppointmentView | null>(null);

  ngOnInit(): void {
    this.store.loadMyAppointments({ page: 0, size: 20 });
  }

  protected showQr(appointment: DonorAppointmentView): void {
    this.qrCode.set(appointment.qrCode);
    this.qrDialogVisible.set(true);
  }

  protected requestCancel(appointment: DonorAppointmentView): void {
    this.cancelTarget.set(appointment);
  }

  protected confirmCancel(): void {
    const target = this.cancelTarget();
    if (!target) return;
    this.store.cancelAppointment(target.id, 'Cancelled by donor');
    this.cancelTarget.set(null);
  }

  protected downloadCertificate(appointment: DonorAppointmentView): void {
    window.open(`${environment.baseUrl}/api/v1/donors/me/certificates/${appointment.id}/download`, '_blank');
  }

  protected bookAppointment(): void {
    this.router.navigate(['/appointments/book']);
  }

  protected rescheduleAppointment(appointment: DonorAppointmentView): void {
    this.router.navigate(['/appointments', appointment.id, 'reschedule']);
  }
}
