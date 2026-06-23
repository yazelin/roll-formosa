/**
 * @file city-content-localization.test.js — gate tier names + extended-landmark ids.
 *
 * localization.test.js only checks the 70 chunk archetypeIds; tier NAMES (the label
 * shown during play) and the extended-landmark slots (codes 90-98) slipped through —
 * keelung/taoyuan shipped taipei's tier-0「柑仔店桌頭」and keelung借用 taipei landmarks
 * (故宮/美麗華…) at 90-98. This gates both for every ready city (text-based, no THREE).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { CITIES } from './manifest.js';

const HERE = dirname(fileURLToPath(import.meta.url));

const tierNames = (city) =>
  [...readFileSync(join(HERE, city, 'tiers.js'), 'utf8').matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1]);

const TAIPEI_TIERS = tierNames('taipei');

// taipei extended-landmark ids (codes 90-98) — must NOT appear (quoted) in another
// city's index.js / catalog.js code map. (82-89 use NM_*.id vars, a separate legacy
// inconsistency, deliberately out of scope here.)
const TAIPEI_EXT_IDS = [
  'rainbow_bridge_tp', 'sun_yat_sen_hall', 'taipei_main_station', 'palace_museum',
  'xingtian_temple', 'national_theater', 'miramar_wheel', 'maokong_station',
];

const others = CITIES.filter((c) => c.id !== 'taipei' && c.status === 'ready');

describe('tier names localized (not taipei)', () => {
  for (const c of others) {
    it(`${c.id} has its own tier-0 name + not a wholesale taipei copy`, () => {
      const names = tierNames(c.id);
      expect(names.length).toBe(7);
      // tier 0 (the 柑仔店 shop) is the signature leftover — must differ from taipei.
      expect(names[0], `${c.id} tier-0 name still taipei's「${TAIPEI_TIERS[0]}」— localize it`).not.toBe(TAIPEI_TIERS[0]);
      const same = names.filter((n, i) => n === TAIPEI_TIERS[i]).length;
      expect(same, `${c.id} has ${same}/7 tier names identical to taipei — localize them`).toBeLessThan(5);
    });
  }
});

describe('extended landmarks (codes 90-98) localized (no taipei ids)', () => {
  for (const c of others) {
    it(`${c.id} code map references no taipei extended-landmark id`, () => {
      let src = '';
      for (const f of ['index.js', 'catalog.js']) {
        try { src += readFileSync(join(HERE, c.id, f), 'utf8'); } catch { /* optional */ }
      }
      const found = TAIPEI_EXT_IDS.filter((id) => src.includes(`'${id}'`));
      expect(found, `${c.id} still references taipei landmark id(s) ${found.join(', ')} — use this city's own landmarks at codes 90-98`).toEqual([]);
    });
  }
});
