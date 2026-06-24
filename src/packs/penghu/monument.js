/**
 * @file packs/penghu/monument.js — 澎湖跨海大橋 goal monument descriptor (P6a).
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via penghu/index.js goalMonument field
 *
 * CROSSSEABRIDGE_POS places the goal at the west of the map, away from the
 * 馬公 shop start, representing the famous 跨海大橋 that connects 白沙 to 西嶼.
 *
 * goal constants:
 *   goalRadiusM  = 300 m  (approach radius)
 *   callRadiusM  = 260 m  (CALLED toast fires)
 *   baseRadiusM  = 60 m   (permanent base collider radius)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_CROSS_SEA_BRIDGE } from './landmarks/taipei101.js';

/** 跨海大橋 game-world position (REAL meters, origin = ball start / 馬公 shop).
 *  Located at the western edge of the map. */
export const CROSSSEABRIDGE_POS = Object.freeze({ x: 749, z: -252 });

/** 跨海大橋 base radius in REAL meters (game feel). */
export const CROSSSEABRIDGE_BASE_R_M = 60;

/**
 * Goal monument descriptor for the Penghu pack.
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
  /** Build the 跨海大橋 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_CROSS_SEA_BRIDGE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: CROSSSEABRIDGE_POS,
  /** Display name (zh-TW). */
  name: '澎湖跨海大橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 300,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 260,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: CROSSSEABRIDGE_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾完澎湖跨海大橋！月牙陪你跨越大海！',
});

export default goalMonument;
