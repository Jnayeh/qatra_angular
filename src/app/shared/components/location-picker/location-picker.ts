import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import maplibregl from 'maplibre-gl';
import { initMapLibre } from '@/app/shared/utils/map-init';
import { reverseGeocode } from '@/app/shared/utils/geocoding';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [ReactiveFormsModule, ToggleSwitch, Message],
  templateUrl: './location-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerComponent implements AfterViewInit, OnDestroy {
  private map: maplibregl.Map | null = null;
  private marker: maplibregl.Marker | null = null;

  readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  readonly locationForm = input.required<FormGroup>();

  protected readonly selectedLat = signal<number | null>(null);
  protected readonly selectedLng = signal<number | null>(null);
  protected readonly useGpsControl = new FormControl(false, { nonNullable: true });
  protected readonly error = signal<string | null>(null);

  private get form() {
    return this.locationForm();
  }

  constructor() {
    this.useGpsControl.valueChanges.subscribe((enabled) => this.toggleGps(enabled));
  }

  ngAfterViewInit(): void {
    const lat = this.selectedLat() ?? this.form.get('latitude')?.value ?? 36.8065;
    const lng = this.selectedLng() ?? this.form.get('longitude')?.value ?? 10.1815;

    if (lat !== 36.8065 || lng !== 10.1815) {
      this.selectedLat.set(lat);
      this.selectedLng.set(lng);
    }

    initMapLibre();
    this.map = new maplibregl.Map({
      container: this.mapContainer().nativeElement,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [lng, lat],
      zoom: 12,
    });

    this.map.on('load', () => this.syncMarker());
    this.map.on('click', (e) => this.useGpsControl.value ? ()=>{} : this.onMapClick(e));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private async onMapClick(e: maplibregl.MapMouseEvent): Promise<void> {
    this.selectedLat.set(e.lngLat.lat);
    this.selectedLng.set(e.lngLat.lng);
    this.form.get('latitude')?.setValue(e.lngLat.lat);
    this.form.get('longitude')?.setValue(e.lngLat.lng);
    this.syncMarker();
    const loc = await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
    if (loc.city) this.form.get('city')?.setValue(loc.city);
    if (loc.country) this.form.get('country')?.setValue(loc.country);
  }

  private syncMarker(): void {
    const lat = this.selectedLat();
    const lng = this.selectedLng();
    if (lat === null || lng === null || !this.map) return;

    this.marker?.remove();
    const el = document.createElement('div');
    el.className = 'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg border-2 border-white';
    el.innerHTML = `
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 6a12 12 0 0 0-12 12c0 8 12 24 12 24s12-16 12-24A12 12 0 0 0 24 6Z" fill="#C0182A"></path>
  <path d="M24 13c0 0-4 4.5-4 7a4 4 0 0 0 8 0C28 17.5 24 13 24 13Z" fill="white"></path>
</svg>`;
    this.marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

  private toggleGps(enabled: boolean): void {
    if (!enabled) {
      this.error.set(null);
      return;
    }

    if (!('geolocation' in navigator)) {
      this.error.set('GPS not available');
      this.useGpsControl.setValue(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.selectedLat.set(pos.coords.latitude);
        this.selectedLng.set(pos.coords.longitude);
        this.form.get('latitude')?.setValue(pos.coords.latitude);
        this.form.get('longitude')?.setValue(pos.coords.longitude);
        this.error.set(null);
        this.syncMarker();
        this.map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 });
        reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((loc) => {
          if (loc.city) this.form.get('city')?.setValue(loc.city);
          if (loc.country) this.form.get('country')?.setValue(loc.country);
        });
      },
      () => {
        this.error.set('Unable to get GPS location. Make sure location access is granted.');
        this.useGpsControl.setValue(false);
      },
    );
  }
}
