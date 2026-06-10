import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { AuthService } from '@/app/core/auth/auth.service';
import { AuthStore } from '@/app/core/auth/auth.store';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';

@Component({
  selector: 'app-verify-email-page',
  standalone: true,
  imports: [Button, Message, RouterLink, PublicNavbarComponent],
  templateUrl: './verify-email-page.html',
  styleUrl: '../login-page/login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  protected readonly verified = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error.set('No verification token provided.');
      this.isLoading.set(false);
      return;
    }

    if (!this.authStore.isAuthenticated()) {
      this.error.set('You must be logged in to verify your email.');
      this.isLoading.set(false);
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.verified.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.friendlyMessage ?? 'Verification failed. The link may have expired.');
        this.isLoading.set(false);
      },
    });
  }
}
