/**
 * @file packs/taichung/monument.js — 台中之鑽 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via taichung/index.js goalMonument field
 *
 * SCALE NOTE: the goal tower's in-game height (MONUMENT_HEIGHT_M = 508) and the
 * win-arm radius (GOAL_RADIUS_M = 420) are ENGINE constants (goalTower.js /
 * tuning.js), identical for every city — so 台中之鑽 plays at the same proven
 * pacing as 台北101 / 高雄85. The real "225 m" is lore (carried in the name /
 * dioramaRHint), exactly like 高雄85's "378 m". MONUMENT_POS reuses the shared
 * goal-monument world anchor; baseRadiusM keeps the tuned 72 m goal collider.
 */

import { NM_TAICHUNG_DIAMOND } from './landmarks/taichung_diamond.js';

/** 台中之鑽 game-world position (REAL meters, origin = ball start). Reuses the
 *  shared goal-monument anchor so finale/terrain math is unchanged. */
export const MONUMENT_POS = Object.freeze({ x: 749, z: -252 });

/** Goal base radius in REAL meters (tuned goal-collider feel, shared value). */
export const MONUMENT_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Taichung pack.
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
  /** Build the 台中之鑽 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_TAICHUNG_DIAMOND.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: MONUMENT_POS,
  /** Display name (zh-TW). */
  name: '台中之鑽',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: MONUMENT_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完台中之鑽！月牙陪你登頂！',
});

export default goalMonument;
