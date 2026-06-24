/**
 * @file packs/taoyuan/collectibles/hakka_leicha.js — Roll Formosa Taoyuan pack, COLLECTIBLE.
 *
 * COL_LEICHA — 客家擂茶 (Hakka ground tea, a signature of Taoyuan's large Hakka
 * districts 龍潭/楊梅/中壢). Silhouette: a wide ridged ceramic grinding bowl
 * (擂缽) holding a mound of green tea paste with scattered seeds, a long wooden
 * pestle (擂棍) leaning out of it at an angle. A small hand-held bowl — wide and
 * squat, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges the paste tint.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_LEICHA = {
  id: 'hakka_leicha',
  name: '客家擂茶',
  collectibleId: 7,
  colorHex: 0x7a9a4e, // green tea paste

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020301);
    const paste = 0x7a9a4e + t; // green tea paste
    const pasteHi = 0x97b566;
    const bowl = 0xd9b98a; // earthy ceramic 擂缽
    const bowlDk = 0xbe9d6f;
    const rim = 0xc8a877;
    const wood = 0xc6a263; // 擂棍 pestle
    const seed = 0xe7dcc0; // sesame/peanut seeds

    const parts = [];
    // ridged ceramic grinding bowl (tapered)
    parts.push(cyl(0.98, 0.58, 0.74, 16, bowl, { y: 0.44, hex2: bowlDk }));
    parts.push(cyl(1.0, 0.94, 0.12, 16, rim, { y: 0.78, open: true }));
    parts.push(cyl(0.58, 0.58, 0.05, 8, bowlDk, { y: 0.06 }));
    // green tea-paste surface + mound
    parts.push(cyl(0.86, 0.86, 0.06, 16, paste, { y: 0.74, hex2: pasteHi }));
    parts.push(sph(0.6, paste, { ws: 12, hs: 6, sy: 0.4, y: 0.82, hex2: pasteHi }));
    // scattered seeds on the paste
    parts.push(sph(0.08, seed, { ws: 4, hs: 3, x: 0.18, z: 0.1, y: 1.0 }));
    parts.push(sph(0.07, seed, { ws: 4, hs: 3, x: -0.2, z: -0.08, y: 0.98 }));
    parts.push(sph(0.07, seed, { ws: 4, hs: 3, x: 0.04, z: 0.26, y: 0.98 }));
    // long wooden pestle leaning out of the bowl
    parts.push(cyl(0.09, 0.11, 1.9, 8, wood, { x: 0.34, y: 1.34, z: 0.04, rz: 0.42, hex2: 0xb38f54 }));
    parts.push(sph(0.13, wood, { ws: 6, hs: 4, x: -0.06, y: 0.62, z: 0.04 })); // pestle head buried in paste

    return finish(parts);
  },
};

export default COL_LEICHA;
