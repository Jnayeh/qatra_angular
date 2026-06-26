import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import type { UserSummary } from '../../../../shared/models/user.model';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './user-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly users = signal<UserSummary[]>([]);
  protected readonly displayedColumns = ['displayName', 'email', 'status', 'roles', 'actions'];

  ngOnInit(): void {
    this.adminService.getUsers({ page: 0, size: 50 }).subscribe((res) => this.users.set(res.data.content));
  }
}
