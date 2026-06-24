import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';
import { activePack } from './index.js';
import { buildCodeMap } from '../_engine/codeMap.js';
import { CITIES } from '../manifest.js';

// City-AGNOSTIC pack contract: this file is the taipei template that new-city.mjs
// copies, so it must pass for ANY localized city without per-city edits. Identity
// is checked against the folder name + manifest; content is checked structurally
// (counts/types/uniqueness). Real localization depth is gated elsewhere:
// localization.test.js (chunk depth), river-localization.test.js, check-city.mjs.
const PACK_ID = basename(dirname(fileURLToPath(import.meta.url)));

describe(`${PACK_ID} pack`, () => {
  it('id matches its folder + manifest, region=TW', () => {
    expect(activePack.id).toBe(PACK_ID);
    expect(activePack.region).toBe('TW');
    const entry = CITIES.find((c) => c.id === PACK_ID);
    expect(entry, `${PACK_ID} must be registered in manifest.js`).toBeTruthy();
    expect(activePack.displayName).toBe(entry.displayName);
  });

  it('exposes zh-TW locale (t function and fmt)', () => {
    expect(typeof activePack.locale.t).toBe('function');
    expect(typeof activePack.locale.fmt).toBe('function');
    expect(activePack.locale.t('hud.rareFound')).toBe('發現稀有！+5000');
  });

  it('validates (7 tiers, ids resolve, landmark ladder, bounds)', () => {
    expect(activePack.validate()).toBe(true);
  });

  it('code map is hole-free and unique (99 entries)', () => {
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

  it('collectible code mapping is structural (id 0->70, 11->81, 12->94)', () => {
    const m = buildCodeMap(activePack);
    expect(m.collectibleCodeForId(0)).toBe(70);
    expect(m.collectibleCodeForId(11)).toBe(81);
    expect(m.collectibleCodeForId(12)).toBe(94);
    expect(typeof m.idByCode[94]).toBe('string');
    expect(m.idByCode[94].length).toBeGreaterThan(0);
  });

  it('attaches R5 pack-scoped code-map methods', () => {
    expect(Array.isArray(activePack.archetypeIdByCode)).toBe(true);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    expect(activePack.codeByArchetypeId[activePack.archetypeIdByCode[0]]).toBe(0);
    expect(typeof activePack.codeToArchetypeId(94)).toBe('string');
    expect(activePack.codeForCollectibleId(12)).toBe(94);
  });

  it('code map: chunk 0-69 == tiers archetypeIds; 70-98 all non-empty', () => {
    const chunkIds = activePack.tiers.flatMap((t) => t.archetypeIds);
    expect(activePack.archetypeIdByCode.slice(0, 70)).toEqual(chunkIds);
    for (let c = 70; c < 99; c++) {
      expect(typeof activePack.archetypeIdByCode[c], `code ${c}`).toBe('string');
      expect(activePack.archetypeIdByCode[c].length, `code ${c}`).toBeGreaterThan(0);
    }
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
    expect(typeof activePack.cityMap.GOAL_POS).toBe('object');
    expect(typeof activePack.cityMap.bandAllowedAt).toBe('function');
  });

  it('has valid seeds (finite, not Tokyo, primary != v5)', () => {
    expect(Number.isFinite(activePack.seeds.primary)).toBe(true);
    expect(Number.isFinite(activePack.seeds.v5)).toBe(true);
    expect(activePack.seeds.primary).not.toBe(0x544f4b59); // not Tokyo (TOKY)
    expect(activePack.seeds.primary).not.toBe(activePack.seeds.v5);
  });
});
