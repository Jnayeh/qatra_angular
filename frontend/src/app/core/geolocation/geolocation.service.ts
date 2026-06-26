import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../http/api.service';
import { AuthStore } from '../auth/auth.store';

interface LastPosition {
  latitude: number;
  longitude: number;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);

  private trackingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly TRACKING_INTERVAL_MS = 600_000;
  private readonly STORAGE_KEY = 'qatra_location_tracking';
  private readonly positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 300_000,
    timeout: 30_000,
  };

  readonly isTracking = signal(false);
  readonly lastPosition = signal<LastPosition | null>(null);
  readonly permissionStatus = signal<'granted' | 'denied' | 'prompt' | 'unavailable'>('prompt');

  constructor() {
    if (!('geolocation' in navigator)) {
      this.permissionStatus.set('unavailable');
    }

    effect(() => {
      const shouldTrack =
        this.authStore.isAuthenticated() &&
        this.authStore.isDonor() &&
        this.getTrackingPref();

      if (shouldTrack) {
        this.startTracking();
      } else {
        this.stopTracking();
      }
    });
  }

  private getTrackingPref(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  setTrackingPref(enabled: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, String(enabled));
    if (enabled) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }

  startTracking(): void {
    if (this.isTracking()) return;
    if (!('geolocation' in navigator)) {
      this.permissionStatus.set('unavailable');
      return;
    }

    this.isTracking.set(true);
    this.fetchAndUpdatePosition();
    this.trackingInterval = setInterval(
      () => this.fetchAndUpdatePosition(),
      this.TRACKING_INTERVAL_MS,
    );
  }

  stopTracking(): void {
    this.isTracking.set(false);
    if (this.trackingInterval !== null) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not available'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, this.positionOptions);
    });
  }

  async requestPermission(): Promise<boolean> {
    if (!('geolocation' in navigator)) {
      this.permissionStatus.set('unavailable');
      return false;
    }

    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({
          name: 'geolocation',
        });
        this.permissionStatus.set(result.state as 'granted' | 'denied' | 'prompt');
        if (result.state === 'granted') return true;
        if (result.state === 'denied') return false;
      } catch {
        // Permissions API might not support 'geolocation' in all environments
      }
    }

    try {
      const position = await this.getCurrentPosition();
      this.permissionStatus.set('granted');
      this.lastPosition.set({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(position.timestamp).toISOString(),
      });
      return true;
    } catch {
      this.permissionStatus.set('denied');
      return false;
    }
  }

  private fetchAndUpdatePosition(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.lastPosition.set({
          latitude,
          longitude,
          timestamp: new Date(position.timestamp).toISOString(),
        });
        this.permissionStatus.set('granted');
        this.api.put('/donors/me/location', { latitude, longitude }).subscribe();
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          this.permissionStatus.set('denied');
        }
      },
      this.positionOptions,
    );
  }
}
