import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { AppointmentService } from '@/app/features/appointment/appointment.service';

interface DonationRecord {
  id: number;
  appointmentId: number;
  donorName: string;
  downloadUrl: string;
}

@Component({
  selector: 'app-donation-history-page',
  standalone: true,
  imports: [
    Card,
    Button,
    TableModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './donation-history-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationHistoryPageComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  protected readonly isLoading = signal(true);
  protected readonly donations = signal<DonationRecord[]>([]);

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.appointmentService.getMyDonations({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.donations.set(res.data as unknown as DonationRecord[]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
