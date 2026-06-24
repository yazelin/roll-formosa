/**
 * @file packs/miaoli/tiers.js — Roll Formosa Miaoli pack: the 7-tier scale
 * ladder (圖釘 2 cm → 龍騰斷橋). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as a HAKKA-COUNTRYSIDE progression through 客庄 / 三義
 * woodcarving / 大湖草莓 / 桐花山林 / 舊山線鐵道 / 龍騰斷橋 skyline.
 * The engine reads tiers via the active pack (src/packs/active.js),
 * NOT via config/tiers.js — but RESCALE_S / ARCH_PER_TIER stay engine constants
 * there; this pack imports ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/miaoli/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (勝興車站 / 龍騰斷橋 …) are NOT here — they live in
 * packs/miaoli/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 夜市→夜店 — 暖夜市攤燈
 * (T0/T1, 客庄/小吃) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 舊山線).
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
    name: '客庄柑仔店', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 彈珠, 客家花布香包, 圖釘, 草莓糖, 擂茶粉包, 尪仔標, 鉛筆, 陶瓷碗
      'marble', 'hakka_flower_sachet', 'pushpin', 'strawberry_candy', 'leicha_packet', 'ngiauimia_card', 'pencil', 'ceramic_bowl',
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
    name: '客家小吃街',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 擂茶碗, 粄條, 草莓, 香腸, 客家麻糬, 薑絲, 紅白塑膠袋, 客家菜包
      'leicha_bowl', 'bantiao', 'strawberry', 'hakka_sausage', 'hakka_mochi', 'ginger_shreds', 'redwhite_bag', 'caibao',
      // chunk landmarks: 客家花布棚, 擂茶攤
      'hakka_cloth_awning', 'leicha_stall',
    ],
    fogColor: 0x3e2026, // 客家小吃街霓虹暖霧
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
    name: '草莓園騎樓',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 採茶帽, 草莓籃, 瓦斯桶, 三角錐, 消防栓, 油桐花盆, 草莓箱
      'red_plastic_chair', 'tea_picking_hat', 'strawberry_basket', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'tung_flower_pot', 'strawberry_crate',
      // chunk landmarks: 草莓攤車, 廟前香爐
      'strawberry_cart', 'temple_incense_burner',
    ],
    fogColor: 0x341e34, // 草莓園傍晚 灰粉
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
    name: '三義木雕街',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 木雕象, 木藝招牌, 鐵捲門, 桐花樹, 木工棚架, 石獅
      'scooter', 'mini_truck', 'wood_elephant', 'wood_sign', 'roll_shutter', 'tung_tree', 'wood_awning', 'stone_lion',
      // chunk landmarks: 木雕店門面, 廟前牌樓
      'woodcarving_shop', 'temple_pailou',
    ],
    fogColor: 0x2a1c3e, // 三義木雕街暮色藍紫
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
    name: '客庄街屋與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 透天厝, 鐵皮屋, 客家夥房, 客家米店, 公車, 垃圾車, 加油站, 木雕騎樓
      'townhouse', 'tin_roof_house', 'hakka_house', 'hakka_rice_shop', 'city_bus', 'garbage_truck', 'gas_station', 'woodcarving_arcade',
      // chunk landmarks: 客家街屋, 大廟
      'hakka_streethouse', 'temple_mass',
    ],
    fogColor: 0x201a44, // 客庄街屋暮色 藍紫
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
    name: '舊山線鐵道',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 商辦大樓, 舊車站, 鐵道高架, 天橋, 停車塔, 鐵道看板, 玻璃帷幕街屋, 銀行
      'office_tower', 'old_station', 'rail_viaduct', 'pedestrian_bridge', 'parking_tower', 'rail_billboard', 'glass_curtain_house', 'bank',
      // chunk landmarks: 舊山線車站塔, 倉庫
      'mountain_rail_station', 'warehouse_mass',
    ],
    fogColor: 0x1c1e48, // 舊山線暮色 金紫
    skyTop: 0x16163a,
    skyBottom: 0x3a3ab8,
    sunDir: [-0.55, 0.20, 0.42],
    sunIntensity: 0.60, // 低斜暮陽映山谷
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.46,
    cloudDensity: 0.30,
    cloudHex: 0x4262ff,
  },
  {
    index: 6,
    name: '龍騰斷橋天際線',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 龍騰斷橋拱門, 跨橋, 木雕工廠, 客家聚落, 舊山線隧道口, 空橋, 舊山線鐵橋, 街區大樓
      'longteng_arch', 'cross_bridge', 'woodcarving_factory', 'hakka_village_cluster', 'railway_tunnel', 'sky_bridge', 'old_mountain_rail_bridge', 'skyline_block',
      // chunk landmarks: 跨街空橋, 屋頂機房塔
      'crossstreet_skybridge', 'rooftop_mech_tower',
    ],
    fogColor: 0x18183e, // 龍騰斷橋夜空 深藍紫 (the finale band)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — dimmed; 斷橋點燈接手
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
    if (!cond) throw new Error(`[miaoli tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→龍騰斷橋, x5 ladder)');
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
       — they now validate the SHIPPING Miaoli tier params, not dead legacy data).
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
