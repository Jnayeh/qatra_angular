import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';
import { AuthService } from '@/app/core/auth/auth.service';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [RouterLink, PublicNavbarComponent],
  templateUrl: './verify-email-page.html',
  styleUrl: '../login-page/login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly status = signal<'loading' | 'success' | 'error' | 'not-authenticated'>('loading');
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.authStore.isAuthenticated()) {
      this.status.set('not-authenticated');
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('error');
      this.errorMessage.set('No verification token provided.');
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.status.set('success');
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.friendlyMessage ?? 'Verification failed');
      },
    });
  }
}
