/**
 * @file cityMap.js — Miaoli pack cityMap.
 *
 * Defines the 8 curated Miaoli landmarks + 1 goal (龍騰斷橋), their positions,
 * and the 後龍溪 river. Landmarks are wired into PLACEMENTS so they spawn in
 * the world and can be absorbed as the ball grows.
 *
 * The curated base layout (SHOP, ZONES, bandAllowedAt, the chunk-dressing +
 * collectible PLACEMENTS, MAP_BOUNDS) comes from ./cityData.js.
 *
 * Override list:
 *   - LANDMARKS   → native Miaoli 9 entries (8 curated + 龍騰斷橋 goal)
 *   - PLACEMENTS  → cityData base placements + the 8 Miaoli landmark placements
 *   - GOAL_POS    → LONGTENG_POS
 *   - DEV_STARTS  → Miaoli-themed teleport keys
 *   - water       → 後龍溪 (Houlong River)
 */

import { LONGTENG_POS } from './monument.js';
import { ABSORB_RATIO } from '../../config/tuning.js';

// Import the 8 curated Miaoli landmark geometry descriptors.
import { NM_SHENGXING_STATION } from './landmarks/shengxing_station.js';
import { NM_NANZHUANG } from './landmarks/nanzhuang_old_street.js';
import { NM_DAHU_STRAWBERRY } from './landmarks/dahu_strawberry.js';
import { NM_SANYI_WOODCARVING } from './landmarks/sanyi_woodcarving.js';
import { NM_TONGXIAO_SHRINE } from './landmarks/tongxiao_station.js';
import { NM_GONGGUAN_TUNG } from './landmarks/gongguan_tung_tree.js';
import { NM_YUANLI_RUSH } from './landmarks/yuanli_tunnel.js';
import { NM_MINGDE_RESERVOIR as NM_MINGDE } from './landmarks/mingde_reservoir.js';
import { NM_LONGTENG_BRIDGE } from './landmarks/longteng_bridge.js';

// Re-export the pack-owned baked layout (cityData.js).
export { SHOP, MAP_BOUNDS, ZONES, bandAllowedAt } from './cityData.js';

// The pack's curated base placements.
import { PLACEMENTS as _BASE_PLACEMENTS } from './cityData.js';

/** @typedef {import('../../types.js').LandmarkDef} LandmarkDef */

/* ================================================================== */
/* Miaoli landmark positions (game-meter, origin = ball start)         */
/* ================================================================== */
/**
 * Hand-authored game-meter positions for the 8 curated Miaoli landmarks.
 * Convention: origin = ball start (客庄柑仔店 shop), +X east, +Z south.
 * Positions spread progressively — smaller landmarks closer, larger farther.
 * Mimics actual Miaoli geography (三義/勝興 south; 大湖 east; 通霄/苑裡 west).
 */
const POS = Object.freeze({
  shengxing:    Object.freeze({ x:  -20, z:   40 }),   // 勝興車站 — near start (old mountain railway)
  nanzhuang:    Object.freeze({ x:  180, z:  -80 }),   // 南庄老街 — northeast (Hakka village)
  dahu:         Object.freeze({ x:  280, z:  150 }),   // 大湖草莓園 — east (strawberry country)
  sanyi:        Object.freeze({ x: -150, z:  250 }),   // 三義木雕博物館 — southwest (woodcarving)
  tongxiao:     Object.freeze({ x: -380, z: -200 }),   // 通霄神社 — northwest (coastal shrine)
  gongguan:     Object.freeze({ x:  350, z: -350 }),   // 公館桐花步道 — northeast (tung trail)
  yuanli:       Object.freeze({ x: -450, z:  350 }),   // 苑裡藺草博物館 — west (rush grass)
  mingde:       Object.freeze({ x:  500, z:  -80 }),   // 明德水庫 — east (reservoir)
});

/* ================================================================== */
/* Landmark archetype codes (EXTRA codes 82..89 = Miaoli landmarks)    */
/* ================================================================== */
/** EXTRA codes for the 8 Miaoli curated landmark singletons. */
const CODE_SHENGXING    = 82;
const CODE_NANZHUANG    = 83;
const CODE_DAHU         = 84;
const CODE_SANYI        = 85;
const CODE_TONGXIAO     = 86;
const CODE_GONGGUAN     = 87;
const CODE_YUANLI       = 88;
const CODE_MINGDE       = 89;

