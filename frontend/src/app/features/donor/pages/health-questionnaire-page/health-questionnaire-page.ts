import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { DonorStore } from '../../donor.store';

@Component({
  selector: 'app-health-questionnaire-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatDividerModule, MatError, RouterLink],
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
    recentSurgery: new FormControl(false, { nonNullable: true }),
    recentTravel: new FormControl(false, { nonNullable: true }),
    recentTattooOrPiercing: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    const q = this.store.healthQuestionnaire();
    if (q) {
      this.form.patchValue({
        hasChronicIllness: q.hasChronicIllness,
        medicalConditionsDetails: q.medicalConditionsDetails ?? '',
        onMedication: q.onMedication,
        medicationDetails: q.medicationDetails ?? '',
        recentSurgery: q.recentSurgery,
        recentTravel: q.recentTravel,
        recentTattooOrPiercing: q.recentTattooOrPiercing,
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
      recentSurgery: this.form.value.recentSurgery ?? false,
      recentTravel: this.form.value.recentTravel ?? false,
      recentTattooOrPiercing: this.form.value.recentTattooOrPiercing ?? false,
    });
  }
}
