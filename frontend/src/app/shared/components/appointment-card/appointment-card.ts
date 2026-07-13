import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import type { DonorAppointmentView } from '@/app/shared/models/appointment.model';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { formatDate, formatTime } from '@/app/shared/utils/date-utils';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [Card, Button, StatusBadgeComponent],
  templateUrl: './appointment-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCardComponent {
  readonly appointment = input.required<DonorAppointmentView>();
  readonly showActions = input(true);

  readonly cancel = output<DonorAppointmentView>();
  readonly reschedule = output<DonorAppointmentView>();
  readonly viewQr = output<DonorAppointmentView>();
  readonly downloadCertificate = output<DonorAppointmentView>();

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  protected isUpcoming(status: string): boolean {
    return status === 'SCHEDULED' || status === 'IN_SCREENING' || status === 'RESCHEDULED';
  }
}
