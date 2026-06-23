/**
 * @file packs/pingtung/monument.js — 鵝鑾鼻燈塔 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via pingtung/index.js goalMonument field
 *
 * ELUANBI_POS uses a position in the south-east quadrant to represent
 * 恆春半島最南端 (southernmost tip of Hengchun Peninsula).
 *
 * goal constants for 鵝鑾鼻燈塔 (21.4m lighthouse, 56m above sea level):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (includes the fortification wall and surrounding park)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_ELUANBI } from './landmarks/eluanbi_lighthouse.js';

/** 鵝鑾鼻燈塔 game-world position (REAL meters, origin = ball start).
 *  Positioned in the south-east to represent 國境之南. */
export const ELUANBI_POS = Object.freeze({ x: 749, z: -252 });

/** 鵝鑾鼻燈塔 base radius in REAL meters (game feel; includes the
 *  fortification wall and surrounding 鵝鑾鼻公園). */
export const ELUANBI_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Pingtung pack.
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
  /** Build the 鵝鑾鼻燈塔 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_ELUANBI.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: ELUANBI_POS,
  /** Display name (zh-TW). */
  name: '鵝鑾鼻燈塔',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: ELUANBI_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾到國境之南！月牙陪你看台灣尾的燈塔！',
});

export default goalMonument;
