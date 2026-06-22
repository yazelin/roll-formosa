/**
 * @file packs/tainan/landmarks/literature_museum.js — Roll Formosa Tainan pack.
 *
 * NM_LIT_MUSEUM — 國立臺灣文學館 (National Museum of Taiwan Literature, the
 * former Tainan State Hall / 原台南州廳). A grand Western Baroque public building:
 * a symmetric cream-stone facade with a CENTRAL projecting entrance bay crowned
 * by a MANSARD dome/cupola, flanked by two symmetric wings carrying rows of
 * arched windows, a colonnade of columns running across the front, and a
 * balustrade parapet along the roofline.
 *
 * Silhouette target: WIDE + symmetric, one central domed cupola accent.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read. Cream/grey stone.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const STONE = 0xcfc7b4; // cream stone wall
const STONE_HI = 0xe2dccb; // sunlit stone
const STONE_SH = 0xb4ac99; // stone shadow / base
const ROOF = 0x6a6a66; // grey mansard / dome roof
const ROOF2 = 0x55554f; // roof shadow
const WIN = 0x3c4a55; // dark arched-window glass
const GOLD = 0xc9aa52; // cupola finial

/**
 * One symmetric wing: a stone block with a row of arched windows and a low
 * cornice + balustrade parapet across the top.
 * @param {number} cx centre X @param {number} w width @param {number} h height
 * @param {number} d depth @param {number} wins number of arched windows
 * @returns {import('three').BufferGeometry[]}
 */
function wing(cx, w, h, d, wins) {
  const parts = [
    box(w, h, d, STONE, { x: cx, y: h / 2, hex2: STONE_HI }), // wing wall mass
    box(w + 0.04, 0.12, d + 0.04, STONE_SH, { x: cx, y: 0.16 }), // base course
  ];
  // Row of arched windows across the front face (tall slab + slim arch head).
  const span = w - 0.5;
  for (let i = 0; i < wins; i++) {
    const wx = cx - span / 2 + (span * i) / Math.max(1, wins - 1);
    parts.push(box(0.2, h * 0.6, 0.06, WIN, { x: wx, y: h * 0.54, z: d / 2 + 0.01 })); // arched window pane (tall)
  }
  // Cornice + balustrade parapet along the top (a single railed band).
  parts.push(box(w + 0.1, 0.12, d + 0.1, STONE_HI, { x: cx, y: h + 0.02 })); // cornice
  parts.push(box(w - 0.1, 0.18, 0.06, STONE_SH, { x: cx, y: h + 0.18, z: d / 2 - 0.02 })); // balustrade band
  parts.push(box(w + 0.06, 0.06, d + 0.06, STONE_HI, { x: cx, y: h + 0.3 })); // parapet rail cap
  return parts;
}

export const NM_LIT_MUSEUM = {
  id: 'literature_museum',
  name: '臺灣文學館',
  landmarkId: 6,
  dioramaRHint: 38, // wide symmetric Baroque public hall with a central cupola
  colorHex: STONE,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01; // micro jitter, never structural
    const parts = [];

    // --- symmetric wings flanking the central entrance bay ---------------
    parts.push(...wing(-2.3, 2.0, 1.5, 1.1, 3)); // left wing
    parts.push(...wing(2.3, 2.0, 1.5, 1.1, 3)); // right wing

    // --- central projecting entrance bay (forward + taller) -------------
    const cy = 1.75;
    parts.push(box(1.9, cy, 1.5, STONE, { z: 0.25, y: cy / 2, hex2: STONE_HI })); // central bay mass
    parts.push(box(1.96, 0.14, 1.56, STONE_SH, { z: 0.25, y: 0.18 })); // bay base course

    // Colonnade of columns across the front of the entrance bay.
    for (const px of [-0.72, -0.24, 0.24, 0.72]) {
      parts.push(cyl(0.11, 0.12, 1.2, 6, STONE_HI, { x: px, y: 0.72, z: 1.04 })); // column shaft
      parts.push(box(0.28, 0.1, 0.16, STONE_HI, { x: px, y: 1.36, z: 1.04 })); // capital
    }
    // Entablature beam over the colonnade.
    parts.push(box(1.9, 0.2, 0.24, STONE_HI, { z: 1.04, y: 1.5 }));
    // Central doorway recess.
    parts.push(box(0.46, 0.9, 0.1, WIN, { z: 1.0, y: 0.55 }));

    // Cornice + balustrade across the central bay top.
    parts.push(box(2.0, 0.14, 1.6, STONE_HI, { z: 0.25, y: cy + 0.05 }));

    // --- central MANSARD dome / cupola crowning the entrance bay ---------
    const dy = cy + 0.12;
    // Mansard drum (steep-sided truncated cone base of the cupola).
    parts.push(cone(0.66, 0.55, 8, ROOF, { z: 0.25, y: dy + 0.27, hex2: ROOF2 })); // mansard skirt
    parts.push(cyl(0.42, 0.46, 0.4, 8, STONE_HI, { z: 0.25, y: dy + 0.72 })); // lantern drum (windows)
    // Hemispherical cupola dome.
    parts.push(sph(0.46, ROOF, { ws: 8, hs: 4, thetaLen: HALF_PI, z: 0.25, y: dy + 0.9, hex2: 0x7a7a74 }));
    // Finial.
    parts.push(cyl(0.04, 0.05, 0.26, 6, GOLD, { z: 0.25, y: dy + 1.4 }));
    parts.push(sph(0.07, GOLD, { ws: 6, hs: 4, z: 0.25, y: dy + 1.56 + j }));

    return finish(parts);
  },
};

export default NM_LIT_MUSEUM;
