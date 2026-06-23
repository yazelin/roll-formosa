/**
 * @file packs/taipei/landmarks/presidential.js — Roll Formosa hero landmark.
 *
 * 總統府 (Presidential Office Building). Japanese-era Tatsuno-style Baroque
 * government palace: a long, symmetric RED BRICK facade striped with WHITE
 * horizontal stone banding (the Tatsuno "blood-and-bandage" look), stepped
 * end- and centre-pavilions, and a TALL central clock/tower rising high above
 * the middle of the wing — the building's defining vertical accent.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * proportions (wide+low wings, one tall tower) carry the silhouette. The whole
 * model fits well under the 600-triangle hero budget.
 *
 * Palette: red brick + white stone bands, grey-green roof, gold clock face.
 */

import { box, cyl, cone, finish } from '../geomHelpers.js';

// Shared hexes for a coherent red-and-white read.
const BRICK = 0xb1413a; // weathered red brick
const BRICK2 = 0x9a3530; // darker brick (lower courses / gradient base)
const STONE = 0xeae3d6; // off-white stone band / pilaster
const ROOF = 0x6f7b6a; // grey-green tiled / copper-patina roof
const ROOF2 = 0x5d6859; // roof shadow
const GOLD = 0xd9b24a; // clock face

/**
 * One facade wing block: a red-brick mass wrapped in alternating white stone
 * banding (stacked thin slabs that slightly overhang the brick) and capped by
 * a low hipped roof. Returns an array of part geometries to be spread in.
 * @param {number} cx centre X @param {number} w width @param {number} h height
 * @param {number} d depth @param {number} bands number of white bands
 * @param {boolean} roof add a hipped roof cap
 */
function wing(cx, w, h, d, bands, roof) {
  const parts = [
    // red-brick core, white base course baked as a vertical gradient bottom.
    box(w, h, d, STONE, { x: cx, y: h / 2, hex2: BRICK }),
  ];
  // white horizontal stone bands wrapping the brick, evenly stacked.
  for (let i = 0; i < bands; i++) {
    const by = (h * (i + 0.7)) / (bands + 1);
    parts.push(box(w + 0.04, h / (bands * 3.6), d + 0.04, STONE, { x: cx, y: by }));
  }
  // crowning white cornice.
  parts.push(box(w + 0.08, 0.12, d + 0.08, STONE, { x: cx, y: h - 0.01 }));
  if (roof) {
    // low hipped grey-green roof (single tapered cap).
    parts.push(box(w * 0.82, 0.24, d * 0.66, ROOF, { x: cx, y: h + 0.18, hex2: ROOF2 }));
  }
  return parts;
}

export const NM_PRESIDENTIAL = {
  id: 'presidential_office',
  name: '總統府',
  landmarkId: 4,
  dioramaRHint: 140, // ~140 m across the symmetric facade frontage
  colorHex: BRICK,
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01; // micro jitter, never structural
    const parts = [];

    // ---- symmetric long facade: end pavilions + connecting wings + centre ----
    // wing(cx, w, h, d, bands, roof)
    // Left end pavilion (taller, projecting).
    parts.push(...wing(-2.35, 0.95, 1.55, 1.0, 3, true));
    // Left connecting wing (lower, longer, set back in depth).
    parts.push(...wing(-1.35, 1.15, 1.15, 0.82, 2, true));
    // Centre pavilion block (under the tower) — slightly forward & taller.
    parts.push(...wing(0.0, 1.5, 1.75, 1.15, 4, true));
    // Right connecting wing.
    parts.push(...wing(1.35, 1.15, 1.15, 0.82, 2, true));
    // Right end pavilion.
    parts.push(...wing(2.35, 0.95, 1.55, 1.0, 3, true));

    // ---- central arched entrance porch (forecourt face) ----
    parts.push(box(0.9, 0.85, 0.22, STONE, { x: 0, y: 0.42, z: 0.62 })); // white portico mass
    parts.push(box(0.62, 0.6, 0.3, BRICK2, { x: 0, y: 0.34, z: 0.66 })); // recessed brick entry
    // white pilasters flanking the portico
    parts.push(box(0.1, 0.78, 0.1, STONE, { x: -0.34, y: 0.44, z: 0.74 }));
    parts.push(box(0.1, 0.78, 0.1, STONE, { x: 0.34, y: 0.44, z: 0.74 }));

    // ---- TALL central clock tower rising above the centre pavilion ----
    const towerBaseY = 1.9; // sits atop the centre pavilion + its roof
    // Tower shaft: red brick with stacked white bands (matches facade rhythm).
    parts.push(box(0.78, 2.6, 0.78, BRICK, { x: 0, y: towerBaseY + 1.3 }));
    for (let i = 0; i < 4; i++) {
      const ty = towerBaseY + (2.6 * (i + 0.7)) / 5;
      parts.push(box(0.82, 0.08, 0.82, STONE, { x: 0, y: ty }));
    }
    // Tower front-corner pilasters (white) emphasising verticality.
    parts.push(box(0.1, 2.6, 0.1, STONE, { x: -0.36, y: towerBaseY + 1.3, z: 0.36 }));
    parts.push(box(0.1, 2.6, 0.1, STONE, { x: 0.36, y: towerBaseY + 1.3, z: 0.36 }));
    // Clock storey: a white belfry cube near the top with gold clock faces.
    const clockY = towerBaseY + 2.75;
    parts.push(box(0.92, 0.6, 0.92, STONE, { x: 0, y: clockY })); // belfry block
    // gold clock faces on the four sides.
    parts.push(box(0.34, 0.34, 0.04, GOLD, { x: 0, y: clockY, z: 0.47 }));
    parts.push(box(0.34, 0.34, 0.04, GOLD, { x: 0, y: clockY, z: -0.47 }));
    parts.push(box(0.04, 0.34, 0.34, GOLD, { x: 0.47, y: clockY, z: 0 }));
    parts.push(box(0.04, 0.34, 0.34, GOLD, { x: -0.47, y: clockY, z: 0 }));
    // Tower crown: stepped brick lantern + grey-green pyramidal roof + finial.
    parts.push(box(0.7, 0.34, 0.7, BRICK, { x: 0, y: clockY + 0.5, hex2: STONE })); // lantern drum (white-banded top)
    parts.push(cone(0.62, 0.85, 4, ROOF, { x: 0, y: clockY + 1.1, ry: Math.PI / 4, hex2: ROOF2 })); // pyramid roof
    parts.push(cyl(0.025, 0.025, 0.4, 6, GOLD, { x: 0, y: clockY + 1.72 + j })); // finial mast
    parts.push(box(0.1, 0.1, 0.1, GOLD, { x: 0, y: clockY + 1.92 })); // finial knob

    return finish(parts);
  },
};

export default NM_PRESIDENTIAL;
