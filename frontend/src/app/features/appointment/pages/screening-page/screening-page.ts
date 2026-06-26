import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScreeningSchema } from '../../../../shared/schemas/appointment.schema';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-screening-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterLink,
  ],
  templateUrl: './screening-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreeningPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  private appointmentId = 0;

  protected form = this.fb.group({
    temperatureCelsius: [<number | null>null, [Validators.required, Validators.min(34), Validators.max(42)]],
    hemoglobinGdL: [<number | null>null, [Validators.required, Validators.min(5), Validators.max(20)]],
    bloodPressure: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
    pulse: [<number | null>null, [Validators.required, Validators.min(40), Validators.max(200)]],
    medicalCheckPassed: [false, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.params['id']);
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const parsed = ScreeningSchema.safeParse(this.form.value);
    if (!parsed.success) {
      this.submitting.set(false);
      return;
    }
    this.appointmentService.addScreening(this.appointmentId, parsed.data).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/appointments', 'staff-queue']);
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err.friendlyMessage ?? 'Screening failed');
      },
    });
  }
}
