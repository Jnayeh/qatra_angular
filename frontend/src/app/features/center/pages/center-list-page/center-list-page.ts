import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import type { CenterSummary } from '../../../../shared/models/center.model';
import { CenterStore } from '../../center.store';

@Component({
  selector: 'app-center-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './center-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterListPageComponent implements OnInit, AfterViewInit {
  protected readonly store = inject(CenterStore);
  private readonly router = inject(Router);
  protected readonly cityFilter = new FormControl('');
  protected readonly showMap = signal(true);
  protected readonly mapEl = viewChild<ElementRef<HTMLDivElement>>('mapContainer');
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  ngOnInit(): void {
    this.store.loadCenters({ page: 0, size: 50 });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 300);
  }

  private initMap(): void {
    const el = this.mapEl()?.nativeElement;
    if (!el) return;
    this.map = L.map(el, { zoomControl: true }).setView([31.7917, -7.0926], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);
    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;
    this.markers.forEach((m) => m.remove());
    this.markers = [];
    for (const c of this.store.centers()) {
      const lat = 31.7917 + (Math.random() - 0.5) * 2;
      const lng = -7.0926 + (Math.random() - 0.5) * 2;
      const marker = L.marker([lat, lng]).addTo(this.map!);
      marker.bindPopup(`<b>${c.name}</b><br/>${c.city}<br/><a href="/centers/${c.id}">View details</a>`);
      marker.on('click', () => this.router.navigate(['/centers', c.id]));
      this.markers.push(marker);
    }
  }

  protected search(): void {
    const params: Record<string, string | number | boolean | undefined> = { page: 0, size: 50 };
    if (this.cityFilter.value) {
      params['city'] = this.cityFilter.value;
    }
    this.store.loadCenters(params);
  }

  protected toggleMap(): void {
    this.showMap.update((v) => !v);
    if (this.showMap()) setTimeout(() => this.map?.invalidateSize());
  }
}
