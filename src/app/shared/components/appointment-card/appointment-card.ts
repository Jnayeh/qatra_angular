import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import type { Appointment } from '@/app/shared/models/appointment.model';
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
  readonly appointment = input.required<Appointment>();
  readonly showActions = input(true);

  readonly cancel = output<Appointment>();
  readonly reschedule = output<Appointment>();
  readonly viewQr = output<Appointment>();

  protected readonly formatDate = formatDate;
  protected readonly formatTime = formatTime;

  protected isUpcoming(status: string): boolean {
    return status === 'SCHEDULED' || status === 'IN_SCREENING' || status === 'RESCHEDULED';
  }
}
