import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { EmergencyCreateSchema } from '../../../../shared/schemas/emergency.schema';
import { BLOOD_TYPE_NAMES } from '../../../../shared/utils/blood-type-utils';
import { CenterStore } from '../../../center/center.store';
import { EmergencyStore } from '../../emergency.store';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-emergency-create-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
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

  protected form = this.fb.group({
    centerId: [<number | null>null, Validators.required],
    bloodType: [<string | null>null, Validators.required],
    unitsNeeded: [<number | null>null, [Validators.required, Validators.min(1)]],
    urgency: [<string | null>null, Validators.required],
    contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{8,15}$/)]],
    neededBy: [<string | null>null, Validators.required],
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
        this.router.navigate(['/emergencies', 'list']);
      },
      error: () => this.submitting.set(false),
    });
  }
}
