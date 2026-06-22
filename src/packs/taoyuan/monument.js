/**
 * @file packs/taoyuan/monument.js — 大溪老街牌樓 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via taoyuan/index.js goalMonument field
 *
 * DAXI_PAILOU_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Taoyuan city map will author a real 大溪老街 anchor later.
 *
 * goal constants retune (大溪牌樓 = 18 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (kept equal to other packs for game-feel parity)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_DAXI_PAILOU } from './landmarks/daxi_pailou.js';

/** 大溪老街牌樓 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor; a later city-map task will
 *  update to real 大溪老街 coords. */
export const DAXI_PAILOU_POS = Object.freeze({ x: 749, z: -252 });

/** 大溪老街牌樓 base radius in REAL meters (game feel; kept at the 72 m parity
 *  value used by other city packs so terrain/collider math is unchanged). */
export const DAXI_PAILOU_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Taoyuan pack.
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
  /** Build the 大溪牌樓 mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_DAXI_PAILOU.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: DAXI_PAILOU_POS,
  /** Display name (zh-TW). */
  name: '大溪老街牌樓',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: DAXI_PAILOU_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完大溪老街牌樓！月牙陪你穿過這道門！',
});

export default goalMonument;
