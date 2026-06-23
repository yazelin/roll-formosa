/**
 * @file packs/changhua/collectibles/kongrou_rice.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_KONGROU_RICE — 爌肉飯 (braised pork rice), another signature Changhua dish.
 * Silhouette: a bowl of white rice topped with a thick slice of braised pork
 * belly (with layers of fat and meat), drizzled with dark braising sauce,
 * and garnished with pickled mustard greens (酸菜) and a soft-boiled egg half.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const RICE = 0xf8f4e8;        // white rice
const MEAT = 0x7a4830;        // braised pork meat layer
const FAT = 0xf0e0c8;         // pork fat layer
const SKIN = 0x8a5838;        // pork skin
const SAUCE = 0x4a2818;       // dark braising sauce
const PICKLE = 0xa8b860;      // pickled mustard greens
const EGG_WHITE = 0xf8f0e0;   // egg white
const EGG_YOLK = 0xe8a830;    // egg yolk
const BOWL = 0xeeeee8;        // bowl

export const COL_KONGROU_RICE = {
  id: 'kongrou_rice',
  name: '爌肉飯',
  collectibleId: 2,
  colorHex: MEAT,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020201);
    const parts = [];

    // Bowl
    parts.push(cyl(0.85, 0.72, 0.35, 10, BOWL, { y: 0.175, open: true }));
    parts.push(cyl(0.68, 0.68, 0.04, 8, BOWL, { y: 0.02 }));

    // White rice mound
    parts.push(sph(0.60, RICE, { ws: 10, hs: 4, y: 0.42, sy: 0.55, thetaLen: HALF_PI }));

    // Braised pork belly slice (layers of meat/fat/skin)
    const porkY = 0.68;
    parts.push(box(0.50, 0.08, 0.40, SKIN + t, { y: porkY + 0.20 })); // skin on top
    parts.push(box(0.50, 0.12, 0.40, FAT, { y: porkY + 0.10 })); // fat layer
    parts.push(box(0.50, 0.16, 0.40, MEAT, { y: porkY - 0.04 })); // meat layer

    // Braising sauce drizzle
    parts.push(sph(0.55, SAUCE, { ws: 8, hs: 3, y: 0.45, sy: 0.10, thetaLen: HALF_PI }));

    // Pickled mustard greens (酸菜) on the side
    parts.push(box(0.20, 0.08, 0.25, PICKLE, { x: -0.35, y: 0.48, z: 0.15 }));

    // Soft-boiled egg half
    parts.push(sph(0.18, EGG_WHITE, { ws: 6, hs: 4, x: 0.32, y: 0.52, z: -0.15, sy: 0.60, thetaLen: HALF_PI }));
    parts.push(sph(0.10, EGG_YOLK, { ws: 5, hs: 3, x: 0.32, y: 0.55, z: -0.15, sy: 0.50 }));

    return finish(parts);
  },
};

export default COL_KONGROU_RICE;
