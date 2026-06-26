import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import type { DataDeletionRequest } from '../../../../shared/models/config.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-deletion-requests-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Deletion Requests</h1>
      @for (req of requests(); track req.id) {
        <mat-card class="bg-surface-card">
          <mat-card-content class="flex items-center justify-between">
            <div>
              <p class="text-white">User #{{ req.requestedByUserId }}</p>
              <app-status-badge [status]="req.status" />
              <p class="text-xs text-gray-500">{{ req.requestedAt }}</p>
            </div>
            <div class="flex gap-2">
              <button mat-raised-button color="primary" (click)="process(req.id, true)">Approve</button>
              <button mat-stroked-button color="warn" (click)="process(req.id, false)">Reject</button>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletionRequestsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly requests = signal<DataDeletionRequest[]>([]);

  ngOnInit(): void {
    this.adminService.getDeletionRequests({ page: 0, size: 50 }).subscribe((res) => this.requests.set(res.data.content));
  }

  protected process(id: number, approved: boolean): void {
    this.adminService.processDeletionRequest(id, approved, '').subscribe(() => {
      this.requests.update((list) => list.filter((r) => r.id !== id));
    });
  }
}
