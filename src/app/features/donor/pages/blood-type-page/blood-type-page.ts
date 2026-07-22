import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
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
  imports: [Button, RouterLink, Message],
  templateUrl: './blood-type-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BloodTypePageComponent {
  protected readonly store = inject(DonorStore);
  protected readonly bloodTypes = ALL_BLOOD_TYPES;
  protected readonly selectedType = signal<BloodType | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly formatBloodType = formatBloodType;

  protected save(): void {
    if (!this.selectedType()) return;
    this.error.set(null);
    this.store.updateBloodType(this.selectedType()!);
  }
}
