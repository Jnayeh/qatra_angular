import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DonorService } from '../../donor.service';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatError],
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
