import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { AuthStore } from '../../../../core/auth/auth.store';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { CenterStore } from '../../center.store';

@Component({
  selector: 'app-center-detail-page',
  standalone: true,
  imports: [Card, Button, RouterLink, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './center-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDetailPageComponent implements OnInit, AfterViewInit {
  protected readonly store = inject(CenterStore);
  protected readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  protected readonly mapEl = viewChild<ElementRef<HTMLDivElement>>('mapDetail');
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  protected readonly days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      this.store.loadCenter(id);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 500);
  }

  private initMap(): void {
    const c = this.store.selectedCenter();
    if (!c) return;
    const el = this.mapEl()?.nativeElement;
    if (!el) return;
    this.map = L.map(el, { zoomControl: true }).setView([c.latitude, c.longitude], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);
    this.marker = L.marker([c.latitude, c.longitude]).addTo(this.map);
    this.marker.bindPopup(`<b>${c.name}</b>`).openPopup();
  }
}
