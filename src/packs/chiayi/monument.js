/**
 * @file packs/chiayi/monument.js — 射日塔 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via chiayi/index.js goalMonument field
 *
 * CHIAYI_GOAL_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; a real 嘉義公園 coordinate can be authored later.
 *
 * goal constants (射日塔 = ~62 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 45 m   (射日塔 base ~25 m real, bumped for game feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_SUN_SHOOTING_TOWER } from './landmarks/sun_shooting_tower.js';

/** 射日塔 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor for now. */
export const CHIAYI_GOAL_POS = Object.freeze({ x: 749, z: -252 });

/** Alias for cityMap.js compatibility. */
export const SUN_SHOOTING_TOWER_POS = CHIAYI_GOAL_POS;

/** 射日塔 base radius in REAL meters (game feel; smaller than 101/85). */
export const CHIAYI_GOAL_BASE_R_M = 45;

/**
 * Goal monument descriptor for the Chiayi pack.
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
  /** Build the 射日塔 tower mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_SUN_SHOOTING_TOWER.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: CHIAYI_GOAL_POS,
  /** Display name (zh-TW). */
  name: '射日塔',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: CHIAYI_GOAL_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完嘉義射日塔！月牙陪你射日登頂！',
});

export default goalMonument;
