import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-certificates-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, EmptyStateComponent],
  templateUrl: './certificates-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesPageComponent implements OnInit {
  protected readonly store = inject(DonorStore);

  ngOnInit(): void {
    this.store.loadCertificates();
  }
}
