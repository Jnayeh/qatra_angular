import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './donation-history-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationHistoryPageComponent implements OnInit, AfterViewInit {
  private readonly appointmentService = inject(AppointmentService);
  protected readonly isLoading = signal(true);
  protected readonly displayedColumns = ['date', 'center', 'mlCollected', 'certificate'];
  protected dataSource = new MatTableDataSource<DonationRecord>([]);
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;

  private allDonations: DonationRecord[] = [];

  readonly sort = viewChild.required(MatSort);
  readonly paginator = viewChild.required(MatPaginator);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.appointmentService.getMyDonations({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.allDonations = res.data.content;
        this.dataSource.data = this.allDonations;
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
    this.dataSource.data = filtered;
  }

  protected clearFilter(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.dataSource.data = this.allDonations;
  }
}
