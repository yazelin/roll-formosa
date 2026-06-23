/**
 * @file packs/taipei/landmarks/palace_museum.js — Roll Formosa Taipei pack.
 *
 * NM_PALACE — 故宮博物院 (National Palace Museum, 國立故宮博物院).
 *
 * The Chinese-palace museum on the 外雙溪 hillside: a tan/beige multi-bay main
 * hall crowned by GREEN glazed-tile multi-tier hipped roofs (a tall central
 * 樓 over a broad lower 廡殿頂 eave), all raised on a terraced stone podium,
 * fronted DOWN the approach by a white five-arch / six-pillar 牌樓 paifang gate
 * also capped in green tile.
 *
 * Signature read: GREEN tiered roofs + WHITE marble paifang + terraced base.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the silhouette (broad green-roofed hall set back behind a wide white gate on
 * a stepped hill) carries the recognition. Hero model budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

const GREEN_TOP = 0x2f7d4f;   // 綠瓦 glazed tile (ridge / deep)
const GREEN_EAVE = 0x4aa168;  // sunlit lower eave
const GREEN_RIDGE = 0x256b41; // dark ridge cap
const WALL = 0xe7dcc2;        // tan/beige palace body (洗石子)
const WALL_HI = 0xf2ead6;     // sunlit upper wall
const WHITE = 0xf2efe6;       // marble paifang body
const WHITE_HI = 0xfbf9f2;    // sunlit marble
const STONE = 0xcbc2ad;       // terrace stone
const STONE_DK = 0xb1a890;    // terrace shadow course
const RED = 0xb23a2e;         // 匾額 plaque ground
const GOLD = 0xd8b24a;        // ridge finial / plaque accent
const SHADOW = 0x6f6450;      // arcade / recess shadow

/**
 * One green glazed-tile hipped roof (廡殿頂): a flared four-sided pyramid sitting
 * on a thin eave slab, with a gold ridge cap + finial. Wide base, low rise so it
 * reads as a broad sweeping 綠瓦 cap rather than a spire.
 * @param {number} x centre X
 * @param {number} y eave (underside) Y
 * @param {number} w full footprint width scalar (X)
 * @param {number} d full footprint depth scalar (Z)
 * @param {number} h roof rise
 * @returns {import('three').BufferGeometry[]}
 */
function greenRoof(x, y, w, d, h) {
  return [
    // white/beige eave slab under the tiles (the overhang line)
    box(w * 1.1, 0.1, d * 1.12, WALL_HI, { x, y }),
    // 4-sided pyramid (cone seg=4) rotated 45° so a flat face fronts -> hipped
    // read; vertical gradient eave(light)→ridge(deep) reads the 綠瓦 tiers.
    cone(0.78, h, 4, GREEN_EAVE, { x, y: y + 0.05 + h / 2, ry: PI / 4, sx: w, sz: d, hex2: GREEN_TOP }),
    // gold ridge cap + tiny finial block
    box(w * 0.62, 0.06, 0.08, GREEN_RIDGE, { x, y: y + 0.05 + h + 0.02 }),
    box(0.07, 0.16, 0.07, GOLD, { x, y: y + 0.05 + h + 0.08 }),
  ];
}

/**
 * Lightweight green hipped roof for the slender paifang 樓 (no eave slab / finial,
 * cone + ridge cap only) to stay inside the hero tri budget. 20 tris each.
 * @param {number} x @param {number} y eave underside @param {number} w @param {number} h
 * @returns {import('three').BufferGeometry[]}
 */
function gateRoof(x, y, w, h) {
  return [
    cone(0.78, h, 4, GREEN_EAVE, { x, y: y + h / 2, ry: PI / 4, sx: w, sz: w * 0.46, hex2: GREEN_TOP }),
    box(w * 0.6, 0.06, 0.08, GREEN_RIDGE, { x, y: y + h + 0.02 }),
  ];
}

