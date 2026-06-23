/**
 * @file packs/taipei/collectibles/presidential_trophy.js — Roll Formosa collectible.
 *
 * 總統府 (Presidential Office Building) — but the SOUVENIR-TROPHY version: a
 * tiny hand-held desk model the katamari can roll up, distinct from the big
 * `NM_PRESIDENTIAL` landmark. Same iconic read — a wide red-brick-and-white
 * Tatsuno facade with one TALL central white tower carrying a gold clock and a
 * green pyramidal cap — but chunked WAY down and planted on a little gold
 * trophy plinth so it scans as a cheap gift-shop keepsake, not a building.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the silhouette: a low broad
 * base, a stubby banded facade, and one slim tower spiking up off-centre-tall.
 * Well under the 350-triangle collectible budget.
 *
 * Palette: red brick + white stone bands, grey-green roof, gold clock + plinth.
 */

import { box, cone, cyl, finish, PI } from '../geomHelpers.js';

const BRICK = 0xb1413a; // weathered red brick
const BRICK2 = 0x9a3530; // darker brick (gradient base)
const STONE = 0xf0ead9; // off-white stone band / tower / pilaster
const ROOF = 0x6f7b6a; // grey-green tiled roof
const ROOF2 = 0x5d6859; // roof shadow
const GOLD = 0xd9b24a; // clock face + trophy plinth
const GOLD2 = 0xb98f33; // darker gold (plinth shade)

export const COL_PRES_TROPHY = {
  id: 'presidential_trophy',
  name: '總統府',
  collectibleId: 9,
  colorHex: BRICK,
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.015; // micro jitter on the finial, never structural
    const parts = [];

    // ---- little gold trophy plinth (reads as a souvenir keepsake) ----
    parts.push(box(2.0, 0.16, 1.3, GOLD, { x: 0, y: -1.02, hex2: GOLD2 })); // broad base slab
    parts.push(box(1.7, 0.18, 1.05, GOLD2, { x: 0, y: -0.86 }));            // stepped riser
    parts.push(box(1.55, 0.1, 0.9, STONE, { x: 0, y: -0.74 }));            // white cap under model

    // ---- compact symmetric red-brick facade with white banding ----
    // central pavilion block (slightly taller + forward), gradient brick base.
    parts.push(box(1.0, 0.95, 0.78, STONE, { x: 0, y: -0.2, z: 0.04, hex2: BRICK2 }));
    // left + right end pavilions (a touch lower).
    parts.push(box(0.66, 0.78, 0.66, STONE, { x: -0.86, y: -0.28, hex2: BRICK2 }));
    parts.push(box(0.66, 0.78, 0.66, STONE, { x: 0.86, y: -0.28, hex2: BRICK2 }));

    // white horizontal stone bands wrapping the facade (the Tatsuno stripe read).
    for (let i = 0; i < 3; i++) {
      const by = -0.55 + i * 0.26;
      parts.push(box(2.5, 0.07, 0.84, STONE, { x: 0, y: by }));
    }
    // crowning white cornice + low grey-green hipped roofs on the wings.
    parts.push(box(2.56, 0.08, 0.9, STONE, { x: 0, y: 0.29 }));
    parts.push(box(0.6, 0.16, 0.6, ROOF, { x: -0.86, y: 0.41, hex2: ROOF2 }));
    parts.push(box(0.6, 0.16, 0.6, ROOF, { x: 0.86, y: 0.41, hex2: ROOF2 }));

    // central arched entrance porch (forecourt face).
    parts.push(box(0.46, 0.4, 0.16, STONE, { x: 0, y: -0.42, z: 0.45 }));
    parts.push(box(0.28, 0.3, 0.22, BRICK2, { x: 0, y: -0.46, z: 0.48 }));

    // ---- TALL central white clock tower (the defining vertical accent) ----
    const tx = 0; // centred over the middle pavilion
    // tower shaft: white stone with thin red brick band-lines (facade rhythm).
    parts.push(box(0.42, 1.5, 0.42, STONE, { x: tx, y: 0.84 }));
    for (let i = 0; i < 3; i++) {
      parts.push(box(0.45, 0.05, 0.45, BRICK, { x: tx, y: 0.45 + i * 0.4 }));
    }
    // clock storey: a white belfry cube with gold clock faces on all four sides.
    const clockY = 1.74;
    parts.push(box(0.52, 0.34, 0.52, STONE, { x: tx, y: clockY }));
    parts.push(box(0.2, 0.2, 0.04, GOLD, { x: tx, y: clockY, z: 0.27 }));
    parts.push(box(0.2, 0.2, 0.04, GOLD, { x: tx, y: clockY, z: -0.27 }));
    parts.push(box(0.04, 0.2, 0.2, GOLD, { x: tx + 0.27, y: clockY, z: 0 }));
    parts.push(box(0.04, 0.2, 0.2, GOLD, { x: tx - 0.27, y: clockY, z: 0 }));
    // tower crown: brick lantern drum, grey-green pyramidal roof, gold finial.
    parts.push(box(0.4, 0.18, 0.4, BRICK, { x: tx, y: clockY + 0.26, hex2: STONE }));
    parts.push(cone(0.34, 0.46, 4, ROOF, { x: tx, y: clockY + 0.6, ry: PI / 4, hex2: ROOF2 }));
    parts.push(cyl(0.02, 0.02, 0.22, 5, GOLD, { x: tx, y: clockY + 0.94 + j }));
    parts.push(box(0.07, 0.07, 0.07, GOLD, { x: tx, y: clockY + 1.07 }));

    return finish(parts);
  },
};

export default COL_PRES_TROPHY;
