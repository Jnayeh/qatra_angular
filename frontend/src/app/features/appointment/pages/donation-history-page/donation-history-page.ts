import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { AppointmentService } from '../../appointment.service';

interface DonationRecord {
  date: string;
  center: string;
  mlCollected: number;
  certificateUrl: string;
}

@Component({
  selector: 'app-donation-history-page',
  standalone: true,
  imports: [
    FormsModule,
    Card,
    Button,
    DatePicker,
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
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;

  private allDonations: DonationRecord[] = [];

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.appointmentService.getMyDonations({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.allDonations = res.data.content;
        this.donations.set(this.allDonations);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected applyFilter(): void {
    let filtered = this.allDonations;
    if (this.dateFrom) {
      const from = this.dateFrom.toISOString().split('T')[0];
      filtered = filtered.filter((d) => d.date >= from);
    }
    if (this.dateTo) {
      const to = this.dateTo.toISOString().split('T')[0];
      filtered = filtered.filter((d) => d.date <= to);
    }
    this.donations.set(filtered);
  }

  protected clearFilter(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.donations.set(this.allDonations);
  }

  protected openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
