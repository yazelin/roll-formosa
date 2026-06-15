/**
 * @file tiers.js — The v3 7-tier Tokyo scale table + RESCALE_S + dev-mode
 * invariant asserts.
 *
 * tierIndex drives ONLY: spawner content bands, fog/sky palette crossfade
 * (incl. sun/moon/stars/clouds sky params), HUD label/unit, bgm layer unlocks
 * and the celebration. Absorbability, camera, fog distances, speed and
 * despawn are continuous functions of ball radius (tuning.js) and NEVER
 * reference tierIndex. See DESIGN.md SEAMLESSNESS LAW.
 *
 * archetypeIds are FROZEN here — config/catalog.js must implement exactly
 * these 70 ids (ARCH_PER_TIER 10 x 7 tiers) with matching spelling, every
 * entry carrying displayNameJa (the Japanese names in the comments below are
 * the frozen display strings — docs/DESIGN-V3.md ティア表). Slots [8]/[9] of
 * every tier are CHUNK LANDMARKS (archRoll-eligible ONLY at placement j === 0
 * of a chunk — the spawner's landmark eligibility rule, DESIGN-V2.md 景観).
 * The 24 EXTRA curated archetypes (codes 70..93: collectibles, landmark
 * singletons, shop shell, Skytree display slot) live in catalog.js/cityMap.js
 * — NEVER here (chunk codes only).
 *
 * v3 sky params ride the EXISTING environment palette crossfade. The NIGHT
 * palette (finale ascension) stays env-LOCAL (appended after the tier
 * palettes inside environment.js) — this table keeps exactly 7 tiers.
 * The sky-dome moon is a NIGHT COSMETIC in v3 (uMoonFade always 1):
 * moonAngSize is non-decreasing (no longer strictly increasing).
 */

import {
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  LOAD_RADIUS_MIN_M,
  SIM_RADIUS_MIN,
  SIM_RADIUS_MAX,
  START_RADIUS_M,
  MOON_DIR_MIN_ELEV,
} from './tuning.js';

/** @typedef {import('../types.js').Tier} Tier */

/**
 * One-frame similarity rescale factor applied when simRadius >= SIM_RADIUS_MAX:
 * worldScale /= S; every sim quantity *= S. 1/S === SIM_RADIUS_MAX/SIM_RADIUS_MIN === 5,
 * so the ball lands exactly back at SIM_RADIUS_MIN (asserted below).
 */
export const RESCALE_S = 0.2;

/**
 * Archetype stride: ids per tier (slots 8/9 = chunk landmarks).
 * Archetype code = tier * ARCH_PER_TIER + slotInTier, 0..69 (v3: 7 tiers).
 * EVERY module that maps codes <-> (tier, slot) must use this constant —
 * never literal 8 or 10. EXTRA curated codes 70..93 are NOT tier-strided.
 */
export const ARCH_PER_TIER = 10;

/**
 * The v3 tier table — 箱庭東京. True ball radius ~x5 per tier:
 * T0 センゴク電子 2cm-10cm, T1 ショップ 10cm-50cm, T2 電気街 0.5m-2.5m,
 * T3 下町 2.5m-12m, T4 都心 12m-60m, T5 大東京 60m-300m,
 * T6 スカイライン 300m+ (goal: Skytree contact arms at GOAL_RADIUS_M 420m).
 * x5 rescale ladder unchanged — rescales at true r = 0.1/0.5/2.5/12.5/62.5/312.5.
 *
 * cellSizeSim / loadRadiusSim / objectsPerChunk are expressed in the tier's
 * NATIVE sim scale (the values the spawner uses when that tier is the current
 * target band N). v3: the spawner additionally scales per-band placement
 * counts by DENSITY_K_V3 (0.45 — the ONE pacing truth) and floors the
 * effective load radius at LOAD_RADIUS_MIN_M / worldScale (Stream B).
 *
 * moonDir POST-normalization elevation must stay >= MOON_DIR_MIN_ELEV
 * (asserted; adjacent dirs sit in the same sky quadrant so the palette lerp
 * can never dip below the floor).
 *
 * @type {Tier[]}
 */
