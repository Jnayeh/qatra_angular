import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { SystemConfigEntry } from '@/app/shared/models/config.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-config-page',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">System Configuration</h1>
      @for (entry of config(); track entry.key) {
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-white font-medium">{{ entry.key }}</p>
          <p class="text-sm text-gray-400">{{ entry.description }}</p>
          <pre class="text-xs text-gray-500 mt-2">{{ entry.value | json }}</pre>
        </div>
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
