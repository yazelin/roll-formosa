/**
 * @file packs/keelung/monument.js — 正濱漁港彩色屋 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via keelung/index.js goalMonument field
 *
 * ZHENGBIN_POS is placed at a central harbor location appropriate for the
 * Keelung city map. The colorful houses are a row of waterfront townhouses
 * about 100m long and 25m tall.
 *
 * goal constants for 正濱漁港彩色屋 (much shorter than Taipei 101):
 *   goalRadiusM  = 280 m  (shorter monument = closer approach trigger)
 *   baseRadiusM  = 60 m   (row of houses ~100m long, base collider ~60m)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_ZHENGBIN_COLORHOUSES } from './landmarks/zhengbin_colorhouses.js';

/** 正濱漁港彩色屋 game-world position (REAL meters, origin = ball start). */
export const ZHENGBIN_POS = Object.freeze({ x: 749, z: -252 });

/** 正濱漁港彩色屋 base radius in REAL meters. */
export const ZHENGBIN_BASE_R_M = 60;

/**
 * Goal monument descriptor for the Keelung pack.
 *
 * @type {{
 *   buildGeometry: (rng: object) => THREE.BufferGeometry,
 *   pos: {x: number, z: number},
 *   name: string,
 *   goalRadiusM: number,
 *   baseRadiusM: number,
 *   winToast: string,
 * }}
 */
export const goalMonument = Object.freeze({
  /** Build the colorful houses row mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_ZHENGBIN_COLORHOUSES.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: ZHENGBIN_POS,
  /** Display name (zh-TW). */
  name: '正濱漁港彩色屋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 280,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 240,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: ZHENGBIN_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾完正濱彩色屋！月牙陪你吹海風！',
});

export default goalMonument;
