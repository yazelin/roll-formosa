/**
 * @file packs/hsinchu/landmarks/seventeen_km.js — Roll Formosa Hsinchu pack.
 *
 * 十七公里海岸風車 (17km Coastal Scenic Area Wind Turbine). The 17-kilometer
 * coastal scenic bikeway along Hsinchu's coast features distinctive wind turbines
 * as landmarks. These wind power installations represent Hsinchu's notorious
 * strong winds (the "Hsinchu wind" is famous throughout Taiwan) and the area's
 * commitment to renewable energy. The coastal area includes observation decks
 * and recreational facilities.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — coastal wind energy installation.
const TOWER = 0xf0f0f0;      // white turbine tower
const TOWER_D = 0xd8d8d8;    // tower shadow
const BLADE = 0xf8f8f8;      // white turbine blades
const HUB = 0xe8e8e8;        // turbine hub/nacelle
const NACELLE = 0xe0e0e0;    // nacelle body
const DECK = 0xb8a898;       // wooden observation deck
const DECK_D = 0x988878;     // deck shadow
const RAIL = 0x707880;       // metal railings
const SAND = 0xe8dcc8;       // beach sand
const WATER = 0x4080a0;      // ocean water
const WATER_D = 0x306080;    // deeper water
const GRASS = 0x88a870;      // coastal grass
const PATH = 0xc0b8a8;       // bikeway path

export const NM_SEVENTEEN_KM = {
  id: 'coastal_wind_turbine',
  name: '十七公里海岸風車',
  landmarkId: 16,
  dioramaRHint: 150,
  colorHex: 0xf0f0f0, // white — the iconic wind turbine color

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Coastal landscape base -------------------------------------------
    // Ocean
    parts.push(box(2.4, 0.06, 0.8, WATER_D, { y: 0.03, z: -0.9, hex2: WATER }));
    // Beach sand
    parts.push(box(2.4, 0.05, 0.5, SAND, { y: 0.04, z: -0.4 }));
    // Coastal grass area
    parts.push(box(2.4, 0.04, 1.2, GRASS, { y: 0.035, z: 0.5 }));
    // Bikeway path
    parts.push(box(2.2, 0.02, 0.2, PATH, { y: 0.06, z: 0.2 }));

    // ---- 2) Main wind turbine (the hero element) -----------------------------
    const turbineX = 0;
    const turbineY = 0.06;
    const towerH = 1.2;

    // Foundation base (reduced segments)
    parts.push(cyl(0.18, 0.22, 0.1, 6, TOWER_D, {
      x: turbineX, y: turbineY + 0.05, z: -0.2
    }));

    // Tapered tower (reduced segments)
    parts.push(cyl(0.06, 0.14, towerH, 6, TOWER_D, {
      x: turbineX, y: turbineY + 0.1 + towerH * 0.5, z: -0.2, hex2: TOWER
    }));

    // Nacelle (the generator housing at top)
    const nacelleY = turbineY + 0.1 + towerH;
    parts.push(box(0.25, 0.1, 0.12, NACELLE, {
      x: turbineX - 0.02, y: nacelleY + 0.05, z: -0.2
    }));

    // Hub (center of blades, reduced segments)
    parts.push(cyl(0.06, 0.05, 0.1, 5, HUB, {
      x: turbineX + 0.1, y: nacelleY + 0.05, z: -0.2, rz: HALF_PI
    }));

    // ---- 3) Turbine blades (3 blades at 120-degree intervals) ----------------
    const bladeLen = 0.7;
    const hubX = turbineX + 0.15;
    const hubY = nacelleY + 0.05;
    const hubZ = -0.2;

    for (let i = 0; i < 3; i++) {
      const angle = (i * PI * 2) / 3 + 0.2; // slight rotation for dynamic feel
      const bx = Math.cos(angle) * bladeLen * 0.5;
      const by = Math.sin(angle) * bladeLen * 0.5;

      // Each blade is a tapered box
      parts.push(box(0.05, bladeLen, 0.03, BLADE, {
        x: hubX,
        y: hubY + by,
        z: hubZ + bx,
        rx: angle,
        ry: 0.1, // slight pitch
      }));
    }

    // ---- 4) Second smaller turbine in background -----------------------------
    const turb2X = 0.75;
    const turb2Z = -0.35;
    const turb2H = 0.8;
    const turb2Y = turbineY;

    parts.push(cyl(0.1, 0.14, 0.06, 6, TOWER_D, {
      x: turb2X, y: turb2Y + 0.03, z: turb2Z
    }));
    parts.push(cyl(0.04, 0.09, turb2H, 6, TOWER_D, {
      x: turb2X, y: turb2Y + 0.06 + turb2H * 0.5, z: turb2Z, hex2: TOWER
    }));
    // Nacelle
    parts.push(box(0.16, 0.07, 0.08, NACELLE, {
      x: turb2X, y: turb2Y + 0.06 + turb2H + 0.035, z: turb2Z
    }));
    // Simplified blades
    for (let i = 0; i < 3; i++) {
      const angle = (i * PI * 2) / 3;
      parts.push(box(0.03, 0.45, 0.02, BLADE, {
        x: turb2X + 0.1,
        y: turb2Y + 0.06 + turb2H + 0.035 + Math.sin(angle) * 0.22,
        z: turb2Z + Math.cos(angle) * 0.22,
        rx: angle,
      }));
    }

    // ---- 5) Observation deck -------------------------------------------------
    const deckX = -0.65;
    const deckY = turbineY;
    const deckZ = 0.0;

    // Deck platform
    parts.push(box(0.55, 0.05, 0.45, DECK_D, {
      x: deckX, y: deckY + 0.15, z: deckZ, hex2: DECK
    }));

    // Support posts
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cyl(0.025, 0.03, 0.12, 5, RAIL, {
          x: deckX + sx * 0.22, y: deckY + 0.08, z: deckZ + sz * 0.18
        }));
      }
    }

    // Railings
    parts.push(box(0.55, 0.02, 0.02, RAIL, { x: deckX, y: deckY + 0.26, z: deckZ + 0.21 }));
    parts.push(box(0.55, 0.02, 0.02, RAIL, { x: deckX, y: deckY + 0.26, z: deckZ - 0.21 }));
    parts.push(box(0.02, 0.02, 0.42, RAIL, { x: deckX + 0.265, y: deckY + 0.26, z: deckZ }));

    // Railing posts
    for (let i = 0; i < 3; i++) {
      parts.push(cyl(0.015, 0.015, 0.1, 4, RAIL, {
        x: deckX - 0.22 + i * 0.22, y: deckY + 0.22, z: deckZ + 0.21
      }));
    }

    // ---- 6) Information sign -------------------------------------------------
    parts.push(cyl(0.02, 0.025, 0.25, 5, RAIL, {
      x: -0.35, y: deckY + 0.125, z: 0.35
    }));
    parts.push(box(0.18, 0.12, 0.02, 0x3060a0, {
      x: -0.35, y: deckY + 0.3, z: 0.36
    }));

    // ---- 7) Beach elements ---------------------------------------------------
    // Small dune
    parts.push(sph(0.15, SAND, { ws: 5, hs: 3, x: 0.5, y: 0.06, z: -0.35, sy: 0.4 }));

    // Wave break markers
    for (let i = 0; i < 3; i++) {
      parts.push(cyl(0.02, 0.02, 0.12, 4, 0x8a7a68, {
        x: -0.6 + i * 0.4, y: 0.08, z: -0.55
      }));
    }

    // ---- 8) Coastal vegetation -----------------------------------------------
    for (const pos of [[-0.9, 0.6], [0.95, 0.55], [-0.5, 0.7]]) {
      parts.push(sph(0.08, 0x6a8a58, {
        ws: 4, hs: 3, x: pos[0], y: 0.1, z: pos[1], sy: 0.7
      }));
    }

    return finish(parts);
  },
};

export default NM_SEVENTEEN_KM;
