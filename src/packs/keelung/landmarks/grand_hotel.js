/**
 * @file packs/taipei/landmarks/grand_hotel.js — Roll Formosa Taipei pack.
 *
 * 圓山大飯店 (The Grand Hotel) — landmarkId 3. The monumental Chinese-palace
 * hotel on 劍潭山: a very wide multi-bay red body lined with red columns under
 * a HUGE sweeping golden-orange hipped tile roof (歇山頂) that dominates the
 * whole silhouette, with a small upper pavilion crowning the ridge.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the silhouette (wide low palace body + dominant golden roof) carries the read.
 *
 * Palette: red lacquer body (0x9e2b25 / brighter 0xc23a30 columns) + golden
 * tile roof (0xe8932a top → 0xf0b54a eave gradient). <= 600 triangles.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** Roof tile golds + red lacquer + stone base — concrete hexes (not tinted). */
const ROOF_TOP = 0xe07c1f;
const ROOF_EAVE = 0xf0b94c;
const ROOF_RIDGE = 0xc8a23a;
const RED_BODY = 0x9c2a24;
const RED_COL = 0xc23a30;
const STONE = 0xcfc7b6;
const STONE_DK = 0xb4ac9b;
const TRIM_GOLD = 0xd8a838;

/**
 * One sweeping hipped tile roof: a flattened 4-sided pyramid (hipped block) with
 * a flared eave skirt below it and golden ridge caps. Returns part geometries.
 * @param {number} w half-ish footprint width (X)
 * @param {number} d footprint depth (Z)
 * @param {number} ridgeH roof rise
 * @param {number} y base Y of the roof (eave height)
 * @param {number} eaveW eave overhang width
 * @param {number} eaveD eave overhang depth
 * @returns {import('three').BufferGeometry[]}
 */
function hippedRoof(w, d, ridgeH, y, eaveW, eaveD) {
  const parts = [];
  // Flared eave skirt: a short, very wide downward-flaring frustum band (cone)
  // gives the characteristic upturned-eave shadow line of a palace roof.
  parts.push(cone(1.0, 0.16, 4, ROOF_EAVE, { sx: eaveW, sz: eaveD, ry: PI / 4, y: y + 0.02 }));
  // Main sweeping hipped mass: a 4-sided pyramid, wide and not too tall, so the
  // roof reads as a broad dominating cap rather than a spire.
  parts.push(cone(1.0, ridgeH, 4, ROOF_TOP, { sx: w, sz: d, ry: PI / 4, y: y + ridgeH / 2 + 0.1, hex2: ROOF_TOP }));
  // Lower roof gradient: re-skin the bottom of the pyramid lighter via a second
  // shallow frustum so eave→ridge reads gold→deep-orange.
  parts.push(cone(1.0, ridgeH * 0.42, 4, ROOF_EAVE, { sx: w * 1.0, sz: d * 1.0, ry: PI / 4, y: y + ridgeH * 0.21 + 0.1, hex2: ROOF_TOP }));
  return parts;
}

