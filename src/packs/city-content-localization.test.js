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

// The ext-id string check above only catches taipei *id strings* in the codeMap.
// penghu slipped through by giving taipei landmarks penghu-flavoured ids while
// keeping taipei geometry: catalog placed `nm: NM_PALACE` (故宮) / `NM_XINGTIAN`
// (行天宮) imported from landmark files still headed `@file packs/taipei/`.
// This gates the actual placed-landmark source files, not just the id strings.
describe('placed catalog landmarks are localized (no taipei source files)', () => {
  for (const c of others) {
    it(`${c.id} places no landmark whose file is still taipei's`, () => {
      const catalog = readFileSync(join(HERE, c.id, 'catalog.js'), 'utf8');
      // NM_* symbols actually given a code (placed in the catalog, not just imported)
      const placed = new Set([...catalog.matchAll(/\bnm:\s*(NM_[A-Z0-9_]+)/g)].map((m) => m[1]));
      const offenders = [];
      for (const m of catalog.matchAll(/import\s*\{([^}]+)\}\s*from\s*'(\.\/landmarks\/[a-z0-9_]+\.js)'/g)) {
        const names = m[1].split(',').map((s) => s.trim());
        if (!names.some((n) => placed.has(n))) continue; // imported but not placed → skip (dead import)
        const body = readFileSync(join(HERE, c.id, m[2]), 'utf8');
        if (body.includes('@file packs/taipei/')) offenders.push(m[2]);
      }
      expect(offenders, `${c.id} places taipei landmark file(s) ${offenders.join(', ')} — localize the geometry + @file header, don't reuse taipei`).toEqual([]);
    });
  }
});
