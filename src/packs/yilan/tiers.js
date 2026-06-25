/**
 * @file packs/yilan/tiers.js — Roll Formosa Yilan pack: the 7-tier scale
 * ladder (圖釘 2 cm → 龜山島). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as a COUNTRYSIDE + OCEAN progression up the
 * 傳藝中心 / 羅東夜市 / 蘭陽平原 / 蘇澳漁港 seafront skyline.
 * The engine reads tiers via the active pack (src/packs/active.js),
 * NOT via config/tiers.js — but RESCALE_S / ARCH_PER_TIER stay engine constants
 * there; this pack imports ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/yilan/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (幾米廣場 / 龜山島 …) are NOT here — they live in
 * packs/yilan/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 夜市→夜店 — 暖夜市攤燈
 * (T0/T1, 傳藝中心/羅東夜市) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 蘇澳海港).
 * Color fields are IDENTICAL to packs/taipei/tiers.js (shared night palette);
 * object rim glows the per-tier cloudHex accent.
 */

import { RESCALE_S, ARCH_PER_TIER } from '../../config/tiers.js';
import {
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  LOAD_RADIUS_MIN_M,
  SIM_RADIUS_MIN,
  START_RADIUS_M,
  MOON_DIR_MIN_ELEV,
} from '../../config/tuning.js';

export { RESCALE_S, ARCH_PER_TIER };

/** @typedef {import('../../types.js').Tier} TierDef */

