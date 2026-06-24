/**
 * @file packs/kinmen/monument.js — 莒光樓 goal monument descriptor.
 *
 * Exposes the goalMonument shape consumed by:
 *   - render/goalTower.js (GoalTowerView) — buildGeometry + pos
 *   - world/terrain.js   — pos + baseRadiusM (permanent base collider)
 *   - game/finale.js     — pos + winToast
 *   - activePack         — via kinmen/index.js goalMonument field
 *
 * JUGUANG_TOWER_POS reuses the legacy goal-monument world position (749, -252)
 * so all existing finale/terrain math continues to work without a city-map
 * rewrite; the Kinmen city map will author a real 金城 anchor later.
 *
 * goal constants (莒光樓 = 17.4 m real, iconic Kinmen landmark):
 *   goalRadiusM  = 420 m  (same GOAL_RADIUS_M — dramatic approach unchanged)
 *   baseRadiusM  = 40 m   (17.4m tower, bumped for game feel)
 *
 * winToast (bear-cheer zh-TW string).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from './geomHelpers.js';

/** 莒光樓 game-world position (REAL meters, origin = ball start).
 *  Reuses the legacy goal-monument world anchor. */
export const JUGUANG_TOWER_POS = Object.freeze({ x: 749, z: -252 });

/** 莒光樓 base radius in REAL meters (game feel). */
export const JUGUANG_TOWER_BASE_R_M = 40;

// Colors for the Juguang Tower
const ROOF_RED = 0xc41e3a;      // Traditional Chinese red roof
const ROOF_DARK = 0x8b1a2a;     // Darker roof tiles
const WALL_CREAM = 0xf5e6c8;    // Cream-colored walls
const WALL_ACCENT = 0xe8d4b0;
const PILLAR_RED = 0xb81c1c;    // Red pillars
const BASE_GREY = 0x6a6a6a;     // Stone base
const BASE_DARK = 0x4a4a4a;
const WINDOW_DARK = 0x2a2a2a;
const GOLD = 0xdaa520;          // Gold accents

/**
 * Build the 莒光樓 (Juguang Tower) geometry.
 * 17.4m tall traditional Chinese palace-style building, iconic Kinmen landmark.
 * Three-story pagoda structure with upturned eaves and red pillars.
 * @param {() => number} rng
 * @returns {import('three').BufferGeometry}
 */
