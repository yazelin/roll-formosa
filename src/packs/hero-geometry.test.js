/**
 * @file hero-geometry.test.js — gate hero/collectible/chunk tri caps for every ready city.
 *
 * THE GAP THIS CLOSES: per-pack catalog.test only checks CHUNK_ARCHETYPES tri caps,
 * NOT the landmarks/collectibles in the full CATALOG. geometryFactory.buildAllGeometries
 * asserts EVERY catalog id against its cap at DEV boot — so a city with an over-cap
 * landmark passes `npm test` but throws on `npm run dev` (main game won't load) while
 * preview.html still works. That shipped a boot-broken 台東 (#29: tiehua_village 864>600).
 *
 * This builds every CATALOG geometry for every ready city and fails if any exceeds its
 * cap (heroTriCap=600 else ARCHETYPE_TRI_CAP=350) — same logic as geometryFactory, so
 * green here == boots in dev. Caps are a self-imposed perf budget (TRI_BUDGET 600000).
 */
import { describe, it, expect } from 'vitest';
import { CITIES } from './manifest.js';
import { ARCHETYPE_TRI_CAP, HERO_TRI_CAP } from '../config/tuning.js';

const catalogModules = import.meta.glob('./*/catalog.js');

const triCount = (geo) => {
  const idx = geo.getIndex();
  return idx !== null ? idx.count / 3 : (geo.getAttribute('position')?.count || 0) / 3;
};

// Deterministic rng (geometry must be stable across runs).
function makeRng() {
  let s = 0x9e3779b9;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('hero geometry tri caps (every ready city boots in DEV)', () => {
  const cities = CITIES.filter((c) => c.status === 'ready');
  for (const c of cities) {
    it(`${c.id} CATALOG geometry all under cap`, async () => {
      const loader = catalogModules[`./${c.id}/catalog.js`];
      expect(loader, `no catalog.js for ready city '${c.id}'`).toBeTruthy();
      const { CATALOG } = await loader();
      const over = [];
      for (const id of Object.keys(CATALOG)) {
        const arch = CATALOG[id];
        if (!arch || typeof arch.buildGeometry !== 'function') continue;
        const geo = arch.buildGeometry(makeRng());
        const tris = triCount(geo);
        const cap = arch.heroTriCap !== undefined ? HERO_TRI_CAP : ARCHETYPE_TRI_CAP;
        if (tris > cap) over.push(`${id}: ${tris} > ${cap}`);
        geo.dispose?.();
      }
      expect(
        over,
        `${c.id} has over-cap geometry that crashes DEV boot (npm run dev):\n  ${over.join('\n  ')}\n` +
          `Reduce segments (sph ws/hs, cyl segments) — see scripts/check-hero-tris.mjs.`
      ).toEqual([]);
    });
  }
});
