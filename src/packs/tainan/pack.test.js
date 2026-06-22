import { describe, it, expect } from 'vitest';
import { activePack } from './index.js';
import { buildCodeMap } from '../_engine/codeMap.js';
import { ARCHETYPE_ID_BY_CODE, ARCHETYPE_CODE_BY_ID } from '../../world/objects.js';

describe('tainan pack', () => {
  it('has id=tainan, region=TW, displayName=台南', () => {
    expect(activePack.id).toBe('tainan');
    expect(activePack.region).toBe('TW');
    expect(activePack.displayName).toBe('台南');
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
    expect(m.idByCode[94]).toBe('mazu');
  });

  it('attaches R5 pack-scoped code-map methods', () => {
    expect(Array.isArray(activePack.archetypeIdByCode)).toBe(true);
    expect(activePack.archetypeIdByCode.length).toBe(99);
    expect(activePack.codeByArchetypeId[activePack.archetypeIdByCode[0]]).toBe(0);
    expect(activePack.codeToArchetypeId(94)).toBe('mazu');
    expect(activePack.codeForCollectibleId(12)).toBe(94);
  });

  it('code map: chunk 0-69 Taipei; collectibles 70-81+94 Taipei; landmarks 82-89 Taipei; 90-93/95-98 Tokyo', () => {
    // P4 replaces chunk codes (0-69) with Taipei archetypeIds.
    const taipeiChunkIds = activePack.tiers.flatMap((t) => t.archetypeIds);
    expect(activePack.archetypeIdByCode.slice(0, 70)).toEqual(taipeiChunkIds);
    // P7: collectible codes 70..81 are Taipei collectible ids.
    expect(activePack.archetypeIdByCode.slice(70, 82)).toEqual([
      'black_bear', 'boba', 'chicken_cutlet', 'gua_bao', 'xiaolongbao', 'pineapple_cake',
      'santaizi', 'budaixi', 'youbike', 'presidential_trophy', 'maokong_gondola', 'shilin_big_chicken',
    ]);
    // codes 82..89 are Tainan landmark ids.
    expect(activePack.archetypeIdByCode[82]).toBe('anping_sword_lion');
    expect(activePack.archetypeIdByCode[83]).toBe('chihkan_tower');
    expect(activePack.archetypeIdByCode[84]).toBe('tainan_confucius_temple');
    expect(activePack.archetypeIdByCode[85]).toBe('wu_temple');
    expect(activePack.archetypeIdByCode[86]).toBe('anping_fort');
    expect(activePack.archetypeIdByCode[87]).toBe('eternal_golden_castle');
    expect(activePack.archetypeIdByCode[88]).toBe('literature_museum');
    expect(activePack.archetypeIdByCode[89]).toBe('chimei_museum');
    // codes 90..93 are Tainan extended landmarks.
    expect(activePack.archetypeIdByCode.slice(90, 94)).toEqual([
      'anping_treehouse', 'shennong_street_lm', 'tainan_station', 'qigu_salt_mountain',
    ]);
    // code 94 媽祖; codes 95..98 Tainan extended landmarks.
    expect(activePack.archetypeIdByCode[94]).toBe('mazu');
    expect(activePack.archetypeIdByCode.slice(95)).toEqual([
      'koxinga_shrine', 'hele_plaza', 'anping_lighthouse_landmark', 'kaiyuan_temple',
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

  it('has zh-TW seeds distinct from Tokyo seeds', () => {
    expect(activePack.seeds.primary).toBe(0x5441494E); // TAIN
    expect(activePack.seeds.v5).toBe(0x7461696E);      // tain
    // Not tokyo seeds
    expect(activePack.seeds.primary).not.toBe(0x544f4b59);
  });
});
