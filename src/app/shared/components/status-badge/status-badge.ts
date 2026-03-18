import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  protected readonly label = computed(() => this.status().replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));

  protected readonly badgeClass = computed(() => {
    const s = this.status();
    if (s.includes('ACTIVE') || s.includes('AVAILABLE') || s.includes('COMPLETED') || s.includes('DELIVERED') || s.includes('READ') || s.includes('FULFILLED')) {
      return 'bg-green-900 text-green-200';
    }
    if (s.includes('PENDING') || s.includes('SCHEDULED') || s.includes('SENT') || s.includes('ACCEPTED')) {
      return 'bg-yellow-900 text-yellow-200';
    }
    if (s.includes('CANCELLED') || s.includes('DECLINED') || s.includes('FAILED') || s.includes('SUSPENDED') || s.includes('CLOSED') || s.includes('EXPIRED') || s.includes('NO_SHOW')) {
      return 'bg-red-900 text-red-200';
    }
    if (s.includes('CHECKED_IN') || s.includes('IN_SCREENING') || s.includes('IN_PROGRESS')) {
      return 'bg-blue-900 text-blue-200';
    }
    return 'bg-gray-700 text-gray-200';
  });
}
