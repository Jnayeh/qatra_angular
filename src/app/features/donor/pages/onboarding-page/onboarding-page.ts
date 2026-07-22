import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';
import { DonorStore } from '@/app/features/donor/donor.store';
import maplibregl from 'maplibre-gl';
import { initMapLibre } from '@/app/shared/utils/map-init';
import { reverseGeocode } from '@/app/shared/utils/geocoding';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, ToggleSwitch, Textarea, Divider],
  templateUrl: './onboarding-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPageComponent implements OnInit {
  private readonly store = inject(DonorStore);
  private readonly router = inject(Router);

  private map: maplibregl.Map | null = null;
  private marker: maplibregl.Marker | null = null;

  readonly mapContainer = viewChild<ElementRef<HTMLElement>>('mapContainer');

  protected readonly selectedLat = signal<number | null>(null);
  protected readonly selectedLng = signal<number | null>(null);
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
    city: new FormControl(''),
    country: new FormControl('Tunisia'),
  });

  protected readonly prefsForm = new FormGroup({
    frequency: new FormControl('EMERGENCY_ONLY', { nonNullable: true }),
    allowEmergencyNotifications: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      if (this.step() === 2) {
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadProfile();
  }

  private initMap(): void {
    const el = this.mapContainer();
    if (!el || this.map) return;

    const lat = this.selectedLat() ?? 36.8065;
    const lng = this.selectedLng() ?? 10.1815;

    initMapLibre();
    this.map = new maplibregl.Map({
      container: el.nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [lng, lat],
      zoom: 12,
    });

    this.map.on('load', () => this.syncMarker());
    this.map.on('click', (e) => this.onMapClick(e));
  }

  private async onMapClick(e: maplibregl.MapMouseEvent): Promise<void> {
    this.selectedLat.set(e.lngLat.lat);
    this.selectedLng.set(e.lngLat.lng);
    this.syncMarker();
    const loc = await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
    if (loc.city) this.locationForm.controls.city.setValue(loc.city);
    if (loc.country) this.locationForm.controls.country.setValue(loc.country);
  }

  private syncMarker(): void {
    const lat = this.selectedLat();
    const lng = this.selectedLng();
    if (lat === null || lng === null || !this.map) return;

    this.marker?.remove();
    const el = document.createElement('div');
    el.className = 'w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg border-2 border-white';
    el.innerHTML = '<i class="pi pi-map-marker text-sm"></i>';
    this.marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(this.map);
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

    const lat = this.selectedLat();
    const lng = this.selectedLng();
    const city = this.locationForm.value.city ?? undefined;
    const country = this.locationForm.value.country ?? undefined;
    if (lat != null && lng != null) {
      this.store.updateLocation({ latitude: lat, longitude: lng, city, country });
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
