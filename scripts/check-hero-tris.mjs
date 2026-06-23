#!/usr/bin/env node
/**
 * check-hero-tris.mjs — list a city's CATALOG geometry that exceeds its tri cap.
 *
 *   node scripts/check-hero-tris.mjs <city>
 *
 * geometryFactory asserts every CATALOG id at DEV boot (heroTriCap=600 else 350).
 * Per-pack catalog.test only checks the 70 chunks, so over-cap landmarks/collectibles
 * sail through `npm test` but crash `npm run dev`. This lists them so you can reduce
 * segments (sph ws/hs, cyl segments). Mirrors src/packs/hero-geometry.test.js.
 * Exits 1 if anything is over cap.
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) { console.error('usage: node scripts/check-hero-tris.mjs <city>'); process.exit(1); }

const HERO_TRI_CAP = 600;
const ARCHETYPE_TRI_CAP = 350;

const triCount = (geo) => {
  const idx = geo.getIndex ? geo.getIndex() : geo.index;
  if (idx) return idx.count / 3;
  const pos = geo.getAttribute('position');
  return pos ? pos.count / 3 : 0;
};
function makeRng() {
  let s = 0x9e3779b9;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const { CATALOG } = await import(pathToFileURL(join(ROOT, 'src/packs', id, 'catalog.js')).href);
const rows = [];
for (const aid of Object.keys(CATALOG)) {
  const arch = CATALOG[aid];
  if (!arch || typeof arch.buildGeometry !== 'function') continue;
  let tris;
  try { tris = triCount(arch.buildGeometry(makeRng())); }
  catch (e) { console.log(`BUILD-ERR ${aid}: ${e.message}`); continue; }
  const cap = arch.heroTriCap !== undefined ? HERO_TRI_CAP : ARCHETYPE_TRI_CAP;
  rows.push({ aid, tris, cap, over: tris > cap });
}
rows.sort((a, b) => b.tris - a.tris);
const over = rows.filter((r) => r.over);
for (const r of over) console.log(`OVER  ${String(r.tris).padStart(5)} > ${r.cap}  ${r.aid}`);
console.log(`\n[check-hero-tris] ${id}: ${over.length} over cap (of ${rows.length} built).`);
if (over.length) process.exit(1);
console.log('top 5 by tris:', rows.slice(0, 5).map((r) => `${r.aid}=${r.tris}`).join(', '));
