/**
 * @file citySelect.js — 縣市選單 (city-select screen). Renders one neon card
 * per CITIES entry into the #city-select overlay (frozen in index.html) and
 * owns its show/hide. A 'ready' city is a clickable neon card; a 'soon' city
 * is a greyed "即將推出" card.
 *
 * Picking a city = reload into it: localStorage.setItem('rf_city', id) then
 * navigate to ?city=<id>. The engine bakes the active pack at load (active.js),
 * so there is NO runtime hot-swap — a reload is the contract.
 *
 * The overlay markup (#city-select) and its neon styles live in index.html
 * (reusing the title's 夜市霓虹 vocabulary: .ny-kicker / .game-title / .btn /
 * --c-* glow). This module only fills the #city-grid cards and toggles the
 * .hidden class — the same overlay-visibility pattern as ui/screens.js.
 */
import { CITIES } from '../packs/manifest.js';

/** @type {HTMLElement|null} The #city-select overlay (lazily resolved). */
let _overlay = null;
/** @type {boolean} Cards built once (idempotent across show/hide). */
let _built = false;

/** @returns {HTMLElement|null} The #city-select overlay element. */
function overlay() {
  if (_overlay === null) {
    _overlay = /** @type {HTMLElement} */ (document.getElementById('city-select'));
  }
  return _overlay;
}

/**
 * Persist the chosen city and reload into it. localStorage write is
 * best-effort (private mode); the ?city= param is the authoritative carrier
 * (resolveCityId reads the param first), so navigation always works.
 * @param {string} id A CITIES id with status 'ready'.
 */
function chooseCity(id) {
  try {
    localStorage.setItem('rf_city', id);
  } catch (_) {
    /* private mode / blocked storage — ?city= below still carries the choice */
  }
  // Reload into the chosen city (the engine reads ?city= at load).
  const url = new URL(window.location.href);
  url.searchParams.set('city', id);
  window.location.href = url.toString();
}

/**
 * Build one card per CITIES entry into #city-grid (once). 'ready' = clickable
 * neon card (displayName + tagline); 'soon' = greyed "即將推出" card.
 */
function buildCards() {
  const grid = document.getElementById('city-grid');
  if (grid === null) return;
  grid.textContent = ''; // idempotent rebuild
  for (let i = 0; i < CITIES.length; i++) {
    const c = CITIES[i];
    const ready = c.status === 'ready';
    const card = document.createElement(ready ? 'button' : 'div');
    card.className = 'city-card' + (ready ? '' : ' city-card-soon');
    if (ready) {
      /** @type {HTMLButtonElement} */ (card).type = 'button';
      card.setAttribute('aria-label', c.displayName + ' — ' + (c.tagline || ''));
      card.addEventListener('click', () => chooseCity(c.id));
    } else {
      card.setAttribute('aria-disabled', 'true');
    }

    const name = document.createElement('span');
    name.className = 'city-card-name';
    name.textContent = c.displayName;
    card.appendChild(name);

    const tag = document.createElement('span');
    tag.className = 'city-card-tag';
    tag.textContent = ready ? (c.tagline || '') : '即將推出 / COMING SOON';
    card.appendChild(tag);

    grid.appendChild(card);
  }
  _built = true;
}

/** Show the city-select overlay (builds the cards on first show). */
export function showCitySelect() {
  if (!_built) buildCards();
  const el = overlay();
  if (el !== null) el.classList.remove('hidden');
}

/** Hide the city-select overlay. */
export function hideCitySelect() {
  const el = overlay();
  if (el !== null) el.classList.add('hidden');
}
