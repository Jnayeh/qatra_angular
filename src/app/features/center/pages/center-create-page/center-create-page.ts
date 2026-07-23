import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Router, RouterLink } from '@angular/router';
import { CenterService } from '@/app/features/center/center.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { LocationPickerComponent } from '@/app/shared/components/location-picker/location-picker';
import type { FacilityType } from '@/app/shared/models/center.model';

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
    LocationPickerComponent,
  ],
  templateUrl: './center-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterCreatePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly centerService = inject(CenterService);

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
    latitude: [<number | null>null],
    longitude: [<number | null>null],
    totalCapacity: [<number | null>null],
    maxRegular: [<number | null>null],
    slotPeriod: [30],
  });

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
      latitude: formValue.latitude ?? 0,
      longitude: formValue.longitude ?? 0,
      totalCapacity: formValue.totalCapacity ?? 0,
      maxRegular: formValue.maxRegular ?? 0,
      slotPeriod: formValue.slotPeriod ?? 30,
    };

    this.centerService.createCenter(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/center-management/dashboard']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Failed to create center. Please try again.');
      },
    });
  }
}
