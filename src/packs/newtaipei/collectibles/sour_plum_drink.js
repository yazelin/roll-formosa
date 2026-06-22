/**
 * @file packs/newtaipei/collectibles/sour_plum_drink.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_SOUR_PLUM_DRINK — 淡水酸梅湯 (Tamsui Sour Plum Drink). A refreshing
 * traditional drink famous along the Tamsui waterfront. Served in a tall
 * plastic cup with ice, deep reddish-brown color, straw, and often sold
 * from street vendors in the old street area.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const DRINK = 0x6a2020;      // deep reddish-brown sour plum
const DRINK_HI = 0x8a3030;   // lighter top
const ICE = 0xd0e8f0;        // ice cubes
const CUP = 0xf0f0f0;        // clear/white plastic cup
const STRAW = 0x40a040;      // green straw (common color)
const LID = 0xf8f8f8;        // plastic dome lid

export const COL_SOUR_PLUM_DRINK = {
  id: 'sour_plum_drink',
  name: '淡水酸梅湯',
  colorHex: DRINK, // plum drink read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Plastic cup body -------------------------------------------
    // Tapered cup
    parts.push(cyl(0.32, 0.4, 0.85, 10, CUP, { y: 0.425 }));
    // Cup interior (darker to show depth)
    parts.push(cyl(0.3, 0.38, 0.8, 10, 0xe8e8e8, { y: 0.45 }));

    // ---- 2) Sour plum drink filling ------------------------------------
    parts.push(cyl(0.28, 0.36, 0.7, 10, DRINK, { y: 0.4, hex2: DRINK_HI }));

    // ---- 3) Ice cubes floating at top ----------------------------------
    const icePos = [
      { x: 0.08, z: 0.08 },
      { x: -0.1, z: 0.05 },
      { x: 0.0, z: -0.1 },
      { x: 0.12, z: -0.05 },
      { x: -0.08, z: -0.08 },
    ];
    for (const { x, z } of icePos) {
      parts.push(box(0.08, 0.06, 0.08, ICE, {
        x, y: 0.75, z,
        ry: rng() * PI,
        rx: rng() * 0.3,
      }));
    }

    // ---- 4) Dome lid ---------------------------------------------------
    parts.push(cyl(0.42, 0.4, 0.04, 10, LID, { y: 0.87 })); // lid base
    // Dome top
    parts.push(sph(0.38, LID, {
      ws: 8, hs: 4,
      y: 0.91,
      sy: 0.4,
      thetaLen: HALF_PI,
    }));
    // Straw hole
    parts.push(cyl(0.04, 0.04, 0.08, 6, 0x3a3a3a, { x: 0.1, y: 0.98 }));

    // ---- 5) Straw ------------------------------------------------------
    parts.push(cyl(0.03, 0.03, 0.6, 6, STRAW, {
      x: 0.1, y: 0.7,
      rz: -0.1, // slight angle
    }));
    // Bendy part
    parts.push(cyl(0.035, 0.035, 0.08, 6, STRAW, {
      x: 0.12, y: 1.05,
      rz: -0.5,
    }));
    // Top part of straw
    parts.push(cyl(0.03, 0.03, 0.15, 6, STRAW, {
      x: 0.18, y: 1.15,
      rz: -0.8,
    }));

    // ---- 6) Cup base ---------------------------------------------------
    parts.push(cyl(0.3, 0.32, 0.05, 10, CUP, { y: 0.025 }));

    return finish(parts);
  },
};

export default COL_SOUR_PLUM_DRINK;
