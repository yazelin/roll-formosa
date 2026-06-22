/**
 * @file localization.test.js — enforce chunk-localization DEPTH for every ready city.
 *
 * The 70 chunk archetypes (tiers.js, 7 tiers x 10) are the street objects the player
 * rolls up. A freshly-scaffolded city is 70/70 identical to taipei; a properly
 * localized one swaps most and keeps only pan-Taiwan generics. This is the gate that
 * stops the autopilot (or anyone) from shipping a shallow city: a ready city must
 * localize at least as deeply as 台中 did — i.e. NO MORE than MAX_SAME of 70 chunk
 * archetypeIds may still equal taipei's. Aim ~37 (高雄 level); 44 is the hard floor.
 *
 * Keeps in lockstep with scripts/check-city.mjs (same comparison, same threshold).
 */
import { describe, it, expect } from 'vitest';
import { CITIES } from './manifest.js';
import { TIERS as TAIPEI } from './taipei/tiers.js';

const MAX_SAME = 44; // 台中-parity floor (台中 44, 台南 40, 高雄 37 all pass; a fresh 70/70 copy fails)

const tiersModules = import.meta.glob('./*/tiers.js');

function sameAsTaipei(tiers) {
  let same = 0;
  let n = 0;
  for (let t = 0; t < tiers.length; t++) {
    const a = tiers[t].archetypeIds;
    const b = TAIPEI[t].archetypeIds;
    for (let s = 0; s < a.length; s++) {
      n++;
      if (a[s] === b[s]) same++;
    }
  }
  return { same, n };
}

describe('chunk localization depth (per ready city)', () => {
  const cities = CITIES.filter((c) => c.status === 'ready' && c.id !== 'taipei');
  for (const c of cities) {
    it(`${c.id} localizes enough chunks vs taipei (<= ${MAX_SAME}/70 identical)`, async () => {
      const loader = tiersModules[`./${c.id}/tiers.js`];
      expect(loader, `no tiers.js found for ready city '${c.id}'`).toBeTruthy();
      const { TIERS } = await loader();
      const { same, n } = sameAsTaipei(TIERS);
      expect(
        same,
        `${c.id} only localized ${n - same}/${n} chunks — ${same} still identical to taipei (floor is ${MAX_SAME}). Swap more street objects; see docs/ADD-A-CITY.md Phase 2.`
      ).toBeLessThanOrEqual(MAX_SAME);
    });
  }
});
