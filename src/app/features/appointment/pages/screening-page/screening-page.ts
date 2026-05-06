import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ScreeningSchema } from '@/app/shared/schemas/appointment.schema';
import { AppointmentService } from '@/app/features/appointment/appointment.service';

@Component({
  selector: 'app-screening-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    InputText,
    InputNumber,
    Textarea,
    ProgressSpinner,
    ToggleSwitch,
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
    temperature: [<number | null>null, [Validators.required, Validators.min(34), Validators.max(42)]],
    hemoglobin: [<number | null>null, [Validators.required, Validators.min(5), Validators.max(20)]],
    bloodPressure: ['', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]],
    weight: [<number | null>null, [Validators.required, Validators.min(30), Validators.max(200)]],
    eligible: [false, Validators.required],
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