export const NM_GRAND_HOTEL = {
  id: 'grand_hotel',
  name: '圓山大飯店',
  landmarkId: 3,
  dioramaRHint: 100, // ~ real building footprint scale (m); integration may override
  colorHex: 0xc23a30, // red lacquer — the body read color
  buildGeometry(rng) {
    const parts = [];

    // ----- stone terrace / podium (wide, low) -----
    parts.push(box(5.2, 0.5, 2.4, STONE_DK, { y: 0.25, hex2: STONE }));
    parts.push(box(4.8, 0.22, 2.05, STONE, { y: 0.6 })); // upper terrace step
    // front stair hint
    parts.push(box(1.6, 0.18, 0.5, STONE_DK, { y: 0.4, z: 1.05 }));

    // ===================================================================
    // LOWER WING (3-story podium body) — very wide multi-bay red building
    // ===================================================================
    const bodyW = 4.6, bodyH = 1.5, bodyD = 1.8, bodyY = 0.71 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, RED_BODY, { y: bodyY, hex2: 0xb13730 }));
    // golden trim band along the top of the body (cornice)
    parts.push(box(bodyW + 0.06, 0.12, bodyD + 0.06, TRIM_GOLD, { y: 0.71 + bodyH }));
    parts.push(box(bodyW + 0.04, 0.1, bodyD + 0.04, STONE, { y: 0.78 })); // base course

    // red columns across the wide front face (multi-bay arcade) — open cylinders
    // (no caps) keep the tri budget low while still reading as a colonnade.
    const nCol = 9;
    const colSpan = bodyW - 0.5;
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(cyl(0.14, 0.15, bodyH - 0.1, 6, RED_COL, { open: true, x: cx, y: bodyY, z: bodyD / 2 + 0.02 }));
    }
    // arcade shadow recess behind columns (dark)
    parts.push(box(colSpan + 0.3, bodyH - 0.2, 0.14, 0x5a1714, { y: bodyY, z: bodyD / 2 - 0.05 }));

    // wide LOWER sweeping roof over the whole podium body — the eave line that
    // makes the palace read. Sits just above the body cornice.
    const lowEave = 0.71 + bodyH + 0.12;
    parts.push(...hippedRoof(2.55, 1.12, 0.52, lowEave, 2.62, 1.18));

    // ===================================================================
    // UPPER WING (the tall central tower body) — narrower, set back
    // ===================================================================
    const towW = 2.7, towH = 1.5, towD = 1.25, towY = lowEave + 0.55 + towH / 2;
    parts.push(box(towW, towH, towD, RED_BODY, { y: towY, hex2: 0xb13730 }));
    parts.push(box(towW + 0.06, 0.12, towD + 0.06, TRIM_GOLD, { y: lowEave + 0.55 + towH }));
    // upper-body columns (front) — open cylinders, fewer bays
    const nCol2 = 6;
    const colSpan2 = towW - 0.4;
    for (let i = 0; i < nCol2; i++) {
      const cx = -colSpan2 / 2 + (colSpan2 / (nCol2 - 1)) * i;
      parts.push(cyl(0.11, 0.12, towH - 0.1, 5, RED_COL, { open: true, x: cx, y: towY, z: towD / 2 + 0.02 }));
    }
    parts.push(box(colSpan2 + 0.25, towH - 0.2, 0.12, 0x5a1714, { y: towY, z: towD / 2 - 0.05 }));

    // ===================================================================
    // GIANT DOMINANT HIPPED ROOF — the visual hero, huge sweeping golden cap
    // ===================================================================
    const topEave = lowEave + 0.55 + towH + 0.1;
    parts.push(...hippedRoof(1.85, 0.88, 1.05, topEave, 1.98, 0.96));

    // golden ridge cap + small finial pavilion crowning the ridge
    const ridgeY = topEave + 1.05 + 0.1;
    parts.push(box(0.5, 0.12, 0.22, ROOF_RIDGE, { y: ridgeY - 0.06 })); // main ridge cap
    parts.push(box(0.55, 0.62, 0.4, RED_BODY, { y: ridgeY + 0.2, hex2: 0xb13730 })); // crowning pavilion
    parts.push(box(0.6, 0.08, 0.45, TRIM_GOLD, { y: ridgeY + 0.5 }));
    // tiny golden roof on the crowning pavilion
    parts.push(cone(0.5, 0.32, 4, ROOF_TOP, { ry: PI / 4, y: ridgeY + 0.7, hex2: ROOF_TOP }));
    // central finial
    parts.push(cyl(0.04, 0.06, 0.26, 6, TRIM_GOLD, { y: ridgeY + 0.95 }));

    // ridge-end ornaments (鴟吻 hints) on the big roof corners — tiny gold blocks
    for (const sx of [-1, 1]) {
      parts.push(box(0.16, 0.18, 0.16, ROOF_RIDGE, { x: sx * 1.78, y: topEave + 0.06, z: 0 }));
    }

    return finish(parts);
  },
};

export default NM_GRAND_HOTEL;