/** @type {TierDef[]} */
export const TIERS = [
  {
    index: 0,
    name: '傳藝中心柑仔店', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 三星蔥種子, 鴨鴨哨子, 礁溪溫泉皂, 牛舌餅, 三星蔥, 尪仔標, 幾米明信片, 蘭陽飯糰
      'green_onion_seed', 'duck_call_toy', 'jiaoxi_soap', 'ox_tongue_biscuit', 'sanxing_scallion', 'ngiauimia_card', 'jimmy_postcard', 'lanyang_rice_ball',
      // chunk landmarks: 戳戳樂板, 籤筒
      'scratch_card_board', 'fortune_stick_tube',
    ],
    fogColor: 0x3a2616, // 暖色柑仔店燈霧
    skyTop: 0x180d06,
    skyBottom: 0x5e3414,
    sunDir: [0.50, 0.62, 0.30],
    sunIntensity: 0.55, // 無頂室內的軟燈光
    moonDir: [-0.45, 0.40, -0.80],
    moonAngSize: 0.018,
    starIntensity: 0.10,
    cloudDensity: 0.10,
    cloudHex: 0xffb050,
  },
  {
    index: 1,
    name: '羅東夜市',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 溫泉麻糬, 寶特瓶, 鴨賞, 香, 金紙, 滷味夾, 紅白塑膠袋, 蔥油餅
      'hot_spring_mochi', 'pet_bottle', 'duck_jerky', 'incense_stick', 'joss_paper', 'luwei_tongs', 'redwhite_bag', 'scallion_pancake',
      // chunk landmarks: 夜市拱門, 攤車
      'night_market_arch', 'stall',
    ],
    fogColor: 0x3e2026, // 羅東夜市黃昏暖霧
    skyTop: 0x1c0f14,
    skyBottom: 0x6e2c44,
    sunDir: [0.40, 0.50, 0.28],
    sunIntensity: 0.55,
    moonDir: [-0.42, 0.42, -0.81],
    moonAngSize: 0.022,
    starIntensity: 0.16,
    cloudDensity: 0.20,
    cloudHex: 0xff7e54,
  },
  {
    index: 2,
    name: '羅東老街騎樓',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 礁溪溫泉蛋, 蔥油餅攤爐, 瓦斯桶, 三角錐, 消防栓, 溫泉桶, 鐵馬樁
      'red_plastic_chair', 'jiaoxi_egg', 'scallion_griddle', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'hot_spring_bucket', 'bike_dock',
      // chunk landmarks: 老街推車, 廟前香爐
      'old_street_cart', 'temple_incense_burner',
    ],
    fogColor: 0x341e34, // 羅東騎樓傍晚 灰粉
    skyTop: 0x180c1a,
    skyBottom: 0x5c2c58,
    sunDir: [0.30, 0.42, 0.26],
    sunIntensity: 0.55,
    moonDir: [-0.38, 0.45, -0.81],
    moonAngSize: 0.028,
    starIntensity: 0.22,
    cloudDensity: 0.30,
    cloudHex: 0xcc5aa8,
  },
  {
    index: 3,
    name: '蘭陽平原',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 稻草捆, 雨量筒, 曬穀架, 田間棕櫚, 棚架, 蘭陽土地公廟
      'scooter', 'mini_truck', 'rice_bale', 'rain_gauge', 'rice_drying_rack', 'field_palm', 'awning_frame', 'tudigong_shrine',
      // chunk landmarks: 傳藝牌樓, 田間水車
      'chuanyi_pailou', 'waterwheel',
    ],
    fogColor: 0x2a1c3e, // 暮色蘭陽平原藍起調
    skyTop: 0x130c24,
    skyBottom: 0x48287a,
    sunDir: [0.10, 0.34, 0.22],
    sunIntensity: 0.55,
    moonDir: [-0.34, 0.48, -0.81],
    moonAngSize: 0.035,
    starIntensity: 0.30,
    cloudDensity: 0.34,
    cloudHex: 0x9850e0,
  },
  {
    index: 4,
    name: '宜蘭市街屋與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 農舍, 宜蘭厝, 田寮磚造民宅, 超商, 公車, 垃圾車, 加油站, 騎樓柱
      'farmhouse', 'yilan_house', 'field_brick_house', 'convenience_store', 'city_bus', 'garbage_truck', 'gas_station', 'arcade_pillar',
      // chunk landmarks: 宜蘭街屋, 大廟
      'yilan_streethouse_mass', 'temple_mass',
    ],
    fogColor: 0x201a44, // 宜蘭街屋暮色 藍紫
    skyTop: 0x0e0c26,
    skyBottom: 0x382c88,
    sunDir: [-0.10, 0.30, 0.30],
    sunIntensity: 0.55,
    moonDir: [-0.32, 0.50, -0.81],
    moonAngSize: 0.046,
    starIntensity: 0.38,
    cloudDensity: 0.34,
    cloudHex: 0x6858f0,
  },
  {
    index: 5,
    name: '蘇澳漁港商區',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 漁會大樓, 漁倉, 漁港高架, 跨港天橋, 漁港貨櫃堆, 港區看板, 南方澳漁港旅館, 漁港拍賣場
      'suao_fishery_building', 'fish_warehouse', 'harbor_viaduct', 'harbor_bridge', 'container_stack', 'port_billboard', 'nanfangao_inn', 'fish_auction_hall',
      // chunk landmarks: 漁港商辦塔, 漁港倉庫
      'fishing_port_tower', 'warehouse_mass',
    ],
    fogColor: 0x1c1e48, // 港區金紫 (golden hour 偏夜)
    skyTop: 0x16163a,
    skyBottom: 0x3a3ab8,
    sunDir: [-0.55, 0.20, 0.42],
    sunIntensity: 0.60, // 低斜暮陽映海面
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.46,
    cloudDensity: 0.30,
    cloudHex: 0x4262ff,
  },
  {
    index: 6,
    name: '龜山島遠眺',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 蘭陽博物館塔, 展覽館, 龜山島觀景台, 衝浪塔, 龜山島燈塔, 海音中心, 屋頂機房, 灣區大樓
      'lanyang_tower', 'exhibition_hall', 'guishan_platform', 'surfing_tower', 'guishan_lighthouse', 'tourism_center', 'rooftop_plant_room', 'bayarea_block',
      // chunk landmarks: 跨街空橋, 屋頂機房塔
      'crossstreet_skybridge', 'rooftop_mech_tower',
    ],
    fogColor: 0x18183e, // 龜山島夜空 深藍紫 (the finale band)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — dimmed; 龜山島點燈接手
    moonDir: [-0.26, 0.56, -0.79],
    moonAngSize: 0.062,
    starIntensity: 0.60,
    cloudDensity: 0,
    cloudHex: 0x3a52ff,
  },
];

