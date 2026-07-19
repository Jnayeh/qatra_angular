import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';
import { DonorStore } from '@/app/features/donor/donor.store';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule, Card, Button, ToggleSwitch, Textarea, Divider],
  templateUrl: './onboarding-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPageComponent implements OnInit {
  private readonly store = inject(DonorStore);
  private readonly router = inject(Router);

  protected readonly step = signal(1);
  protected readonly totalSteps = 4;
  protected readonly isLoading = signal(false);

  protected readonly selectedBloodType = signal<string | null>(null);

  protected readonly bloodTypes = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' },
    { value: 'UNKNOWN', label: "I don't know" },
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
    city: new FormControl(''),
    country: new FormControl('Tunisia'),
    latitude: new FormControl<number | null>(null),
    longitude: new FormControl<number | null>(null),
  });

  protected readonly prefsForm = new FormGroup({
    frequency: new FormControl('EMERGENCY_ONLY', { nonNullable: true }),
    allowEmergencyNotifications: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.store.loadProfile();
  }

  protected selectBloodType(type: string): void {
    this.selectedBloodType.set(type);
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

    if (this.selectedBloodType()) {
      this.store.updateBloodType(this.selectedBloodType()!);
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

    const loc = this.locationForm.value;
    if (loc.latitude != null && loc.longitude != null) {
      this.store.updateLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: loc.city ?? undefined,
        country: loc.country ?? undefined,
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
