// Reverse geocoding utility using Nominatim (free, no API key)
// with localStorage caching and rate limiting

const CACHE_PREFIX = 'geo_cache_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // Nominatim: max 1 req/sec

/**
 * Parse a geopoint value into { lat, lon }.
 * Supports:
 *  - GeoJSON object: { type: 'Point', coordinates: [lon, lat, alt] }
 *  - WKT string: "POINT (lon lat)"
 *  - ODK string: "lat lon alt acc"
 */
export function parseGeopoint(value) {
  if (value == null) return null;

  // GeoJSON object from OData API
  if (typeof value === 'object' && value.type === 'Point' && Array.isArray(value.coordinates)) {
    const [lon, lat] = value.coordinates;
    if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
    return null;
  }

  const str = String(value).trim();

  // WKT format: POINT (lon lat)
  const wktMatch = str.match(/^POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)/i);
  if (wktMatch) {
    const lon = parseFloat(wktMatch[1]);
    const lat = parseFloat(wktMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
  }

  // ODK format: "lat lon alt acc"
  const parts = str.split(/\s+/);
  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
  }
  return null;
}

/**
 * Format coordinates as readable string
 */
export function formatCoords(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

function getCacheKey(lat, lon) {
  return `${CACHE_PREFIX}${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

/**
 * Get cached place name (synchronous, localStorage)
 */
export function getCachedPlaceName(lat, lon) {
  try {
    const key = getCacheKey(lat, lon);
    const cached = localStorage.getItem(key);
    if (cached) {
      const { ts, name } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL_MS) return name;
      localStorage.removeItem(key);
    }
  } catch (_) { /* ignore */ }
  return null;
}

/**
 * Reverse geocode using Nominatim API (async, with rate limiting and caching)
 */
export async function reverseGeocode(lat, lon) {
  // Check cache first
  const cached = getCachedPlaceName(lat, lon);
  if (cached) return cached;

  // Rate limit
  const now = Date.now();
  const wait = MIN_REQUEST_INTERVAL - (now - lastRequestTime);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastRequestTime = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1&accept-language=fr`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'AGR-Collect/1.0' }
    });
    if (!resp.ok) return null;

    const data = await resp.json();
    const addr = data.address || {};
    const parts = [];
    if (addr.village || addr.town || addr.city) parts.push(addr.village || addr.town || addr.city);
    if (addr.county || addr.state_district) parts.push(addr.county || addr.state_district);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);
    const placeName = parts.length > 0 ? parts.join(', ') : (data.display_name || null);

    // Cache result
    if (placeName) {
      try {
        const key = getCacheKey(lat, lon);
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), name: placeName }));
      } catch (_) { /* storage full */ }
    }

    return placeName;
  } catch (_) {
    return null;
  }
}

/**
 * Format a geopoint value for display:
 * Returns cached place name if available, otherwise formatted coordinates
 */
export function formatGeopoint(value) {
  const parsed = parseGeopoint(value);
  if (!parsed) {
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  const cached = getCachedPlaceName(parsed.lat, parsed.lon);
  if (cached) return cached;
  return formatCoords(parsed.lat, parsed.lon);
}
