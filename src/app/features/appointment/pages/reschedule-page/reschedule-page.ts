import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Message } from 'primeng/message';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { CenterService } from '@/app/features/center/center.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { formatTime } from '@/app/shared/utils/date-utils';
import type { Appointment } from '@/app/shared/models/appointment.model';
import type { Slot } from '@/app/shared/models/center.model';

@Component({
  selector: 'app-reschedule-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    DatePicker,
    Message,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    DatePipe,
  ],
  templateUrl: './reschedule-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReschedulePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  private readonly centerService = inject(CenterService);

  protected readonly appointment = signal<Appointment | null>(null);
  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly slots = signal<Slot[]>([]);
  protected readonly selectedSlot = signal<Slot | null>(null);
  protected readonly isLoadingAppointment = signal(true);
  protected readonly isLoadingSlots = signal(false);
  protected readonly isRescheduling = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly dateControl = new FormControl<Date | null>(null);
  protected readonly formatTime = formatTime;
  protected readonly minDate = new Date();

  private myAppointmentsPath(): string { 
    return this.router.url.startsWith('/donor') ? '/donor/my-appointments' : '/center-management/appointments/queue';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate([this.myAppointmentsPath()]);
      return;
    }

    this.appointmentService.getDetail(id).subscribe({
      next: (res) => {
        this.appointment.set(res.data);
        this.isLoadingAppointment.set(false);
      },
      error: (err: { friendlyMessage?: string }) => {
        this.errorMessage.set(err.friendlyMessage ?? 'Failed to load appointment');
        this.isLoadingAppointment.set(false);
      },
    });
  }

  protected onDateChange(date: Date | null): void {
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    this.slots.set([]);

    const appt = this.appointment();
    if (date && appt) {
      const isoDate = date.toISOString().split('T')[0];
      this.isLoadingSlots.set(true);
      this.centerService.getSlots(appt.centerId, { date: isoDate }).subscribe({
        next: (res) => {
          this.slots.set(
            res.data
              .filter((s) => !s.isBlocked && s.bookedCount < s.maxBookings)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
          );
          this.isLoadingSlots.set(false);
        },
        error: (err: { friendlyMessage?: string }) => {
          this.errorMessage.set(err.friendlyMessage ?? 'Failed to load slots');
          this.isLoadingSlots.set(false);
        },
      });
    }
  }

  protected selectSlot(slot: Slot): void {
    this.selectedSlot.set(slot);
  }

  protected confirmReschedule(): void {
    const appt = this.appointment();
    const slot = this.selectedSlot();
    if (!appt || !slot) return;

    this.isRescheduling.set(true);
    this.errorMessage.set('');

    this.appointmentService.reschedule(appt.id, slot.id).subscribe({
      next: () => {
        this.isRescheduling.set(false);
        this.successMessage.set('Appointment rescheduled successfully!');
        setTimeout(() => this.router.navigate([this.myAppointmentsPath()]), 1500);
      },
      error: (err: { friendlyMessage?: string }) => {
        this.isRescheduling.set(false);
        this.errorMessage.set(err.friendlyMessage ?? 'Failed to reschedule appointment');
      },
    });
  }

  protected goBack(): void {
    this.router.navigate([this.myAppointmentsPath()]);
  }
}
