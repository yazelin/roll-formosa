import { describe, it, expect } from 'vitest';
import {
  EXTRA_CODE_BASE,
  V5_CODE_BASE,
  ARCHETYPE_ID_BY_CODE,
  ARCHETYPE_CODE_BY_ID,
  collectibleCodeForId,
} from './objects.js';

describe('objects.js code table after OSM removal', () => {
  it('has no OSM codes — table is exactly 99 entries (70 chunk + 24 EXTRA + 5 v5)', () => {
    expect(ARCHETYPE_ID_BY_CODE.length).toBe(99);
  });
  it('EXTRA base stays 70, v5 base re-based to 94 (was 110)', () => {
    expect(EXTRA_CODE_BASE).toBe(70);
    expect(V5_CODE_BASE).toBe(94);
  });
  it('no osm_* archetype id survives', () => {
    for (const id of ARCHETYPE_ID_BY_CODE) expect(id.startsWith('osm_')).toBe(false);
  });
  it('collectible id 12 (stack_chan) maps to the re-based v5 code 94', () => {
    expect(collectibleCodeForId(12)).toBe(94);
    expect(ARCHETYPE_ID_BY_CODE[94]).toBe('stack_chan');
  });
  it('every code round-trips id<->code with no holes', () => {
    for (let c = 0; c < ARCHETYPE_ID_BY_CODE.length; c++) {
      const id = ARCHETYPE_ID_BY_CODE[c];
      expect(typeof id).toBe('string');
      expect(ARCHETYPE_CODE_BY_ID[id]).toBe(c);
    }
  });
});
