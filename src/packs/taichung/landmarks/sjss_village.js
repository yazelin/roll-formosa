/**
 * @file packs/taichung/landmarks/sjss_village.js — Roll Formosa Taichung pack, landmark 1.
 *
 * 審計新村 (Shenji New Village, 西區) — a 1969 dependents' quarters for the
 * provincial Audit Department, refurbished into a low-rise indie creative
 * cluster (文創聚落). The icon is a CONNECTED ROW of squat old dormitory
 * 街屋: 2–3 short washed-terrazzo (洗石子) units in warm beige-grey, each
 * under its own low gable roof, the facades hung with a few small candy-colour
 * creative-shop signboards and dressed with little upper balconies and potted
 * greenery. Low, retro, hand-made, indie — never tall, never grand; the read
 * is "an old single-storey lane of little painted-sign shops".
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): box + cyl.
 * The geometry math is an engine red line. finish() merges → recenters →
 * normalizes to a UNIT bounding sphere (radius 1), so the recognizable read
 * comes from PROPORTIONS (a WIDE, LOW terrace of small repeated units), not
 * absolute size. +Z is the show face for a friendly 3/4 view. rng() only
 * re-shuffles which signboard picks which hue and jitters the planters a hair,
 * so every spawn is a slightly different little lane — never structure.
 * <= 600 tris.
 */

