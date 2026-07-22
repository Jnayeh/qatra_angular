import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DonorService } from '@/app/features/donor/donor.service';
import { DonorStore } from '@/app/features/donor/donor.store';

@Component({
  selector: 'app-availability-page',
  standalone: true,
  imports: [Button],
  templateUrl: './availability-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityPageComponent {
  private readonly donorService = inject(DonorService);
  private readonly donorStore = inject(DonorStore);

  protected readonly availabilityOptions = [
    { value: 'AVAILABLE', label: 'Available', icon: 'check_circle', description: 'Ready to donate ÔÇö you may receive emergency alerts' },
    { value: 'TEMPORARILY_UNAVAILABLE', label: 'Temporarily Unavailable', icon: 'pause_circle', description: 'Not available right now ÔÇö no emergency alerts' },
    { value: 'VACATION_MODE', label: 'Vacation Mode', icon: 'beach_access', description: 'On vacation ÔÇö no emergency alerts' },
  ];

  protected readonly currentStatus = computed(() => this.donorStore.profile()?.availability ?? 'AVAILABLE');

  protected setStatus(status: string): void {
    this.donorService.updateAvailability(status).subscribe();
  }
}
