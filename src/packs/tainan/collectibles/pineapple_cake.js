/**
 * @file packs/tainan/collectibles/pineapple_cake.js — Roll Formosa Tainan pack,
 * COLLECTIBLE (rare-album item the ball rolls up).
 *
 * COL_PINEAPPLE — 蝦仁飯 (shrimp rice). Tainan's classic shrimp-over-rice: a
 * shallow bowl of glistening rice tinted warm-tan from the shrimp broth, heaped
 * into a low dome and topped with several plump pink shrimp and a scatter of
 * green-onion bits. A small hand-held bowl — wide-and-low, the rice mound just
 * cresting the rim.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) carry the
 * read: a broth-tinted rice dome studded with pink shrimp.
 *
 * Palette: warm-tan broth rice, pink shrimp, green onion, white bowl. rng()
 * only nudges the toppings a hair — never structure. <= 350 triangles.
 */

import { cyl, cone, sph, torus, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

export const COL_PINEAPPLE = {
  id: 'pineapple_cake',
  name: '蝦仁飯',
  collectibleId: 5,
  colorHex: 0xe6c878, // warm broth-tinted rice

  buildGeometry(rng) {
    const rice = 0xe6c878;     // warm-tan broth rice
    const riceHi = 0xf4dd9e;   // brighter glistening grains
    const bowlWhite = 0xf4f1e8; // white ceramic bowl
    const bowlShade = 0xddd8c9; // bowl shadow
    const bowlRim = 0xc4654a;   // terracotta painted rim
    const shrimp = 0xf2856a;    // plump boiled shrimp
    const shrimpHi = 0xf7a890;  // shrimp highlight
    const onion = 0x6fa838;     // green-onion bit

    const j = (a) => (rng() - 0.5) * a;

    const parts = [
      // --- WHITE BOWL ------------------------------------------------------
      cyl(1.5, 1.0, 0.85, 9, bowlWhite, { y: 0.0, open: true, hex2: bowlShade }),
      cone(1.0, 0.42, 8, bowlWhite, { y: -0.55, hex2: bowlShade }), // floor
      torus(1.5, 0.07, 3, 9, bowlRim, { rx: HALF_PI, y: 0.42 }),    // painted rim

      // --- RICE DOME (heaped mound cresting the rim) ----------------------
      sph(1.18, rice, { ws: 8, hs: 3, thetaLen: HALF_PI, sy: 0.62, y: 0.18, hex2: riceHi }),
      // a couple of grain clumps for a lumpy rice surface
      sph(0.2, riceHi, { ws: 4, hs: 3, x: -0.4, y: 0.7, z: 0.25 }),
      sph(0.18, riceHi, { ws: 4, hs: 3, x: 0.45, y: 0.66, z: -0.2 }),
    ];

    // --- SHRIMP scattered on top (curled boiled shrimp) -------------------
    const shrimps = [
      { x: -0.1, z: 0.15, y: 0.82, rot: 0.0 },
      { x: 0.4, z: 0.3, y: 0.72, rot: 1.2 },
      { x: -0.42, z: -0.18, y: 0.7, rot: 2.4 },
    ];
    for (let i = 0; i < shrimps.length; i++) {
      const s = shrimps[i];
      parts.push(
        torus(0.26, 0.11, 3, 6, shrimp, {
          rx: HALF_PI * 0.45, ry: s.rot,
          x: s.x + j(0.05), z: s.z + j(0.05), y: s.y, arc: Math.PI * 1.3, hex2: shrimpHi,
        }),
      );
    }

    // --- GREEN-ONION sprinkle --------------------------------------------
    const onions = [[-0.25, 0.4], [0.5, -0.4], [0.05, 0.5]];
    for (let i = 0; i < onions.length; i++) {
      const [ox, oz] = onions[i];
      parts.push(
        cyl(0.05, 0.05, 0.14, 5, onion, {
          rz: HALF_PI, ry: rng() * 3,
          x: ox + j(0.1), z: oz + j(0.1), y: 0.78,
        }),
      );
    }

    return finish(parts);
  },
};

export default COL_PINEAPPLE;
