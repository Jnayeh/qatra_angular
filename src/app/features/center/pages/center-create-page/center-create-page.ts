import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Router, RouterLink } from '@angular/router';
import { CenterService } from '@/app/features/center/center.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import type { FacilityType } from '@/app/shared/models/center.model';
import maplibregl from 'maplibre-gl';
import { initMapLibre } from '@/app/shared/utils/map-init';

@Component({
  selector: 'app-center-create-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    RouterLink,
    LoadingSpinnerComponent,
  ],
  templateUrl: './center-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterCreatePageComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly centerService = inject(CenterService);

  private map: maplibregl.Map | null = null;
  private marker: maplibregl.Marker | null = null;

  readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  protected readonly selectedLat = signal<number | null>(null);
  protected readonly selectedLng = signal<number | null>(null);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly facilityTypeOptions: { value: FacilityType; label: string }[] = [
    { value: 'HOSPITAL', label: 'Hospital' },
    { value: 'BLOOD_BANK', label: 'Blood Bank' },
    { value: 'MOBILE_UNIT', label: 'Mobile Unit' },
    { value: 'COMMUNITY_CENTER', label: 'Community Center' },
    { value: 'CLINIC', label: 'Clinic' },
  ];

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    facilityType: [<FacilityType | null>null, Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['Tunisia'],
    phone: [''],
    email: [''],
    totalCapacity: [<number | null>null],
    maxRegular: [<number | null>null],
    slotPeriod: [30],
  });

  ngAfterViewInit(): void {
    initMapLibre();
    this.map = new maplibregl.Map({
      container: this.mapContainer().nativeElement,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [10.1815, 36.8065],
      zoom: 6,
    });

    this.map.on('click', (e) => {
      this.selectedLat.set(e.lngLat.lat);
      this.selectedLng.set(e.lngLat.lng);
      this.syncMarker();
    });
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

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.getRawValue();
    const payload = {
      name: formValue.name!,
      facilityType: formValue.facilityType!,
      address: formValue.address!,
      city: formValue.city!,
      country: formValue.country!,
      phone: formValue.phone!,
      email: formValue.email!,
      totalCapacity: formValue.totalCapacity ?? 0,
      maxRegular: formValue.maxRegular ?? 0,
      slotPeriod: formValue.slotPeriod ?? 30,
      latitude: this.selectedLat() ?? 0,
      longitude: this.selectedLng() ?? 0,
    };

    this.centerService.createCenter(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/centers/list']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Failed to create center. Please try again.');
      },
    });
  }
}