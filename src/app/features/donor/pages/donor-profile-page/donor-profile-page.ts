import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { DonorService } from '@/app/features/donor/donor.service';
import { DonorStore } from '@/app/features/donor/donor.store';
import { AuthService } from '@/app/core/auth/auth.service';
import { AuthStore } from '@/app/core/auth/auth.store';

@Component({
  selector: 'app-donor-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, Card, Button, InputText, Password, Message, RouterLink],
  templateUrl: './donor-profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorProfilePageComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly donorStore = inject(DonorStore);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  protected readonly isLoading = signal(false);
  protected readonly isChangingPassword = signal(false);
  protected readonly passwordSuccess = signal('');
  protected readonly passwordError = signal('');

  protected readonly form = new FormGroup({
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)] }),
  });

  protected readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.form.patchValue({
      displayName: this.authStore.user()?.displayName ?? '',
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.donorService.updateMyProfile({
      displayName: this.form.value.displayName!,
      phone: this.form.value.phone!,
    }).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
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
