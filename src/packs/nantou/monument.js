/**
 * @file packs/nantou/monument.js — 慈恩塔 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via nantou/index.js goalMonument field
 *
 * 慈恩塔 (Ci-En Pagoda) is a 9-story octagonal pagoda ~46 m tall at Sun Moon Lake,
 * built by Chiang Kai-shek in 1971 to commemorate his mother.
 *
 * goal constants (慈恩塔 = 46 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 40 m   (慈恩塔 base ~20 m real, bumped for game feel)
 *
 * winToast (spec §5.3 R13 bear-cheer zh-TW string).
 */

import { NM_CIEN_PAGODA } from './landmarks/cien_pagoda.js';

/** 慈恩塔 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor for now. */
export const NANTOU_GOAL_POS = Object.freeze({ x: 749, z: -252 });

/** Alias for cityMap compatibility. */
export const CIEN_PAGODA_POS = NANTOU_GOAL_POS;

/** 慈恩塔 base radius in REAL meters (game feel; smaller than 101 since pagoda is shorter). */
export const CIEN_PAGODA_BASE_R_M = 40;

/**
 * Goal monument descriptor for the Nantou pack.
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
  /** Build the 慈恩塔 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_CIEN_PAGODA.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: NANTOU_GOAL_POS,
  /** Display name (zh-TW). */
  name: '慈恩塔',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: CIEN_PAGODA_BASE_R_M,
  /** Bear-cheer win toast (spec §5.3, R13; zh-TW). */
  winToast: '滾完日月潭慈恩塔！月牙陪你登高望遠！',
});

export default goalMonument;