/* ================================================================== */
/* LANDMARKS — 9 entries: 8 curated + 龍騰斷橋 goal                    */
/* (strictly increasing dioramaR in array order, goal last)            */
/* ================================================================== */

/**
 * Miaoli landmark defs, in strictly-increasing dioramaR order (= landmarkId order).
 * absorbRatio = 0.65 → absorb threshold = dioramaR / 0.65.
 *
 * Ladder:
 *   L0  勝興車站           dioramaR  35 → absorbable @  53.8 m
 *   L1  南庄老街           dioramaR  45 → absorbable @  69.2 m
 *   L2  大湖草莓園         dioramaR  55 → absorbable @  84.6 m
 *   L3  三義木雕博物館     dioramaR  70 → absorbable @ 107.7 m
 *   L4  通霄神社           dioramaR  85 → absorbable @ 130.8 m
 *   L5  公館桐花步道       dioramaR 100 → absorbable @ 153.8 m
 *   L6  苑裡藺草博物館     dioramaR 120 → absorbable @ 184.6 m
 *   L7  明德水庫           dioramaR 150 → absorbable @ 230.8 m
 *   L8  龍騰斷橋(goal)     dioramaR 400 → goal
 *
 * @type {LandmarkDef[]}
 */
export const LANDMARKS = Object.freeze([
  {
    landmarkId: 0,
    name: NM_SHENGXING_STATION.name,
    nameJa: NM_SHENGXING_STATION.name,
    x: POS.shengxing.x, z: POS.shengxing.z,
    dioramaR: 35,
    collisionScale: 1.0,
    sizeReal: 40,
    archetypeCode: CODE_SHENGXING,
    naturalBand: 3,
    colorHex: NM_SHENGXING_STATION.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 1,
    name: NM_NANZHUANG.name,
    nameJa: NM_NANZHUANG.name,
    x: POS.nanzhuang.x, z: POS.nanzhuang.z,
    dioramaR: 45,
    collisionScale: 0.9,
    sizeReal: 60,
    archetypeCode: CODE_NANZHUANG,
    naturalBand: 3,
    colorHex: NM_NANZHUANG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 2,
    name: NM_DAHU_STRAWBERRY.name,
    nameJa: NM_DAHU_STRAWBERRY.name,
    x: POS.dahu.x, z: POS.dahu.z,
    dioramaR: 55,
    collisionScale: 0.9,
    sizeReal: 80,
    archetypeCode: CODE_DAHU,
    naturalBand: 4,
    colorHex: NM_DAHU_STRAWBERRY.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 3,
    name: NM_SANYI_WOODCARVING.name,
    nameJa: NM_SANYI_WOODCARVING.name,
    x: POS.sanyi.x, z: POS.sanyi.z,
    dioramaR: 70,
    collisionScale: 0.9,
    sizeReal: 100,
    archetypeCode: CODE_SANYI,
    naturalBand: 4,
    colorHex: NM_SANYI_WOODCARVING.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 4,
    name: NM_TONGXIAO_SHRINE.name,
    nameJa: NM_TONGXIAO_SHRINE.name,
    x: POS.tongxiao.x, z: POS.tongxiao.z,
    dioramaR: 85,
    collisionScale: 0.8,
    sizeReal: 120,
    archetypeCode: CODE_TONGXIAO,
    naturalBand: 4,
    colorHex: NM_TONGXIAO_SHRINE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 5,
    name: NM_GONGGUAN_TUNG.name,
    nameJa: NM_GONGGUAN_TUNG.name,
    x: POS.gongguan.x, z: POS.gongguan.z,
    dioramaR: 100,
    collisionScale: 0.85,
    sizeReal: 150,
    archetypeCode: CODE_GONGGUAN,
    naturalBand: 5,
    colorHex: NM_GONGGUAN_TUNG.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 6,
    name: NM_YUANLI_RUSH.name,
    nameJa: NM_YUANLI_RUSH.name,
    x: POS.yuanli.x, z: POS.yuanli.z,
    dioramaR: 120,
    collisionScale: 0.85,
    sizeReal: 180,
    archetypeCode: CODE_YUANLI,
    naturalBand: 5,
    colorHex: NM_YUANLI_RUSH.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 7,
    name: NM_MINGDE.name,
    nameJa: NM_MINGDE.name,
    x: POS.mingde.x, z: POS.mingde.z,
    dioramaR: 150,
    collisionScale: 0.8,
    sizeReal: 250,
    archetypeCode: CODE_MINGDE,
    naturalBand: 5,
    colorHex: NM_MINGDE.colorHex,
    isGoal: false,
  },
  {
    landmarkId: 8,
    name: NM_LONGTENG_BRIDGE.name,
    nameJa: NM_LONGTENG_BRIDGE.name,
    x: LONGTENG_POS.x, z: LONGTENG_POS.z,
    dioramaR: 400,
    collisionScale: 0.5,
    sizeReal: 508,
    archetypeCode: 93, // display-name-only slot — goalTower.js renders this separately
    naturalBand: 6,
    colorHex: 0xb04a38,
    isGoal: true,
  },
]);

