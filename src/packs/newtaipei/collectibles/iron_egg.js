/**
 * @file packs/newtaipei/collectibles/iron_egg.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_IRON_EGG — 鐵蛋 (Iron Egg). The famous Tamsui snack: eggs repeatedly
 * braised in spiced soy sauce and air-dried, resulting in a shrunken,
 * intensely flavored, chewy dark brown egg. Usually sold in small bags
 * or boxes. Shown as a small pile of these dark, shiny oval eggs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const EGG_DARK = 0x2a1a10;   // very dark brown egg
const EGG_MID = 0x3a2818;    // mid brown
const EGG_HI = 0x4a3820;     // highlight on shiny surface
const BAG = 0xf0e0c0;        // clear/cream plastic bag
const TIE = 0xd83030;        // red twist tie

export const COL_IRON_EGG = {
  id: 'iron_egg',
  name: '鐵蛋',
  colorHex: EGG_DARK, // dark egg read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Small pile of iron eggs ------------------------------------
    // Bottom layer - 3 eggs
    const eggPositions = [
      { x: -0.22, y: 0.18, z: 0.1 },
      { x: 0.2, y: 0.18, z: 0.15 },
      { x: 0.0, y: 0.18, z: -0.2 },
      // Top layer - 2 eggs
      { x: -0.05, y: 0.42, z: 0.0 },
      { x: 0.18, y: 0.4, z: -0.05 },
    ];

    for (let i = 0; i < eggPositions.length; i++) {
      const { x, y, z } = eggPositions[i];
      const col = i % 2 === 0 ? EGG_DARK : EGG_MID;
      // Egg shape - slightly elongated sphere
      parts.push(sph(0.2, col, {
        ws: 7, hs: 5,
        x, y, z,
        sy: 1.2, // elongate
        rx: (rng() - 0.5) * 0.4, // slight random tilt
        rz: (rng() - 0.5) * 0.4,
        hex2: EGG_HI,
      }));
    }

    // ---- 2) Clear plastic bag (partially visible) ----------------------
    // Bag wrapping around the eggs
    parts.push(cyl(0.5, 0.45, 0.6, 8, BAG, { y: 0.3, open: true }));
    // Gathered top of bag
    parts.push(cone(0.15, 0.25, 6, BAG, { y: 0.7 }));

    // ---- 3) Red twist tie at top ---------------------------------------
    parts.push(cyl(0.02, 0.02, 0.15, 4, TIE, { y: 0.82, rz: 0.5 }));
    parts.push(cyl(0.02, 0.02, 0.15, 4, TIE, { y: 0.82, rz: -0.5 }));

    // ---- 4) Product label ----------------------------------------------
    parts.push(box(0.25, 0.12, 0.02, 0xffffff, { x: 0, y: 0.4, z: 0.48 }));
    parts.push(box(0.2, 0.08, 0.025, 0xc83030, { x: 0, y: 0.4, z: 0.485 })); // "鐵蛋" text area

    return finish(parts);
  },
};

export default COL_IRON_EGG;
