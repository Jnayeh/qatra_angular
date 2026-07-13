import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { AuthService } from '@/app/core/auth/auth.service';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

interface ResetTheme {
  pageBg: string;
  cardShadow: string;
  accentText: string;
  icon: string;
  badge: string;
  badgeClass: string;
  dark: boolean;
  loginLink: string;
}

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    Password,
    Message,
    RouterLink,
    PublicNavbarComponent,
  ],
  templateUrl: './reset-password-page.html',
  styleUrl: '../login-page/login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  private readonly intendedRole = this.route.snapshot.data['intendedRole'] as string | undefined;

  protected readonly isHiddenPortal = !!this.intendedRole && this.intendedRole !== 'DONOR';
  protected readonly navbarMode = this.isHiddenPortal ? 'back' as const : 'default' as const;

  protected readonly theme = computed((): ResetTheme => {
    switch (this.intendedRole) {
      case 'CENTER':
        return {
          pageBg: 'auth-surface-admin',
          cardShadow: 'auth-card-admin',
          accentText: 'text-primary-400',
          icon: 'pi-building',
          badge: 'Center Portal',
          badgeClass: 'bg-slate-700 text-primary-200 border border-slate-600',
          dark: true,
          loginLink: '/auth/center-login',
        };
      case 'ADMIN':
        return {
          pageBg: 'auth-surface-admin',
          cardShadow: 'auth-card-admin',
          accentText: 'text-primary-400',
          icon: 'pi-shield',
          badge: 'Super Admin',
          badgeClass: 'bg-slate-700 text-primary-200 border border-slate-600',
          dark: true,
          loginLink: '/auth/admin-login',
        };
      default:
        return {
          pageBg: 'auth-surface-donor',
          cardShadow: 'auth-card-donor',
          accentText: 'text-primary-600',
          icon: 'pi-key',
          badge: 'New Password',
          badgeClass: 'bg-primary-50 text-primary-700',
          dark: false,
          loginLink: '/auth/login',
        };
    }
  });

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
