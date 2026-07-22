import { ChangeDetectionStrategy, Component, inject, signal, viewChild, ViewContainerRef } from '@angular/core';
import { AuthStore } from '@/app/core/auth/auth.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-center-dashboard-page',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Center Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">
          @if (authStore.isCenterAdmin()) {
            Manage your center, staff, slots, and analytics.
          } @else {
            View upcoming appointments and center activity.
          }
        </p>
      </div>

      @if (loading()) {
        <app-loading-spinner />
      }
      <ng-container #container />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDashboardPageComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly loading = signal(true);

  private readonly container = viewChild('container', { read: ViewContainerRef });

  constructor() {
    if (this.authStore.isCenterAdmin()) {
      import('@/app/features/center/components/admin-center-overview/admin-center-overview').then((m) => {
        this.container()?.createComponent(m.AdminCenterOverviewComponent);
        this.loading.set(false);
      });
    } else {
      import('@/app/features/center/components/staff-center-overview/staff-center-overview').then((m) => {
        this.container()?.createComponent(m.StaffCenterOverviewComponent);
        this.loading.set(false);
      });
    }
  }
}
