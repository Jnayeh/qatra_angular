import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { DonorStore } from '@/app/features/donor/donor.store';

@Component({
  selector: 'app-certificates-page',
  standalone: true,
  imports: [Card, Button, EmptyStateComponent],
  templateUrl: './certificates-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesPageComponent implements OnInit {
  protected readonly store = inject(DonorStore);

  ngOnInit(): void {
    this.store.loadCertificates();
  }
}
