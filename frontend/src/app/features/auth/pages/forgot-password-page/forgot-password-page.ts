import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AuthService } from '@/app/core/auth/auth.service';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

interface ForgotTheme {
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
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    Message,
    RouterLink,
    PublicNavbarComponent,
  ],
  templateUrl: './forgot-password-page.html',
  styleUrl: '../login-page/login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  private readonly intendedRole = this.route.snapshot.data['intendedRole'] as string | undefined;

  protected readonly isHiddenPortal = !!this.intendedRole && this.intendedRole !== 'DONOR';
  protected readonly navbarMode = this.isHiddenPortal ? 'back' as const : 'default' as const;

  protected readonly theme = computed((): ForgotTheme => {
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
          icon: 'pi-lock',
          badge: 'Password Recovery',
          badgeClass: 'bg-primary-50 text-primary-700',
          dark: false,
          loginLink: '/auth/login',
        };
    }
  });

  protected readonly emailSent = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.emailSent.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage ?? 'Failed to send reset link');
        this.isLoading.set(false);
      },
    });
  }
}
