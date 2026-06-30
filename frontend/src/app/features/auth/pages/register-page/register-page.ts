import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from '../../../../core/auth/auth.service';
import type { RegisterRequest } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    InputText,
    Password,
    ProgressSpinner,
    RouterLink,
  ],
  templateUrl: './register-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup(
    {
      displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: this.passwordMatchValidator },
  );

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    const payload: RegisterRequest = {
      displayName: this.form.value.displayName!,
      email: this.form.value.email!,
      phone: this.form.value.phone!,
      password: this.form.value.password!,
      role: 'DONOR',
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: true },
        });
      },
      error: (err) => {
        this.error.set(err.friendlyMessage ?? 'Registration failed');
        this.isLoading.set(false);
      },
    });
  }
}
