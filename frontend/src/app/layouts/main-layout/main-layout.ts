import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/layouts/main-layout/sidebar/sidebar';
import { ToolbarComponent } from '@/app/layouts/main-layout/toolbar/toolbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    ToolbarComponent,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  protected readonly sidebarOpen = signal(true);
}
