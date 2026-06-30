import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { DonorService } from '../../donor.service';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [ReactiveFormsModule, Card, Button, InputText, InputNumber, ToggleSwitch, Message],
  templateUrl: './location-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPageComponent {
  private readonly donorService = inject(DonorService);

  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    useGps: new FormControl(false, { nonNullable: true }),
    latitude: new FormControl<number | null>(null, [Validators.min(-90), Validators.max(90)]),
    longitude: new FormControl<number | null>(null, [Validators.min(-180), Validators.max(180)]),
    city: new FormControl(''),
    country: new FormControl(''),
  });

  protected onUseGpsChange(): void {
    if (this.form.get('useGps')?.value) {
      this.form.get('latitude')?.clearValidators();
      this.form.get('longitude')?.clearValidators();
    } else {
      this.form.get('latitude')?.setValidators([Validators.required, Validators.min(-90), Validators.max(90)]);
      this.form.get('longitude')?.setValidators([Validators.required, Validators.min(-180), Validators.max(180)]);
    }
    this.form.get('latitude')?.updateValueAndValidity();
    this.form.get('longitude')?.updateValueAndValidity();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    if (this.form.get('useGps')?.value) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.donorService.updateLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }).subscribe();
          },
          () => this.error.set('Unable to get GPS location'),
        );
      } else {
        this.error.set('GPS not available');
      }
    } else {
      this.donorService.updateLocation({
        latitude: this.form.value.latitude!,
        longitude: this.form.value.longitude!,
        city: this.form.value.city ?? undefined,
        country: this.form.value.country ?? undefined,
      }).subscribe();
    }
  }
}
