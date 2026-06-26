import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import type { AuditLogEntry } from '../../../../shared/models/analytics.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: './audit-logs-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly logs = signal<AuditLogEntry[]>([]);
  protected readonly cols = ['timestamp', 'action', 'entityType', 'userId'];

  ngOnInit(): void {
    this.adminService.getAuditLogs({ page: 0, size: 50 }).subscribe((res) => this.logs.set(res.data.content));
  }
}
