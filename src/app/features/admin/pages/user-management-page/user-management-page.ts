import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Tag } from 'primeng/tag';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { UserDetail, Role, UserStatus } from '@/app/shared/models/user.model';
import { AdminService } from '@/app/features/admin/admin.service';

const ALL_ROLES: { label: string; value: Role; severity: 'danger' | 'warn' | 'info' | 'success' }[] = [
  { label: 'Super Admin', value: 'SUPER_ADMIN', severity: 'danger' },
  { label: 'Admin', value: 'CENTER_ADMIN', severity: 'warn' },
  { label: 'Staff', value: 'CENTER_STAFF', severity: 'info' },
  { label: 'Donor', value: 'DONOR', severity: 'success' },
];

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Pending Verification', value: 'PENDING_VERIFICATION' },
];

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [FormsModule, TableModule, Button, Dialog, Tag, Select, InputText, RouterLink, StatusBadgeComponent],
  templateUrl: './user-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly users = signal<UserDetail[]>([]);

  protected readonly showEditDialog = signal(false);
  protected readonly showAddDialog = signal(false);
  protected readonly showDeleteDialog = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly selectedUser = signal<UserDetail | null>(null);

  protected readonly editEmail = signal('');
  protected readonly editPhone = signal('');
  protected readonly editDisplayName = signal('');
  protected readonly editStatus = signal<UserStatus>('ACTIVE');
  protected readonly editRoles = signal<Role[]>([]);

  protected readonly addForm = signal({ email: '', phone: '', password: '', firstName: '', familyName: '', displayName: '' });
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly allRoles = ALL_ROLES;

  protected readonly sortField = signal<string>('id');
  protected readonly sortDirection = signal<string>('asc');

  ngOnInit(): void {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.adminService.getUsers({
      page: 0,
      size: 50,
      sortBy: this.sortField(),
      sortDirection: this.sortDirection(),
    }).subscribe((res) => this.users.set(res.data));
  }

  onSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.loadUsers();
  }

  sortIcon(field: string): string {
    if (this.sortField() !== field) return 'pi pi-sort';
    return this.sortDirection() === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down';
  }

  protected roleSeverity(role: Role): 'danger' | 'warn' | 'info' | 'success' {
    return ALL_ROLES.find((r) => r.value === role)?.severity ?? 'secondary' as 'danger';
  }

  protected roleLabel(role: Role): string {
    return ALL_ROLES.find((r) => r.value === role)?.label ?? role;
  }

  openEdit(user: UserDetail): void {
    this.selectedUser.set(user);
    this.editEmail.set(user.email);
    this.editPhone.set(user.phone);
    this.editDisplayName.set(user.displayName);
    this.editStatus.set(user.status);
    this.editRoles.set([...user.roles]);
    this.showEditDialog.set(true);
  }

  toggleRole(role: Role): void {
    this.editRoles.update((roles) =>
      roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role],
    );
  }

  saveEdit(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.isSaving.set(true);

    const profileChanged =
      this.editEmail() !== user.email ||
      this.editPhone() !== user.phone ||
      this.editDisplayName() !== user.displayName;
    const statusChanged = this.editStatus() !== user.status;
    const rolesToAdd = this.editRoles().filter((r) => !user.roles.includes(r));
    const rolesToRemove = user.roles.filter((r) => !this.editRoles().includes(r));

    const total = (profileChanged ? 1 : 0) + (statusChanged ? 1 : 0) + rolesToAdd.length + rolesToRemove.length;
    if (total === 0) { this.showEditDialog.set(false); this.isSaving.set(false); return; }

    let completed = 0;
    const onDone = () => { completed++; if (completed >= total) { this.showEditDialog.set(false); this.isSaving.set(false); this.loadUsers(); } };
    const onError = () => this.isSaving.set(false);

    if (profileChanged) {
      this.adminService.updateUser(user.id, {
        email: this.editEmail(),
        phone: this.editPhone(),
        displayName: this.editDisplayName(),
      }).subscribe({ next: onDone, error: onError });
    }
    if (statusChanged) {
      this.adminService.updateUserStatus(user.id, this.editStatus()).subscribe({ next: onDone, error: onError });
    }
    rolesToAdd.forEach((role) => {
      this.adminService.assignRole(user.id, role).subscribe({ next: onDone, error: onError });
    });
    rolesToRemove.forEach((role) => {
      this.adminService.revokeRole(user.id, role).subscribe({ next: onDone, error: onError });
    });
  }

  openAdd(): void {
    this.addForm.set({ email: '', phone: '', password: '', firstName: '', familyName: '', displayName: '' });
    this.showAddDialog.set(true);
  }

  saveAdd(): void {
    const f = this.addForm();
    if (!f.email || !f.password || !f.firstName || !f.familyName) return;
    this.isSaving.set(true);
    this.adminService.createUser(f).subscribe({
      next: () => { this.showAddDialog.set(false); this.isSaving.set(false); this.loadUsers(); },
      error: () => this.isSaving.set(false),
    });
  }

  openDelete(user: UserDetail): void {
    this.selectedUser.set(user);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.isSaving.set(true);
    this.adminService.deleteUser(user.id).subscribe({
      next: () => { this.showDeleteDialog.set(false); this.isSaving.set(false); this.loadUsers(); },
      error: () => this.isSaving.set(false),
    });
  }

  updateForm(field: string, value: string): void {
    this.addForm.update((f) => ({ ...f, [field]: value }));
  }
}
