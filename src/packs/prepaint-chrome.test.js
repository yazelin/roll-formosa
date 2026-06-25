/* Guard: the pre-paint city-chrome map (window.RF_CHROME in index.html) must
 * mirror every ready city's manifest displayName + locale 'title.subtitle'.
 * That inline map is a deliberate duplication (it has to run synchronously,
 * before the module bundle, to kill the taipei flash) — this test is its leash
 * so it can't silently drift from the packs. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CITIES } from './manifest.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const html = readFileSync(root + 'index.html', 'utf8');

// Pull the RF_CHROME object literal out of index.html and eval just that.
const m = html.match(/window\.RF_CHROME\s*=\s*(\{[\s\S]*?\});/);
const RF_CHROME = m ? Function(`return ${m[1]}`)() : null;

const ready = CITIES.filter((c) => c.status === 'ready');

describe('pre-paint RF_CHROME map', () => {
  it('exists in index.html', () => {
    expect(RF_CHROME).not.toBeNull();
  });

  it('covers exactly the ready cities (no missing, no stale)', () => {
    expect(Object.keys(RF_CHROME).sort()).toEqual(ready.map((c) => c.id).sort());
  });

  for (const c of ready) {
    it(`${c.id}: name + subtitle match the pack`, () => {
      const entry = RF_CHROME[c.id];
      expect(entry, `${c.id} missing from RF_CHROME`).toBeTruthy();
      expect(entry.name).toBe(c.displayName);

      const locale = readFileSync(root + `src/packs/${c.id}/locale.js`, 'utf8');
      const sm = locale.match(/'title\.subtitle':\s*'([^']*)'/);
      expect(sm, `${c.id} locale has no title.subtitle`).toBeTruthy();
      expect(entry.sub).toBe(sm[1]);
    });
  }
});
