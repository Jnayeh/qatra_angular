import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import Papa from 'papaparse';
import { AdminService } from '@/app/features/admin/admin.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    FormsModule,
    Select,
    Button,
    DatePicker,
    TableModule,
    ProgressSpinner,
  ],
  templateUrl: './reports-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPageComponent {
  private readonly adminService = inject(AdminService);
  protected readonly generating = signal(false);
  protected readonly reportData = signal<Record<string, unknown>[]>([]);
  protected readonly reportColumns = signal<string[]>([]);
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;
  protected reportType = 'DONATIONS';
  protected readonly reportTypeOptions = [
    { value: 'DONATIONS', label: 'Donations' },
    { value: 'DONORS', label: 'Donors' },
    { value: 'CENTERS', label: 'Centers' },
    { value: 'EMERGENCIES', label: 'Emergencies' },
  ];

  protected generate(): void {
    this.generating.set(true);
    const params: Record<string, string | number | boolean | undefined> = { type: this.reportType };
    if (this.dateFrom) params['from'] = this.dateFrom.toISOString().split('T')[0];
    if (this.dateTo) params['to'] = this.dateTo.toISOString().split('T')[0];

    this.adminService.getReports(params).subscribe({
      next: (res) => {
        const data = res.data as any;
        const rows = data?.totalDonations != null
          ? [{ metric: 'Total Donations', value: data.totalDonations }, { metric: 'New Donors', value: data.newDonors }, { metric: 'Active Centers', value: data.activeCenters }, { metric: 'Emergency Response Rate', value: data.emergencyResponseRate + '%' }]
          : [{ message: 'Report generated', ...data }];
        this.reportData.set(rows);
        this.reportColumns.set(Object.keys(rows[0]));
        this.generating.set(false);
      },
      error: () => this.generating.set(false),
    });
  }

  protected exportCsv(): void {
    const csv = Papa.unparse(this.reportData());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.reportType.toLowerCase()}_report.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
