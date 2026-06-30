import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { RadioButton } from 'primeng/radiobutton';
import { ActivatedRoute, Router } from '@angular/router';
import { formatTime } from '../../../../shared/utils/date-utils';
import { AppointmentService } from '../../../appointment/appointment.service';
import { CenterStore } from '../../center.store';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-slot-booking-page',
  standalone: true,
  imports: [
    FormsModule,
    Card,
    Button,
    DatePicker,
    RadioButton,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './slot-booking-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotBookingPageComponent implements OnInit {
  protected readonly store = inject(CenterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);

  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly selectedSlotId = signal<number | null>(null);
  protected readonly appointmentType = signal<'REGULAR' | 'EMERGENCY'>('REGULAR');
  protected readonly isBooking = signal(false);
  protected readonly error = signal('');

  protected readonly appointmentOptions = [
    { value: 'REGULAR', label: 'Regular' },
    { value: 'EMERGENCY', label: 'Emergency' },
  ];

  private centerId = 0;

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.params['id']);
    if (this.centerId) {
      this.store.loadCenter(this.centerId);
    }
  }

  protected onDateChange(date: Date | null): void {
    this.selectedDate.set(date);
    this.selectedSlotId.set(null);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      this.store.loadSlots({ centerId: this.centerId, params: { date: isoDate } });
    }
  }

  protected selectSlot(slotId: number): void {
    this.selectedSlotId.set(this.selectedSlotId() === slotId ? null : slotId);
  }

  protected book(): void {
    const slotId = this.selectedSlotId();
    if (!slotId) return;
    this.isBooking.set(true);
    this.error.set('');
    this.appointmentService.create({
      centerId: this.centerId,
      slotId,
      appointmentType: this.appointmentType(),
    }).subscribe({
      next: () => {
        this.isBooking.set(false);
        this.router.navigate(['/appointments', 'my-appointments']);
      },
      error: (err: any) => {
        this.isBooking.set(false);
        this.error.set(err.friendlyMessage ?? 'Failed to book appointment');
      },
    });
  }

  protected readonly formatTime = formatTime;
}
