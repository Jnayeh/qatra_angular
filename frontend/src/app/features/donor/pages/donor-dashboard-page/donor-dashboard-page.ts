import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthStore } from '@/app/core/auth/auth.store';
import { DonorStore } from '@/app/features/donor/donor.store';
import { BLOOD_TYPE_NAMES } from '@/app/shared/utils/blood-type-utils';
import { formatDate } from '@/app/shared/utils/date-utils';

@Component({
  selector: 'app-donor-dashboard-page',
  standalone: true,
  imports: [Button, RouterLink],
  templateUrl: './donor-dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonorDashboardPageComponent implements OnInit {
  protected readonly store = inject(DonorStore);
  protected readonly authStore = inject(AuthStore);
  protected readonly bloodTypeNames = BLOOD_TYPE_NAMES;
  protected readonly formatDate = formatDate;

  protected readonly profileChecklist = computed(() => {
    const items = [
      { label: 'Set blood type', done: !!this.store.profile()?.bloodType && this.store.profile()?.bloodType !== 'UNKNOWN', link: '/donor/blood-type' },
      { label: 'Set location', done: !!this.store.profile()?.city, link: '/donor/location' },
      { label: 'Health questionnaire', done: this.store.profileComplete(), link: '/donor/health-questionnaire' },
      { label: 'Notification preferences', done: !!this.store.profile()?.notificationPreferences, link: '/donor/notification-prefs' },
    ];
    const done = items.filter((i) => i.done).length;
    return { items, percent: Math.round((done / items.length) * 100) };
  });

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  protected readonly nextMilestone = computed(() => {
    const milestones = this.store.impact()?.milestones;
    if (!milestones) return null;
    return milestones.find((m) => !m.achieved) ?? null;
  });

  protected readonly donationsToNextMilestone = computed(() => {
    const next = this.nextMilestone();
    if (!next) return null;
    const total = this.store.impact()?.totalDonations ?? 0;
    const targets: Record<string, number> = {
      'First Donation': 1,
      '5 Donations': 5,
      '10 Donations': 10,
      'Silver Donor': 10,
    };
    const target = targets[next.label] ?? 10;
    return Math.max(0, target - total);
  });

  protected readonly donationProgress = computed(() => {
    const total = this.store.impact()?.totalDonations ?? 0;
    const next = this.nextMilestone();
    if (!next) return 100;
    const targets: Record<string, number> = {
      'First Donation': 1,
      '5 Donations': 5,
      '10 Donations': 10,
      'Silver Donor': 10,
    };
    const target = targets[next.label] ?? 10;
    return Math.min(100, Math.round((total / target) * 100));
  });

  protected readonly availabilityEmoji = computed(() => {
    switch (this.store.profile()?.availability) {
      case 'AVAILABLE': return '🟢';
      case 'TEMPORARILY_UNAVAILABLE': return '🟡';
      case 'VACATION_MODE': return '🏖️';
      case 'PERMANENTLY_RESTRICTED': return '⛔';
      default: return '❓';
    }
  });

  protected readonly availabilityText = computed(() => {
    switch (this.store.profile()?.availability) {
      case 'AVAILABLE': return 'Ready to donate';
      case 'TEMPORARILY_UNAVAILABLE': return 'Taking a break';
      case 'VACATION_MODE': return 'On vacation';
      case 'PERMANENTLY_RESTRICTED': return 'Restricted';
      default: return 'Unknown';
    }
  });

  ngOnInit(): void {
    this.store.loadProfile();
    this.store.loadEligibility();
    this.store.loadImpact();
    this.store.loadHealthQuestionnaire();
  }
}
