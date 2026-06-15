import { describe, it, expect } from 'vitest';
import { activePack } from './index.js';
import { buildCodeMap } from '../_engine/codeMap.js';
import { ARCHETYPE_ID_BY_CODE, ARCHETYPE_CODE_BY_ID } from '../../world/objects.js';

describe('tokyo transient pack', () => {
  it('validates (7 tiers, ids resolve, ladder, bounds)', () => {
    expect(activePack.validate()).toBe(true);
  });

  it('code map is hole-free and unique over the real pack (reproduces the 99-entry table)', () => {
    const m = buildCodeMap(activePack);
    expect(m.chunkCount).toBe(70); // 7 tiers x 10
    expect(m.idByCode.length).toBe(99); // 70 chunk + 24 EXTRA + 5 v5
    const seen = new Set();
    for (let c = 0; c < m.idByCode.length; c++) {
      expect(typeof m.idByCode[c]).toBe('string');
      expect(m.idByCode[c].length).toBeGreaterThan(0);
      expect(seen.has(m.idByCode[c])).toBe(false);
      seen.add(m.idByCode[c]);
      expect(m.codeById[m.idByCode[c]]).toBe(c);
    }
  });

  it('collectible id 0 -> code 70, id 11 -> 81, id 12 -> 94 (legacy Tokyo rule preserved)', () => {
    const m = buildCodeMap(activePack);
    expect(m.collectibleCodeForId(0)).toBe(70);
    expect(m.collectibleCodeForId(11)).toBe(81);
    expect(m.collectibleCodeForId(12)).toBe(94);
    expect(m.idByCode[94]).toBe('stack_chan');
  });

  it('attaches R5 pack-scoped code-map methods on the pack object', () => {
    expect(Array.isArray(activePack.archetypeIdByCode)).toBe(true);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    expect(activePack.codeByArchetypeId[activePack.archetypeIdByCode[0]]).toBe(0);
    expect(activePack.codeToArchetypeId(94)).toBe('stack_chan');
    expect(activePack.codeForCollectibleId(12)).toBe(94);
  });

  it('BYTE-IDENTITY: the pack code map equals objects.js legacy ARCHETYPE_ID_BY_CODE / CODE_BY_ID', () => {
    // The seam must reproduce the exact legacy table the engine read pre-P2.
    expect(activePack.archetypeIdByCode).toEqual(ARCHETYPE_ID_BY_CODE);
    expect(activePack.codeByArchetypeId).toEqual(ARCHETYPE_CODE_BY_ID);
  });
});
