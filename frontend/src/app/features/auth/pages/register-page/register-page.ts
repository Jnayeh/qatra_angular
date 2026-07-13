import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { AuthService } from '@/app/core/auth/auth.service';
import type { RegisterRequest } from '@/app/shared/models/user.model';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Password, Message, RouterLink, PublicNavbarComponent],
  templateUrl: './register-page.html',
  styleUrl: '../login-page/login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup(
    {
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
      familyName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)] }),
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
      firstName: this.form.value.firstName!,
      familyName: this.form.value.familyName!,
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