import { box, cyl, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// ---- palette ----------------------------------------------------------------
const WASH = 0xbdb2a0; // 洗石子 — the signature warm beige-grey terrazzo wall
const WASH_D = 0x9c927f; // shadowed terrazzo (under-eave / side-return shade)
const WASH_L = 0xcfc6b4; // sunlit terrazzo (parapet band / top gradient)
const PLINTH = 0x8f8674; // earthy concrete plinth / lane paving the row sits on
const TRIM = 0xe7ddca; // pale plaster window/door surrounds & sill lines
const TILE = 0x5d5a55; // faded dark grey-green roof tile
const TILE_D = 0x46443f; // shadowed roof slope (eave underside)
const RIDGE = 0x3a3733; // dark ridge cap along each gable peak
const VOID = 0x241f1a; // near-black window / doorway opening (recess)
const WOOD = 0x6a4a30; // timber shop door leaves
const RAIL = 0xb9b0a0; // pale balcony railing (matches washed render)
const POT = 0xb56a44; // terracotta planter
const LEAF = 0x4f8b46; // potted shrub foliage
const SIGNPOLE = 0x3a3733; // dark bracket the hanging signs swing from
// candy creative-shop signboard colours — cycled across the boards by rng()
const SIGN = [
  0xe2533b, // 朱橘 vermilion-orange
  0x3a8f9c, // 湖青 lake teal
  0xf2b21e, // 鵝黃 marigold
  0xd45a86, // 桃粉 pink
  0x4f8b46, // 草綠 leaf green
  0x4a6fb0, // 靛藍 indigo
];

export const NM_SJSS_VILLAGE = {
  id: 'sjss_village',
  name: '審計新村',
  landmarkId: 1,
  dioramaRHint: 6, // a short refurbished dependents' terrace — only a few metres across
  colorHex: WASH, // the cluster reads as warm washed-terrazzo beige-grey

  buildGeometry(rng) {
    const parts = [];

    // Per-instance hue rotation so the little signboards are shuffled each spawn,
    // like the ever-changing roster of indie shops in the real lane.
    const off = (rng() * SIGN.length) | 0;
    const sign = (i) => SIGN[(i + off) % SIGN.length];

    // === 0) SHARED LANE PLINTH ==============================================
    // One low slab of concrete paving carries the whole connected terrace.
    const ROW_W = 3.6; // total terrace width (wide + low is the read)
    parts.push(box(ROW_W + 0.3, 0.16, 1.7, PLINTH, { y: 0.08, hex2: 0xa49a87 }));
    // a low doorstep / pavement strip along the front (warm gradient = sun-worn)
    parts.push(box(ROW_W + 0.1, 0.05, 0.3, WASH_D, { y: 0.16, z: 0.68, hex2: PLINTH }));

    // === 1) THREE CONNECTED DORMITORY UNITS =================================
    // Short 2-storey washed-terrazzo boxes sharing party walls. Slight width &
    // height variation gives the hand-built terrace its uneven, retro charm.
    const FZ = 0.6; // front-face plane (half body depth)
    const BODY_D = 1.18; // shallow depth — a thin street terrace
    const PLY = 0.16; // plinth top (units sit on the lane)
    const units = [
      { x: -1.2, w: 1.18, h: 1.46 }, // left unit (a touch taller)
      { x: 0.0, w: 1.22, h: 1.34 }, // centre unit
      { x: 1.2, w: 1.18, h: 1.4 }, // right unit
    ];

    for (let u = 0; u < units.length; u++) {
      const { x, w, h } = units[u];
      const cy = PLY + h / 2; // body centre height
      const fz = FZ; // each unit shares the same front plane

      // washed-terrazzo body mass (lighter toward the parapet)
      parts.push(box(w, h, BODY_D, WASH, { x, y: cy, hex2: WASH_L }));
      // thin pale string course splitting ground floor / upper floor
      parts.push(box(w + 0.02, 0.07, BODY_D + 0.02, TRIM, { x, y: PLY + h * 0.46 }));

      // ---- ground floor: timber shop doorway (dark opening + timber leaves;
      // the pale string course above already frames it, so no extra surround)
      const dW = 0.46;
      const dH = h * 0.4;
      const dY = PLY + dH / 2 + 0.02;
      parts.push(box(dW, dH, 0.1, VOID, { x, y: dY, z: fz - 0.04 })); // dark opening
      parts.push(box(dW - 0.06, dH - 0.06, 0.06, WOOD, { x, y: dY, z: fz })); // timber leaves, flush to face

      // ---- upper floor: a small recessed window + a little juliet balcony
      const uwY = PLY + h * 0.72;
      parts.push(box(0.3, 0.32, 0.08, VOID, { x, y: uwY, z: fz - 0.02, hex2: WASH_D })); // upper glass void (pale sill read via gradient)

      // small cantilevered balcony slab + low railing under the upper window
      const balY = PLY + h * 0.55;
      const balW = w * 0.7;
      parts.push(box(balW, 0.05, 0.22, WASH_D, { x, y: balY, z: fz + 0.11 })); // balcony floor
      parts.push(box(balW, 0.16, 0.04, RAIL, { x, y: balY + 0.1, z: fz + 0.21 })); // front rail panel

      // a potted shrub on the END units' balconies (the indie greenery accent;
      // centre unit left clear to keep the part count lean)
      if (u !== 1) {
        const pj = (rng() - 0.5) * 0.06; // tiny non-structural placement jitter
        const potX = x + balW * 0.3 + pj;
        parts.push(box(0.12, 0.12, 0.12, POT, { x: potX, y: balY + 0.11, z: fz + 0.18 })); // terracotta pot
        parts.push(box(0.16, 0.16, 0.14, LEAF, { x: potX, y: balY + 0.26, z: fz + 0.18 })); // leafy crown
      }
    }

    // === 2) PARTY-WALL CAPS + SIDE RETURNS ==================================
    // Shaded terrazzo returns at the ends so the terrace reads as a building,
    // and slim pale party-wall pilasters between units (the street rhythm).
    parts.push(box(0.08, 1.42, BODY_D + 0.04, WASH_D, { x: -1.82, y: PLY + 0.71, hex2: 0x847a68 }));
    parts.push(box(0.08, 1.36, BODY_D + 0.04, WASH_D, { x: 1.82, y: PLY + 0.68, hex2: 0x847a68 }));
    // a single slim pale party-wall pilaster between the units marks the seam
    // (one is enough for the terrace rhythm; keeps the part count lean)
    parts.push(box(0.07, 1.3, 0.07, WASH_L, { x: -0.6, y: PLY + 0.66, z: FZ + 0.01 }));

    // === 3) LOW GABLE ROOFS — one shallow pitched cap per unit =============
    // Each unit gets its own low 人字 (gable) roof: two tilted tile slabs to a
    // dark ridge, with overhanging eaves. Low pitch keeps the row squat & old.
    const pitch = 0.4; // gentle slope (radians)
    const slabT = 0.07;
    const slabLen = BODY_D * 0.74; // half-roof run (front & back slope)
    const roofRise = (slabLen / 2) * Math.sin(pitch);
    for (let u = 0; u < units.length; u++) {
      const { x, w, h } = units[u];
      const eaveY = PLY + h;
      const slabW = w + 0.22; // eaves overhang the wall
      const roofMidY = eaveY + roofRise * 0.5 + 0.03;
      for (const sgn of [1, -1]) {
        parts.push(
          box(slabW, slabT, slabLen, TILE, {
            x,
            rx: -sgn * pitch,
            y: roofMidY,
            z: (sgn * slabLen) / 4,
            hex2: TILE_D,
          })
        );
      }
      // dark ridge cap along the gable peak
      parts.push(box(slabW * 0.96, 0.08, 0.1, RIDGE, { x, y: eaveY + roofRise + 0.02 }));
      // pale gable-end infill on the CENTRE unit so the front peak doesn't read
      // hollow (the flanking units' peaks are largely occluded in a 3/4 view)
      if (u === 1) {
        parts.push(box(w * 0.86, roofRise + 0.05, 0.05, WASH_L, { x, y: eaveY + roofRise * 0.5, z: FZ - 0.04 }));
      }
    }

    // === 4) HANGING CREATIVE-SHOP SIGNBOARDS (the 文創 character) ============
    // A handful of small candy-colour boards bracketed off the facades — some
    // flat on the wall over a doorway, some hung perpendicular like a lane of
    // little shop signs. rng() shuffles which board takes which hue.
    let k = 0;
    for (let u = 0; u < units.length; u++) {
      const { x, h } = units[u];
      const ssY = PLY + h * 0.46; // signboard band sits at the floor split
      // flat board mounted on the wall above the shop door, with a thin pale
      // base strip baked in via the vertical gradient (cheap painted-sign look)
      parts.push(box(0.5, 0.2, 0.05, sign(k++), { x, y: ssY, z: FZ + 0.04, hex2: TRIM }));
    }
    // one projecting hanging sign (a perpendicular blade on a dark bracket) —
    // the lane-of-shops silhouette cue, kept singular for the triangle budget
    {
      const hx = 0.62;
      const hy = 1.04;
      parts.push(box(0.06, 0.04, 0.26, SIGNPOLE, { x: hx, y: hy + 0.12, z: FZ + 0.14 })); // bracket arm
      parts.push(box(0.05, 0.26, 0.2, sign(k++), { x: hx, y: hy, z: FZ + 0.22 })); // hanging blade
    }

    // === 5) POTTED PLANTS ON THE LANE (street-level greenery) ===============
    // A terracotta planter on the pavement out front ties the cluster to its
    // leafy, hand-tended courtyard feel — a round (cyl) pot with a bushy crown.
    const gj = (rng() - 0.5) * 0.1;
    parts.push(cyl(0.13, 0.1, 0.2, 6, POT, { x: -1.5 + gj, y: PLY + 0.06, z: 0.72 })); // big terracotta pot (round planter)
    parts.push(box(0.26, 0.26, 0.24, LEAF, { x: -1.5 + gj, y: PLY + 0.3, z: 0.72 })); // bushy foliage

    return finish(parts);
  },
};

export default NM_SJSS_VILLAGE;
