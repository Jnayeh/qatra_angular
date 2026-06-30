import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-appointment-booking-page',
  standalone: true,
  imports: [Card],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">Book Appointment</h1>
      <p-card class="bg-surface-card">
        <ng-template pTemplate="content">
          <p class="text-gray-400">This page will integrate with the center detail flow: select a center, view available slots, and confirm a booking.</p>
        </ng-template>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentBookingPageComponent {}
