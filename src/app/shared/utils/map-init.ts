import maplibregl from 'maplibre-gl';

let initialized = false;

export function initMapLibre(): void {
  if (!initialized && typeof window !== 'undefined') {
    (window as any).maplibregl = maplibregl;
    initialized = true;
  }
}
