import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-donor-appointments-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTabsModule, EmptyStateComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">My Appointments</h1>

      <mat-tab-group>
        <mat-tab label="Upcoming">
          <app-empty-state icon="calendar_today" title="No upcoming appointments" message="Book your next donation at a center near you." />
        </mat-tab>
        <mat-tab label="Past">
          <app-empty-state icon="history" title="No past appointments" message="Your donation history will appear here." />
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorAppointmentsPageComponent {}
