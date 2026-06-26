import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import type { FeatureFlag } from '../../../../shared/models/config.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-feature-flags-page',
  standalone: true,
  imports: [MatCardModule, MatSlideToggleModule, JsonPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Feature Flags</h1>
      @for (flag of flags(); track flag.featureName) {
        <mat-card class="bg-surface-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">{{ flag.featureName }}</p>
              <p class="text-sm text-gray-400">{{ flag.rules | json }}</p>
            </div>
            <mat-slide-toggle [checked]="flag.enabled" color="primary" (change)="toggle(flag)" />
          </mat-card-content>
        </mat-card>
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

  protected toggle(flag: FeatureFlag): void {
    this.adminService.updateFeatureFlag(flag.featureName, !flag.enabled, flag.rules).subscribe((res) => {
      this.flags.update((list) => list.map((f) => f.featureName === res.data.featureName ? res.data : f));
    });
  }
}
