/**
 * @file packs/pingtung/tiers.js — Roll Formosa Pingtung pack: the 7-tier scale
 * ladder (圖釘 2 cm → 鵝鑾鼻燈塔). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as a TROPICAL BEACH-RESORT progression from 屏東市柑仔店
 * through 墾丁海灘 / 恆春古城 / 海生館 to 國境之南鵝鑾鼻燈塔. The engine reads
 * tiers via the active pack (src/packs/active.js), NOT via config/tiers.js —
 * but RESCALE_S / ARCH_PER_TIER stay engine constants there; this pack imports
 * ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/pingtung/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (鵝鑾鼻燈塔 / 海生館 …) are NOT here — they live in
 * packs/pingtung/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 夜市→夜店 — 暖夜市攤燈
 * (T0/T1, 屏東市/墾丁大街) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 墾丁海岸電城).
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
    name: '屏東柑仔店桌頭', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 珊瑚碎片, 愛文芒果乾, 圖釘, 貝殼, 椰子糖, 飛魚鱗片, 鑰匙圈貝殼, 月琴撥片
      'coral_fragment', 'dried_mango', 'pushpin', 'seashell', 'coconut_candy', 'fish_scale', 'shell_keychain', 'yueqin_pick',
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
    name: '墾丁大街',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 黑鮪魚生魚片, 烤飛魚, 萬巒豬腳塊, 椰子汁, 海鮮攤碗, 芒果冰杯, 烤玉米, 海藻串
      'tuna_sashimi', 'grilled_flying_fish', 'pig_trotter_chunk', 'coconut_juice', 'seafood_bowl_pt', 'mango_ice_cup', 'grilled_corn_pt', 'seaweed_skewer',
      // chunk landmarks: 墾丁大街拱門, 海鮮攤車
      'kenting_street_arch', 'seafood_stall',
    ],
    fogColor: 0x3e2026, // 墾丁大街黃昏暖霧
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
    name: '恆春老街',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 安全帽, 大同電鍋, 瓦斯桶, 三角錐, 洋蔥籃, 浮潛面鏡, 衝浪板架
      'red_plastic_chair', 'helmet', 'rice_cooker', 'gas_cylinder', 'traffic_cone', 'onion_basket', 'snorkel_mask', 'surfboard_rack',
      // chunk landmarks: 恆春推車, 海灘躺椅組
      'hengchun_vendor_cart', 'beach_lounge_set',
    ],
    fogColor: 0x341e34, // 恆春老街傍晚 灰粉
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
    name: '墾丁海灘',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 香蕉船, 衝浪板, 救生圈, 陽傘堆, 椰子樹, 石獅
      'scooter', 'mini_truck', 'banana_ride', 'surfboard', 'life_buoy', 'beach_umbrella_pile', 'coconut_palm', 'stone_lion',
      // chunk landmarks: 墾丁海灘拱門, 沙灘酒吧
      'beach_arch', 'beach_bar',
    ],
    fogColor: 0x2a1c3e, // 暮色海灘藍紫調
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
    name: '恆春古城與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 咾咕石屋, 鐵皮屋, 恆春老洋樓, 超商, 公車, 垃圾車, 加油站, 萬巒豬腳店
      'coral_stone_house', 'tin_roof_house', 'hengchun_villa', 'convenience_store', 'city_bus', 'garbage_truck', 'gas_station', 'pig_trotter_shop',
      // chunk landmarks: 恆春街屋, 大廟
      'hengchun_streethouse_mass', 'temple_mass',
    ],
    fogColor: 0x201a44, // 恆春古城暮色 藍紫
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
    name: '海生館與度假區',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 商辦大樓, 度假飯店, 遊覽車高架, 跨港天橋, 停車塔, 海生館看板, 玻璃帷幕民宿, 銀行
      'office_tower', 'resort_hotel', 'tour_bus_viaduct', 'harbor_bridge', 'parking_tower', 'aquarium_billboard', 'glass_curtain_bnb', 'bank',
      // chunk landmarks: 海生館入口塔, 度假村大廳
      'aquarium_entrance_tower', 'resort_lobby_mass',
    ],
    fogColor: 0x1c1e48, // 海生館區金紫 (golden hour 偏夜)
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
    name: '國境之南天際線',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 玻璃帷幕高樓, 觀景台, 其他摩天樓, 墾丁度假村看板, 度假塔, 海洋中心, 屋頂機房, 海岸大樓
      'glass_highrise', 'observation_deck', 'other_skyscraper', 'resort_billboard', 'resort_tower', 'ocean_center', 'rooftop_plant_room', 'coastal_block',
      // chunk landmarks: 跨海空橋, 屋頂機房塔
      'cross_sea_skybridge', 'rooftop_mech_tower',
    ],
    fogColor: 0x18183e, // 國境之南夜空 深藍紫 (the finale band)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — dimmed; 鵝鑾鼻燈塔點燈接手
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
    if (!cond) throw new Error(`[pingtung tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→鵝鑾鼻, x5 ladder)');
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
       — they now validate the SHIPPING Pingtung tier params, not dead legacy data).
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
