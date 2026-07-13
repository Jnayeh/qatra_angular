import maplibregl from 'maplibre-gl';

let initialized = false;

export function initMapLibre(): void {
  if (initialized) return;
  initialized = true;
  maplibregl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    true,
  );
}
