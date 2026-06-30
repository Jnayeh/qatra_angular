import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    InputText,
    Message,
    ProgressSpinner,
    RouterLink,
  ],
  templateUrl: './verify-email-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly verified = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup({
    token: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.verifyEmail(this.form.value.token!).subscribe({
      next: () => {
        this.verified.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage ?? 'Verification failed');
        this.isLoading.set(false);
      },
    });
  }
}
