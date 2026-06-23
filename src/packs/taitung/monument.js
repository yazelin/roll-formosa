/**
 * @file packs/taitung/monument.js — Sanxiantai Bridge goal monument descriptor (P6a).
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via taitung/index.js goalMonument field
 *
 * SANXIANTAI_POS uses a goal-monument world position suitable for Taitung.
 *
 * goal constants (三仙台 = ~320 m total bridge span real):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (scaled for game feel)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_SANXIANTAI } from './landmarks/sanxiantai_bridge.js';

/** Sanxiantai game-world position (REAL meters, origin = ball start).
 *  P6a: uses a suitable world anchor for Taitung's east coast geography. */
export const SANXIANTAI_POS = Object.freeze({ x: 749, z: -252 });

/** 三仙台 base radius in REAL meters (game feel).  */
export const SANXIANTAI_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Taitung pack.
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
  /** Build the Sanxiantai bridge mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_SANXIANTAI.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: SANXIANTAI_POS,
  /** Display name (zh-TW). */
  name: '三仙台八拱橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: SANXIANTAI_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾上三仙台！太平洋的風吹來，你已經征服東海岸！',
});

export default goalMonument;
