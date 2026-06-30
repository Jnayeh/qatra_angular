import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ProgressSpinner } from 'primeng/progressspinner';
import { CompletionSchema } from '../../../../shared/schemas/appointment.schema';
import { BLOOD_TYPE_NAMES } from '../../../../shared/utils/blood-type-utils';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-completion-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    InputNumber,
    Select,
    Textarea,
    ProgressSpinner,
    RouterLink,
  ],
  templateUrl: './completion-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly bloodTypeOptions = [
    { label: 'Keep existing', value: null },
    ...Object.keys(BLOOD_TYPE_NAMES)
      .filter((k) => k !== 'UNKNOWN')
      .map(k => ({ label: BLOOD_TYPE_NAMES[k as keyof typeof BLOOD_TYPE_NAMES], value: k })),
  ];

  private appointmentId = 0;

  protected form = this.fb.group({
    mlCollected: [<number | null>null, [Validators.required, Validators.min(1)]],
    bloodType: [<string | null>null],
    notes: [''],
  });

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.params['id']);
  }

  protected submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.value;
    const payload = {
      mlCollected: raw.mlCollected!,
      ...(raw.bloodType ? { bloodType: raw.bloodType } : {}),
      ...(raw.notes ? { notes: raw.notes } : {}),
    };
    const parsed = CompletionSchema.safeParse(payload);
    if (!parsed.success) {
      this.submitting.set(false);
      return;
    }
    this.appointmentService.complete(this.appointmentId, parsed.data).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/appointments', 'staff-queue']);
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err.friendlyMessage ?? 'Completion failed');
      },
    });
  }
}
