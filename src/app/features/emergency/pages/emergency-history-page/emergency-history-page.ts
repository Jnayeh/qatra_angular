import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { EmergencyStore } from '@/app/features/emergency/emergency.store';
import { BLOOD_TYPE_NAMES } from '@/app/shared/utils/blood-type-utils';
import { formatDate } from '@/app/shared/utils/date-utils';

@Component({
  selector: 'app-emergency-history-page',
  standalone: true,
  imports: [
    FormsModule,
    Select,
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

  protected readonly filterOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'OPEN', label: 'Open' },
    { value: 'FULFILLED', label: 'Fulfilled' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'EXPIRED', label: 'Expired' },
  ];

  ngOnInit(): void {
    this.store.loadEmergencies({ page: 0, size: 50 });
  }

  protected filtered() {
    const items = this.store.emergencies();
    if (this.statusFilter() === 'ALL') return items;
    return items.filter((e) => e.status === this.statusFilter());
  }

  protected bloodTypeLabel(bt: string): string {
    return (BLOOD_TYPE_NAMES as any)[bt] ?? bt;
  }

  protected responseBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'bg-blue-900 text-blue-300';
      case 'FULFILLED': return 'bg-green-900 text-green-300';
      case 'CANCELLED': return 'bg-gray-800 text-gray-400';
      case 'EXPIRED': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-800 text-gray-400';
    }
  }
}
