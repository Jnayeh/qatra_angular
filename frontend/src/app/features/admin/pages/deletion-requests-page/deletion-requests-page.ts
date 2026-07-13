import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { DataDeletionRequest } from '@/app/shared/models/config.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-deletion-requests-page',
  standalone: true,
  imports: [Card, Button, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Deletion Requests</h1>
      @for (req of requests(); track req.id) {
        <p-card class="bg-surface-card">
          <ng-template pTemplate="content">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white">User #{{ req.requestedByUserId }}</p>
                <app-status-badge [status]="req.status" />
                <p class="text-xs text-gray-500">{{ req.requestedAt }}</p>
              </div>
              <div class="flex gap-2">
                <p-button label="Approve" severity="primary" (click)="process(req.id, true)" />
                <p-button label="Reject" severity="danger" styleClass="p-button-outlined" (click)="process(req.id, false)" />
              </div>
            </div>
          </ng-template>
        </p-card>
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