function buildJuguangTowerGeometry(rng) {
  const parts = [];

  // ---- PLATFORM BASE: raised stone foundation ----
  parts.push(box(1.8, 0.25, 1.5, BASE_GREY, { y: 0.125, hex2: BASE_DARK }));
  parts.push(box(1.6, 0.1, 1.3, BASE_DARK, { y: 0.3 }));
  // Steps at front
  parts.push(box(0.6, 0.08, 0.2, BASE_GREY, { y: 0.04, z: 0.8 }));
  parts.push(box(0.5, 0.08, 0.15, BASE_GREY, { y: 0.12, z: 0.72 }));

  // ---- FIRST FLOOR: main hall ----
  // Walls
  parts.push(box(1.4, 0.7, 1.1, WALL_CREAM, { y: 0.7, hex2: WALL_ACCENT }));
  // Red pillars at corners
  const pillarR = 0.06;
  const pillarH = 0.75;
  parts.push(cyl(pillarR, pillarR, pillarH, 6, PILLAR_RED, { x: -0.65, z: 0.5, y: 0.72 }));
  parts.push(cyl(pillarR, pillarR, pillarH, 6, PILLAR_RED, { x: 0.65, z: 0.5, y: 0.72 }));
  parts.push(cyl(pillarR, pillarR, pillarH, 6, PILLAR_RED, { x: -0.65, z: -0.5, y: 0.72 }));
  parts.push(cyl(pillarR, pillarR, pillarH, 6, PILLAR_RED, { x: 0.65, z: -0.5, y: 0.72 }));
  // Windows/doors
  parts.push(box(0.25, 0.4, 0.05, WINDOW_DARK, { y: 0.7, z: 0.56 }));

  // ---- FIRST FLOOR ROOF: upturned eaves ----
  // Main roof body
  parts.push(box(1.7, 0.12, 1.4, ROOF_RED, { y: 1.15, hex2: ROOF_DARK }));
  // Eaves overhang (simplified upturned corners)
  parts.push(box(1.8, 0.08, 0.15, ROOF_RED, { y: 1.18, z: 0.72 }));
  parts.push(box(1.8, 0.08, 0.15, ROOF_RED, { y: 1.18, z: -0.72 }));
  parts.push(box(0.15, 0.08, 1.5, ROOF_RED, { y: 1.18, x: 0.85 }));
  parts.push(box(0.15, 0.08, 1.5, ROOF_RED, { y: 1.18, x: -0.85 }));

  // ---- SECOND FLOOR: upper hall (smaller) ----
  parts.push(box(1.1, 0.55, 0.9, WALL_CREAM, { y: 1.5, hex2: WALL_ACCENT }));
  // Pillars
  parts.push(cyl(pillarR * 0.9, pillarR * 0.9, 0.6, 6, PILLAR_RED, { x: -0.52, z: 0.42, y: 1.52 }));
  parts.push(cyl(pillarR * 0.9, pillarR * 0.9, 0.6, 6, PILLAR_RED, { x: 0.52, z: 0.42, y: 1.52 }));
  parts.push(cyl(pillarR * 0.9, pillarR * 0.9, 0.6, 6, PILLAR_RED, { x: -0.52, z: -0.42, y: 1.52 }));
  parts.push(cyl(pillarR * 0.9, pillarR * 0.9, 0.6, 6, PILLAR_RED, { x: 0.52, z: -0.42, y: 1.52 }));
  // Window
  parts.push(box(0.18, 0.28, 0.05, WINDOW_DARK, { y: 1.5, z: 0.46 }));

  // ---- SECOND FLOOR ROOF ----
  parts.push(box(1.35, 0.1, 1.15, ROOF_RED, { y: 1.85, hex2: ROOF_DARK }));
  parts.push(box(1.45, 0.06, 0.12, ROOF_RED, { y: 1.88, z: 0.58 }));
  parts.push(box(1.45, 0.06, 0.12, ROOF_RED, { y: 1.88, z: -0.58 }));

  // ---- THIRD FLOOR / PAVILION TOP ----
  parts.push(box(0.8, 0.4, 0.65, WALL_CREAM, { y: 2.15, hex2: WALL_ACCENT }));
  // Mini pillars
  parts.push(cyl(0.04, 0.04, 0.45, 5, PILLAR_RED, { x: -0.38, z: 0.3, y: 2.15 }));
  parts.push(cyl(0.04, 0.04, 0.45, 5, PILLAR_RED, { x: 0.38, z: 0.3, y: 2.15 }));

  // ---- TOP ROOF: main pagoda roof ----
  // Pyramidal roof shape
  parts.push(box(1.0, 0.08, 0.85, ROOF_RED, { y: 2.42, hex2: ROOF_DARK }));
  parts.push(cone(0.6, 0.35, 4, ROOF_RED, { y: 2.6, ry: PI / 4, hex2: ROOF_DARK }));

  // ---- FINIAL: roof ornament ----
  parts.push(cyl(0.04, 0.03, 0.15, 6, GOLD, { y: 2.85 }));
  parts.push(sph(0.05, GOLD, { ws: 5, hs: 4, y: 2.95 }));

  // ---- "莒光樓" plaque above entrance ----
  parts.push(box(0.35, 0.12, 0.02, GOLD, { y: 0.95, z: 0.57 }));

  return finish(parts);
}

/** Kinmen landmark descriptor for the goal tower. */
export const NM_JUGUANG_TOWER = {
  id: 'juguang_tower',
  name: '莒光樓',
  landmarkId: 8, // goal landmark
  dioramaRHint: 420, // goal-sized
  colorHex: ROOF_RED, // iconic red roof color
  buildGeometry: buildJuguangTowerGeometry,
};

/**
 * Goal monument descriptor for the Kinmen pack.
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
  /** Build the Juguang Tower mesh (unit-sphere normalized, ≤600 tris). */
  buildGeometry: NM_JUGUANG_TOWER.buildGeometry,
  /** Fixed real-meter world position (origin = ball start). */
  pos: JUGUANG_TOWER_POS,
  /** Display name (zh-TW). */
  name: '莒光樓',
  /** GOAL_RADIUS_M equivalent — approach arms at this trueRadius (m). */
  goalRadiusM: 420,
  /** GOAL_CALL_RADIUS_M equivalent — CALLED toast fires at this trueRadius (m). */
  callRadiusM: 380,
  /** Permanent base circle collider radius (REAL meters). */
  baseRadiusM: JUGUANG_TOWER_BASE_R_M,
  /** Bear-cheer win toast (zh-TW). */
  winToast: '滾完莒光樓！月牙陪你守護金門！',
});

export default goalMonument;
