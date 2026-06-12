import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { EmergencyStore } from '@/app/features/emergency/emergency.store';

@Component({
  selector: 'app-emergency-detail-page',
  standalone: true,
  imports: [Card, Button, LoadingSpinnerComponent, StatusBadgeComponent],
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
