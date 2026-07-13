import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import { Router, RouterLink } from '@angular/router';
import maplibregl from 'maplibre-gl';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { CenterSummary } from '@/app/shared/models/center.model';
import { CenterStore } from '@/app/features/center/center.store';
import { initMapLibre } from '@/app/shared/utils/map-init';

@Component({
  selector: 'app-center-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Card,
    Button,
    InputText,
    Tooltip,
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
  private map: maplibregl.Map | null = null;
  private markers: maplibregl.Marker[] = [];

  ngOnInit(): void {
    this.store.loadCenters({ page: 0, size: 50 });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 300);
  }

  private initMap(): void {
    initMapLibre();
    const el = this.mapEl()?.nativeElement;
    if (!el) return;
    this.map = new maplibregl.Map({
      container: el,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [10.1815, 36.8065],
      zoom: 6,
    });
    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;
    this.markers.forEach((m) => m.remove());
    this.markers = [];
    for (const c of this.store.centers()) {
      const el = document.createElement('div');
      el.style.cssText = 'width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
      el.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="#cc0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
        `<div dir="auto"><b>${c.name}</b><br/>${c.city}</div><a href="/centers/${c.id}" style="display:block;margin-top:4px;color:#cc0000;">View details</a>`,
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([c.longitude ?? 0, c.latitude ?? 0])
        .setPopup(popup)
        .addTo(this.map!);
      el.addEventListener('click', () => this.router.navigate(['/centers', c.id]));
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
    if (this.showMap()) setTimeout(() => this.map?.resize());
  }
}