export const TIERS = [
  {
    index: 0,
    name: 'センゴク電子', // v5: 千石電商-inspired shop name (was パーツ棚) — drives HUD #tier-label
    enterTrueRadius: 0.02,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // ネジ, 抵抗, コンデンサ, ICチップ, LED, ボタン電池, 消しゴム, クリップ
      'screw', 'resistor', 'capacitor', 'ic_chip', 'led', 'button_battery', 'eraser', 'paperclip',
      // chunk landmarks: ジャンク基板, はんだごて
      'junk_board', 'soldering_iron',
    ],
    fogColor: 0xe7d9bf, // warm shop lamplight haze
    skyTop: 0xf0ddb4,
    skyBottom: 0xfff3dd,
    sunDir: [0.50, 0.62, 0.30],
    sunIntensity: 0.5, // soft lamp-glow disc (roofless shop interior)
    moonDir: [-0.45, 0.40, -0.80],
    moonAngSize: 0.018,
    starIntensity: 0,
    cloudDensity: 0.10,
    cloudHex: 0xfff1d8,
  },
  {
    index: 1,
    name: 'ショップ',
    enterTrueRadius: 0.10,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // マウス, ゲームソフト, ジャンクHDD, スピーカー, 工具箱, 雑誌たば, 丸イス, ダンボール箱
      'mouse', 'game_soft', 'junk_hdd', 'speaker', 'toolbox', 'magazine_stack', 'round_stool', 'cardboard_box',
      // chunk landmarks: パーツ棚ラック, アーケード筐体
      'parts_rack', 'arcade_cabinet',
    ],
    fogColor: 0xdde4ec, // soft indoor daylight toward the open front
    skyTop: 0xbcd6ee,
    skyBottom: 0xf0f6ff,
    sunDir: [0.45, 0.60, 0.34],
    sunIntensity: 0.65,
    moonDir: [-0.42, 0.42, -0.81],
    moonAngSize: 0.022,
    starIntensity: 0,
    cloudDensity: 0.15,
    cloudHex: 0xf6fbff,
  },
  {
    index: 2,
    name: '電気街',
    enterTrueRadius: 0.50,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 自転車, 通行人, 看板, 自販機, ネコ, ハト, のぼり, ゴミ箱
      'bicycle', 'person', 'signboard', 'vending_machine', 'cat', 'pigeon', 'nobori_banner', 'trash_can',
      // chunk landmarks: 電柱 (cs .45), 屋台
      'utility_pole', 'yatai_stall',
    ],
    fogColor: 0xcfe6f5, // fresh Akiba morning
    skyTop: 0x6fb7e8,
    skyBottom: 0xdff1fb,
    sunDir: [0.38, 0.68, 0.26],
    sunIntensity: 0.9,
    moonDir: [-0.38, 0.45, -0.81],
    moonAngSize: 0.028,
    starIntensity: 0,
    cloudDensity: 0.45, // puffy
    cloudHex: 0xffffff,
  },
  {
    index: 3,
    name: '下町',
    enterTrueRadius: 2.5,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 車, タクシー, バス, トラック, 街路樹, 売店, 町家, 鳥居
      'car', 'taxi', 'bus', 'truck', 'street_tree', 'kiosk', 'machiya', 'torii',
      // chunk landmarks: 歩道橋 (cs .5), 銭湯の煙突 (cs .35)
      'footbridge', 'sento_chimney',
    ],
    fogColor: 0xc4e3e8, // clear shitamachi noon
    skyTop: 0x4fa3d8,
    skyBottom: 0xcfeef7,
    sunDir: [0.12, 0.88, 0.20],
    sunIntensity: 1.0, // high noon
    moonDir: [-0.34, 0.48, -0.81],
    moonAngSize: 0.035,
    starIntensity: 0,
    cloudDensity: 0.50, // puffy
    cloudHex: 0xfdfdf6,
  },
  {
    index: 4,
    name: '都心',
    enterTrueRadius: 12,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 雑居ビル, マンション, コンビニ, 立体駐車場, 電車車両, ガスタンク, クレーン, 神社
      'zakkyo_building', 'mansion', 'konbini', 'parking_garage', 'train_car', 'gas_tank', 'crane', 'shrine',
      // chunk landmarks: 首都高ジャンクション (cs .6), 観覧車
      'highway_junction', 'ferris_wheel',
    ],
    fogColor: 0xc9dcec, // bright city afternoon
    skyTop: 0x4a9bd4,
    skyBottom: 0xd8eef8,
    sunDir: [-0.25, 0.70, 0.35],
    sunIntensity: 1.0,
    moonDir: [-0.32, 0.50, -0.81],
    moonAngSize: 0.046,
    starIntensity: 0,
    cloudDensity: 0.42,
    cloudHex: 0xfdf6e8,
  },
  {
    index: 5,
    name: '大東京',
    enterTrueRadius: 60,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 超高層ビル, タワーマンション, ホテル, デパート, 高架橋, スタジアム, 操車場, 客船
      'skyscraper', 'tower_mansion', 'hotel', 'department_store', 'viaduct', 'stadium', 'rail_yard', 'cruise_ship',
      // chunk landmarks: 丘陵 (cs .85 — v2 'mountain' recipe reuse), 湾岸コンビナート
      'mountain', 'bay_complex',
    ],
    fogColor: 0xf2cfa3, // golden hour over the bay
    skyTop: 0xffb46b,
    skyBottom: 0xffe3b0,
    sunDir: [-0.60, 0.18, 0.45],
    sunIntensity: 1.2, // golden-hour low fat sun
    moonDir: [-0.30, 0.52, -0.80],
    moonAngSize: 0.055,
    starIntensity: 0.15,
    cloudDensity: 0.38, // amber streaks
    cloudHex: 0xffc98a,
  },
  {
    index: 6,
    name: 'スカイライン',
    enterTrueRadius: 300,
    cellSizeSim: 32,
    loadRadiusSim: 96,
    objectsPerChunk: 72,
    archetypeIds: [
      // 街区ブロック, 公園, 埠頭, ビル群, 川面ブロック, 競技場, 森, 雲
      'city_block', 'park', 'pier', 'building_cluster', 'river_block', 'arena', 'forest', 'cloud',
      // chunk landmarks: 大丘陵, 環状線リング
      'great_hill', 'ring_road',
    ],
    fogColor: 0x8a7bb5, // dusk-violet — the finale band
    skyTop: 0x2d2a5e,
    skyBottom: 0xb88bd6,
    sunDir: [-0.70, 0.10, 0.40],
    sunIntensity: 0.35, // dusk — dimmed
    moonDir: [-0.26, 0.56, -0.79],
    moonAngSize: 0.062,
    starIntensity: 0.5,
    cloudDensity: 0, // clear dusk
    cloudHex: 0x8a7bb5,
  },
];

