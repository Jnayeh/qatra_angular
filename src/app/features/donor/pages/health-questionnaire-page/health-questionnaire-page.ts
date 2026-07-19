import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { DonorStore } from '@/app/features/donor/donor.store';

@Component({
  selector: 'app-health-questionnaire-page',
  standalone: true,
  imports: [ReactiveFormsModule, Card, Button, InputText, Textarea, ToggleSwitch, Divider, Message, RouterLink],
  templateUrl: './health-questionnaire-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthQuestionnairePageComponent implements OnInit {
  private readonly store = inject(DonorStore);

  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = new FormGroup({
    hasChronicIllness: new FormControl(false, { nonNullable: true }),
    medicalConditionsDetails: new FormControl(''),
    onMedication: new FormControl(false, { nonNullable: true }),
    medicationDetails: new FormControl(''),
    lastSurgeryAt: new FormControl<string | null>(null),
    lastTravelAt: new FormControl<string | null>(null),
    lastTattooOrPiercingAt: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    const q = this.store.healthQuestionnaire();
    if (q) {
      this.form.patchValue({
        hasChronicIllness: q.hasChronicIllness,
        medicalConditionsDetails: q.medicalConditionsDetails ?? '',
        onMedication: q.onMedication,
        medicationDetails: q.medicationDetails ?? '',
        lastSurgeryAt: q.lastSurgeryAt ?? null,
        lastTravelAt: q.lastTravelAt ?? null,
        lastTattooOrPiercingAt: q.lastTattooOrPiercingAt ?? null,
      });
    } else {
      this.store.loadHealthQuestionnaire();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.store.updateHealthQuestionnaire({
      hasChronicIllness: this.form.value.hasChronicIllness ?? false,
      medicalConditionsDetails: this.form.value.medicalConditionsDetails ?? null,
      onMedication: this.form.value.onMedication ?? false,
      medicationDetails: this.form.value.medicationDetails ?? null,
      lastSurgeryAt: this.form.value.lastSurgeryAt ? `${this.form.value.lastSurgeryAt}T00:00:00Z` : null,
      lastTravelAt: this.form.value.lastTravelAt ? `${this.form.value.lastTravelAt}T00:00:00Z` : null,
      lastTattooOrPiercingAt: this.form.value.lastTattooOrPiercingAt ? `${this.form.value.lastTattooOrPiercingAt}T00:00:00Z` : null,
    });
  }
}
