import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CenterService } from '@/app/features/center/center.service';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import type { StaffProfile } from '@/app/shared/models/center.model';

@Component({
  selector: 'app-staff-management-page',
  standalone: true,
  imports: [FormsModule, Button, Dialog, InputText, Password, Toast, LoadingSpinnerComponent, EmptyStateComponent],
  providers: [MessageService],
  templateUrl: './staff-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementPageComponent implements OnInit {
  private readonly centerService = inject(CenterService);
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  protected readonly staff = signal<StaffProfile[]>([]);
  protected readonly loading = signal(true);
  protected readonly showAddDialog = signal(false);
  protected readonly adding = signal(false);

  protected readonly newEmail = signal('');
  protected readonly newPhone = signal('');
  protected readonly newPassword = signal('');
  protected readonly newFirstName = signal('');
  protected readonly newFamilyName = signal('');

  private centerId = 0;

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.params['id']);
    if (this.centerId) {
      this.loadStaff();
    } else {
      this.centerService.getMyAdminProfile().subscribe({
        next: (res) => {
          this.centerId = res.data.centerId;
          this.loadStaff();
        },
        error: () => this.loading.set(false),
      });
    }
  }

  private loadStaff(): void {
    this.loading.set(true);
    this.centerService.getStaff(this.centerId).subscribe({
      next: (res) => {
        this.staff.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected addStaff(): void {
    if (!this.newEmail() || !this.newPassword() || !this.newFirstName() || !this.newFamilyName()) return;
    this.adding.set(true);
    this.adminService.createUser({
      email: this.newEmail(),
      phone: this.newPhone(),
      password: this.newPassword(),
      firstName: this.newFirstName(),
      familyName: this.newFamilyName(),
    }).subscribe({
      next: (userRes) => {
        this.adminService.assignRole(userRes.data.id, 'CENTER_STAFF').subscribe({
          next: () => {
            this.centerService.addStaff(this.centerId, userRes.data.id).subscribe({
              next: (staffRes) => {
                this.staff.update((s) => [...s, staffRes.data]);
                this.resetForm();
                this.messageService.add({ severity: 'success', summary: 'Staff added', detail: `${this.newFirstName()} ${this.newFamilyName()} has been added as staff.` });
                this.adding.set(false);
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'User created but could not assign to center.' });
                this.adding.set(false);
              },
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'User created but could not assign role.' });
            this.adding.set(false);
          },
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Could not create user. Email may already be in use.' });
        this.adding.set(false);
      },
    });
  }

  protected removeStaff(userId: number): void {
    this.centerService.removeStaff(this.centerId, userId).subscribe({
      next: () => {
        this.staff.update((s) => s.filter((m) => m.userId !== userId));
        this.messageService.add({ severity: 'success', summary: 'Removed', detail: 'Staff member removed.' });
      },
    });
  }

  private resetForm(): void {
    this.newEmail.set('');
    this.newPhone.set('');
    this.newPassword.set('');
    this.newFirstName.set('');
    this.newFamilyName.set('');
    this.showAddDialog.set(false);
  }
}
