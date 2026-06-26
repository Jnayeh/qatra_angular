import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-appointment-booking-page',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">Book Appointment</h1>
      <mat-card class="bg-surface-card">
        <mat-card-content>
          <p class="text-gray-400">This page will integrate with the center detail flow: select a center, view available slots, and confirm a booking.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentBookingPageComponent {}
