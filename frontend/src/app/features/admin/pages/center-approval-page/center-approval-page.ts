import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import type { CenterSummary } from '../../../../shared/models/center.model';
import { CenterService } from '../../../center/center.service';

@Component({
  selector: 'app-center-approval-page',
  standalone: true,
  imports: [Card, Button, StatusBadgeComponent],
  templateUrl: './center-approval-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterApprovalPageComponent implements OnInit {
  private readonly centerService = inject(CenterService);
  protected readonly pendingCenters = signal<CenterSummary[]>([]);

  ngOnInit(): void {
    this.centerService.getPendingCenters().subscribe((res) => this.pendingCenters.set(res.data.content));
  }

  protected approve(id: number, approved: boolean): void {
    this.centerService.approveCenter(id, approved).subscribe(() => {
      this.pendingCenters.update((list) => list.filter((c) => c.id !== id));
    });
  }
}
