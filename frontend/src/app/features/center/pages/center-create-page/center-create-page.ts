import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-center-create-page',
  standalone: true,
  imports: [Card],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">Register a Center</h1>
      <p-card class="bg-surface-card">
        <ng-template pTemplate="content">
          <p class="text-gray-400">Center registration form will be implemented here with operating hours editor, capacity settings, and location picker (MapLibre map).</p>
        </ng-template>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterCreatePageComponent {}
