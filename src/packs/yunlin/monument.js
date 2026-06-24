/**
 * @file packs/yunlin/monument.js — 西螺大橋 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via yunlin/index.js goalMonument field
 *
 * YUNLIN_GOAL_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; a real 西螺 coordinate can be authored later.
 *
 * goal constants (西螺大橋 ~1939 m real length, but we represent a section):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 60 m   (bridge section base, game feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_XILUO_BRIDGE } from './landmarks/xiluo_bridge.js';

/** 西螺大橋 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor for now. */
export const YUNLIN_GOAL_POS = Object.freeze({ x: 749, z: -252 });

/** Alias for cityMap.js compatibility. */
export const XILUO_BRIDGE_POS = YUNLIN_GOAL_POS;

/** Alias for cityMap.js (standard name). */
export const GOAL_MONUMENT_POS = YUNLIN_GOAL_POS;

/** 西螺大橋 base radius in REAL meters (game feel). */
export const YUNLIN_GOAL_BASE_R_M = 60;

/**
 * Goal monument descriptor for the Yunlin pack.
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
  /** Build the 西螺大橋 bridge mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_XILUO_BRIDGE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: YUNLIN_GOAL_POS,
  /** Display name (zh-TW). */
  name: '西螺大橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: YUNLIN_GOAL_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完西螺大橋！月牙陪你過橋賞稻浪！',
});

export default goalMonument;
