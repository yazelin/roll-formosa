/**
 * @file packs/miaoli/monument.js — 龍騰斷橋 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via miaoli/index.js goalMonument field
 *
 * The 龍騰斷橋 (Longteng Bridge Ruins) is the iconic 1908 Japanese-era red
 * brick railway bridge in 三義鄉, partially collapsed in the 1935 earthquake.
 * It stands as Miaoli's most recognizable heritage landmark and the goal
 * monument for this pack.
 */

import { NM_LONGTENG_BRIDGE } from './landmarks/longteng_bridge.js';

/** Longteng Bridge game-world position (REAL meters, origin = ball start). */
export const LONGTENG_POS = Object.freeze({ x: 749, z: -252 });

/** 龍騰斷橋 base radius in REAL meters (game feel). */
export const LONGTENG_BASE_R_M = 60;

/**
 * Goal monument descriptor for the Miaoli pack.
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
  /** Build the bridge ruin mesh (unit-sphere normalized, <=600 tris). */
  buildGeometry: NM_LONGTENG_BRIDGE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: LONGTENG_POS,
  /** Display name (zh-TW). */
  name: '龍騰斷橋',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 400,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 360,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: LONGTENG_BASE_R_M,
  /** Bear-cheer win toast (zh-TW, Miaoli / Hakka flavor). */
  winToast: '滾過龍騰斷橋！月牙帶你穿越客庄！',
});

export default goalMonument;