/* ================================================================== */
/* Pack self-check (dev only) — STRUCTURE ONLY (no archetype resolve)  */
/* Archetype-resolution lives in pack.validate() once Part 5 lands.   */
/* ================================================================== */

/**
 * Structural invariants for the tier ladder, independent of catalog.js.
 * Called by pack.validate(); also runnable standalone. Throws on violation.
 * @returns {void}
 */
export function validateTiersStructure() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`[yilan tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→龜山島, x5 ladder)');
  const seen = new Set();
  for (let t = 0; t < TIERS.length; t++) {
    const tier = TIERS[t];
    assert(tier.index === t, `tier ${t}: index mismatch`);
    assert(
      tier.archetypeIds.length === ARCH_PER_TIER,
      `tier ${t}: exactly ${ARCH_PER_TIER} archetypeIds (slots 8/9 = chunk landmarks)`
    );
    for (const id of tier.archetypeIds) {
      assert(!seen.has(id), `duplicate archetype id '${id}'`);
      seen.add(id);
    }
    if (t > 0) {
      assert(
        tier.enterTrueRadius > TIERS[t - 1].enterTrueRadius,
        `tier ${t}: enterTrueRadius must be strictly increasing`
      );
    }

    /* Sky/fog authoring guards (relocated from the engine's old config/tiers.js
       — they now validate the SHIPPING Yilan tier params, not dead legacy data).
       Worst-case worldScale fog/load floor: the fog wall must hide the spawn-in
       edge EVEN WHERE the real-meter floors bind (ws_t = (START_RADIUS_M /
       SIM_RADIUS_MIN) * 5^t at reference simRadius 1). */
    const ws = (START_RADIUS_M / SIM_RADIUS_MIN) * Math.pow(5, t);
    const fogSim = Math.max(FOG_FAR_K, FOG_FAR_MIN_M / ws);
    const loadSim = Math.max(tier.loadRadiusSim, LOAD_RADIUS_MIN_M / ws);
    assert(
      fogSim < loadSim - tier.cellSizeSim,
      `tier ${t}: floored fog far (${fogSim.toFixed(1)}) must be < floored load radius - cell ` +
        `(${(loadSim - tier.cellSizeSim).toFixed(1)}) at worst-case worldScale ${ws}`
    );
    assert(
      Array.isArray(tier.sunDir) && tier.sunDir.length === 3 &&
        Array.isArray(tier.moonDir) && tier.moonDir.length === 3,
      `tier ${t}: sunDir/moonDir must be [x,y,z]`
    );
    const m = tier.moonDir;
    const mlen = Math.hypot(m[0], m[1], m[2]);
    assert(mlen > 1e-6, `tier ${t}: moonDir must be non-zero`);
    assert(
      Math.asin(m[1] / mlen) >= MOON_DIR_MIN_ELEV,
      `tier ${t}: moonDir post-normalization elevation must be >= MOON_DIR_MIN_ELEV (${MOON_DIR_MIN_ELEV} rad)`
    );
    assert(
      tier.moonAngSize > 0 && tier.moonAngSize < 0.2,
      `tier ${t}: moonAngSize must be a sane angular radius in radians`
    );
    assert(
      tier.starIntensity >= 0 && tier.starIntensity <= 1 &&
        tier.cloudDensity >= 0 && tier.cloudDensity <= 1 &&
        tier.sunIntensity >= 0,
      `tier ${t}: sky scalars out of range`
    );
  }
  assert(seen.size === 70, 'exactly 70 unique chunk archetype ids (10 x 7) — Part 5 contract');
  assert(
    TIERS[0].enterTrueRadius === START_RADIUS_M,
    'T0 enterTrueRadius must equal START_RADIUS_M'
  );
  // moonAngSize NON-DECREASING (night cosmetic — strictly-increasing relaxed).
  for (let t = 1; t < TIERS.length; t++) {
    assert(
      TIERS[t].moonAngSize >= TIERS[t - 1].moonAngSize,
      `tier ${t}: moonAngSize must be non-decreasing (night cosmetic)`
    );
  }
}

export default TIERS;
