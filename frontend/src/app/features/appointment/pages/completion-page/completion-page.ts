import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompletionSchema } from '../../../../shared/schemas/appointment.schema';
import { BLOOD_TYPE_NAMES } from '../../../../shared/utils/blood-type-utils';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-completion-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
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
  protected readonly bloodTypes = BLOOD_TYPE_NAMES;
  protected readonly bloodTypeKeys = Object.keys(BLOOD_TYPE_NAMES).filter((k) => k !== 'UNKNOWN') as Array<keyof typeof BLOOD_TYPE_NAMES>;

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
