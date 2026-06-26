import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import type { SystemConfigEntry } from '../../../../shared/models/config.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-config-page',
  standalone: true,
  imports: [MatCardModule, JsonPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">System Configuration</h1>
      @for (entry of config(); track entry.key) {
        <mat-card class="bg-surface-card">
          <mat-card-content>
            <p class="text-white font-medium">{{ entry.key }}</p>
            <p class="text-sm text-gray-400">{{ entry.description }}</p>
            <pre class="text-xs text-gray-500 mt-2">{{ entry.value | json }}</pre>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly config = signal<SystemConfigEntry[]>([]);

  ngOnInit(): void {
    this.adminService.getConfig().subscribe((res) => this.config.set(res.data));
  }
}
