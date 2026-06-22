/**
 * @file packs/tainan/landmarks/chimei_museum.js — Roll Formosa Tainan pack, hero LANDMARK.
 *
 * NM_CHIMEI — 奇美博物館 (Chimei Museum). A grand neoclassical museum: a long
 * symmetric white-marble building with a CENTRAL domed rotunda fronted by a
 * triangular PEDIMENT carried on a colonnade of tall columns, two long
 * symmetric wings — and, IN FRONT, the circular Apollo fountain (a low round
 * pool with a central sculpture column and small water jets).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (wide symmetric hall, central
 * dome, fountain in the forecourt) carry the read. White/cream marble.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const MARBLE = 0xe8e4da; // white/cream marble wall
const MARBLE_HI = 0xf4f1e9; // sunlit marble
const MARBLE_SH = 0xcdc8bc; // marble base shadow
const DOME = 0xb9c2c6; // grey-green dome lead
const DOME_HI = 0xd6dcdd; // dome highlight
const GOLD = 0xc9aa52; // dome finial
const WIN = 0x44525c; // dark window glass
const WATER = 0x6fb4c4; // fountain pool water
const WATER_HI = 0xa6dceb; // jet / spray highlight

export const NM_CHIMEI = {
  id: 'chimei_museum',
  name: '奇美博物館',
  landmarkId: 7,
  dioramaRHint: 60, // long symmetric neoclassical hall + forecourt fountain
  colorHex: MARBLE,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01; // micro jitter, never structural
    const parts = [];

    /* ---- long symmetric marble building base --------------------------- */
    // Broad podium step the whole building stands on.
    parts.push(box(5.4, 0.3, 2.0, MARBLE_SH, { y: 0.15, z: -0.3 }));
    // Two long symmetric wings.
    for (const wx of [-1.9, 1.9]) {
      parts.push(box(1.7, 1.2, 1.6, MARBLE, { x: wx, y: 0.9, z: -0.3, hex2: MARBLE_HI })); // wing mass
      // A long window band across each wing front (one slab reads as the colonnade glazing).
      parts.push(box(1.3, 0.72, 0.06, WIN, { x: wx, y: 0.98, z: 0.51 }));
      // Cornice cap on the wing.
      parts.push(box(1.78, 0.12, 1.68, MARBLE_HI, { x: wx, y: 1.56, z: -0.3 }));
    }

    /* ---- central rotunda block (taller, projecting forward) ------------ */
    parts.push(box(2.0, 1.55, 1.8, MARBLE, { y: 0.78, z: 0.1, hex2: MARBLE_HI })); // central mass
    parts.push(box(2.08, 0.14, 1.88, MARBLE_HI, { y: 1.6, z: 0.1 })); // central cornice

    /* ---- colonnade of tall columns across the central portico --------- */
    for (const px of [-0.7, -0.23, 0.23, 0.7]) {
      parts.push(cyl(0.1, 0.11, 1.5, 6, MARBLE_HI, { x: px, y: 0.78, z: 0.95 })); // column shaft
      parts.push(box(0.26, 0.1, 0.18, MARBLE_HI, { x: px, y: 1.58, z: 0.95 })); // capital
    }
    // Entablature beam over the colonnade.
    parts.push(box(1.9, 0.18, 0.22, MARBLE_HI, { y: 1.7, z: 0.95 }));

    /* ---- triangular pediment over the portico -------------------------- */
    // A wide flat triangular gable (cone seg=3, scaled flat in depth).
    parts.push(cone(1.05, 0.55, 3, MARBLE, { y: 2.05, z: 0.92, sz: 0.18, ry: PI / 2, hex2: MARBLE_HI }));

    /* ---- central domed rotunda over the building ----------------------- */
    const dy = 1.74;
    parts.push(cyl(0.85, 0.92, 0.5, 8, MARBLE, { y: dy + 0.25, z: 0.1, hex2: MARBLE_HI })); // drum
    // Hemispherical dome.
    parts.push(sph(0.9, DOME, { ws: 8, hs: 4, thetaLen: HALF_PI, y: dy + 0.5, z: 0.1, hex2: DOME_HI }));
    parts.push(torus(0.62, 0.04, 3, 5, DOME_HI, { rx: HALF_PI, y: dy + 0.95, z: 0.1 })); // mid rib ring
    // Lantern + finial at the apex.
    parts.push(cyl(0.18, 0.2, 0.22, 6, MARBLE_HI, { y: dy + 1.18, z: 0.1 }));
    parts.push(cone(0.18, 0.22, 6, DOME, { y: dy + 1.4, z: 0.1, hex2: DOME_HI }));
    parts.push(sph(0.06, GOLD, { ws: 5, hs: 3, y: dy + 1.58 + j, z: 0.1 }));

    /* ---- Apollo fountain in the front forecourt ------------------------ */
    const fz = 2.7; // fountain sits well in front of the building
    parts.push(cyl(1.0, 1.05, 0.18, 9, MARBLE_HI, { y: 0.09, z: fz })); // pool rim wall
    parts.push(cyl(0.92, 0.92, 0.1, 9, WATER, { y: 0.12, z: fz, hex2: WATER_HI })); // pool water surface
    // Central sculpture column / pedestal.
    parts.push(cyl(0.16, 0.2, 0.5, 6, MARBLE_HI, { y: 0.35, z: fz }));
    parts.push(sph(0.14, MARBLE, { ws: 5, hs: 3, y: 0.65, z: fz, hex2: MARBLE_HI })); // sculpture cap
    // A central water jet rising from the sculpture.
    parts.push(cyl(0.02, 0.03, 0.55, 4, WATER_HI, { y: 0.78, z: fz }));

    return finish(parts);
  },
};

export default NM_CHIMEI;
