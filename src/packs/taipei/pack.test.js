import { describe, it, expect } from 'vitest';
import { activePack } from './index.js';
import { buildCodeMap } from '../_engine/codeMap.js';
import { ARCHETYPE_ID_BY_CODE, ARCHETYPE_CODE_BY_ID } from '../../world/objects.js';

describe('taipei pack (P3 skeleton)', () => {
  it('has id=taipei, region=TW, displayName=台北', () => {
    expect(activePack.id).toBe('taipei');
    expect(activePack.region).toBe('TW');
    expect(activePack.displayName).toBe('台北');
  });

  it('exposes zh-TW locale (t function and fmt)', () => {
    expect(typeof activePack.locale.t).toBe('function');
    expect(typeof activePack.locale.fmt).toBe('function');
    expect(activePack.locale.t('hud.rareFound')).toBe('發現稀有！+5000');
  });

  it('validates (7 tiers, ids resolve, landmark ladder, bounds)', () => {
    expect(activePack.validate()).toBe(true);
  });

  it('code map is hole-free and unique (mirrors 99-entry Tokyo table)', () => {
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

  it('collectible codes preserved: id 0 -> 70, id 11 -> 81, id 12 -> 94', () => {
    const m = buildCodeMap(activePack);
    expect(m.collectibleCodeForId(0)).toBe(70);
    expect(m.collectibleCodeForId(11)).toBe(81);
    expect(m.collectibleCodeForId(12)).toBe(94);
    expect(m.idByCode[94]).toBe('stack_chan');
  });

  it('attaches R5 pack-scoped code-map methods', () => {
    expect(Array.isArray(activePack.archetypeIdByCode)).toBe(true);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    expect(activePack.codeByArchetypeId[activePack.archetypeIdByCode[0]]).toBe(0);
    expect(activePack.codeToArchetypeId(94)).toBe('stack_chan');
    expect(activePack.codeForCollectibleId(12)).toBe(94);
  });

  it('code map chunk slots 0-69 are Taipei ids (P4: tiers now Taipei; EXTRA ids 70+ stay Tokyo)', () => {
    // P4 replaces chunk codes (0-69) with Taipei archetypeIds; EXTRA codes (70+)
    // remain the Tokyo EXTRA/V5 pool until P5. Legacy check removed (P3-only).
    const taipeiChunkIds = activePack.tiers.flatMap((t) => t.archetypeIds);
    expect(activePack.archetypeIdByCode.slice(0, 70)).toEqual(taipeiChunkIds);
    // EXTRA codes still align with Tokyo EXTRA (unchanged in P4)
    expect(activePack.archetypeIdByCode.slice(70)).toEqual(ARCHETYPE_ID_BY_CODE.slice(70));
  });

  it('exposes full R16 content surface', () => {
    expect(Array.isArray(activePack.tiers)).toBe(true);
    expect(typeof activePack.archetypes).toBe('object');
    expect(typeof activePack.extraCatalog).toBe('object');
    expect(typeof activePack.displayNameByCode).toBe('object');
    expect(typeof activePack.extraSizeClassByCode).toBe('object');
    expect(typeof activePack.extraPoolCaps).toBe('object');
    expect(Array.isArray(activePack.landmarks)).toBe(true);
    // cityMap namespace fields
    expect(typeof activePack.cityMap.PLACEMENTS).toBe('object');
    expect(typeof activePack.cityMap.SHOP).toBe('object');
    expect(typeof activePack.cityMap.SKYTREE_POS).toBe('object');
    expect(typeof activePack.cityMap.bandAllowedAt).toBe('function');
  });

  it('has zh-TW seeds distinct from Tokyo seeds', () => {
    expect(activePack.seeds.primary).toBe(0x54414950); // TAIP
    expect(activePack.seeds.v5).toBe(0x56355441);      // V5TA
    // Not tokyo seeds
    expect(activePack.seeds.primary).not.toBe(0x544f4b59);
  });
});
