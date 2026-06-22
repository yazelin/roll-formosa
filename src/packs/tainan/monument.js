/**
 * @file packs/taipei/monument.js — Taipei 101 goal monument descriptor (P6a).
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via taipei/index.js goalMonument field
 *
 * TAIPEI101_POS reuses the legacy goal-monument world position (749, -252)
 * for P6a — the Taipei city map will author a new anchor in P6b; for now the
 * goal stands at the same map location so all existing finale/terrain math
 * continues to work without a city-map rewrite.
 *
 * goal constants retune (101 = 508 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (101 base ~58 m real, bumped for game feel;
 *                           MONUMENT_BASE_R_M 90 m scaled by 508/634 ≈ 72 m)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string; no 跨年煙火 per R13).
 */

import { NM_HAYASHI } from './landmarks/hayashi_dept.js';

/** Taipei 101 game-world position (REAL meters, origin = ball start).
 *  P6a: reuses the legacy goal-monument world anchor; P6b will update to real Xinyi coords. */
export const TAIPEI101_POS = Object.freeze({ x: 749, z: -252 });

/** 台北101 base radius in REAL meters (game feel; scales from the legacy 90 m
 *  monument by real-height ratio 508/634 ≈ 0.80 → 72 m).  */
export const TAIPEI101_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Taipei pack.
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
  /** Build the 101 tower mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_HAYASHI.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: TAIPEI101_POS,
  /** Display name (zh-TW). */
  name: '林百貨',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: TAIPEI101_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW, no 跨年煙火 per R13). */
  winToast: '滾上林百貨頂樓！月牙佮你做伙看府城！',
});

export default goalMonument;
