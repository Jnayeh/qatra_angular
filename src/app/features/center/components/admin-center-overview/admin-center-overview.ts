import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthStore } from '@/app/core/auth/auth.store';

@Component({
  selector: 'app-admin-center-overview',
  standalone: true,
  imports: [RouterLink, Button],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a routerLink="/centers/list" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-building text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Manage Center</p>
            <p class="text-xs text-gray-500">Edit center info and capacity</p>
          </div>
        </div>
      </a>

      <a routerLink="/centers/list" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-calendar text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Schedule & Slots</p>
            <p class="text-xs text-gray-500">Manage appointment slots</p>
          </div>
        </div>
      </a>

      <a routerLink="/centers/list" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-users text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Staff Management</p>
            <p class="text-xs text-gray-500">Manage center staff</p>
          </div>
        </div>
      </a>

      <a routerLink="/centers/list" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <i class="pi pi-chart-bar text-primary-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Analytics</p>
            <p class="text-xs text-gray-500">View center metrics</p>
          </div>
        </div>
      </a>

      <a routerLink="/emergencies/list" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Emergencies</p>
            <p class="text-xs text-gray-500">View and manage emergencies</p>
          </div>
        </div>
      </a>

      <a routerLink="/emergencies/create" class="block bg-white rounded-xl border border-gray-200 p-5 hover:border-primary-300 transition-colors no-underline">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <i class="pi pi-plus-circle text-green-600"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">Create Emergency</p>
            <p class="text-xs text-gray-500">Post a new emergency request</p>
          </div>
        </div>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCenterOverviewComponent {
  protected readonly authStore = inject(AuthStore);
}
