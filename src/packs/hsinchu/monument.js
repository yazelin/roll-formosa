/**
 * @file packs/hsinchu/monument.js — 新竹城隍廟 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via hsinchu/index.js goalMonument field
 *
 * CHENGHUANG_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Hsinchu city map will author a real 北門街 anchor later.
 *
 * goal constants retune (City God Temple is a wide temple complex, not a tower):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 65 m   (temple complex ~45 m real footprint, bumped for game feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_CHENGHUANG_TEMPLE } from './landmarks/chenghuang_temple.js';

/** 新竹城隍廟 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor; a later city-map task will
 *  update to real 北門街 coords. */
export const CHENGHUANG_POS = Object.freeze({ x: 749, z: -252 });

/** Alias for backward compatibility with cityMap.js (which still uses Taipei template).
 *  TODO: update cityMap.js to use CHENGHUANG_POS directly, then remove this alias. */
export const TAIPEI101_POS = CHENGHUANG_POS;

/** 新竹城隍廟 base radius in REAL meters (game feel; temple complex footprint
 *  is ~45 m, bumped to 65 m for game feel and to match legacy collider math). */
export const CHENGHUANG_BASE_R_M = 65;

/**
 * Goal monument descriptor for the Hsinchu pack.
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
  /** Build the City God Temple mesh (unit-sphere normalized, <=600 tris). */
  buildGeometry: NM_CHENGHUANG_TEMPLE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: CHENGHUANG_POS,
  /** Display name (zh-TW). */
  name: '新竹城隍廟',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: CHENGHUANG_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完新竹城隍廟！月牙陪你參拜！',
});

export default goalMonument;
