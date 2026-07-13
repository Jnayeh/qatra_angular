import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { ToggleSwitch } from 'primeng/toggleswitch';
import type { FeatureFlag } from '@/app/shared/models/config.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-feature-flags-page',
  standalone: true,
  imports: [Card, ToggleSwitch, FormsModule, JsonPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Feature Flags</h1>
      @for (flag of flags(); track flag.featureName) {
        <p-card class="bg-surface-card">
          <ng-template pTemplate="content">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white font-medium">{{ flag.featureName }}</p>
                <p class="text-sm text-gray-400">{{ flag.rules | json }}</p>
              </div>
              <p-toggleSwitch [ngModel]="flag.enabled" (onChange)="toggle(flag, $event.checked)" inputId="toggle-{{ flag.featureName }}" />

            </div>
          </ng-template>
        </p-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly flags = signal<FeatureFlag[]>([]);

  ngOnInit(): void {
    this.adminService.getFeatureFlags().subscribe((res) => this.flags.set(res.data));
  }

  protected toggle(flag: FeatureFlag, checked: boolean): void {
    this.adminService.updateFeatureFlag(flag.featureName, checked, flag.rules).subscribe((res) => {
      this.flags.update((list) => list.map((f) => f.featureName === res.data.featureName ? res.data : f));
    });
  }
}
