/**
 * @file packs/hualien/tiers.js — Roll Formosa Hualien pack: the 7-tier scale
 * ladder (圖釘 2 cm → 太魯閣牌樓). Pack-scoped re-theme of the engine's legacy
 * tier table, themed as a MOUNTAIN-COAST progression up the 文創小店 / 夜市 /
 * 原民街 / 七星潭 / 石藝街屋 / 太魯閣 / 清水斷崖 progression. The engine reads
 * tiers via the active pack (src/packs/active.js), NOT via config/tiers.js —
 * but RESCALE_S / ARCH_PER_TIER stay engine constants there; this pack imports
 * ARCH_PER_TIER only for its self-check.
 *
 * SEAMLESSNESS LAW unchanged: tierIndex drives ONLY spawn bands, sky/fog
 * palette, HUD label, bgm, celebration. Absorbability/camera/fog/speed/despawn
 * stay continuous functions of ball radius (tuning.js) and NEVER read tierIndex.
 *
 * archetypeIds[10] per tier are the FROZEN CONTRACT with packs/hualien/catalog.js
 * (Part 5): slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 * The named singleton landmarks (慶修院 / 松園 …) are NOT here — they live in
 * packs/hualien/landmarks.js + cityMap.js (curated EXTRA code space).
 *
 * Band edges (enterTrueRadius) + cellSizeSim/loadRadiusSim/objectsPerChunk are
 * kept identical to the engine baseline so the engine's worst-case fog/load
 * floor dev-assert passes untouched.
 *
 * Palette (搖滾·福爾摩沙 夜色 pass): all-night neon arc 夜市→夜店 — 暖夜市攤燈
 * (T0/T1) → 漸冷霓虹紫 (T2-T4) → 冷電光夜店藍 (T5/T6, 清水斷崖電城). Shared by
 * every pack (identical color fields per tier); object rim glows the per-tier
 * cloudHex accent (main.js setRimTint + tuning RIM_K).
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
    name: '文創小店桌頭', // 圖釘/手作雜貨桌頭 — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 彈珠, 橡皮擦, 圖釘, 大理石珠, 原民編織繩, 尪仔標, 鉛筆, 鈕扣
      'marble', 'eraser', 'pushpin', 'marble_bead', 'tribal_weave_cord', 'ngiauimia_card', 'pencil', 'button',
      // chunk landmarks: 戳戳樂板, 籤筒
      'scratch_card_board', 'fortune_stick_tube',
    ],
    fogColor: 0x3a2616, // T0 暖夜市攤燈 (搖滾·福爾摩沙 夜市→夜店 夜色 pass)
    skyTop: 0x180d06,
    skyBottom: 0x5e3414,
    sunDir: [0.50, 0.62, 0.30],
    sunIntensity: 0.55, // 暖攤燈(夜色但物件仍看得清)
    moonDir: [-0.45, 0.40, -0.80],
    moonAngSize: 0.018,
    starIntensity: 0.10,
    cloudDensity: 0.10,
    cloudHex: 0xffb050,
  },
  {
    index: 1,
    name: '東大門夜市',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 扁食碗, 寶特瓶, 麻糬盒, 香, 金紙, 官財板, 紅白塑膠袋, 炸彈蔥油餅
      'wonton_bowl', 'pet_bottle', 'mochi_box', 'incense_stick', 'joss_paper', 'coffin_bread', 'redwhite_bag', 'scallion_pancake',
      // chunk landmarks: 攤車燈籠, 彈珠台
      'stall_lantern', 'pinball_table',
    ],
    fogColor: 0x3e2026, // T1 熱鬧夜市霓虹(暖+第一道霓虹)
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
    name: '原民街巷',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 紅塑膠椅, 安全帽, 竹蒸籠, 瓦斯桶, 三角錐, 消防栓, 編織籃, 獵人刀架
      'red_plastic_chair', 'helmet', 'bamboo_steamer', 'gas_cylinder', 'traffic_cone', 'fire_hydrant', 'woven_basket', 'hunter_knife_rack',
      // chunk landmarks: 原民圖騰柱, 廟前香爐
      'tribal_totem_pole', 'temple_incense_burner',
    ],
    fogColor: 0x341e34, // T2 原民街霓虹漸冷(紫洋紅上)
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
    name: '七星潭海濱',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 機車, 小貨車, 漂流木, 鵝卵石堆, 風箏, 七星潭涼亭, 棕櫚, 石獅
      'scooter', 'mini_truck', 'driftwood', 'pebble_stack', 'kite', 'qixing_pavilion', 'harbor_palm', 'stone_lion',
      // chunk landmarks: 海濱拱門, 涼亭廊架
      'beach_arch', 'beach_pergola',
    ],
    fogColor: 0x2a1c3e, // T3 七星潭海濱電光(紫)
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
    name: '石藝街屋與廟',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 透天厝, 石雕工坊, 公寓, 超商, 公車, 垃圾車, 加油站, 騎樓柱
      'townhouse', 'marble_workshop', 'apartment', 'convenience_store', 'city_bus', 'garbage_truck', 'gas_station', 'arcade_pillar',
      // chunk landmarks: 石藝街屋量體, 宮廟量體
      'marble_shop_mass', 'temple_mass',
    ],
    fogColor: 0x201a44, // T4 石藝街屋藍紫(轉冷)
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
    name: '太魯閣峽谷',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 大理石岩塊, 吊橋塔, 步道欄杆, 山壁岩石, 停車塔, 峽谷看板, 遊客中心, 隧道口
      'marble_boulder', 'suspension_tower', 'trail_railing', 'cliff_rock', 'parking_tower', 'gorge_sign', 'visitor_center', 'tunnel_mouth',
      // chunk landmarks: 燕子口觀景台, 九曲洞牌坊
      'swallow_viewpoint', 'jiuqudong_arch',
    ],
    fogColor: 0x1c1e48, // T5 太魯閣峽谷夜店電光藍(俱樂部)
    skyTop: 0x16163a,
    skyBottom: 0x3a3ab8,
    sunDir: [-0.55, 0.20, 0.42],
    sunIntensity: 0.60,
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.46,
    cloudDensity: 0.30,
    cloudHex: 0x4262ff,
  },
  {
    index: 6,
    name: '清水斷崖天際',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 斷崖岩壁, 公路護欄, 觀景平台, 巨型海蝕洞, 蘇花隧道, 斷崖量體, 海上巨岩, 燈塔
      'cliff_wall', 'highway_guardrail', 'scenic_platform', 'sea_cave', 'suhua_tunnel', 'cliff_mass', 'sea_rock', 'lighthouse',
      // chunk landmarks: 清水斷崖觀景, 蘇花公路彎道
      'qingshui_viewpoint', 'suhua_curve',
    ],
    fogColor: 0x18183e, // T6 清水斷崖巔峰夜店電城(太魯閣接手)
    skyTop: 0x121238,
    skyBottom: 0x3030aa,
    sunDir: [-0.70, 0.08, 0.40],
    sunIntensity: 0.55, // 入夜 — 城市霓虹接手
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
    if (!cond) throw new Error(`[hualien tiers] ${msg}`);
  };
  assert(TIERS.length === 7, 'exactly 7 tiers (圖釘→太魯閣, x5 ladder)');
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
       — they now validate the SHIPPING Hualien tier params, not dead legacy data).
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
