export interface ReverseGeocodeResult {
  city: string;
  country: string;
}

let lastCall = 0;

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const now = Date.now();
  const elapsed = now - lastCall;
  if (elapsed < 1100) {
    await new Promise((r) => setTimeout(r, 1100 - elapsed));
  }
  lastCall = Date.now();

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    { headers: { 'User-Agent': 'Qatra/1.0' } },
  );
  const data = await res.json();
  const addr = data?.address ?? {};
  return {
    city: addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? '',
    country: addr.country ?? '',
  };
}
