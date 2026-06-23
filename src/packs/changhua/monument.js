/**
 * @file packs/changhua/monument.js — 八卦山大佛 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via changhua/index.js goalMonument field
 *
 * 八卦山大佛 — the iconic 22.5 m seated Buddha statue atop Bagua Mountain,
 * built in 1961. The goal monument for the 彰化 pack.
 *
 * goal constants tune (八卦山大佛 = 22.5 m real):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 32 m   (Buddha statue + lotus pedestal base, ~28 m diameter)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_BAGUASHAN_BUDDHA } from './landmarks/baguashan_buddha.js';

/** 八卦山大佛 game-world position (REAL meters, origin = ball start).
 *  Positioned NE of the city center on Bagua Mountain. */
export const BAGUASHAN_BUDDHA_POS = Object.freeze({ x: 680, z: -320 });

/** 八卦山大佛 base radius in REAL meters (game feel; lotus pedestal ~28 m diameter). */
export const BAGUASHAN_BUDDHA_BASE_R_M = 32;

/**
 * Goal monument descriptor for the Changhua pack.
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
  /** Build the 八卦山大佛 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_BAGUASHAN_BUDDHA.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: BAGUASHAN_BUDDHA_POS,
  /** Display name (zh-TW). */
  name: '八卦山大佛',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: BAGUASHAN_BUDDHA_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾完八卦山大佛！月牙陪你登頂！',
});

export default goalMonument;
