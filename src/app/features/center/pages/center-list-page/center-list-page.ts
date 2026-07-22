import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, OnInit, afterNextRender, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { Tooltip } from 'primeng/tooltip';
import { Router, RouterLink } from '@angular/router';
import maplibregl from 'maplibre-gl';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import type { CenterSummary } from '@/app/shared/models/center.model';
import { CenterService } from '@/app/features/center/center.service';
import { initMapLibre } from '@/app/shared/utils/map-init';

@Component({
  selector: 'app-center-list-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Slider,
    Tooltip,
    RouterLink,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './center-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterListPageComponent implements OnInit, OnDestroy {
  private readonly centerService = inject(CenterService);
  private readonly router = inject(Router);

  protected readonly isDonor = () => this.router.url.startsWith('/donor');
  protected readonly centerPrefix = () => this.isDonor() ? '/donor/centers' : '/centers'; 

  protected readonly viewMode = signal<'map' | 'list'>('map');
  protected readonly isLoading = signal(false);
  protected readonly mapEl = viewChild<ElementRef<HTMLDivElement>>('mapContainer');
  private map: maplibregl.Map | null = null;
  private markers: maplibregl.Marker[] = [];


  protected readonly mapCenters = signal<CenterSummary[]>([]);


  protected readonly listCenters = signal<CenterSummary[]>([]);
  protected readonly listPage = signal(0);
  protected readonly listTotalPages = signal(0);
  protected readonly listTotalElements = signal(0);
  protected readonly pageSize = 12;

  protected readonly distanceKm = signal(50);
  protected readonly cityFilter = new FormControl('');

  ngOnInit(): void {
    this.loadMapCenters();
  }

  ngAfterViewInit(): void {
    afterNextRender(() => this.initMap());
  }

  ngOnDestroy(): void {
    this.map?.remove();
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
    this.map.on('moveend', () => this.onMapMove());
    this.addMarkers();
  }

  private onMapMove(): void {
    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    const bounds = this.map.getBounds();
    const visible = this.mapCenters().filter((c) => {
      if (c.latitude == null || c.longitude == null) return false;
      return bounds.contains([c.longitude, c.latitude]);
    });

    for (const c of visible) {
      const el = document.createElement('div');
      el.style.cssText = 'width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
      el.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="#cc0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
        `<div style="min-width:140px"><b>${c.name}</b><br/><span style="color:#6b7280;font-size:12px">${c.city}</span>` +
        `<br/><span style="color:#6b7280;font-size:12px">${c.status}</span>` +
        `<a href="${this.router.url.startsWith('/donor') ? '/donor/centers' : '/centers'}/${c.id}" style="display:block;margin-top:4px;color:#cc0000;font-size:12px">View details</a></div>`, 
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([c.longitude!, c.latitude!])
        .setPopup(popup)
        .addTo(this.map!);
      el.addEventListener('click', () => this.router.navigate([this.centerPrefix(), c.id]));
      this.markers.push(marker);
    }
  }

  private loadMapCenters(): void {
    this.isLoading.set(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.centerService.getPublicCenters(pos.coords.latitude, pos.coords.longitude)
            .subscribe({ next: (res) => { this.mapCenters.set(res.data); this.isLoading.set(false); afterNextRender(() => this.addMarkers()); }, error: () => this.isLoading.set(false) });
        },
        () => {
          this.centerService.getPublicCenters().subscribe({ next: (res) => { this.mapCenters.set(res.data); this.isLoading.set(false); afterNextRender(() => this.addMarkers()); }, error: () => this.isLoading.set(false) });
        },
        { timeout: 5000, maximumAge: 600000 },
      );
    } else {
      this.centerService.getPublicCenters().subscribe({ next: (res) => { this.mapCenters.set(res.data); this.isLoading.set(false); afterNextRender(() => this.addMarkers()); }, error: () => this.isLoading.set(false) });
    }
  }

  protected loadListPage(page: number): void {
    this.isLoading.set(true);
    this.listPage.set(page);
    const params: Record<string, string | number | boolean | undefined> = {
      page: page + 1,
      size: this.pageSize,
    };
    const city = this.cityFilter.value?.trim();
    if (city) params['search'] = city;

    this.centerService.getCenters(params).subscribe({
      next: (res) => {
        this.listCenters.set(res.data);
        this.listTotalPages.set(res.page?.totalPages ?? 0);
        this.listTotalElements.set(res.page?.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected onDistanceChange(value: number): void {
    this.distanceKm.set(value);
    this.loadListPage(0);
  }

  protected onCitySearch(): void {
    this.loadListPage(0);
  }

  protected switchToList(): void {
    this.viewMode.set('list');
    this.loadListPage(0);
  }

  protected switchToMap(): void {
    this.viewMode.set('map');
    afterNextRender(() => {
      this.map?.resize();
      this.addMarkers();
    });
  }

  protected formatDistance(km: number | null): string {
    if (km == null) return '';
    return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
  }
}
