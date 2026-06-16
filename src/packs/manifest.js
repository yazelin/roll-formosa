/**
 * @file manifest.js — city registry (single source of truth for the selector
 * and active.js). status: 'ready' = playable; 'soon' = greyed "即將推出".
 */
export const CITIES = Object.freeze([
  Object.freeze({ id: 'taipei',    displayName: '台北', status: 'ready' }),
  Object.freeze({ id: 'kaohsiung', displayName: '高雄', status: 'ready' }),
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
