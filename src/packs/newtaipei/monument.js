/**
 * @file packs/newtaipei/monument.js — 淡水漁人碼頭情人橋 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via newtaipei/index.js goalMonument field
 *
 * LOVER_BRIDGE_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the New Taipei city map will author a real 淡水 anchor later.
 *
 * goal constants retune (情人橋 = 165 m real span):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (kept equal for parity, podium base feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_LOVER_BRIDGE } from './landmarks/lover_bridge.js';

/** 淡水漁人碼頭情人橋 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor. */
export const LOVER_BRIDGE_POS = Object.freeze({ x: 749, z: -252 });

/** 情人橋 base radius in REAL meters (game feel; kept at the 72 m parity
 *  value used by other city goals so terrain/collider math is unchanged). */
export const LOVER_BRIDGE_BASE_R_M = 72;

/**
 * Goal monument descriptor for the New Taipei pack.
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
  /** Build the 情人橋 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_LOVER_BRIDGE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: LOVER_BRIDGE_POS,
  /** Display name (zh-TW). */
  name: '淡水漁人碼頭情人橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: LOVER_BRIDGE_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完情人橋！月牙陪你看夕陽！',
});

export default goalMonument;
