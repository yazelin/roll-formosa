/**
 * @file packs/newtaipei/tiers.js — Roll Formosa New Taipei pack: the 7-tier scale
 * ladder (圖釘 2 cm → 淡水漁人碼頭情人橋). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as a 老街/陶瓷/河岸 progression up 九份/鶯歌/淡水 skyline.
 * The engine reads tiers via the active pack (src/packs/active.js),
 * NOT via config/tiers.js — but RESCALE_S / ARCH_PER_TIER stay engine constants
 * there; this pack imports ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/newtaipei/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (九份 / 情人橋 …) are NOT here — they live in
 * packs/newtaipei/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 夜市→夜店 — 暖夜市攤燈
 * (T0/T1, 九份/淡水) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 淡水河岸電城).
 * Color fields are IDENTICAL to other packs (shared night palette);
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
    name: '九份柑仔店桌頭', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 彈珠, 橡皮擦, 圖釘, 黑糖糕盤, 礦工油燈, 尪仔標, 鉛筆, 鈕扣
      'marble', 'eraser', 'pushpin', 'brown_sugar_cakes', 'miner_lamp_vintage', 'ngiauimia_card', 'pencil', 'button',
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
    name: '老街夜市',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 阿給盤, 鐵蛋包, 天燈盞, 芋圓碗, 魚丸串, 酸梅湯杯, 寶特瓶, 胡椒餅
      'agei_serving', 'iron_egg_cluster', 'sky_lantern_lit', 'taro_ball_bowl', 'fishball_skewer', 'sour_plum_cup', 'pet_bottle', 'pepper_bun',
      // chunk landmarks: 天燈攤, 老街燈籠
      'lantern_stall', 'oldstreet_lantern',
    ],
    fogColor: 0x3e2026, // 老街夜市黃昏暖霧
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
    name: '鶯歌陶瓷騎樓',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 陶碗組, 茶壺組, 紅塑膠椅, 瓦斯桶, 三角錐, 消防栓, 陶藝轉盤, 花瓶
      'ceramic_bowl_stack', 'teapot_set', 'red_plastic_chair', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'pottery_wheel', 'vase',
      // chunk landmarks: 陶瓷攤車, 窯爐
      'ceramic_cart', 'kiln',
    ],
    fogColor: 0x341e34, // 陶瓷騎樓傍晚 灰粉
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
    name: '淡水河岸',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 渡輪票亭, 霓虹招牌, 鐵捲門, 路樹, 藍白渡船, 石獅
      'scooter', 'mini_truck', 'ferry_booth', 'neon_sign', 'roll_shutter', 'street_tree', 'blue_ferry', 'stone_lion',
      // chunk landmarks: 河岸碼頭, 漁船
      'river_pier', 'fishing_boat',
    ],
    fogColor: 0x2a1c3e, // 暮色淡水河岸藍起調
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
    name: '老鎮街屋與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 透天厝, 紅磚屋, 老公寓, 超商, 公車, 垃圾車, 加油站, 騎樓柱
      'townhouse', 'redbrick_house', 'old_apartment', 'convenience_store', 'city_bus', 'garbage_truck', 'gas_station', 'arcade_pillar',
      // chunk landmarks: 三峽老街屋, 大廟
      'sanxia_streethouse', 'temple_mass',
    ],
    fogColor: 0x201a44, // 老鎮街屋暮色 藍紫
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
    name: '新北商業區',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 商辦大樓, 百貨, 捷運高架, 天橋, 停車塔, 巨型看板, 玻璃帷幕街屋, 銀行
      'office_tower', 'department_store', 'metro_viaduct', 'pedestrian_bridge', 'parking_tower', 'giant_billboard', 'glass_curtain_house', 'bank',
      // chunk landmarks: 新北商辦塔, 百貨大樓
      'newtaipei_tower', 'department_mass',
    ],
    fogColor: 0x1c1e48, // 新北商業區金紫 (golden hour 偏夜)
    skyTop: 0x16163a,
    skyBottom: 0x3a3ab8,
    sunDir: [-0.55, 0.20, 0.42],
    sunIntensity: 0.60, // 低斜暮陽映河面
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.46,
    cloudDensity: 0.30,
    cloudHex: 0x4262ff,
  },
  {
    index: 6,
    name: '淡水天際線',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 玻璃帷幕高樓, 跨河大橋, 其他摩天樓, 巨型廣告牆, 商辦塔, 空橋, 屋頂機房, 河岸大樓
      'glass_highrise', 'river_bridge', 'other_skyscraper', 'giant_ad_wall', 'biz_tower', 'sky_bridge', 'rooftop_plant_room', 'riverside_block',
      // chunk landmarks: 跨街空橋, 屋頂機房塔
      'crossstreet_skybridge', 'rooftop_mech_tower',
    ],
    fogColor: 0x18183e, // 淡水天際線夜空 深藍紫 (the finale band)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — dimmed; 情人橋點燈接手
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
    if (!cond) throw new Error(`[newtaipei tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→情人橋, x5 ladder)');
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
       — they now validate the SHIPPING New Taipei tier params, not dead legacy data).
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
