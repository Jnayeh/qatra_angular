import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { CenterStore } from '@/app/features/center/center.store';

@Component({
  selector: 'app-center-manage-page',
  standalone: true,
  imports: [Button, Divider, RouterLink, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './center-manage-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterManagePageComponent implements OnInit {
  protected readonly store = inject(CenterStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.store.loadCenter(id);
    }
  }
}
