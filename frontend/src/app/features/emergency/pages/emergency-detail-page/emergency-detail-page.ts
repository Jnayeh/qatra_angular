import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { EmergencyStore } from '../../emergency.store';

@Component({
  selector: 'app-emergency-detail-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './emergency-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyDetailPageComponent implements OnInit {
  protected readonly store = inject(EmergencyStore);
  protected readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.store.loadEmergency(id);
    }
  }
}
