import maplibregl from 'maplibre-gl';

let initialized = false;

export function initMapLibre(): void {
  if (!initialized && typeof window !== 'undefined') {
    (window as any).maplibregl = maplibregl;
    maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
      true,
    );
    initialized = true;
  }
}