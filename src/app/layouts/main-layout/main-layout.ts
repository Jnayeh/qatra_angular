import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@/app/layouts/main-layout/sidebar/sidebar';
import { ToolbarComponent } from '@/app/layouts/main-layout/toolbar/toolbar';
import { AuthStore } from '@/app/core/auth/auth.store';
import { StaffStore } from '@/app/features/appointment/staff.store';

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
export class MainLayoutComponent implements OnInit {
  protected readonly sidebarOpen = signal(true);
  private readonly authStore = inject(AuthStore);
  private readonly staffStore = inject(StaffStore);

  ngOnInit(): void {
    const user = this.authStore.user();
    if (user?.roles.includes('CENTER_STAFF') || user?.roles.includes('CENTER_ADMIN')) {
      this.staffStore.loadProfile();
    }
  }
}
