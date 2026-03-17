import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [Button],
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon = input('inbox');
  readonly title = input('Nothing here');
  readonly message = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
