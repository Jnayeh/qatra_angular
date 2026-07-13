import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { AuthStore } from '@/app/core/auth/auth.store';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

interface LoginTheme {
  pageBg: string;
  cardShadow: string;
  accentText: string;
  accentBg: string;
  icon: string;
  badge: string;
  badgeClass: string;
  dark: boolean;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Password, Message, RouterLink, PublicNavbarComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly intendedRole = this.route.snapshot.data['intendedRole'] as string | undefined;

  protected readonly title = computed(() => {
    switch (this.intendedRole) {
      case 'CENTER': return 'Center Sign In';
      case 'ADMIN': return 'Super Admin Sign In';
      default: return 'Sign In';
    }
  });

  protected readonly subtitle = computed(() => {
    switch (this.intendedRole) {
      case 'CENTER': return 'Staff and center administrator portal';
      case 'ADMIN': return 'Platform oversight, users, and system configuration';
      default: return 'Book donations, respond to emergencies, track your impact';
    }
  });

  protected readonly theme = computed((): LoginTheme => {
    switch (this.intendedRole) {
      case 'CENTER':
        return {
          pageBg: 'auth-surface-admin',
          cardShadow: 'auth-card-admin',
          accentText: 'text-primary-400',
          accentBg: 'bg-slate-800',
          icon: 'pi-building',
          badge: 'Center Portal',
          badgeClass: 'bg-slate-700 text-primary-200 border border-slate-600',
          dark: true,
        };
      case 'ADMIN':
        return {
          pageBg: 'auth-surface-admin',
          cardShadow: 'auth-card-admin',
          accentText: 'text-primary-400',
          accentBg: 'bg-slate-800',
          icon: 'pi-shield',
          badge: 'Super Admin',
          badgeClass: 'bg-slate-700 text-primary-200 border border-slate-600',
          dark: true,
        };
      default:
        return {
          pageBg: 'auth-surface-donor',
          cardShadow: 'auth-card-donor',
          accentText: 'text-primary-600',
          accentBg: 'bg-primary-50',
          icon: 'pi-heart-fill',
          badge: 'Donor',
          badgeClass: 'bg-primary-50 text-primary-700',
          dark: false,
        };
    }
  });

  protected readonly showRegisterLink = !this.intendedRole || this.intendedRole === 'DONOR';
  protected readonly isHiddenPortal = !!this.intendedRole && this.intendedRole !== 'DONOR';
  protected readonly navbarMode = this.isHiddenPortal ? 'back' as const : 'default' as const;

  protected readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.authStore.login(email!, password!, this.intendedRole).subscribe({
      next: () => {
        if (this.authStore.error()) return;

        if (this.authStore.isSuperAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authStore.isCenterAdmin()) {
          this.router.navigate(['/centers/list']);
        } else if (this.authStore.isCenterStaff()) {
          this.router.navigate(['/appointments/staff-queue']);
        } else if (this.authStore.isDonor()) {
          this.router.navigate(['/donor/home']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.authStore.setError('Login failed. Please try again.');
      },
    });
  }
}
