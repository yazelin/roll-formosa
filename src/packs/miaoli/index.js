/**
 * @file miaoli/index.js — Miaoli StagePack.
 *
 * Full content surface for the Miaoli pack. Wires 8 curated Miaoli landmarks
 * (勝興車站/南庄老街/大湖草莓園/三義木雕博物館/通霄神社/公館桐花步道/
 * 苑裡藺草博物館/明德水庫) plus the 龍騰斷橋 goal into the cityMap and catalog.
 *
 * Pack identity: id='miaoli', displayName='苗栗', region='TW', locale=zh-TW.
 * Seeds are Miaoli-specific (M I A O = 0x4D49414F, v5 extension = 0x6D69616F).
 *
 * Validation: routes through validatePack(pack). Miaoli LANDMARKS carry native
 * `name` and `isGoal` fields.
 *
 * Code-map methods: attached on the pack object via buildCodeMap.
 */

import { TIERS, RESCALE_S, ARCH_PER_TIER, validateTiersStructure } from './tiers.js';
import {
  CATALOG,
  EXTRA_CATALOG,
  DISPLAY_NAME_BY_CODE,
  EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS,
} from './catalog.js';
import { EXTRA_ARCHETYPE_IDS } from '../../world/objects.js';
import * as cityMap from './cityMap.js';
import { ABSORB_RATIO, MAP_BOUNDS } from '../../config/tuning.js';
import { buildCodeMap, validatePack } from '../_engine/codeMap.js';
import { locale } from './locale.js';
import { goalMonument } from './monument.js';
import * as narration from './narration.js';
import { ending } from './ending.js';

// Miaoli replaces EXTRA codes 82..89 with Miaoli landmark ids.
import { NM_SHENGXING_STATION } from './landmarks/shengxing_station.js';
import { NM_NANZHUANG } from './landmarks/nanzhuang_old_street.js';
import { NM_DAHU_STRAWBERRY } from './landmarks/dahu_strawberry.js';
import { NM_SANYI_WOODCARVING } from './landmarks/sanyi_woodcarving.js';
import { NM_TONGXIAO_SHRINE } from './landmarks/tongxiao_station.js';
import { NM_GONGGUAN_TUNG } from './landmarks/gongguan_tung_tree.js';
import { NM_YUANLI_RUSH } from './landmarks/yuanli_tunnel.js';
import { NM_MINGDE_RESERVOIR } from './landmarks/mingde_reservoir.js';

/**
 * EXTRA id order for the Miaoli pack.
 * Codes 70..81 (indices 0..11): Miaoli collectible ids.
 * Codes 82..89 (indices 12..19): Miaoli landmark ids.
 * Codes 90..93 (indices 20..23): extended landmark slots.
 * Codes 94..98 (v5 indices 0..4): v5 ids (94=tung_oil).
 */
const extraIds = [
  // indices 0..11 — codes 70..81: Miaoli collectibles
  'black_bear', 'leicha', 'col_strawberry', 'tung_blossom', 'hakka_bantiao', 'mochi',
  'persimmon_cake', 'woodcarving', 'rail_bike', 'rush_hat', 'hakka_floral', 'col_caibao',
  // indices 12..19 — codes 82..89: Miaoli landmark ids
  NM_SHENGXING_STATION.id,  // 82 勝興車站
  NM_NANZHUANG.id,          // 83 南庄老街
  NM_DAHU_STRAWBERRY.id,    // 84 大湖草莓園
  NM_SANYI_WOODCARVING.id,  // 85 三義木雕博物館
  NM_TONGXIAO_SHRINE.id,    // 86 通霄神社
  NM_GONGGUAN_TUNG.id,      // 87 公館桐花步道
  NM_YUANLI_RUSH.id,        // 88 苑裡藺草博物館
  NM_MINGDE_RESERVOIR.id,   // 89 明德水庫
  // indices 20..23 — codes 90..93: extended landmark slots (placeholder)
  'extra_90', 'extra_91', 'extra_92', 'extra_93',
  // v5 codes 94..98 — 94 桐油瓶; 95..98 placeholder
  'tung_oil', 'extra_95', 'extra_96', 'extra_97', 'extra_98',
];

// Collectible album id -> index in extraIds (Miaoli order).
const collectibleExtraIndex = {};
for (let id = 0; id <= 11; id++) collectibleExtraIndex[id] = id;
collectibleExtraIndex[12] = EXTRA_ARCHETYPE_IDS.length + 0; // tung_oil at code 94

/** @type {import('../_engine/codeMap.js').StagePack} */
export const activePack = {
  id: 'miaoli',
  displayName: '苗栗',
  region: 'TW',
  locale, // zh-TW t()/fmt()
  tiers: TIERS, // Miaoli tier ladder
  rescaleS: RESCALE_S,
  archPerTier: ARCH_PER_TIER,
  archetypes: CATALOG, // Miaoli archetype recipes
  extraCatalog: EXTRA_CATALOG,
  extraSizeClassByCode: EXTRA_SIZE_CLASS_BY_CODE,
  extraPoolCaps: EXTRA_POOL_CAPS,
  displayNameByCode: DISPLAY_NAME_BY_CODE, // zh-TW names
  extraIds,
  collectibleExtraIndex,
  cityMap, // Miaoli city map namespace
  map: { bounds: { x: MAP_BOUNDS.x, z: MAP_BOUNDS.z } },
  landmarks: cityMap.LANDMARKS, // Miaoli landmarks
  absorbRatio: ABSORB_RATIO,
  seeds: { primary: 0x4D49414F, v5: 0x6D69616F }, // MIAO / miao
  goalMonument, // 龍騰斷橋 goal monument
  narration,    // 月牙 zh-TW narration tables
  ending,       // Formosa-island reveal definition
  validate() {
    // Structural ladder invariants (no catalog dependency).
    validateTiersStructure();

    // Miaoli LANDMARKS carry native name/isGoal — run the real
    // validatePack directly. The 9-entry ladder (8 curated + 龍騰斷橋 goal)
    // must pass the strictly-increasing threshold check and the
    // goal-is-largest invariant.
    validatePack(this);
    return true;
  },
};

/**
 * Pack-scoped code-map methods, built once by buildCodeMap and attached
 * to the pack object so consumers read them off `activePack`.
 */
const _codeMap = buildCodeMap(activePack);
/** @type {string[]} code -> archetype id. */
activePack.archetypeIdByCode = _codeMap.idByCode;
/** @type {Record<string, number>} archetype id -> code. */
activePack.codeByArchetypeId = _codeMap.codeById;
/** @type {string[]} code -> display name (Miaoli zh-TW names). */
activePack.displayNameByCodeArr = DISPLAY_NAME_BY_CODE;
/** @param {number} id collectible album id @returns {number} archetype code. */
activePack.codeForCollectibleId = (id) => _codeMap.collectibleCodeForId(id);
/** @param {number} code archetype code @returns {string} archetype id. */
activePack.codeToArchetypeId = (code) => _codeMap.idByCode[code];

export default activePack;
