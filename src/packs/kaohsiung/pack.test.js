import { describe, it, expect } from 'vitest';
import { activePack } from './index.js';
import { buildCodeMap } from '../_engine/codeMap.js';

describe('kaohsiung pack', () => {
  it('has id=kaohsiung, region=TW, displayName=高雄', () => {
    expect(activePack.id).toBe('kaohsiung');
    expect(activePack.region).toBe('TW');
    expect(activePack.displayName).toBe('高雄');
  });

  it('exposes zh-TW locale (t function and fmt)', () => {
    expect(typeof activePack.locale.t).toBe('function');
    expect(typeof activePack.locale.fmt).toBe('function');
    expect(activePack.locale.t('hud.rareFound')).toBe('發現稀有！+5000');
  });

  it('validates (7 tiers, ids resolve, landmark ladder, bounds)', () => {
    expect(activePack.validate()).toBe(true);
  });

  it('code map is hole-free and unique (99-entry table)', () => {
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
    expect(m.idByCode[94]).toBe('meinong_umbrella');
  });

  it('attaches R5 pack-scoped code-map methods', () => {
    expect(Array.isArray(activePack.archetypeIdByCode)).toBe(true);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    expect(activePack.codeByArchetypeId[activePack.archetypeIdByCode[0]]).toBe(0);
    expect(activePack.codeToArchetypeId(94)).toBe('meinong_umbrella');
    expect(activePack.codeForCollectibleId(12)).toBe(94);
  });

  it('code map: chunk 0-69 Kaohsiung; collectibles 70-81+94; core landmarks 82-89; extended 90-93/95-98', () => {
    const kaoChunkIds = activePack.tiers.flatMap((t) => t.archetypeIds);
    expect(activePack.archetypeIdByCode.slice(0, 70)).toEqual(kaoChunkIds);
    // collectible codes 70..81 are Kaohsiung collectible ids.
    expect(activePack.archetypeIdByCode.slice(70, 82)).toEqual([
      'black_bear', 'papaya_milk_king', 'big_bowl_ice', 'qigu_cake', 'duck_meat', 'oden',
      'cijin_ferry', 'mrt_girls', 'pedicab', 'cishan_banana', 'mini_container', 'spring_autumn_pavilion',
    ]);
    // codes 82..89 are Kaohsiung core landmark ids.
    expect(activePack.archetypeIdByCode[82]).toBe('dome_of_light');
    expect(activePack.archetypeIdByCode[83]).toBe('pier2_art');
    expect(activePack.archetypeIdByCode[84]).toBe('cijin_lighthouse');
    expect(activePack.archetypeIdByCode[85]).toBe('dragon_tiger_towers');
    expect(activePack.archetypeIdByCode[86]).toBe('sanfeng_temple');
    expect(activePack.archetypeIdByCode[87]).toBe('kaohsiung_music_center');
    expect(activePack.archetypeIdByCode[88]).toBe('dagang_bridge');
    expect(activePack.archetypeIdByCode[89]).toBe('dream_mall_wheel');
    // codes 90..93 are Kaohsiung extended landmarks.
    expect(activePack.archetypeIdByCode.slice(90, 94)).toEqual([
      'weiwuying', 'foguangshan', 'takao_railway_museum', 'cihou_fort',
    ]);
    // code 94 美濃油紙傘; codes 95..98 Kaohsiung extended landmarks.
    expect(activePack.archetypeIdByCode[94]).toBe('meinong_umbrella');
    expect(activePack.archetypeIdByCode.slice(95)).toEqual([
      'chengcing_pagoda', 'kaohsiung_arena', 'holy_rosary_cathedral', 'love_river_heart',
    ]);
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

  it('has zh-TW Kaohsiung seeds distinct from Taipei seeds', () => {
    expect(activePack.seeds.primary).toBe(0x4B414F48); // KAOH
    expect(activePack.seeds.v5).toBe(0x56354B41);      // V5KA
    // Not the taipei seeds.
    expect(activePack.seeds.primary).not.toBe(0x54414950);
  });

  it('no Japanese kana in displayNameByCode, extraIds, or archetypeIdByCode (99-code map)', () => {
    const kana = /[぀-ゟ゠-ヿ]/;
    expect(activePack.displayNameByCode.length).toBe(99);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    for (let c = 0; c < 99; c++) {
      const n = activePack.displayNameByCode[c];
      expect(n.length, `displayName code ${c}`).toBeGreaterThan(0);
      expect(kana.test(n), `displayName code ${c} '${n}' has kana`).toBe(false);
      expect(kana.test(activePack.archetypeIdByCode[c]), `archetypeId code ${c} has kana`).toBe(false);
    }
    for (const id of activePack.extraIds) {
      expect(kana.test(id), `extraId '${id}' has kana`).toBe(false);
    }
  });
});
