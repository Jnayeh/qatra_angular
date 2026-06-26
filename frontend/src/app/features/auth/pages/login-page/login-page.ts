import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatError,
    RouterLink,
  ],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly intendedRole = this.route.snapshot.data['intendedRole'] as string | undefined;

  protected readonly title = computed(() => {
    switch (this.intendedRole) {
      case 'STAFF': return 'Staff Sign In';
      case 'ADMIN': return 'Admin Sign In';
      default: return 'Sign In';
    }
  });

  protected readonly subtitle = computed(() => {
    switch (this.intendedRole) {
      case 'STAFF': return 'Access the staff dashboard';
      case 'ADMIN': return 'Access the admin panel';
      default: return 'Sign in to your donor account';
    }
  });

  protected readonly showRegisterLink = this.intendedRole === undefined || this.intendedRole === 'DONOR';

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
        if (this.authStore.isDonor()) {
          this.router.navigate(['/donor/dashboard']);
        } else if (this.authStore.isSuperAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authStore.isCenterStaff() || this.authStore.isCenterAdmin()) {
          this.router.navigate(['/centers']);
        }
      },
    });
  }
}
