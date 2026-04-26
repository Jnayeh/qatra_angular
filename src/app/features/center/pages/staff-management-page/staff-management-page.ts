import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { CenterService } from '@/app/features/center/center.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';

@Component({
  selector: 'app-staff-management-page',
  standalone: true,
  imports: [FormsModule, Card, Button, Dialog, InputText, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './staff-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffManagementPageComponent implements OnInit {
  private readonly centerService = inject(CenterService);
  private readonly route = inject(ActivatedRoute);

  protected readonly staff = signal<import('@/app/shared/models/center.model').StaffProfile[]>([]);
  protected readonly loading = signal(true);
  protected readonly showAddDialog = signal(false);
  protected readonly newUserId = signal('');
  protected readonly adding = signal(false);

  private centerId = 0;

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.params['id']);
    this.loadStaff();
  }

  private loadStaff(): void {
    this.loading.set(true);
    this.centerService.getStaff(this.centerId).subscribe({
      next: (res) => {
        this.staff.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected addStaff(): void {
    const userId = Number(this.newUserId());
    if (!userId) return;
    this.adding.set(true);
    this.centerService.addStaff(this.centerId, userId).subscribe({
      next: (res) => {
        this.staff.update((s) => [...s, res.data]);
        this.newUserId.set('');
        this.showAddDialog.set(false);
        this.adding.set(false);
      },
      error: () => this.adding.set(false),
    });
  }

  protected removeStaff(userId: number): void {
    this.centerService.removeStaff(this.centerId, userId).subscribe({
      next: () => this.staff.update((s) => s.filter((m) => m.userId !== userId)),
    });
  }
}
