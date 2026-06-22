/**
 * river-localization.test.js — guard against a city shipping 台北's 基隆河.
 *
 * `cp -r taipei` (and the autopilot scaffold) copies cityMap.js verbatim, and the
 * river `water` block is easy to leave as taipei's 基隆河 — both 台南 and 台中 once
 * shipped taipei's exact centerline. check-city.mjs only looks at chunk archetypes,
 * so this is the test that makes `npm test` red until each ready city authors its
 * own river (name + centerline + comment). Text-based (no THREE import) so it stays
 * fast and mirrors scripts/check-city.mjs's river check.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { CITIES } from './manifest.js';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Extract the water `name` and centerline points from a cityMap.js source. */
function readRiver(city) {
  const src = readFileSync(join(HERE, city, 'cityMap.js'), 'utf8');
  const wb = src.slice(src.indexOf('export const water'));
  const name = (wb.match(/name:\s*['"]([^'"]+)['"]/) || [])[1] || '';
  const clBlock = (wb.match(/centerline:\s*Object\.freeze\(\[([\s\S]*?)\]\)/) || [])[1] || '';
  const pts = [...clBlock.matchAll(/x:\s*(-?\d+(?:\.\d+)?),\s*z:\s*(-?\d+(?:\.\d+)?)/g)]
    .map((m) => `${m[1]},${m[2]}`)
    .join(' ');
  return { name, pts };
}

const taipei = readRiver('taipei');
const others = CITIES.filter((c) => c.id !== 'taipei' && c.status === 'ready');

describe('river localization (no copied 台北 基隆河)', () => {
  it('taipei itself has a non-empty river (sanity)', () => {
    expect(taipei.name).toBeTruthy();
    expect(taipei.pts.length).toBeGreaterThan(0);
  });

  for (const c of others) {
    it(`${c.id} (${c.displayName}) authors its own river`, () => {
      const r = readRiver(c.id);
      expect(r.name, `${c.id} river still named 基隆河 (台北's)`).not.toBe('基隆河');
      expect(
        r.pts,
        `${c.id} river centerline is identical to 台北's 基隆河 — localize it (name + centerline + comment)`
      ).not.toBe(taipei.pts);
    });
  }
});
