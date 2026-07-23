import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthStore } from '@/app/core/auth/auth.store';

@Component({
  selector: 'app-staff-center-overview',
  standalone: true,
  imports: [RouterLink, Button],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a routerLink="/center-management/dashboard" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-th-large text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Dashboard</p>
            <p class="text-xs text-gray-500">Staff overview and stats</p>
          </div>
        </div>
      </a>

      <a routerLink="/center-management/appointments/queue" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-list text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Appointment Queue</p>
            <p class="text-xs text-gray-500">Manage walk-ins and appointments</p>
          </div>
        </div>
      </a>

      <a routerLink="/center-management/appointments/checkin" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-qrcode text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Check-In</p>
            <p class="text-xs text-gray-500">Check in donors for appointments</p>
          </div>
        </div>
      </a>

      <a routerLink="/center-management/emergencies" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Emergencies</p>
            <p class="text-xs text-gray-500">View active emergencies</p>
          </div>
        </div>
      </a>

      <a routerLink="/center-management/appointments/queue" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="pi pi-check-circle text-green-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Today's Schedule</p>
            <p class="text-xs text-gray-500">View today's appointments</p>
          </div>
        </div>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffCenterOverviewComponent {
  protected readonly authStore = inject(AuthStore);
}