/* ================================================================== */
/* PLACEMENTS — cityData base placements + 8 Miaoli landmark singletons */
/* ================================================================== */

/**
 * Curated placements for Miaoli: starts with the full cityData base set,
 * then appends the 8 Miaoli landmark singleton placements. The 龍騰斷橋 goal
 * is rendered by goalTower.js (code 93 = display-name-only slot).
 */
const _MIAOLI_LANDMARK_PLACEMENTS = LANDMARKS
  .filter((ld) => !ld.isGoal)
  .map((ld) => ({
    archetypeCode: ld.archetypeCode,
    x: ld.x, y: 0, z: ld.z,
    radiusReal: ld.dioramaR,
    yaw: 0,
    naturalBand: ld.naturalBand,
    landmarkId: ld.landmarkId,
    collectibleId: -1,
    interior: false, interiorElevated: false, releaseGated: false,
    yK: 1,
    colorHex: ld.colorHex,
    rIntent: ld.dioramaR / ABSORB_RATIO,
  }));

export const PLACEMENTS = [
  ..._BASE_PLACEMENTS,
  ..._MIAOLI_LANDMARK_PLACEMENTS,
];

/* ================================================================== */
/* Water body (pack-driven — consumed by environment.js)               */
/* ================================================================== */

/**
 * 後龍溪 (Houlong River) definition for the Miaoli pack.
 *
 * Authored in REAL METERS. A 5-point centerline + width traces the river's
 * path through the Miaoli countryside (flows west toward the coast).
 *
 * color: muddy brown-green (山區溪水 with sediment)
 * yM: 0.3 m above ground
 */
export const water = Object.freeze({
  name: '後龍溪',
  color: 0x4a6850,
  yM: 0.3,
  width: 80,
  centerline: Object.freeze([
    Object.freeze({ x: -600, z: -100 }),
    Object.freeze({ x: -400, z:  -50 }),
    Object.freeze({ x: -150, z:   50 }),
    Object.freeze({ x:  100, z:  100 }),
    Object.freeze({ x:  350, z:   80 }),
  ]),
});

/* ================================================================== */
/* Overrides                                                           */
/* ================================================================== */

/**
 * Goal monument real-meter position (龍騰斷橋 world anchor).
 */
export const GOAL_POS = LONGTENG_POS;

/**
 * Dev teleport starts (?at=name&r=meters; main.js devTeleport).
 * Miaoli ladder keys: shop / hakka-street / strawberry / woodcarving / rail / goal
 */
export const DEV_STARTS = Object.freeze({
  /** Ball-start inside the 客庄柑仔店 shop — the base 'shop' start. */
  shop:        Object.freeze({ x: 0,    z: 0,     r: 0.02 }),
  /** 客家小吃街 Hakka food street. */
  'hakka-street': Object.freeze({ x: 60,   z: -60,   r: 0.5  }),
  /** 草莓園 strawberry farm area. */
  strawberry:  Object.freeze({ x: 200,  z: 100,   r: 3    }),
  /** 三義木雕街 woodcarving district. */
  woodcarving: Object.freeze({ x: -120, z: 200,   r: 30   }),
  /** 舊山線 old mountain railway area. */
  rail:        Object.freeze({ x: 400,  z: -200,  r: 120  }),
  /** Near the 龍騰斷橋 goal monument. */
  goal:        Object.freeze({ x: 700,  z: -280,  r: 380  }),
});
