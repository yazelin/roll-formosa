/**
 * @file packs/newtaipei/collectibles/agei.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_AGEI — 阿給 (Agei). The signature Tamsui delicacy: deep-fried tofu skin
 * pocket stuffed with glass noodles and sealed with fish paste, served with
 * sweet chili sauce. Golden-brown fried exterior, visible noodle stuffing
 * peeking out, on a small plate.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 */

import { cyl, sph, box, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const TOFU = 0xd4a050;       // golden fried tofu skin
const TOFU_HI = 0xe8b868;    // lighter tofu highlight
const NOODLE = 0xf0e8d0;     // glass noodles (transparent-ish white)
const PASTE = 0xe8d0a8;      // fish paste seal
const SAUCE = 0xc83030;      // sweet chili sauce
const PLATE = 0xf4f4f0;      // white plate

export const COL_AGEI = {
  id: 'agei',
  name: '阿給',
  colorHex: TOFU, // golden tofu read color

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x101010); // slight color variation
    const tofu = TOFU + t;
    const parts = [];

    // ---- 1) Small plate ------------------------------------------------
    parts.push(cyl(0.9, 0.95, 0.08, 10, PLATE, { y: 0.04 }));
    parts.push(cyl(0.75, 0.8, 0.04, 10, 0xf8f8f4, { y: 0.08 })); // plate well

    // ---- 2) Agei body (tofu pocket shape) ------------------------------
    // Irregular pillow shape - squashed sphere
    parts.push(sph(0.55, tofu, { ws: 8, hs: 6, y: 0.45, sy: 0.7, hex2: TOFU_HI }));

    // ---- 3) Opening showing glass noodles ------------------------------
    // The top of the agei has an opening stuffed with noodles
    parts.push(cyl(0.25, 0.3, 0.1, 8, NOODLE, { y: 0.68 })); // visible noodle bundle
    // Fish paste seal around the opening
    parts.push(cyl(0.32, 0.28, 0.06, 8, PASTE, { y: 0.62 }));

    // ---- 4) Sweet chili sauce drizzle ----------------------------------
    // Sauce on top
    parts.push(sph(0.08, SAUCE, { ws: 5, hs: 3, x: 0.1, y: 0.72, z: 0.05 }));
    parts.push(sph(0.06, SAUCE, { ws: 4, hs: 3, x: -0.08, y: 0.7, z: -0.08 }));
    // Sauce pooling on plate
    parts.push(cyl(0.2, 0.22, 0.02, 8, SAUCE, { x: 0.3, y: 0.1, z: 0.25 }));

    // ---- 5) Fried texture bumps ----------------------------------------
    // Small bumps on the tofu surface for fried texture
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * PI * 2;
      const r = 0.38;
      parts.push(sph(0.08, TOFU_HI, {
        ws: 4, hs: 3,
        x: Math.cos(a) * r,
        y: 0.4,
        z: Math.sin(a) * r,
      }));
    }

    return finish(parts);
  },
};

export default COL_AGEI;
