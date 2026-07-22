import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { EmergencyStore } from '@/app/features/emergency/emergency.store';

@Component({
  selector: 'app-emergency-list-page',
  standalone: true,
  imports: [Button, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './emergency-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyListPageComponent implements OnInit {
  protected readonly store = inject(EmergencyStore);
  private readonly router = inject(Router);
  protected readonly emergencyPrefix = () => this.router.url.startsWith('/donor') ? '/donor/emergencies' : '/emergencies'; // ponytail

  ngOnInit(): void {
    this.store.loadEmergencies({ page: 1, size: 20 });
  }
}
