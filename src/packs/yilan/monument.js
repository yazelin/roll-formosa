/**
 * @file packs/yilan/monument.js — 龜山島 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via yilan/index.js goalMonument field
 *
 * GUISHAN_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Yilan city map will author a real 蘭陽/龜山島 anchor later.
 *
 * goal constants retune (龜山島 = ~401 m peak height real):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (island footprint ~2.8 km real, bumped for game feel;
 *                           kept equal to the 101 base for parity)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_GUISHAN } from './landmarks/guishan.js';

/** 龜山島 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor; a later city-map task will
 *  update to real 蘭陽/龜山島 coords. */
export const GUISHAN_POS = Object.freeze({ x: 749, z: -252 });

/** 龜山島 base radius in REAL meters (game feel; kept at the 72 m parity
 *  value used by the legacy 101 goal so terrain/collider math is unchanged). */
export const GUISHAN_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Yilan pack.
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
  /** Build the 龜山島 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_GUISHAN.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: GUISHAN_POS,
  /** Display name (zh-TW). */
  name: '龜山島',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: GUISHAN_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完龜山島！月牙陪你登頂！',
});

export default goalMonument;
