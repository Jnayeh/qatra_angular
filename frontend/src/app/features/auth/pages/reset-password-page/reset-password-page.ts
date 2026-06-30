import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    Password,
    Message,
    ProgressSpinner,
    RouterLink,
  ],
  templateUrl: './reset-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup(
    {
      newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: this.passwordMatchValidator },
  );

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.error.set('Missing reset token');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.resetPassword(token, this.form.value.newPassword!).subscribe({
      next: () => {
        this.success.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage ?? 'Password reset failed');
        this.isLoading.set(false);
      },
    });
  }
}
