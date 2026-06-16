/**
 * @file packs/kaohsiung/monument.js — 高雄85大樓 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via kaohsiung/index.js goalMonument field
 *
 * KAOHSIUNG85_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Kaohsiung city map will author a real 苓雅/灣區 anchor later.
 *
 * goal constants retune (85 = 378 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (85 podium ~55 m real, bumped for game feel;
 *                           kept equal to the 101 base for parity)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_KAOHSIUNG85 } from './landmarks/kaohsiung85.js';

/** 高雄85大樓 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor; a later city-map task will
 *  update to real 苓雅/灣區 coords. */
export const KAOHSIUNG85_POS = Object.freeze({ x: 749, z: -252 });

/** 高雄85大樓 base radius in REAL meters (game feel; kept at the 72 m parity
 *  value used by the legacy 101 goal so terrain/collider math is unchanged). */
export const KAOHSIUNG85_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Kaohsiung pack.
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
  /** Build the 85 tower mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_KAOHSIUNG85.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: KAOHSIUNG85_POS,
  /** Display name (zh-TW). */
  name: '高雄85大樓',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: KAOHSIUNG85_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完高雄85大樓！月牙陪你登頂！',
});

export default goalMonument;
