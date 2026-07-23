import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { AdminService } from '@/app/features/admin/admin.service';
import { DonorService } from '@/app/features/donor/donor.service';
import { AuthService } from '@/app/core/auth/auth.service';
import { AuthStore } from '@/app/core/auth/auth.store';

@Component({
  selector: 'app-donor-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Password, Message, RouterLink],
  templateUrl: './donor-profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorProfilePageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly saveSuccess = signal('');
  protected readonly saveError = signal('');
  protected readonly isChangingPassword = signal(false);
  protected readonly passwordSuccess = signal('');
  protected readonly passwordError = signal('');

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)] }),
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
    familyName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
  });

  protected readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    const userId = this.authStore.user()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.adminService.getUser(userId).subscribe({
      next: (res) => {
        const u = res.data;
        this.form.patchValue({
          email: u.email,
          phone: u.phone,
          displayName: u.displayName,
          firstName: u.firstName ?? '',
          familyName: u.familyName ?? '',
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const userId = this.authStore.user()?.id;
    if (!userId) return;

    this.isSaving.set(true);
    this.saveSuccess.set('');
    this.saveError.set('');

    const v = this.form.value;
    this.adminService.updateUser(userId, {
      email: v.email!,
      phone: v.phone!,
      displayName: v.displayName!,
      firstName: v.firstName!,
      familyName: v.familyName!,
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set('Profile updated successfully');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(err.error?.message ?? 'Failed to update profile');
      },
    });
  }

  protected onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.passwordError.set('Passwords do not match');
      return;
    }

    this.isChangingPassword.set(true);
    this.passwordSuccess.set('');
    this.passwordError.set('');
    this.authService.changePassword(
      this.passwordForm.value.currentPassword!,
      this.passwordForm.value.newPassword!,
    ).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordSuccess.set('Password changed successfully');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(err.error?.message ?? 'Failed to change password');
      },
    });
  }

  protected requestDeletion(): void {
    if (confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
      this.donorService.requestAccountDeletion().subscribe();
    }
  }
}
