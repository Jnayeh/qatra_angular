import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { AppointmentService } from '@/app/features/appointment/appointment.service';

@Component({
  selector: 'app-completion-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    InputNumber,
    Textarea,
    Select,
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
  protected readonly outcomeOptions = [
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  private appointmentId = 0;

  protected form = this.fb.group({
    outcome: ['COMPLETED', Validators.required],
    mlCollected: [<number | null>null, [Validators.required, Validators.min(1)]],
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
      outcome: raw.outcome!,
      mlCollected: raw.mlCollected!,
      ...(raw.notes ? { notes: raw.notes } : {}),
    };
    this.appointmentService.complete(this.appointmentId, payload).subscribe({
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
