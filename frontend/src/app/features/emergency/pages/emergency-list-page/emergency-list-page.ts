import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { EmergencyStore } from '../../emergency.store';

@Component({
  selector: 'app-emergency-list-page',
  standalone: true,
  imports: [Card, Button, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './emergency-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyListPageComponent implements OnInit {
  protected readonly store = inject(EmergencyStore);

  ngOnInit(): void {
    this.store.loadEmergencies({ page: 0, size: 20 });
  }
}
