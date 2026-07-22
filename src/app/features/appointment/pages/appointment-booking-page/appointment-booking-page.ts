import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { CenterStore } from '@/app/features/center/center.store';
import { DonorStore } from '@/app/features/donor/donor.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { CenterSummary } from '@/app/shared/models/center.model';
import type { Slot } from '@/app/shared/models/center.model';
import { formatDate, formatTime } from '@/app/shared/utils/date-utils';

@Component({
  selector: 'app-appointment-booking-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    DatePicker,
    Dialog,
    InputText,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './appointment-booking-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentBookingPageComponent implements OnInit {
  protected readonly centerStore = inject(CenterStore);
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);
  private readonly donorStore = inject(DonorStore);

  protected readonly step = signal(1);
  protected readonly searchControl = new FormControl('');
  protected readonly selectedCenter = signal<CenterSummary | null>(null);
  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly selectedSlot = signal<Slot | null>(null);
  protected readonly showQrDialog = signal(false);
  protected readonly isBooking = signal(false);
  protected readonly bookingError = signal('');
  protected readonly lastQrCode = signal('');

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  protected readonly steps = ['Center', 'Date', 'Time', 'Confirm'];
  protected readonly minDate = new Date();

  ngOnInit(): void {
    this.centerStore.loadCenters({ page: 0, size: 50, status: 'ACTIVE' });
  }

  protected searchCenters(): void {
    const params: Record<string, string | number | boolean | undefined> = { page: 0, size: 50, status: 'ACTIVE' };
    const city = this.searchControl.value?.trim();
    if (city) params['city'] = city;
    this.centerStore.loadCenters(params);
  }

  protected selectCenter(center: CenterSummary): void {
    this.selectedCenter.set(center);
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.step.set(2);
  }

  protected onDateChange(date: Date | null): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    const center = this.selectedCenter();
    if (date && center) {
      const isoDate = date.toISOString().split('T')[0];
      this.centerStore.loadSlots({ centerId: center.id, params: { date: isoDate } });
    }
  }

  protected selectSlot(slot: Slot): void {
    if (slot.isBlocked || slot.bookedCount >= slot.maxBookings) return;
    this.selectedSlot.set(slot);
    this.step.set(4);
  }

  protected goToStep(target: number): void {
    if (target < this.step()) this.step.set(target);
  }

  protected confirmBooking(): void {
    const center = this.selectedCenter();
    const slot = this.selectedSlot();
    if (!center || !slot) return;

    this.isBooking.set(true);
    this.bookingError.set('');
    this.appointmentService.create({
      type: 'REGULAR',
      donorId: this.donorStore.profile()!.id,
      slotId: slot.id,
    }).subscribe({
      next: (res) => {
        this.isBooking.set(false);
        this.lastQrCode.set(res.data.qrCode);
        this.showQrDialog.set(true);
      },
      error: (err: { friendlyMessage?: string }) => {
        this.isBooking.set(false);
        this.bookingError.set(err.friendlyMessage ?? 'Failed to book appointment');
      },
    });
  }

  protected closeQrDialog(): void {
    this.showQrDialog.set(false);
    this.router.navigate([this.router.url.startsWith('/donor') ? '/donor/my-appointments' : '/appointments/my-appointments']); // ponytail
  }

  protected availableSlots(): Slot[] {
    return this.centerStore.slots().filter((s) => !s.isBlocked && s.bookedCount < s.maxBookings);
  }
}
