import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';
import { DonorStore } from '@/app/features/donor/donor.store';
import { LocationPickerComponent } from '@/app/shared/components/location-picker/location-picker';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, ToggleSwitch, Textarea, Divider, LocationPickerComponent],
  templateUrl: './onboarding-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPageComponent implements OnInit {
  private readonly store = inject(DonorStore);
  private readonly router = inject(Router);

  protected readonly step = signal(1);
  protected readonly totalSteps = 3;
  protected readonly isLoading = signal(false);

  protected readonly bloodTypeForm = new FormGroup({
    unknown: new FormControl(true, { nonNullable: true }),
    type: new FormControl<string | null>(null),
  });

  protected readonly bloodTypes = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' },
  ];

  protected readonly healthForm = new FormGroup({
    hasChronicIllness: new FormControl(false, { nonNullable: true }),
    medicalConditionsDetails: new FormControl(''),
    onMedication: new FormControl(false, { nonNullable: true }),
    medicationDetails: new FormControl(''),
    lastSurgeryAt: new FormControl<string | null>(null),
    lastTravelAt: new FormControl<string | null>(null),
    lastTattooOrPiercingAt: new FormControl<string | null>(null),
  });

  protected readonly locationForm = new FormGroup({
    latitude: new FormControl<number | null>(null),
    longitude: new FormControl<number | null>(null),
    city: new FormControl(''),
    country: new FormControl('Tunisia'),
  });

  protected readonly prefsForm = new FormGroup({
    frequency: new FormControl('EMERGENCY_ONLY', { nonNullable: true }),
    allowEmergencyNotifications: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.store.loadProfile();
  }

  protected nextStep(): void {
    if (this.step() < this.totalSteps) {
      this.step.update((s) => s + 1);
    }
  }

  protected prevStep(): void {
    if (this.step() > 1) {
      this.step.update((s) => s - 1);
    }
  }

  protected skipAll(): void {
    this.router.navigate(['/donor/home']);
  }

  protected finish(): void {
    this.isLoading.set(true);

    if (!this.bloodTypeForm.value.unknown && this.bloodTypeForm.value.type) {
      this.store.updateBloodType(this.bloodTypeForm.value.type);
    }

    this.store.updateHealthQuestionnaire({
      hasChronicIllness: this.healthForm.value.hasChronicIllness ?? false,
      medicalConditionsDetails: this.healthForm.value.medicalConditionsDetails ?? null,
      onMedication: this.healthForm.value.onMedication ?? false,
      medicationDetails: this.healthForm.value.medicationDetails ?? null,
      lastSurgeryAt: this.healthForm.value.lastSurgeryAt ? `${this.healthForm.value.lastSurgeryAt}T00:00:00Z` : null,
      lastTravelAt: this.healthForm.value.lastTravelAt ? `${this.healthForm.value.lastTravelAt}T00:00:00Z` : null,
      lastTattooOrPiercingAt: this.healthForm.value.lastTattooOrPiercingAt ? `${this.healthForm.value.lastTattooOrPiercingAt}T00:00:00Z` : null,
    });

    const lat = this.locationForm.value.latitude;
    const lng = this.locationForm.value.longitude;
    if (lat != null && lng != null) {
      this.store.updateLocation({
        latitude: lat,
        longitude: lng,
        city: this.locationForm.value.city ?? undefined,
        country: this.locationForm.value.country ?? undefined,
      });
    }

    this.store.updateNotificationPrefs({
      frequency: this.prefsForm.value.frequency as any,
      allowEmergencyNotifications: this.prefsForm.value.allowEmergencyNotifications ?? true,
      quietHours: null,
      maxNotificationDistanceKm: 25,
    });

    this.router.navigate(['/donor/home']);
  }
}
