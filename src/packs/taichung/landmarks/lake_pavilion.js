/**
 * @file packs/taichung/landmarks/lake_pavilion.js — Roll Formosa Taichung pack, hero landmark.
 *
 * 湖心亭 (Lake Pavilion, 台中公園) — the icon on Taichung's city emblem. NOT a hall
 * or a tower: a pair of LINKED open pavilions standing OUT ON THE WATER, each a ring
 * of slender WHITE pillars carrying a tall RED pointed roof (a 4-sided pyramid with a
 * flared, up-turned lower eave and a little gold finial spike). The two pavilions —
 * one larger, one smaller — are joined by a short walkway, the whole group sitting on
 * a round BLUE pond pan. Light, airy, lakeside: white pillars + red peaked roofs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding sphere
 * (radius 1), so this is authored in unit-ish space with the correct PROPORTIONS —
 * water disc wide + low, two slender pavilions rising from it, RED pyramidal roofs the
 * dominant read. rng is tiny non-structural jitter only.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — lakeside pavilion materials.
const WATER = 0x4a7fa6; // 藍色水面 (the pond pan the pavilions stand on)
const WATER_D = 0x3a6b90; // deeper water toward the rim (gradient bottom)
const STONE = 0xe6e0d2; // pale stone deck / pier the pillars rise from
const STONE_D = 0xc9c2b2; // step / deck shading
const WHITE = 0xf0ece0; // 白柱 (the slender white pillars + railing)
const WHITE_D = 0xd8d2c4; // shaded pillar side
const RED = 0xcf3a3a; // 紅頂 (the signature red pyramidal roof)
const RED_D = 0xa82b2b; // deeper red on the under-eave / ridge shadow
const GOLD = 0xd9b24a; // 寶頂 finial spike + tiny eave-corner tips

/**
 * Author ONE open pavilion centered at (cx,0,cz): a thin stone deck, four slender
 * white corner pillars, a tying eave beam, and a tall RED roof = a flared up-turned
 * lower eave (wide shallow 4-pyramid) under a steeper red pyramid, topped by a gold
 * finial spike. Pushes parts into `out`.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx       pavilion center x
 * @param {number} cz       pavilion center z
 * @param {number} hw       half-footprint (x & z) — pavilion radius
 * @param {number} deckY    top-of-water height the deck sits at
 * @param {number} colH     pillar height (deck to eave)
 * @param {number} roofRise red pyramid rise above the eave
 * @param {number} jit      tiny non-structural jitter for the finial
 */
function pavilion(out, cx, cz, hw, deckY, colH, roofRise, jit) {
  // Stone deck the pavilion stands on, just above the water surface.
  out.push(box(hw * 2 + 0.14, 0.12, hw * 2 + 0.14, STONE, { x: cx, y: deckY + 0.06, z: cz, hex2: STONE_D }));
  // Low white railing skirt around the open deck (reads as the 欄杆 perimeter).
  out.push(box(hw * 2 + 0.18, 0.14, 0.06, WHITE, { x: cx, y: deckY + 0.2, z: cz + hw, hex2: WHITE_D }));
  out.push(box(hw * 2 + 0.18, 0.14, 0.06, WHITE, { x: cx, y: deckY + 0.2, z: cz - hw, hex2: WHITE_D }));

  // Four slender square white pillars at the corners — SQUARE columns (seg=4, ry=PI/4).
  const pillarTop = deckY + 0.12 + colH;
  const colCY = deckY + 0.12 + colH / 2;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(
        cyl(0.07, 0.08, colH, 4, WHITE, {
          x: cx + sx * hw * 0.82,
          y: colCY,
          z: cz + sz * hw * 0.82,
          ry: PI / 4,
          hex2: WHITE_D,
        })
      );
    }
  }
  // White tying eave beam ring under the roof (架枋 lintel) + a thin red fascia band.
  out.push(box(hw * 2 + 0.1, 0.12, hw * 2 + 0.1, WHITE, { x: cx, y: pillarTop + 0.04, z: cz, hex2: WHITE_D }));
  out.push(box(hw * 2 + 0.2, 0.07, hw * 2 + 0.2, RED_D, { x: cx, y: pillarTop + 0.12, z: cz }));

  // RED roof — the visual hero. (1) wide shallow flared eave = up-turned eave read;
  // (2) steeper main red pyramid; (3) a small deep-red ridge cap; (4) gold finial.
  const eaveY = pillarTop + 0.14;
  out.push(cone(hw * 1.55, roofRise * 0.34, 4, RED, { x: cx, y: eaveY + roofRise * 0.17, z: cz, ry: PI / 4, hex2: RED_D }));
  out.push(cone(hw * 1.18, roofRise, 4, RED, { x: cx, y: eaveY + roofRise * 0.5 + 0.04, z: cz, ry: PI / 4, hex2: RED_D }));
  // Gold finial spike crowning the apex (寶頂).
  const apexY = eaveY + roofRise + 0.04;
  out.push(cyl(0.05, 0.09, 0.16, 4, GOLD, { x: cx, y: apexY + 0.06, z: cz, ry: PI / 4 }));
  out.push(cone(0.045, 0.16, 4, GOLD, { x: cx, y: apexY + 0.2 + jit, z: cz, ry: PI / 4 }));
}

export const NM_LAKE_PAVILION = {
  id: 'lake_pavilion',
  name: '湖心亭',
  landmarkId: 4,
  dioramaRHint: 8, // small lakeside pavilion footprint (metres)
  colorHex: RED, // the red pyramidal roof — the silhouette read color
  buildGeometry(rng) {
    const jit = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finials
    const parts = [];

    // ---- Round BLUE pond pan the pavilions stand out on (wide + low) ------
    // A many-sided cylinder reads as the circular pond; a slim pale stone rim
    // rings it (the 護岸 / lake edge), and a faint inner disc lifts the decks.
    parts.push(cyl(2.5, 2.5, 0.22, 16, WATER, { y: 0.11, hex2: WATER_D }));
    parts.push(cyl(2.62, 2.62, 0.1, 16, STONE, { y: 0.05, hex2: STONE_D })); // stone lake-edge rim
    const waterTop = 0.22;

    // ---- The two LINKED pavilions (one larger, one smaller) --------------
    // Larger main pavilion, off-center one way.
    pavilion(parts, -0.62, 0.0, 0.62, waterTop, 0.92, 1.05, jit);
    // Smaller companion pavilion, off-center the other way.
    pavilion(parts, 0.92, 0.18, 0.46, waterTop, 0.74, 0.82, -jit);

    // ---- Short walkway / 拱橋 deck joining the two pavilions ---------------
    // A pale stone deck bridging the gap, with a thin white handrail each side.
    parts.push(box(1.0, 0.1, 0.5, STONE, { x: 0.18, y: waterTop + 0.18, z: 0.08, rz: -0.04, hex2: STONE_D }));
    for (const sz of [-1, 1]) {
      parts.push(box(1.0, 0.13, 0.05, WHITE, { x: 0.18, y: waterTop + 0.3, z: 0.08 + sz * 0.24, hex2: WHITE_D }));
    }
    // Two little posts where the walkway meets the larger pavilion deck.
    for (const sz of [-1, 1]) {
      parts.push(cyl(0.04, 0.05, 0.18, 4, WHITE, { x: -0.28, y: waterTop + 0.21, z: 0.08 + sz * 0.24, ry: PI / 4 }));
    }

    return finish(parts);
  },
};

export default NM_LAKE_PAVILION;
