/**
 * @file packs/taoyuan/collectibles/daxi_top.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_TOP — 大溪陀螺 (Daxi spinning top, the town's iconic giant wooden top).
 * Silhouette: a fat painted wooden top — a broad rounded shoulder tapering to a
 * sharp metal spinning tip at the bottom, a flat crown on top with painted
 * color rings, and a length of winding string looped around its waist. A small
 * hand-held toy — round-shouldered, point down.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges paint tint.
 */

import { cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_TOP = {
  id: 'daxi_top',
  name: '大溪陀螺',
  collectibleId: 8,
  colorHex: 0xb5532e, // painted wood red-brown

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201);
    const wood = 0xb5532e + t; // red-brown painted wood
    const woodHi = 0xcf6c40;
    const ring1 = 0xe2b23c; // gold paint ring
    const ring2 = 0xf2efe6; // cream paint ring
    const metal = 0x9aa1a6; // steel spin tip
    const string = 0xd8c79a; // hemp string

    const parts = [];
    // SHOULDER — the widest part, a squashed dome (round top of the top)
    parts.push(sph(0.95, wood, { ws: 14, hs: 7, sy: 0.62, y: 0.95, hex2: woodHi }));
    // BODY — one continuous cone tapering DOWN from the shoulder to the point
    // (cone apex is +y by default; rx:PI flips it so the point faces down)
    parts.push(cone(0.95, 1.5, 14, wood, { y: 0.2, rx: PI, hex2: woodHi }));
    // flat wooden CROWN disc on top
    parts.push(cyl(0.46, 0.52, 0.12, 12, wood, { y: 1.34, hex2: woodHi }));
    // painted color rings around the widest shoulder
    parts.push(cyl(0.97, 0.97, 0.12, 14, ring1, { y: 0.95, open: true }));
    parts.push(cyl(0.78, 0.78, 0.09, 14, ring2, { y: 1.14, open: true }));
    // steel spinning TIP at the bottom point
    parts.push(cone(0.14, 0.36, 8, metal, { y: -0.66, rx: PI }));
    // hemp STRING looped around the shoulder
    parts.push(torus(0.84, 0.055, 6, 14, string, { y: 1.02, rx: HALF_PI }));

    return finish(parts);
  },
};

export default COL_TOP;
