/**
 * @file packs/taipei/landmarks/liberty_arch.js — Roll Formosa Taipei pack.
 *
 * NM_LIBERTY_ARCH — 自由廣場牌樓 (Liberty Square archway / 五間六柱十一樓 paifang).
 *
 * The wide white marble gateway that fronts 中正紀念堂 / 自由廣場: a five-bay
 * (5 openings) paifang carried on white pillars, crowned by a row of blue
 * glazed-tile hipped roofs — one tall central 樓 flanked by stepped-down side
 * 樓 — all picked out in the藍瓦 blue against the white marble body.
 *
 * Silhouette target: WIDE + LOW. White body, blue hipped roofs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space with
 * a deliberately wide aspect (the real gate is ~30 m tall, ~76 m wide).
 *
 * Hero model budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

const WHITE = 0xf2efe6; // marble body
const WHITE_HI = 0xfbf9f2; // sunlit marble top
const BLUE = 0x2a64b4; // 藍瓦 glazed roof tile
const BLUE_HI = 0x3f7fd0; // ridge highlight
const GOLD = 0xd8b24a; // ridge / finial accent
const RED = 0xb23a2e; // 牌匾 plaque ground
const STONE = 0x9a958a; // base plinth shadow

/**
 * One blue-tiled hipped roof (廡殿頂): a flared four-sided pyramid on a thin
 * eave slab with a gold ridge cap. Wide-base, low-rise so it reads as 藍瓦.
 * @param {number} x  centre X
 * @param {number} y  base Y (eave underside)
 * @param {number} w  roof half-width footprint scalar (full width = w)
 * @param {number} h  roof rise
 * @returns {import('three').BufferGeometry[]}
 */
function hippedRoof(x, y, w, h) {
  const eaveD = 1.1; // front-back depth of the gate (thin, it is a screen)
  return [
    box(w * 1.08, 0.1, eaveD * 1.12, WHITE_HI, { x, y }), // white eave slab under the tiles
    // 4-sided pyramid (cone seg=4) gives a hipped silhouette; rotate 45° so a flat face fronts.
    cone(w * 0.78, h, 4, BLUE, { x, y: y + 0.05 + h / 2, ry: PI / 4, hex2: BLUE_HI }), // blue tiled roof
    box(w * 0.92, 0.05, 0.07, GOLD, { x, y: y + 0.05 + h + 0.02 }), // gold main ridge
    cyl(0.05, 0.07, 0.16, 6, GOLD, { x, y: y + 0.05 + h + 0.06 }), // ridge finial knob
  ];
}

export const NM_LIBERTY_ARCH = {
  id: 'liberty_square_arch',
  name: '自由廣場牌樓',
  landmarkId: 6,
  dioramaRHint: 38, // ~76 m wide gate; r ~ 38 m (integration may override for the ladder)
  colorHex: WHITE,

  buildGeometry(rng) {
    const parts = [];

    // --- ground / base plinth: long low white step that ties the pillars ----
    parts.push(box(7.6, 0.34, 1.4, STONE, { y: 0.17 })); // shadowed base course
    parts.push(box(7.4, 0.22, 1.22, WHITE, { y: 0.45, hex2: WHITE_HI })); // white plinth top step

    // --- six white pillars define the FIVE openings (五間六柱) --------------
    // Bay centres are the gaps; pillars sit between/around them.
    const pillarX = [-3.3, -2.0, -0.65, 0.65, 2.0, 3.3];
    const pillarH = [3.0, 3.4, 3.7, 3.7, 3.4, 3.0]; // taller toward the centre
    for (let i = 0; i < pillarX.length; i++) {
      const px = pillarX[i];
      const ph = pillarH[i];
      parts.push(box(0.52, ph, 0.62, WHITE, { x: px, y: 0.56 + ph / 2, hex2: WHITE_HI })); // pillar shaft
      parts.push(box(0.6, 0.14, 0.7, WHITE_HI, { x: px, y: 0.56 + ph + 0.05 })); // pillar cap
    }

    // --- horizontal lintel beams spanning the bays (the 額枋) ---------------
    // Lower architrave across the whole width.
    parts.push(box(7.0, 0.34, 0.5, WHITE, { y: 2.55, hex2: WHITE_HI })); // long architrave
    parts.push(box(7.0, 0.1, 0.56, STONE, { y: 2.74 })); // architrave shadow line
    // Upper lintel only over the three central bays (taller centre block).
    parts.push(box(4.4, 0.42, 0.52, WHITE, { y: 3.55, hex2: WHITE_HI })); // central upper lintel
    parts.push(box(2.0, 0.5, 0.5, WHITE, { y: 4.05, hex2: WHITE_HI })); // centre attic block under top roof

    // --- 「自由廣場」red plaque on the centre bay --------------------------
    parts.push(box(1.9, 0.62, 0.16, RED, { y: 3.18, z: 0.32 })); // plaque ground
    parts.push(box(1.78, 0.5, 0.06, GOLD, { y: 3.18, z: 0.42 })); // gold plaque face/border

    // --- blue-tiled hipped roofs across the top (the signature crown) ------
    // One tall central roof + two stepped side roofs each direction = 5 roofs.
    parts.push(...hippedRoof(0.0, 4.45, 2.3, 1.05)); // central 樓 (tallest)
    parts.push(...hippedRoof(-2.45, 3.05, 1.7, 0.78)); // inner-left 樓
    parts.push(...hippedRoof(2.45, 3.05, 1.7, 0.78)); // inner-right 樓
    parts.push(...hippedRoof(-4.0, 3.85, 1.4, 0.62)); // outer-left 樓 (slightly raised pavilion end)
    parts.push(...hippedRoof(4.0, 3.85, 1.4, 0.62)); // outer-right 樓

    // --- small tiny variation only (never structure) -----------------------
    // Nudge the two outer finials a hair so the crown is not perfectly mirrored.
    parts.push(cyl(0.04, 0.05, 0.1 + rng() * 0.04, 6, GOLD, { x: -4.0, y: 4.66 })); // L outer extra finial
    parts.push(cyl(0.04, 0.05, 0.1 + rng() * 0.04, 6, GOLD, { x: 4.0, y: 4.66 })); // R outer extra finial

    return finish(parts);
  },
};

export default NM_LIBERTY_ARCH;
