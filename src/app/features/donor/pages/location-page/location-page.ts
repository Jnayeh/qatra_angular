import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DonorStore } from '@/app/features/donor/donor.store';
import { LocationPickerComponent } from '@/app/shared/components/location-picker/location-picker';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [ReactiveFormsModule, Button, LocationPickerComponent],
  templateUrl: './location-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPageComponent {
  private readonly donorStore = inject(DonorStore);

  protected readonly form = new FormGroup({
    latitude: new FormControl<number | null>(null),
    longitude: new FormControl<number | null>(null),
    city: new FormControl(''),
    country: new FormControl(''),
  });

  constructor() {
    const profile = this.donorStore.profile();
    if (profile?.latitude != null) this.form.get('latitude')!.setValue(profile.latitude);
    if (profile?.longitude != null) this.form.get('longitude')!.setValue(profile.longitude);
    if (profile?.city) this.form.get('city')!.setValue(profile.city);
    if (profile?.country) this.form.get('country')!.setValue(profile.country);
  }

  protected saveLocation(): void {
    const lat = this.form.value.latitude!;
    const lng = this.form.value.longitude!;
    if (lat == null || lng == null) return;

    this.donorStore.updateLocation({
      latitude: lat,
      longitude: lng,
      city: this.form.value.city ?? undefined,
      country: this.form.value.country ?? "Tunisia",
    });
  }
}
