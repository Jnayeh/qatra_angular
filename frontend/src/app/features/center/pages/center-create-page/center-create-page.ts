import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-center-create-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-white">Register a Center</h1>
      <mat-card class="bg-surface-card">
        <mat-card-content>
          <p class="text-gray-400">Center registration form will be implemented here with operating hours editor, capacity settings, and location picker (Leaflet map).</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterCreatePageComponent {}
