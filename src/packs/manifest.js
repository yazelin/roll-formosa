/**
 * @file manifest.js — city registry (single source of truth for the selector
 * and active.js). status: 'ready' = playable; 'soon' = greyed "即將推出".
 */
export const CITIES = Object.freeze([
  Object.freeze({ id: 'taipei',    displayName: '台北', tagline: '101 終點',   status: 'ready' }),
  Object.freeze({ id: 'kaohsiung', displayName: '高雄', tagline: '85 大樓終點', status: 'ready' }),
  Object.freeze({ id: 'taichung', displayName: '台中', tagline: '台中之鑽終點', status: 'ready' }),
  Object.freeze({ id: 'tainan', displayName: '台南', tagline: '林百貨終點', status: 'ready' }),
  Object.freeze({ id: 'keelung', displayName: '基隆', tagline: '雨港廟口', status: 'ready' }),
]);

export const DEFAULT_CITY = 'taipei';

/** Resolve the chosen city id from ?city= then localStorage, validated against CITIES. */
export function resolveCityId() {
  let id = null;
  try {
    const u = new URLSearchParams(globalThis.location?.search || '');
    id = u.get('city');
    if (!id && globalThis.localStorage) id = globalThis.localStorage.getItem('rf_city');
  } catch { /* SSR/test: fall through to default */ }
  const ok = CITIES.some((c) => c.id === id && c.status === 'ready');
  return ok ? id : DEFAULT_CITY;
}
