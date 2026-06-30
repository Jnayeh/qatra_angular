import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tabs, TabList, Tab, TabPanel } from 'primeng/tabs';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-donor-appointments-page',
  standalone: true,
  imports: [Tabs, TabList, Tab, TabPanel, EmptyStateComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">My Appointments</h1>

      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Upcoming</p-tab>
          <p-tab value="1">Past</p-tab>
        </p-tablist>
        <p-tabpanel value="0">
          <app-empty-state icon="calendar" title="No upcoming appointments" message="Book your next donation at a center near you." />
        </p-tabpanel>
        <p-tabpanel value="1">
          <app-empty-state icon="history" title="No past appointments" message="Your donation history will appear here." />
        </p-tabpanel>
      </p-tabs>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorAppointmentsPageComponent {}
