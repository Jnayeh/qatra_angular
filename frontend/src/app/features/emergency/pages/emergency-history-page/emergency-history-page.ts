import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { EmergencyStore } from '../../emergency.store';
import { BLOOD_TYPE_NAMES } from '../../../../shared/utils/blood-type-utils';
import { formatDate } from '../../../../shared/utils/date-utils';

@Component({
  selector: 'app-emergency-history-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './emergency-history-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyHistoryPageComponent implements OnInit {
  protected readonly store = inject(EmergencyStore);
  protected readonly statusFilter = signal<string>('ALL');
  protected readonly formatDate = formatDate;

  ngOnInit(): void {
    this.store.loadMyEmergencies();
  }

  protected filtered() {
    const items = this.store.myEmergencies();
    if (this.statusFilter() === 'ALL') return items;
    return items.filter((e) => e.responseType === this.statusFilter());
  }

  protected bloodTypeLabel(bt: string): string {
    return (BLOOD_TYPE_NAMES as any)[bt] ?? bt;
  }

  protected responseBadgeClass(type: string | null): string {
    switch (type) {
      case 'WILLING': return 'bg-green-900 text-green-300';
      case 'CONVERTED_TO_APPOINTMENT': return 'bg-blue-900 text-blue-300';
      case 'DECLINED': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-800 text-gray-400';
    }
  }
}
