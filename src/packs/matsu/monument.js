/**
 * @file packs/matsu/monument.js — 媽祖巨神像 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via matsu/index.js goalMonument field
 *
 * MAZU_GODDESS_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Matsu city map will author a real 南竿 anchor later.
 *
 * goal constants (媽祖巨神像 = 29.6 m real, the tallest goddess statue in the world):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 50 m   (29.6m statue, bumped for game feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from './geomHelpers.js';

/** 媽祖巨神像 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor. */
export const MAZU_GODDESS_POS = Object.freeze({ x: 749, z: -252 });

/** 媽祖巨神像 base radius in REAL meters (game feel). */
export const MAZU_GODDESS_BASE_R_M = 50;

// Colors for the Mazu Goddess statue
const ROBE_MAIN = 0xd4a574;    // Golden/tan robe
const ROBE_ACCENT = 0xc41e3a; // Red accents
const FACE = 0xf5deb3;        // Skin tone
const CROWN = 0xffd700;       // Golden crown
const PEDESTAL = 0x808080;    // Grey stone pedestal
const PEDESTAL_DARK = 0x606060;

/**
 * Build the 媽祖巨神像 (Mazu Goddess Statue) geometry.
 * 29.6m tall goddess statue - the tallest Mazu statue in the world.
 * Standing figure with flowing robes, crown, and outstretched blessing pose.
 * @param {() => number} rng
 * @returns {import('three').BufferGeometry}
 */
function buildMazuGoddessGeometry(rng) {
  const parts = [];

  // ---- PEDESTAL: octagonal stone base ----
  parts.push(cyl(1.2, 1.4, 0.8, 8, PEDESTAL, { y: 0.4, hex2: PEDESTAL_DARK }));
  parts.push(cyl(1.0, 1.2, 0.3, 8, PEDESTAL_DARK, { y: 0.95 }));

  // ---- FIGURE: standing Mazu goddess ----
  // Lower robe (wide flowing skirt)
  parts.push(cyl(0.9, 0.5, 2.2, 8, ROBE_MAIN, { y: 2.2, hex2: ROBE_ACCENT }));

  // Robe details - flowing layers
  parts.push(cyl(0.95, 0.55, 0.4, 8, ROBE_ACCENT, { y: 1.5 }));
  parts.push(cyl(0.85, 0.52, 0.3, 8, ROBE_ACCENT, { y: 2.8 }));

  // Upper body / torso
  parts.push(cyl(0.5, 0.4, 1.2, 8, ROBE_MAIN, { y: 3.9 }));

  // Arms extended in blessing pose
  // Left arm
  parts.push(cyl(0.12, 0.1, 0.9, 6, ROBE_MAIN, { x: -0.5, y: 4.0, rz: 0.6 }));
  parts.push(sph(0.12, FACE, { ws: 6, hs: 4, x: -0.95, y: 4.35 })); // hand

  // Right arm
  parts.push(cyl(0.12, 0.1, 0.9, 6, ROBE_MAIN, { x: 0.5, y: 4.0, rz: -0.6 }));
  parts.push(sph(0.12, FACE, { ws: 6, hs: 4, x: 0.95, y: 4.35 })); // hand

  // Neck
  parts.push(cyl(0.15, 0.14, 0.25, 8, FACE, { y: 4.6 }));

  // Head
  parts.push(sph(0.35, FACE, { ws: 8, hs: 6, y: 5.0 }));

  // Crown / headdress (elaborate imperial style)
  parts.push(cyl(0.38, 0.3, 0.3, 8, CROWN, { y: 5.35 }));
  parts.push(box(0.5, 0.4, 0.1, CROWN, { y: 5.6 })); // crown front panel
  parts.push(cyl(0.25, 0.15, 0.3, 6, CROWN, { y: 5.75 })); // crown top

  // Crown dangles (traditional Mazu headdress with hanging beads)
  parts.push(cyl(0.04, 0.03, 0.35, 4, CROWN, { x: -0.35, y: 5.2 }));
  parts.push(cyl(0.04, 0.03, 0.35, 4, CROWN, { x: 0.35, y: 5.2 }));

  // Halo / nimbus behind head (circular disc)
  parts.push(cyl(0.6, 0.6, 0.05, 12, CROWN, { y: 5.0, z: -0.25, rx: HALF_PI * 0.1 }));

  return finish(parts);
}

/** Matsu landmark descriptor for the goal statue. */
export const NM_MAZU_GODDESS = {
  id: 'mazu_goddess',
  name: '媽祖巨神像',
  landmarkId: 8, // goal landmark
  dioramaRHint: 420, // goal-sized
  colorHex: 0xd4a574, // golden robe color
  buildGeometry: buildMazuGoddessGeometry,
};

/**
 * Goal monument descriptor for the Matsu pack.
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
  /** Build the Mazu Goddess statue mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_MAZU_GODDESS.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: MAZU_GODDESS_POS,
  /** Display name (zh-TW). */
  name: '媽祖巨神像',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: MAZU_GODDESS_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完媽祖巨神像！月牙陪你朝聖！',
});

export default goalMonument;
