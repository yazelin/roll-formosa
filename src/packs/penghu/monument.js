/**
 * @file packs/penghu/monument.js — 澎湖跨海大橋 goal monument descriptor (P6a).
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via penghu/index.js goalMonument field
 *
 * The Penghu pack's goal is the 澎湖跨海大橋 (Penghu Great Bridge), the iconic
 * 2.5 km bridge connecting 白沙島 and 西嶼 — the most recognizable landmark
 * of the Penghu Islands.
 *
 * goal constants:
 *   goalRadiusM  = 420 m  (dramatic approach unchanged)
 *   baseRadiusM  = 80 m   (bridge is wide and long)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_CROSS_SEA_BRIDGE } from './landmarks/cross_sea_bridge.js';

/** 澎湖跨海大橋 game-world position (REAL meters, origin = ball start). */
export const CROSS_SEA_BRIDGE_POS = Object.freeze({ x: 749, z: -252 });

/** 跨海大橋 base radius in REAL meters (game feel). */
export const CROSS_SEA_BRIDGE_BASE_R_M = 80;

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
  pos: CROSS_SEA_BRIDGE_POS,
  /** Display name (zh-TW). */
  name: '澎湖跨海大橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: CROSS_SEA_BRIDGE_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾完澎湖跨海大橋！月牙陪你橫跨大海！',
});

export default goalMonument;
