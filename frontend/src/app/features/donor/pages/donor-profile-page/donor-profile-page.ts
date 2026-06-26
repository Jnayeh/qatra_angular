import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { DonorService } from '../../donor.service';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-donor-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatError, RouterLink],
  templateUrl: './donor-profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorProfilePageComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly donorStore = inject(DonorStore);

  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup({
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)] }),
  });

  ngOnInit(): void {
    const profile = this.donorStore.profile();
    if (profile) {
      this.form.patchValue({
        displayName: profile.displayName ?? '',
        phone: profile.phone ?? '',
      });
    } else {
      this.donorStore.loadProfile();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.donorService.updateMyProfile({
      displayName: this.form.value.displayName!,
      phone: this.form.value.phone!,
    }).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false),
    });
  }

  protected requestDeletion(): void {
    if (confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
      this.donorService.requestAccountDeletion().subscribe();
    }
  }
}
