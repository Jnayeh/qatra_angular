import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DonorService } from '../../donor.service';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-notification-prefs-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule],
  templateUrl: './notification-prefs-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPrefsPageComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly donorStore = inject(DonorStore);

  protected readonly form = new FormGroup({
    frequency: new FormControl('IMMEDIATE', { nonNullable: true, validators: [Validators.required] }),
    enableQuietHours: new FormControl(false, { nonNullable: true }),
    quietStart: new FormControl('22:00'),
    quietEnd: new FormControl('07:00'),
    allowEmergencyNotifications: new FormControl(true, { nonNullable: true }),
    maxNotificationDistanceKm: new FormControl(25, { nonNullable: true, validators: [Validators.min(0), Validators.max(1000)] }),
  });

  ngOnInit(): void {
    const prefs = this.donorStore.profile()?.notificationPreferences;
    if (prefs) {
      this.form.patchValue({
        frequency: prefs.frequency,
        enableQuietHours: prefs.quietHours !== null,
        quietStart: prefs.quietHours?.start ?? '22:00',
        quietEnd: prefs.quietHours?.end ?? '07:00',
        allowEmergencyNotifications: prefs.allowEmergencyNotifications,
        maxNotificationDistanceKm: prefs.maxNotificationDistanceKm,
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const v = this.form.value;
    this.donorService.updateNotificationPrefs({
      frequency: v.frequency as any,
      quietHours: v.enableQuietHours ? { start: v.quietStart!, end: v.quietEnd! } : null,
      allowEmergencyNotifications: v.allowEmergencyNotifications ?? true,
      maxNotificationDistanceKm: v.maxNotificationDistanceKm ?? 25,
    }).subscribe();
  }
}
