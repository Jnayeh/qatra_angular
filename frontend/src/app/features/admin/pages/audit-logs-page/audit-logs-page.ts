import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import type { AuditLogEntry } from '@/app/shared/models/analytics.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [Card, TableModule],
  templateUrl: './audit-logs-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly logs = signal<AuditLogEntry[]>([]);

  ngOnInit(): void {
    this.adminService.getAuditLogs({ page: 0, size: 50 }).subscribe((res) => this.logs.set(res.data.content));
  }
}
