import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-donor-dashboard-page',
  standalone: true,
  imports: [Card, Button, RouterLink],
  templateUrl: './donor-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorDashboardPageComponent implements OnInit {
  protected readonly store = inject(DonorStore);

  ngOnInit(): void {
    this.store.loadProfile();
    this.store.loadEligibility();
    this.store.loadImpact();
  }
}
