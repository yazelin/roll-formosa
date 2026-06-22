/**
 * @file packs/hualien/monument.js — 太魯閣牌樓 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via hualien/index.js goalMonument field
 *
 * TAROKO_GATE_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Hualien city map will author a real 太魯閣口 anchor later.
 *
 * goal constants retune (牌樓 = ~15 m real vs the legacy 634 m monument):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 72 m   (kept equal to the 101 base for parity)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { NM_TAROKO_GATE } from './landmarks/taroko_gate.js';

/** 太魯閣牌樓 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor; a later city-map task will
 *  update to real 太魯閣口 coords. */
export const TAROKO_GATE_POS = Object.freeze({ x: 749, z: -252 });

/** 太魯閣牌樓 base radius in REAL meters (game feel; kept at the 72 m parity
 *  value used by the legacy 101 goal so terrain/collider math is unchanged). */
export const TAROKO_GATE_BASE_R_M = 72;

/**
 * Goal monument descriptor for the Hualien pack.
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
  /** Build the 太魯閣牌樓 gate mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_TAROKO_GATE.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: TAROKO_GATE_POS,
  /** Display name (zh-TW). */
  name: '太魯閣牌樓',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: TAROKO_GATE_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完太魯閣牌樓！月牙陪你走遍花蓮！',
});

export default goalMonument;
