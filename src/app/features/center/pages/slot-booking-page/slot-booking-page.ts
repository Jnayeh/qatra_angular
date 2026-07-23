import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { RadioButton } from 'primeng/radiobutton';
import { ActivatedRoute, Router } from '@angular/router';
import { formatTime } from '@/app/shared/utils/date-utils';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { CenterStore } from '@/app/features/center/center.store';
import { DonorStore } from '@/app/features/donor/donor.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';

@Component({
  selector: 'app-slot-booking-page',
  standalone: true,
  imports: [
    FormsModule,
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
  private readonly donorStore = inject(DonorStore);

  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly selectedSlotId = signal<number | null>(null);
  protected readonly appointmentType = signal<'REGULAR' | 'EMERGENCY'>('REGULAR');
  protected readonly isBooking = signal(false);
  protected readonly error = signal('');

  protected readonly appointmentOptions = [
    { value: 'REGULAR' as const, label: 'Regular' },
    { value: 'EMERGENCY' as const, label: 'Emergency' },
  ];

  protected readonly minDate = new Date();

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
      type: this.appointmentType(),
      donorId: this.donorStore.profile()!.id,
      slotId,
    }).subscribe({
      next: () => {
        this.isBooking.set(false);
        this.router.navigate([this.router.url.startsWith('/donor') ? '/donor/my-appointments' : '/center-management/appointments/queue']); 
      },
      error: (err: any) => {
        this.isBooking.set(false);
        this.error.set(err.friendlyMessage ?? 'Failed to book appointment');
      },
    });
  }

  protected readonly formatTime = formatTime;
}
