/**
 * @file packs/keelung/collectibles/paopao_ice.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_PAOPAO — 泡泡冰 (Keelung Miaokou whipped shaved ice). Silhouette: a short
 * tapered paper cup brimming with a big rounded scoop of pale-green 情人果
 * (green-mango) whipped ice that overflows the rim, with a flat wooden spoon
 * stuck in at a jaunty angle. A small hand-held cup — wide and squat, never a
 * tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read. <= 350 triangles
 * (collectible budget). rng() only nudges the ice tint, never structure.
 */

import { cyl, sph, box, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_PAOPAO = {
  id: 'paopao_ice',
  name: '泡泡冰',
  collectibleId: 11,
  colorHex: 0xbfe39a, // pale 情人果 green ice

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x030502); // tiny per-instance ice tint nudge
    const ice = 0xbfe39a + t; // pale green-mango whipped ice
    const iceHi = 0xd6f0b8; // lighter ice highlight
    const cup = 0xf2f4f5; // white paper cup
    const cupBand = 0x57a6c9; // blue cup print band
    const wood = 0xcaa770; // wooden spoon

    const parts = [];

    // --- paper CUP (tapered, squat) -------------------------------------
    parts.push(cyl(0.78, 0.6, 1.1, 14, cup, { y: 0.55, hex2: 0xe6eaec }));
    // printed blue band around the cup
    parts.push(cyl(0.8, 0.74, 0.22, 14, cupBand, { y: 0.62, open: true }));
    // bright rim lip at the mouth
    parts.push(cyl(0.82, 0.8, 0.06, 12, 0xfbfdfd, { y: 1.1 }));
    // cup base disc
    parts.push(cyl(0.6, 0.6, 0.04, 6, 0xe2e7e9, { y: 0.04 }));

    // --- whipped ICE dome overflowing the rim ---------------------------
    // big flattened hemisphere mound + a couple smaller scoops for a swirly read
    parts.push(sph(0.92, ice, { ws: 14, hs: 7, sy: 0.78, y: 1.18, hex2: iceHi }));
    parts.push(sph(0.4, ice, { ws: 8, hs: 5, sy: 0.85, x: 0.28, z: 0.18, y: 1.74, hex2: iceHi }));
    parts.push(sph(0.32, ice, { ws: 8, hs: 5, sy: 0.85, x: -0.26, z: -0.16, y: 1.78, hex2: iceHi }));
    // little overflow lump spilling over one side of the rim
    parts.push(sph(0.28, ice, { ws: 6, hs: 4, sy: 0.7, x: 0.62, z: 0.0, y: 1.18, hex2: iceHi }));

    // --- wooden SPOON stuck in at a jaunty angle ------------------------
    // flat handle (thin box) leaning out, with a small scoop bowl at the buried end
    parts.push(box(0.12, 1.25, 0.05, wood, { x: -0.28, y: 2.05, z: 0.06, rz: 0.34, hex2: 0xb8945e }));
    parts.push(sph(0.17, wood, { ws: 6, hs: 4, sy: 0.4, x: -0.62, y: 1.45, z: 0.06, rz: 0.34 }));

    return finish(parts);
  },
};

export default COL_PAOPAO;
