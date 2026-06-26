import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { CenterStore } from '../../center.store';

@Component({
  selector: 'app-center-manage-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, RouterLink, LoadingSpinnerComponent, StatusBadgeComponent],
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
