import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { DonorStore } from '@/app/features/donor/donor.store';
import maplibregl from 'maplibre-gl';
import { initMapLibre } from '@/app/shared/utils/map-init';
import { reverseGeocode } from '@/app/shared/utils/geocoding';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Message],
  templateUrl: './location-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPageComponent implements AfterViewInit {
  private readonly donorStore = inject(DonorStore);

  private map: maplibregl.Map | null = null;
  private marker: maplibregl.Marker | null = null;

  readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  protected readonly selectedLat = signal<number | null>(null);
  protected readonly selectedLng = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    city: new FormControl(''),
    country: new FormControl(''),
  });

  ngAfterViewInit(): void {
    const profile = this.donorStore.profile();
    const lat = profile?.latitude ?? 36.8065;
    const lng = profile?.longitude ?? 10.1815;

    if (profile?.latitude != null && profile?.longitude != null) {
      this.selectedLat.set(profile.latitude);
      this.selectedLng.set(profile.longitude);
    }
    if (profile?.city) this.form.controls.city.setValue(profile.city);
    if (profile?.country) this.form.controls.country.setValue(profile.country);

    initMapLibre();
    this.map = new maplibregl.Map({
      container: this.mapContainer().nativeElement,
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
    if (loc.city) this.form.controls.city.setValue(loc.city);
    if (loc.country) this.form.controls.country.setValue(loc.country);
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

  protected useMyLocation(): void {
    if (!('geolocation' in navigator)) {
      this.error.set('GPS not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.selectedLat.set(pos.coords.latitude);
        this.selectedLng.set(pos.coords.longitude);
        this.error.set(null);
        this.syncMarker();
        this.map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 });
        reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((loc) => {
          if (loc.city) this.form.controls.city.setValue(loc.city);
          if (loc.country) this.form.controls.country.setValue(loc.country);
        });
      },
      () => this.error.set('Unable to get GPS location. Make sure location access is granted.'),
    );
  }

  protected saveLocation(): void {
    const lat = this.selectedLat();
    const lng = this.selectedLng();
    if (lat === null || lng === null) return;

    this.donorStore.updateLocation({
      latitude: lat,
      longitude: lng,
      city: this.form.value.city ?? undefined,
      country: this.form.value.country ?? undefined,
    });
  }
}