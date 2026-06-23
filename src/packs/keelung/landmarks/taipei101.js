/**
 * @file packs/taipei/landmarks/taipei101.js — Roll Formosa hero landmark.
 *
 * NM_TAIPEI101 — 台北101, THE GOAL MONUMENT. The iconic supertall: a tapered
 * pedestal base, eight stacked "bamboo segment" sections that each flare
 * slightly WIDER toward their top (the inverted-trapezoid 斗 / pagoda look),
 * a square shaft above the segments, and a tall spire/antenna crowning it.
 * A small gold sphere motif (the 如意 / wish-fulfilment medallion) rides the
 * face of each segment. Tall + slender — the tallest, slenderest model so the
 * player can spot the goal from across Taipei.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. Square cross-sections come from cyl(...) with seg=4, rotated so a
 * flat face points down +Z. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Glass curtain-wall colors — the famous blue-green tint, brightened toward the
// top of each segment for the lit-night feel; darker steel mullions between.
const GLASS_LO = 0x2f6a78; // cool blue-green glass (segment bottom, in shadow)
const GLASS_HI = 0x68c8c8; // bright teal glass (segment top, catching light)
const MULLION = 0x1c3a44; // dark steel transom band between segments
const GOLD = 0xf2c64a; // 如意 medallion gold
const STEEL = 0xb9c2c8; // light steel for the shaft / spire base
const SPIRE = 0xdfe6ea; // pale metallic antenna

export const NM_TAIPEI101 = {
  id: 'taipei_101',
  name: '台北101',
  landmarkId: 8,
  dioramaRHint: 508, // real structural height ≈ 508 m (roof+spire)
  colorHex: GLASS_HI,

  buildGeometry(rng) {
    // Square cross-section: a 4-sided cyl is a square rotated 45°, so spin it
    // ry = PI/4 to land flat faces on the cardinal directions. r passed to cyl
    // is the circumradius; half-width = r * cos(45°) ≈ r * 0.7071.
    const FACE = HALF_PI / 2; // PI/4 — orient square faces to the axes
    const parts = [];

    // ---- 1) Tapered pedestal base (the splayed podium skirt) ---------------
    // Wider at the ground, narrowing up to where the first bamboo segment sits.
    parts.push(cyl(0.62, 0.92, 0.55, 4, 0x3a4650, { ry: FACE, y: 0.275, hex2: 0x4a5660 })); // splayed podium
    parts.push(box(1.5, 0.12, 1.5, 0x2c343c, { y: 0.06 })); // ground plinth slab
    parts.push(cyl(0.46, 0.62, 0.5, 4, GLASS_LO, { ry: FACE, y: 0.78, hex2: 0x3f7e88 })); // base glass collar

    // ---- 2) Eight inverted-trapezoid "bamboo" segments ---------------------
    // Each segment flares WIDER toward its top (rTop > rBot), then the next one
    // starts narrower again — the stacked-斗 silhouette. They climb the tower.
    const segH = 0.62; // height of one bamboo segment
    const segBot = 1.05; // y where the first segment base starts
    const rNarrow = 0.30; // circumradius at a segment's NARROW (bottom) edge
    const rWide = 0.40; // circumradius at a segment's WIDE (top) edge — the flare
    const gap = 0.07; // thin mullion transom between consecutive segments

    for (let i = 0; i < 8; i++) {
      const yBot = segBot + i * (segH + gap);
      const yMid = yBot + segH / 2;
      // Trapezoid wall: cyl(rTop, rBot, h) — top radius larger than bottom => flares out toward top.
      parts.push(
        cyl(rWide, rNarrow, segH, 4, GLASS_LO, { ry: FACE, y: yMid, hex2: GLASS_HI }) // bamboo segment glass
      );
      // Dark transom cap at the flared top lip of the segment (the step shadow).
      const lipW = rWide * 1.4142 + 0.03;
      parts.push(box(lipW, 0.05, lipW, MULLION, { y: yBot + segH })); // segment top transom
      // Gold 如意 medallion on the +Z (camera) face of each segment.
      parts.push(box(0.16, 0.16, 0.04, GOLD, { y: yMid, z: rWide * 0.72 })); // 如意 medallion
    }

    const topOfSegs = segBot + 8 * (segH + gap); // y at the top of the 8th segment

    // ---- 3) Square shaft above the bamboo segments -------------------------
    // A short straight square block crowning the stacked segments before the spire.
    const shaftH = 0.42;
    parts.push(
      cyl(0.30, 0.34, shaftH, 4, GLASS_LO, { ry: FACE, y: topOfSegs + shaftH / 2, hex2: 0x5aaeb6 }) // crown shaft
    );
    const shaftTop = topOfSegs + shaftH;
    parts.push(box(0.62, 0.06, 0.62, MULLION, { y: shaftTop })); // shaft parapet ring

    // ---- 4) Pinnacle box + tall spire / antenna ----------------------------
    parts.push(box(0.30, 0.16, 0.30, STEEL, { y: shaftTop + 0.08 })); // pinnacle housing
    parts.push(cyl(0.10, 0.16, 0.30, 8, STEEL, { y: shaftTop + 0.31 })); // tapered spire base
    parts.push(cyl(0.018, 0.05, 1.05, 6, SPIRE, { y: shaftTop + 0.98 })); // tall antenna spire
    parts.push(sph(0.045, 0xff5a4a, { ws: 6, hs: 4, y: shaftTop + 1.52 })); // aircraft warning light (lit red)

    return finish(parts);
  },
};

export default NM_TAIPEI101;
