import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import maplibregl from 'maplibre-gl';
import { AuthStore } from '@/app/core/auth/auth.store';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { CenterStore } from '@/app/features/center/center.store';
import { initMapLibre } from '@/app/shared/utils/map-init';

@Component({
  selector: 'app-center-detail-page',
  standalone: true,
  imports: [Button, RouterLink, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './center-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDetailPageComponent implements OnInit, OnDestroy {
  protected readonly store = inject(CenterStore);
  protected readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly mapEl = viewChild<ElementRef<HTMLDivElement>>('mapDetail');
  private map: maplibregl.Map | null = null;
  private marker: maplibregl.Marker | null = null;

  protected readonly isDonor = () => this.router.url.startsWith('/donor');
  protected readonly centerPrefix = () => this.isDonor() ? '/donor/centers' : '/center-management/dashboard'; 

  protected readonly days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  constructor() {
    effect(() => {
      const c = this.store.selectedCenter();
      const el = this.mapEl()?.nativeElement;
      if (c && el && !this.map) {
        this.initMap(c, el);
      }
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.store.loadCenter(id);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private initMap(c: { longitude: number; latitude: number; name: string }, el: HTMLDivElement): void {
    initMapLibre();
    this.map = new maplibregl.Map({
      container: el,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [c.longitude, c.latitude],
      zoom: 14,
    });
    const markerEl = document.createElement('div');
    markerEl.style.cssText = 'width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
    markerEl.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="#cc0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
    this.marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat([c.longitude, c.latitude])
      .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`<div dir="auto"><b>${c.name}</b></div>`))
      .addTo(this.map);
    this.marker.togglePopup();
  }
}
