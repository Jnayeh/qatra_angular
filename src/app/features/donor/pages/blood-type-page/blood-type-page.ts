import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import type { BloodType } from '@/app/shared/models/donor.model';
import { formatBloodType } from '@/app/shared/utils/blood-type-utils';
import { DonorStore } from '@/app/features/donor/donor.store';

const ALL_BLOOD_TYPES: BloodType[] = [
  'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'UNKNOWN',
];

@Component({
  selector: 'app-blood-type-page',
  standalone: true,
  imports: [FormsModule, RouterLink, Button, ToggleSwitch, Select, Message],
  templateUrl: './blood-type-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BloodTypePageComponent {
  protected readonly store = inject(DonorStore);
  private readonly router = inject(Router);

  protected readonly bloodTypeOptions = ALL_BLOOD_TYPES.map((t) => ({ label: formatBloodType(t), value: t }));
  protected readonly selectedType = signal<BloodType | null>(null);
  protected readonly dontKnowType = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly formatBloodType = formatBloodType;

  protected onToggleChange(event: { checked: boolean }): void {
    if (!event.checked && !this.selectedType()) {
      this.selectedType.set(this.store.profile()?.bloodType ?? 'UNKNOWN');
    }
  }

  protected save(): void {
    if (!this.selectedType()) return;
    this.isSaving.set(true);
    this.error.set(null);

    this.store.updateBloodType(this.selectedType()!).subscribe({
      next: () => {
        this.router.navigate(['/donor/home']);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }
}
