/**
 * @file packs/kaohsiung/landmarks/cijin_lighthouse.js — Roll Formosa Kaohsiung pack landmark.
 *
 * NM_CIJIN_LIGHTHOUSE — 旗津燈塔 (Cijin / Cihou Lighthouse), the white octagonal
 * lighthouse standing on 旗後山 at the mouth of Kaohsiung harbour. A curated hero
 * geometry, NOT a repeatable chunk archetype: a low whitewashed masonry base, a
 * slender white OCTAGONAL tapering shaft (eight flat faces), a railed gallery
 * balcony, a glazed lantern room with a black domed cap and a small finial. Tall +
 * slender so the lighthouse silhouette reads against the 港都 skyline.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with the correct
 * lighthouse PROPORTIONS (tall + slender, eight-sided taper — NOT a fat tower).
 * The integration step owns the size-ladder; dioramaRHint is the real-world hint.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — lighthouse materials.
const WHITE = 0xf0f0ea; // whitewashed octagonal shaft (signature off-white)
const WHITE_D = 0xd8d8d0; // shaded lower band of the shaft (vertical gradient bottom)
const STONE = 0xc4bfb2; // 旗後山 grey-tan masonry base / plinth
const STONE_D = 0xa8a294; // darker base stone for the shadow gradient
const DARK = 0x2b2f33; // black-grey gallery railing / lantern frame / dome
const GLASS = 0x9fd0d8; // pale cyan lantern-room glazing
const BRASS = 0xc9a14a; // small brass finial atop the dome

/** PI/8 — orient the octagon's flat faces to face front (+Z) and the cardinals. */
const OCT_FACE = PI / 8;

export const NM_CIJIN_LIGHTHOUSE = {
  id: 'cijin_lighthouse',
  name: '旗津燈塔',
  dioramaRHint: 40, // ~ rocky-hilltop footprint-to-tip hint in metres
  colorHex: 0xf0f0ea, // the lighthouse's signature off-white
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finial
    const parts = [];

    // ---- 1) Rocky hilltop plinth + masonry base (low + wide) -------------
    parts.push(cyl(0.62, 0.74, 0.30, 8, STONE, { ry: OCT_FACE, y: 0.15, hex2: STONE_D })); // rocky 旗後山 plinth
    parts.push(cyl(0.50, 0.54, 0.36, 8, STONE, { ry: OCT_FACE, y: 0.48, hex2: STONE_D })); // masonry octagonal base
    parts.push(box(1.08, 0.06, 1.08, STONE_D, { ry: OCT_FACE, y: 0.665 })); // base cornice ring

    // ---- 2) Slender white OCTAGONAL tapering shaft ----------------------
    // An 8-sided cyl is an octagon; spin ry = PI/8 so a flat face fronts +Z.
    // Gentle taper (wider at base) reads as the lighthouse trunk.
    const shaftBot = 0.70;
    const shaftH = 1.78;
    parts.push(
      cyl(0.255, 0.345, shaftH, 8, WHITE, {
        ry: OCT_FACE,
        y: shaftBot + shaftH / 2,
        hex2: WHITE, // keep the trunk uniformly white; base band added below
      }) // octagonal lighthouse shaft
    );
    // A short shaded foot band so the lower trunk grounds visually.
    parts.push(
      cyl(0.33, 0.345, 0.26, 8, WHITE_D, { ry: OCT_FACE, y: shaftBot + 0.13, hex2: WHITE })
    );
    const shaftTop = shaftBot + shaftH; // top of the white shaft

    // ---- 3) Railed gallery balcony (the walk-around platform) -----------
    const galY = shaftTop;
    parts.push(cyl(0.40, 0.40, 0.06, 8, DARK, { ry: OCT_FACE, y: galY + 0.03 })); // gallery deck ring
    parts.push(box(0.74, 0.10, 0.74, WHITE, { ry: OCT_FACE, y: galY - 0.02 })); // corbelled deck support
    // eight short railing posts around the gallery rim
    const railR = 0.37;
    for (let i = 0; i < 8; i++) {
      const a = OCT_FACE + (i / 8) * PI * 2;
      parts.push(
        cyl(0.018, 0.018, 0.16, 4, DARK, {
          x: Math.sin(a) * railR,
          z: Math.cos(a) * railR,
          y: galY + 0.14,
        })
      ); // railing post
    }
    parts.push(cyl(0.39, 0.39, 0.025, 8, DARK, { ry: OCT_FACE, y: galY + 0.22, hex2: DARK })); // top rail ring

    // ---- 4) Glazed lantern room + black domed cap + finial -------------
    const lantBot = galY + 0.10;
    parts.push(cyl(0.265, 0.30, 0.10, 8, DARK, { ry: OCT_FACE, y: lantBot + 0.05 })); // lantern base frame
    parts.push(cyl(0.255, 0.265, 0.30, 8, GLASS, { ry: OCT_FACE, y: lantBot + 0.27, hex2: GLASS })); // glazed lantern room
    parts.push(cyl(0.285, 0.27, 0.06, 8, DARK, { ry: OCT_FACE, y: lantBot + 0.45 })); // lantern top frame ring
    // black domed cap (low cone + cap sphere) crowning the lantern
    const domeY = lantBot + 0.48;
    parts.push(cone(0.30, 0.22, 8, DARK, { ry: OCT_FACE, y: domeY + 0.11 })); // conical dome roof
    parts.push(sph(0.10, DARK, { ws: 8, hs: 4, y: domeY + 0.24 })); // dome crown cap
    parts.push(cyl(0.012, 0.022, 0.16, 6, BRASS, { y: domeY + 0.36 + r })); // brass spindle finial
    parts.push(sph(0.035, BRASS, { ws: 6, hs: 4, y: domeY + 0.46 })); // finial ball

    return finish(parts);
  },
};

export default NM_CIJIN_LIGHTHOUSE;
