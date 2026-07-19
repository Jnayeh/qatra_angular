import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { EmergencyStore } from '@/app/features/emergency/emergency.store';

@Component({
  selector: 'app-emergency-detail-page',
  standalone: true,
  imports: [FormsModule, Card, Button, Dialog, Textarea, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './emergency-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyDetailPageComponent implements OnInit {
  protected readonly store = inject(EmergencyStore);
  protected readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly showDeclineDialog = signal(false);
  protected readonly declineReason = signal('');
  protected readonly isResponding = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.store.loadEmergency(id);
    }
  }

  protected accept(): void {
    const e = this.store.selectedEmergency();
    if (!e) return;
    this.isResponding.set(true);
    this.store.acceptEmergency(e.id).subscribe({
      next: () => {
        this.isResponding.set(false);
        this.store.loadEmergency(e.id);
      },
      error: () => this.isResponding.set(false),
    });
  }

  protected openDeclineDialog(): void {
    this.declineReason.set('');
    this.showDeclineDialog.set(true);
  }

  protected confirmDecline(): void {
    const e = this.store.selectedEmergency();
    if (!e) return;
    this.isResponding.set(true);
    this.store.declineEmergency(e.id, this.declineReason()).subscribe({
      next: () => {
        this.isResponding.set(false);
        this.showDeclineDialog.set(false);
        this.store.loadEmergency(e.id);
      },
      error: () => this.isResponding.set(false),
    });
  }
}
