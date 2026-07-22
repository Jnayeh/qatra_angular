import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';
import { CenterService } from '@/app/features/center/center.service';

@Component({
  selector: 'app-center-reports-page',
  standalone: true,
  imports: [FormsModule, Button, Select, DatePicker, TableModule, ProgressSpinner],
  templateUrl: './center-reports-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterReportsPageComponent {
  private readonly centerService = inject(CenterService);
  private readonly route = inject(ActivatedRoute);

  protected readonly generating = signal(false);
  protected readonly hasGenerated = signal(false);
  protected readonly reportData = signal<Record<string, unknown>[]>([]);
  protected readonly reportColumns = signal<string[]>([]);
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;
  protected centerId = Number(this.route.snapshot.params['id']);
  protected reportType = 'donations';
  protected readonly reportTypeOptions = [
    { value: 'donations', label: 'Donations' },
    { value: 'emergencies', label: 'Emergencies' },
  ];

  protected generate(): void {
    if (!this.centerId || !this.dateFrom || !this.dateTo) {
      alert('Please select a date range');
      return;
    }
    
    this.generating.set(true);
    const startDate = this.dateFrom.toISOString().split('T')[0];
    const endDate = this.dateTo.toISOString().split('T')[0];

    this.centerService.getReport(this.centerId, startDate, endDate).subscribe({
      next: (csvData: Blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n').filter(line => line.trim());
          if (lines.length > 0) {
            const headers = lines[0].split(',');
            const rows = lines.slice(1).map(line => {
              const values = line.split(',');
              const row: Record<string, unknown> = {};
              headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
              });
              return row;
            });
            this.reportData.set(rows);
            this.reportColumns.set(headers.map(h => h.trim()));
          }
          this.hasGenerated.set(true);
        };
        reader.readAsText(csvData);
        this.generating.set(false);
      },
      error: () => this.generating.set(false),
    });
  }

  protected exportCsv(): void {
    if (!this.centerId || !this.dateFrom || !this.dateTo) {
      alert('Please select a date range');
      return;
    }
    
    const startDate = this.dateFrom.toISOString().split('T')[0];
    const endDate = this.dateTo.toISOString().split('T')[0];

    this.centerService.getReport(this.centerId, startDate, endDate).subscribe({
      next: (csvData: Blob) => {
        const url = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = url;
        link.download = `center-${this.centerId}-report.csv`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Failed to export report'),
    });
  }
}
