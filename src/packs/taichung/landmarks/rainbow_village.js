/**
 * @file packs/taichung/landmarks/rainbow_village.js — Roll Formosa Taichung pack, hero LANDMARK.
 *
 * 彩虹眷村 (Rainbow Village, 南屯 Nantun). 彩虹爺爺 黃永阜 saved a doomed military
 * dependents' village by covering every wall, door and path with hand-painted folk
 * murals in saturated rainbow colour. Silhouette: a SMALL, SQUAT single-storey
 * cottage — a low brick-ish box body under a shallow gable (人字) roof — its every
 * surface tiled with bright candy-coloured paint blocks (紅/黃/青/粉/橘) and a few
 * painted dots/circles. Tiny, cute, riotously colourful — never tall, never grand.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): box + cyl. The
 * geometry math is an engine red line. finish() merges → recenters → normalizes to
 * a UNIT bounding sphere (radius 1), so this is authored with correct cottage
 * PROPORTIONS (wide + low) and absolute size is irrelevant. <= 600 tris. rng()
 * only re-shuffles which painted blocks pick which rainbow hue, so every instance
 * is painted a little differently — exactly like the real hand-painted walls.
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — 彩虹爺爺's folk-mural rainbow + the cottage shell.
const CREAM = 0xf2e6cf; // base wall canvas (warm off-white render he paints over)
const CREAM_D = 0xd9c7a6; // shadowed wall / under-eave gradient
const PLINTH = 0xb9aa8e; // earthy concrete path / plinth the village sits on
const DOOR = 0x2f6f8f; // teal painted doorway (a recurring colour in his work)
const RIDGE = 0x8a5a3a; // brick-red ridge tile capping the gable
// the candy mural colours — cycled across the painted blocks by rng()
const PAINT = [
  0xe23b3b, // 紅 vermilion
  0xf2b21e, // 黃 marigold
  0x2bb3a3, // 青 turquoise
  0xee6aa0, // 粉 pink
  0xf07f23, // 橘 orange
  0x3a6fd0, // 藍 cobalt (he uses blues too)
];

export const NM_RAINBOW_VILLAGE = {
  id: 'rainbow_village',
  name: '彩虹眷村',
  landmarkId: 3,
  dioramaRHint: 6, // a single squat 眷村 cottage — only a few metres across
  colorHex: 0xe23b3b, // the village reads as riotous red-led rainbow paint

  buildGeometry(rng) {
    const parts = [];
    // Per-instance hue rotation so the painted blocks are shuffled each spawn,
    // mimicking the hand-painted, never-identical real walls.
    const off = (rng() * PAINT.length) | 0;
    const hue = (i) => PAINT[(i + off) % PAINT.length];

    // ---- 1) Earthy concrete path / plinth the cottage sits on -------------
    parts.push(box(3.4, 0.18, 2.6, PLINTH, { y: 0.09, hex2: 0xa89878 }));
    // a couple of painted flagstones on the path (his floors are painted too)
    parts.push(box(0.7, 0.04, 0.7, hue(2), { y: 0.2, z: 1.0, rz: 0 }));
    parts.push(box(0.7, 0.04, 0.7, hue(4), { x: 0.85, y: 0.2, z: 0.95 }));
    parts.push(box(0.7, 0.04, 0.7, hue(0), { x: -0.85, y: 0.2, z: 0.95 }));

    // ---- 2) Squat single-storey cottage body (the painted canvas) ---------
    const bodyW = 2.6;
    const bodyH = 1.0;
    const bodyD = 1.7;
    const bodyY = 0.18; // sits on the plinth
    const cy = bodyY + bodyH / 2; // body centre height
    parts.push(box(bodyW, bodyH, bodyD, CREAM, { y: cy, hex2: CREAM_D }));

    const frontZ = bodyD / 2; // +z is the show face (3/4 view friendly)
    const sideX = bodyW / 2;
    const wallOut = 0.015; // lift painted blocks just proud of the wall

    // ---- 3) Painted mural blocks tiled across the FRONT wall --------------
    // A 4-wide × 3-tall quilt of bright square-ish blocks, leaving a doorway gap.
    const cols = [-0.92, -0.31, 0.31, 0.92];
    const rows = [cy - 0.3, cy + 0.0, cy + 0.3];
    const bw = 0.5;
    const bh = 0.26;
    let k = 0;
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < cols.length; c++) {
        // leave the second column's lower two rows open for the door
        if (c === 1 && r < 2) continue;
        parts.push(box(bw, bh, 0.04, hue(k++), { x: cols[c], y: rows[r], z: frontZ + wallOut }));
      }
    }
    // teal painted doorway set into that gap
    parts.push(box(0.42, 0.62, 0.06, DOOR, { x: cols[1], y: cy - 0.19, z: frontZ + wallOut }));
    // a small bright painted lintel dot above the door (his iconic round faces/suns)
    parts.push(cyl(0.12, 0.12, 0.05, 10, hue(1), { x: cols[1], y: cy + 0.34, z: frontZ + wallOut, rx: HALF_PI }));

    // a couple of painted round "eyes/suns" dotted on the front
    parts.push(cyl(0.1, 0.1, 0.05, 10, hue(3), { x: -0.62, y: cy + 0.32, z: frontZ + wallOut, rx: HALF_PI }));
    parts.push(cyl(0.1, 0.1, 0.05, 10, hue(5), { x: 0.62, y: cy - 0.32, z: frontZ + wallOut, rx: HALF_PI }));

    // ---- 4) Painted blocks wrapping the right SIDE wall (3/4 read) --------
    const sideCols = [-0.42, 0.42];
    const sideRows = [cy - 0.22, cy + 0.18];
    let s = 2;
    for (let r = 0; r < sideRows.length; r++) {
      for (let c = 0; c < sideCols.length; c++) {
        parts.push(box(0.04, 0.3, 0.62, hue(s++), { x: sideX + wallOut, y: sideRows[r], z: sideCols[c] }));
      }
    }
    // a painted dot on the side too
    parts.push(cyl(0.09, 0.09, 0.05, 10, hue(0), { x: sideX + wallOut, y: cy + 0.0, z: 0.0, ry: 0, rz: HALF_PI }));

    // ---- 5) Shallow gable (人字) roof — two tilted slabs to a ridge -------
    // Low pitch so the cottage stays squat; eaves overhang the painted walls.
    const eaveY = bodyY + bodyH; // roof springs from the wall top
    const pitch = 0.42; // gentle slope angle (radians)
    const slabW = bodyW + 0.5; // overhanging eaves
    const slabLen = bodyD * 0.78;
    const slabT = 0.09;
    const roofRise = (slabLen / 2) * Math.sin(pitch);
    const roofMidY = eaveY + roofRise * 0.5 + 0.04;
    for (const sgn of [1, -1]) {
      // base tile slab (each side of the gable)
      parts.push(
        box(slabW, slabT, slabLen, CREAM_D, {
          rx: -sgn * pitch,
          y: roofMidY,
          z: (sgn * slabLen) / 4,
        })
      );
      // bright painted stripes laid along each roof slab (his roofs are painted too)
      const stripeZ = (sgn * slabLen) / 4;
      for (let i = 0; i < 3; i++) {
        parts.push(
          box(slabW * 0.86, 0.03, 0.14, hue(i + sgn + 2), {
            rx: -sgn * pitch,
            y: roofMidY + slabT * 0.6,
            x: (i - 1) * (slabW * 0.28),
            z: stripeZ,
          })
        );
      }
    }
    // brick-red ridge tile capping the gable peak
    const ridgeY = eaveY + roofRise + 0.02;
    parts.push(box(slabW * 0.96, 0.1, 0.14, RIDGE, { y: ridgeY }));

    // gable end triangles (the little vertical wall under each roof slope) —
    // a short painted block fills the front gable so the peak doesn't read hollow
    parts.push(box(bodyW * 0.9, roofRise + 0.06, 0.06, hue(3), { y: eaveY + roofRise * 0.5, z: frontZ - 0.02 }));

    return finish(parts);
  },
};

export default NM_RAINBOW_VILLAGE;
