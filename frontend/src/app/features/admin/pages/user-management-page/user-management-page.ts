import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { UserSummary } from '@/app/shared/models/user.model';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [Card, TableModule, Button, RouterLink, StatusBadgeComponent],
  templateUrl: './user-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly users = signal<UserSummary[]>([]);

  ngOnInit(): void {
    this.adminService.getUsers({ page: 0, size: 50 }).subscribe((res) => this.users.set(res.data));
  }
}
