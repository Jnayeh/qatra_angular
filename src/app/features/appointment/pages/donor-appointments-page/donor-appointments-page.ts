import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Tabs, TabList, Tab, TabPanel } from 'primeng/tabs';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AppointmentStore } from '@/app/features/appointment/appointment.store';
import { AppointmentCardComponent } from '@/app/shared/components/appointment-card/appointment-card';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { Appointment } from '@/app/shared/models/appointment.model';

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

  protected readonly bookPath = () => this.router.url.startsWith('/donor') ? '/donor/book' : '/appointments/book'; // ponytail

  protected readonly qrDialogVisible = signal(false);
  protected readonly qrCode = signal('');
  protected readonly cancelTarget = signal<Appointment | null>(null);

  ngOnInit(): void {
    this.store.loadMyAppointments({ page: 0, size: 20 });
  }

  protected showQr(appointment: Appointment): void {
    this.qrCode.set(appointment.qrCode);
    this.qrDialogVisible.set(true);
  }

  protected requestCancel(appointment: Appointment): void {
    this.cancelTarget.set(appointment);
  }

  protected confirmCancel(): void {
    const target = this.cancelTarget();
    if (!target) return;
    this.store.cancelAppointment(target.id);
    this.cancelTarget.set(null);
  }

  protected bookAppointment(): void {
    this.router.navigate([this.router.url.startsWith('/donor') ? '/donor/book' : '/appointments/book']); // ponytail
  }

  protected rescheduleAppointment(appointment: Appointment): void {
    this.router.navigate([this.router.url.startsWith('/donor') ? `/donor/${appointment.id}/reschedule` : `/appointments/${appointment.id}/reschedule`]); // ponytail
  }
}
