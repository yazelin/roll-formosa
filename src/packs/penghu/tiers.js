/**
 * @file packs/penghu/tiers.js — Roll Formosa Penghu pack: the 7-tier scale
 * ladder (圖釘 2 cm → 跨海大橋). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as an ISLAND progression up the 漁村 / 觀光碼頭 / 玄武岩
 * skyline. The engine reads tiers via the active pack (src/packs/active.js),
 * NOT via config/tiers.js — but RESCALE_S / ARCH_PER_TIER stay engine constants
 * there; this pack imports ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/penghu/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (雙心石滬 / 跨海大橋 …) are NOT here — they live in
 * packs/penghu/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 漁村→港口 — 暖漁村燈火
 * (T0/T1, 漁港) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 跨海大橋電城).
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
    name: '漁村柑仔店', // 圖釘/文具桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 珊瑚珠, 風獅爺吊飾, 魚鉤, 貝殼, 仙人掌糖, 石敢當小牌, 小卷乾, 貝殼釦
      'coral_bead', 'windlion_charm', 'fish_hook', 'seashell', 'cactus_candy', 'stone_tablet', 'dried_squid_snack', 'shell_button',
      // chunk landmarks: 戳戳樂板, 籤筒
      'scratch_card_board', 'fortune_stick_tube',
    ],
    fogColor: 0x3a2616, // 暖色漁村燈霧
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
    name: '漁港夜市',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 仙人掌冰零食, 烤小管, 海膽零食, 黑糖糕零食, 風茹茶, 花枝丸, 炸魚, 海菜
      'cactus_ice_snack', 'grilled_squid', 'sea_urchin_snack', 'brown_sugar_cake_snack', 'fenru_tea', 'cuttlefish_ball', 'fried_fish', 'seaweed',
      // chunk landmarks: 漁市拱門, 攤車
      'fish_market_arch', 'stall',
    ],
    fogColor: 0x3e2026, // 漁港夜市黃昏暖霧
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
    name: '漁村騎樓',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 安全帽, 漁網浮球, 瓦斯桶, 三角錐, 消防栓, 風獅爺小像, 漁網捲
      'red_plastic_chair', 'helmet', 'fishing_float', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'windlion_mini', 'fishing_net_roll',
      // chunk landmarks: 漁村推車, 石敢當碑
      'fishing_vendor_cart', 'shigandang_stele',
    ],
    fogColor: 0x341e34, // 漁村騎樓傍晚 灰粉
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
    name: '觀光碼頭',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 漁船, 鐵捲門, 繫纜柱, 漁網捲大, 碼頭棕櫚, 石敢當
      'scooter', 'mini_truck', 'fishing_boat', 'roll_shutter', 'mooring_bollard', 'fishing_net_big', 'harbor_palm', 'shigandang',
      // chunk landmarks: 觀光碼頭吊車, 漁港牌樓
      'pier_crane', 'fishport_pailou',
    ],
    fogColor: 0x2a1c3e, // 暮色觀光碼頭藍起調
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
    name: '古厝與天后宮',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 咾咕石厝, 漁寮, 老公寓, 超商, 公車, 垃圾車, 加油站, 漁港涼亭
      'coral_house', 'fishing_shed', 'old_apartment', 'convenience_store', 'island_bus', 'garbage_truck', 'gas_station', 'harbor_pavilion',
      // chunk landmarks: 咾咕石街屋, 漁港牌樓
      'coral_streethouse_mass', 'harbor_gate',
    ],
    fogColor: 0x201a44, // 古厝街屋暮色 藍紫
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
    name: '玄武岩海岸',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 商辦大樓, 港倉, 觀光船, 跨港天橋, 停車塔, 港區看板, 玻璃帷幕街屋, 銀行
      'office_tower', 'port_warehouse', 'tour_boat', 'harbor_bridge', 'parking_tower', 'port_billboard', 'glass_curtain_house', 'bank',
      // chunk landmarks: 玄武岩柱, 港邊倉庫
      'basalt_pillar', 'warehouse_mass',
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
    name: '跨海大橋天際線',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 跨海橋塔, 橋墩, 其他摩天樓, 風力發電機, 圖書館塔, 遊客中心, 屋頂機房, 灣區大樓
      'bridge_tower', 'bridge_pier', 'other_skyscraper', 'wind_turbine', 'library_tower', 'visitor_center', 'rooftop_plant_room', 'bayarea_block',
      // chunk landmarks: 漁港聯外橋, 屋頂機房塔
      'fishing_harbor_connector', 'rooftop_mech_tower',
    ],
    fogColor: 0x18183e, // 跨海大橋夜空 深藍紫 (the finale band)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — dimmed; 跨海大橋點燈接手
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
    if (!cond) throw new Error(`[penghu tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→跨海大橋, x5 ladder)');
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
       — they now validate the SHIPPING Penghu tier params, not dead legacy data).
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
