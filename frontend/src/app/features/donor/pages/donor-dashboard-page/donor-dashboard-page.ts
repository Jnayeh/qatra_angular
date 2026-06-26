import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-donor-dashboard-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
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