/* ================================================================== */
/* Dev-mode invariant asserts (stripped from prod by the DEV guard)    */
/* ================================================================== */

if (import.meta.env && import.meta.env.DEV) {
  /** @param {boolean} cond @param {string} msg */
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`[tiers.js invariant] ${msg}`);
  };

  assert(TIERS.length === 7, 'exactly 7 tiers (v3 Hakoniwa Tokyo; NIGHT palette is env-local, never here)');
  assert(ARCH_PER_TIER === 10, 'ARCH_PER_TIER is frozen at 10');
  assert(
    Math.abs(1 / RESCALE_S - SIM_RADIUS_MAX / SIM_RADIUS_MIN) < 1e-9,
    '1/RESCALE_S must equal SIM_RADIUS_MAX/SIM_RADIUS_MIN (ball lands back at band min)'
  );
  assert(TIERS[0].enterTrueRadius === START_RADIUS_M, 'T0 enterTrueRadius must equal START_RADIUS_M');

  const seen = new Set();
  for (let t = 0; t < TIERS.length; t++) {
    const tier = TIERS[t];
    assert(tier.index === t, `tier ${t}: index field mismatch`);
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
    /* v3 EXTENDED fog/load floor assert (docs/DESIGN-V3.md スポーンアーキテクチャ):
       the fog wall must hide the spawn-in edge EVEN WHERE the real-meter
       floors bind. At each tier's worst-case worldScale (the tier's native
       scale, ws_t = (START_RADIUS_M / SIM_RADIUS_MIN) * 5^t, reference
       simRadius 1):
         max(FOG_FAR_K, FOG_FAR_MIN_M / ws) < max(loadRadiusSim, LOAD_RADIUS_MIN_M / ws) - cellSizeSim
       At T0 (ws 0.04) the floors dominate: 225 < 281.25 - 32 — the 8m shop is
       visible at r = 2cm yet still materializes beyond fog. */
    const ws = (START_RADIUS_M / SIM_RADIUS_MIN) * Math.pow(5, t);
    const fogSim = Math.max(FOG_FAR_K, FOG_FAR_MIN_M / ws);
    const loadSim = Math.max(tier.loadRadiusSim, LOAD_RADIUS_MIN_M / ws);
    assert(
      fogSim < loadSim - tier.cellSizeSim,
      `tier ${t}: floored fog far (${fogSim.toFixed(1)}) must be < floored load radius - cell ` +
        `(${(loadSim - tier.cellSizeSim).toFixed(1)}) at worst-case worldScale ${ws}`
    );
    // Sky params.
    assert(
      Array.isArray(tier.sunDir) && tier.sunDir.length === 3 &&
      Array.isArray(tier.moonDir) && tier.moonDir.length === 3,
      `tier ${t}: sunDir/moonDir must be [x,y,z]`
    );
    const m = tier.moonDir;
    const len = Math.hypot(m[0], m[1], m[2]);
    assert(len > 1e-6, `tier ${t}: moonDir must be non-zero`);
    assert(
      Math.asin(m[1] / len) >= MOON_DIR_MIN_ELEV,
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
  assert(seen.size === 70, 'exactly 70 unique archetype ids across the chunk catalog (10 x 7)');
  // v3: moonAngSize NON-DECREASING (night cosmetic — strictly-increasing relaxed).
  for (let t = 1; t < TIERS.length; t++) {
    assert(
      TIERS[t].moonAngSize >= TIERS[t - 1].moonAngSize,
      `tier ${t}: moonAngSize must be non-decreasing (v3 night cosmetic)`
    );
  }
}
