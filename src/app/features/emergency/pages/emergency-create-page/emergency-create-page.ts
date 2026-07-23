import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { RadioButton } from 'primeng/radiobutton';
import { Router, RouterLink } from '@angular/router';
import { EmergencyCreateSchema } from '@/app/shared/schemas/emergency.schema';
import { BLOOD_TYPE_NAMES } from '@/app/shared/utils/blood-type-utils';
import { CenterStore } from '@/app/features/center/center.store';
import { EmergencyStore } from '@/app/features/emergency/emergency.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-emergency-create-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    DatePicker,
    RadioButton,
    RouterLink,
    LoadingSpinnerComponent,
  ],
  templateUrl: './emergency-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyCreatePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly emergencyStore = inject(EmergencyStore);
  protected readonly centerStore = inject(CenterStore);
  protected readonly submitting = signal(false);
  protected readonly bloodTypes = BLOOD_TYPE_NAMES;
  protected readonly bloodTypeKeys = Object.keys(BLOOD_TYPE_NAMES).filter((k) => k !== 'UNKNOWN') as Array<keyof typeof BLOOD_TYPE_NAMES>;
  protected readonly bloodTypeOptions = this.bloodTypeKeys.map((k) => ({ value: k, label: this.bloodTypes[k] }));

  protected readonly urgencyOptions = [
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  protected form = this.fb.group({
    centerId: [<number | null>null, Validators.required],
    bloodType: [<string | null>null, Validators.required],
    unitsNeeded: [<number | null>null, [Validators.required, Validators.min(1)]],
    urgency: [<string | null>null, Validators.required],
    contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)]],
    matchRadius: [50, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.centerStore.loadCenters({ page: 0, size: 200 });
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const parsed = EmergencyCreateSchema.safeParse(this.form.value);
    if (!parsed.success) {
      this.submitting.set(false);
      return;
    }
    this.emergencyStore.createEmergency(parsed.data).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/center-management/emergencies']);
      },
      error: () => this.submitting.set(false),
    });
  }
}