export const NM_PALACE = {
  id: 'palace_museum',
  name: '故宮博物院',
  landmarkId: 9,
  dioramaRHint: 60, // broad hilltop palace complex (integration may override)
  colorHex: GREEN_EAVE, // green roof — the read color

  buildGeometry(rng) {
    const parts = [];

    // ===================================================================
    // TERRACED STONE PODIUM (the hillside the palace sits on) — wide, stepped
    // ===================================================================
    parts.push(box(6.2, 0.5, 3.2, STONE_DK, { y: 0.25, hex2: STONE })); // broad base terrace
    parts.push(box(5.4, 0.34, 2.7, STONE, { y: 0.67, hex2: WALL_HI }));  // upper terrace step
    // grand central staircase hint running toward the viewer (front +Z)
    parts.push(box(1.8, 0.5, 0.9, STONE_DK, { y: 0.4, z: 1.7, hex2: STONE }));

    const podTop = 0.84; // top of podium

    // ===================================================================
    // MAIN HALL BODY — broad tan multi-bay palace hall
    // ===================================================================
    const bodyW = 4.6, bodyH = 1.4, bodyD = 2.1, bodyY = podTop + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, WALL, { y: bodyY, hex2: WALL_HI }));
    // stone base course + cornice band
    parts.push(box(bodyW + 0.06, 0.14, bodyD + 0.06, STONE, { y: podTop + 0.07 }));
    parts.push(box(bodyW + 0.04, 0.1, bodyD + 0.04, STONE_DK, { y: podTop + bodyH - 0.05 }));

    // tan pilasters across the wide front face (multi-bay arcade) + recessed
    // shadow so the colonnade reads. Open cylinders keep tris low.
    const nCol = 7;
    const colSpan = bodyW - 0.5;
    parts.push(box(colSpan + 0.3, bodyH - 0.3, 0.12, SHADOW, { y: bodyY, z: bodyD / 2 - 0.04 }));
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(cyl(0.12, 0.13, bodyH - 0.18, 4, WALL_HI, { open: true, x: cx, y: bodyY, z: bodyD / 2 + 0.02, ry: PI / 4 }));
    }

    // LOWER broad green roof over the whole hall (廡殿頂) — the wide eave line
    const lowEave = podTop + bodyH + 0.06;
    parts.push(...greenRoof(0, lowEave, 2.7, 1.32, 0.52));

    // ===================================================================
    // UPPER STORY — narrower set-back central body + dominant green roof
    // ===================================================================
    const upW = 3.0, upH = 1.15, upD = 1.45, upY = lowEave + 0.62 + upH / 2;
    parts.push(box(upW, upH, upD, WALL, { y: upY, hex2: WALL_HI }));
    parts.push(box(upW + 0.05, 0.1, upD + 0.05, STONE_DK, { y: lowEave + 0.62 + upH - 0.05 }));
    // upper-story windows recess + lighter pilasters
    parts.push(box(upW - 0.5, upH - 0.3, 0.1, SHADOW, { y: upY, z: upD / 2 - 0.03 }));
    const nCol2 = 5;
    const colSpan2 = upW - 0.5;
    for (let i = 0; i < nCol2; i++) {
      const cx = -colSpan2 / 2 + (colSpan2 / (nCol2 - 1)) * i;
      parts.push(cyl(0.09, 0.1, upH - 0.16, 4, WALL_HI, { open: true, x: cx, y: upY, z: upD / 2 + 0.02, ry: PI / 4 }));
    }

    // 「國立故宮博物院」匾額 plaque on the upper centre
    parts.push(box(1.6, 0.42, 0.12, RED, { y: lowEave + 0.45, z: upD / 2 + 0.12 }));
    parts.push(box(1.5, 0.32, 0.05, GOLD, { y: lowEave + 0.45, z: upD / 2 + 0.18 }));

    // TOP DOMINANT green roof (tall central 樓) — the visual hero
    const topEave = lowEave + 0.62 + upH + 0.05;
    parts.push(...greenRoof(0, topEave, 2.0, 1.0, 0.95));
    // crowning ridge ornaments (鴟吻 hints) at the big roof corners
    for (const sx of [-1, 1]) {
      parts.push(box(0.14, 0.16, 0.14, GREEN_RIDGE, { x: sx * 1.05, y: topEave + 0.06, z: 0 }));
    }

    // ===================================================================
    // WHITE FIVE-ARCH 牌樓 PAIFANG GATE — set forward, down the approach (+Z)
    // ===================================================================
    const gateZ = 2.6;        // forward of the hall, on the lower terrace front
    const gateBase = 0.34;    // sits just above ground in front of the podium
    // gate base plinth
    parts.push(box(5.0, 0.26, 0.7, STONE, { y: 0.13, z: gateZ }));
    // six white pillars -> five openings (五間六柱), taller toward centre
    const px = [-2.2, -1.32, -0.44, 0.44, 1.32, 2.2];
    const ph = [1.35, 1.6, 1.85, 1.85, 1.6, 1.35];
    for (let i = 0; i < px.length; i++) {
      parts.push(box(0.26, ph[i], 0.3, WHITE, { x: px[i], y: gateBase + ph[i] / 2, z: gateZ, hex2: WHITE_HI }));
    }
    // architrave lintels (額枋) — full-width lower beam + raised centre beam
    parts.push(box(4.7, 0.18, 0.26, WHITE, { y: gateBase + 1.28, z: gateZ, hex2: WHITE_HI }));
    parts.push(box(2.9, 0.2, 0.28, WHITE, { y: gateBase + 1.78, z: gateZ, hex2: WHITE_HI }));
    parts.push(box(1.2, 0.22, 0.3, WHITE, { y: gateBase + 2.05, z: gateZ, hex2: WHITE_HI })); // centre attic

    // green hipped roofs crowning the gate — central tall + stepped sides (五樓)
    const gy = gateBase;
    parts.push(...gateRoof(0.0, gy + 2.18, 1.25, 0.46));   // central 樓 (tallest)
    parts.push(...gateRoof(-1.32, gy + 1.5, 0.95, 0.34));  // inner-left
    parts.push(...gateRoof(1.32, gy + 1.5, 0.95, 0.34));   // inner-right
    parts.push(...gateRoof(-2.2, gy + 1.25, 0.78, 0.28));  // outer-left
    parts.push(...gateRoof(2.2, gy + 1.25, 0.78, 0.28));   // outer-right

    // --- tiny variation only (never structure) -----------------------------
    // nudge the two outer gate finials a hair so the crown is not perfectly mirrored
    parts.push(box(0.05, 0.08 + rng() * 0.04, 0.05, GOLD, { x: -2.2, y: gy + 1.66 }));
    parts.push(box(0.05, 0.08 + rng() * 0.04, 0.05, GOLD, { x: 2.2, y: gy + 1.66 }));

    return finish(parts);
  },
};

export default NM_PALACE;
