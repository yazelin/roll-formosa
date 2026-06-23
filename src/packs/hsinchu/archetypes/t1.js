/**
 * @file packs/hsinchu/archetypes/t1.js — T1 城隍廟夜市 (temple night market).
 *
 * Tier 1 of the Roll Formosa Hsinchu ladder (城隍廟夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/hsinchu/tiers.js:
 *   slots [0..7] absorbable 夜市小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (廟口燈籠 / 小吃攤車, spawnWeight ~0.3).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): primitives
 * are authored in convenient LOCAL units, then finish() merges, recenters and
 * normalizes every geometry to a UNIT bounding sphere (radius 1.0). yOffset is
 * measured as (-1 - minY) on the normalized geometry so ground-sitting objects
 * rest on y=0. Each buildGeometry stays well under the 350-triangle cap by
 * keeping cyl/sph/cone radial segments at ~6-10.
 *
 * Size band (radiusNominal, REAL meters): 0.05–0.25 m.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T1_ARCHETYPES = [
  /* ---------------------------------------------------------------- */
  /* [0] meatball_soup 貢丸湯 — Hsinchu signature meatball soup bowl    */
  /* ---------------------------------------------------------------- */
  {
    id: 'meatball_soup',
    displayName: '貢丸湯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf4e8d0, 0xe8dcc0, 0xf8f0e0, 0xd8c8a8, 0xc8a878],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // ceramic soup bowl
        cyl(1.0, 0.6, 0.55, 10, 0xf8f0e0, { y: 0.28, hex2: 0xf4e8d0 }),
        cyl(0.6, 0.6, 0.08, 10, 0xd8c8a8, { y: 0.02 }), // foot ring
        cyl(1.02, 1.0, 0.06, 10, 0xe8dcc0, { y: 0.53, open: true }), // rim
        // clear broth surface
        cyl(0.92, 0.92, 0.04, 10, 0xe8d8b8, { y: 0.48 }),
      ];
      // three bouncy meatballs (Hsinchu famous!)
      parts.push(sph(0.28, 0xd8b090, { ws: 7, hs: 5, x: -0.25, y: 0.62, z: 0.1 }));
      parts.push(sph(0.26, 0xd0a888, { ws: 7, hs: 5, x: 0.22, y: 0.58, z: -0.15 }));
      parts.push(sph(0.24, 0xd8b090, { ws: 7, hs: 5, x: 0.05, y: 0.64, z: 0.28 }));
      // green scallion garnish
      parts.push(box(0.08, 0.04, 0.08, 0x6a9a50, { x: 0.15, y: 0.68, z: 0.1 }));
      parts.push(box(0.06, 0.04, 0.06, 0x6a9a50, { x: -0.1, y: 0.66, z: -0.08 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] rice_noodle_bowl 米粉 — Hsinchu signature rice noodle bowl     */
  /* ---------------------------------------------------------------- */
  {
    id: 'rice_noodle_bowl',
    displayName: '米粉',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f4e8, 0xf0e8d8, 0xfff8f0, 0xe8dcc8, 0xd8c8b0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // shallow wide bowl
        cyl(1.1, 0.7, 0.5, 10, 0xfff8f0, { y: 0.25, hex2: 0xf8f4e8 }),
        cyl(0.7, 0.7, 0.06, 10, 0xd8c8b0, { y: 0.02 }), // foot
        cyl(1.12, 1.1, 0.05, 10, 0xf0e8d8, { y: 0.48, open: true }), // rim
      ];
      // pile of white rice noodles (the famous Hsinchu mi-fun)
      parts.push(sph(0.7, 0xf8f4e8, { ws: 7, hs: 5, sy: 0.5, y: 0.55, hex2: 0xfff8f0 }));
      // curly noodle strands on top
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(
          cyl(0.03, 0.03, 0.5, 4, 0xf0e8d8, {
            rz: 0.4,
            ry: a,
            x: Math.cos(a) * 0.3,
            y: 0.7,
            z: Math.sin(a) * 0.3,
          })
        );
      }
      // bean sprouts and scallion garnish
      parts.push(box(0.12, 0.06, 0.08, 0xf4f0e0, { x: 0.35, y: 0.72, z: 0.1 }));
      parts.push(box(0.08, 0.04, 0.06, 0x6a9a50, { x: -0.2, y: 0.74, z: 0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] duck_rice 鴨香飯 — fragrant duck rice bowl                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'duck_rice',
    displayName: '鴨香飯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0e4d0, 0xe0d0b8, 0xf8f0e0, 0xc8a878, 0x8a6a40],
    yOffset: -0.50,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // rice bowl
        cyl(0.9, 0.55, 0.55, 10, 0xf8f0e0, { y: 0.28, hex2: 0xf0e4d0 }),
        cyl(0.55, 0.55, 0.06, 10, 0xc8a878, { y: 0.02 }), // foot
        cyl(0.92, 0.9, 0.05, 10, 0xe0d0b8, { y: 0.53, open: true }), // rim
        // mounded white rice
        sph(0.65, 0xf8f4e8, { ws: 7, hs: 5, sy: 0.5, y: 0.58 }),
      ];
      // sliced duck meat on top (dark glazed)
      parts.push(box(0.5, 0.08, 0.4, 0x8a6a40, { y: 0.72, rz: 0.1, hex2: 0xa07850 }));
      parts.push(box(0.45, 0.07, 0.35, 0x906840, { y: 0.68, x: 0.15, rz: -0.08 }));
      // duck sauce drizzle
      parts.push(box(0.6, 0.03, 0.3, 0x604020, { y: 0.75, rz: 0.05 }));
      // pickled vegetable garnish
      parts.push(box(0.15, 0.05, 0.12, 0x90a060, { x: -0.3, y: 0.7, z: 0.2 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] red_yeast_pork 紅糟肉 — red yeast fermented pork               */
  /* ---------------------------------------------------------------- */
  {
    id: 'red_yeast_pork',
    displayName: '紅糟肉',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb84838, 0xc85848, 0xa83828, 0xd86858, 0x983020],
    yOffset: -0.55,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        // paper plate underneath
        cyl(1.0, 1.0, 0.08, 10, 0xf4f0e8, { y: 0.04 }),
        cyl(1.02, 1.0, 0.04, 10, 0xe8e0d8, { y: 0.1, open: true }), // rim
      ];
      // chunky red yeast pork pieces
      parts.push(box(0.55, 0.35, 0.4, 0xb84838, { y: 0.36, x: -0.2, rz: 0.1, hex2: 0xc85848 }));
      parts.push(box(0.5, 0.32, 0.38, 0xc85848, { y: 0.34, x: 0.25, z: 0.1, rz: -0.08, hex2: 0xd86858 }));
      parts.push(box(0.45, 0.28, 0.35, 0xa83828, { y: 0.32, x: 0.0, z: -0.2, rz: 0.05 }));
      // crispy fried coating texture
      parts.push(box(0.52, 0.04, 0.38, 0xd86858, { y: 0.52, x: -0.2 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] runbing 水潤餅 — thin spring roll wrapper                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'runbing',
    displayName: '水潤餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xf0e8d8, 0xfff8f0, 0xe8dcc8, 0xd8c8b0],
    yOffset: -0.70,
    upright: false,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        // rolled up spring roll wrapper (the runbing)
        cyl(0.35, 0.35, 1.8, 8, 0xffffff, { rz: HALF_PI, hex2: 0xf8f0e0 }),
        // wrapper ends showing the spiral
        cyl(0.36, 0.32, 0.08, 8, 0xf0e8d8, { rz: HALF_PI, x: -0.92 }),
        cyl(0.36, 0.32, 0.08, 8, 0xf0e8d8, { rz: HALF_PI, x: 0.92 }),
        // filling peeking out (vegetables)
        box(0.2, 0.2, 0.1, 0x6a9a50, { x: -0.88, y: 0.1, z: 0.05 }),
        box(0.18, 0.15, 0.08, 0x90a868, { x: -0.86, y: -0.08, z: -0.1 }),
        // peanut powder dusting
        box(0.3, 0.03, 0.25, 0xd8c090, { y: 0.36, x: 0.2 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] grass_jelly_cup 燒仙草 — hot grass jelly drink cup             */
  /* ---------------------------------------------------------------- */
  {
    id: 'grass_jelly_cup',
    displayName: '燒仙草',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a2420, 0x3a3430, 0x1a1410, 0x4a4440, 0x5a5450],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // plastic cup (clear with dark contents)
        cyl(0.58, 0.46, 1.4, 9, 0xe8e4de, { y: 0.7 }),
        cyl(0.46, 0.46, 0.06, 9, 0xd8d4ce, { y: 0.03 }), // base
        cyl(0.6, 0.58, 0.06, 9, 0xf0ece6, { y: 1.38, open: true }), // rim
        // dark grass jelly liquid (the signature black color)
        cyl(0.54, 0.44, 1.3, 9, 0xffffff, { y: 0.68, hex2: 0x3a3430 }),
        // toppings floating on top - taro balls, red beans
        sph(0.1, 0x9070a0, { ws: 5, hs: 4, x: 0.15, y: 1.32, z: 0.1 }), // taro ball
        sph(0.08, 0x8a3020, { ws: 5, hs: 4, x: -0.12, y: 1.30, z: 0.08 }), // red bean
        sph(0.09, 0x9070a0, { ws: 5, hs: 4, x: 0.0, y: 1.34, z: -0.15 }), // taro ball
        // straw
        cyl(0.04, 0.04, 0.9, 6, 0xf0a060, { x: 0.2, y: 1.7, rz: 0.15 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] popcorn_chicken 鹹酥雞 — Taiwanese popcorn chicken             */
  /* ---------------------------------------------------------------- */
  {
    id: 'popcorn_chicken',
    displayName: '鹹酥雞',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8884a, 0xb87840, 0xd8985a, 0xa86830, 0xe8a868],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [
        // paper bag container
        box(1.2, 0.8, 0.8, 0xf4e8d8, { y: 0.4, hex2: 0xe8dcc8 }),
        box(1.22, 0.1, 0.82, 0xe0d4c4, { y: 0.82 }), // folded top edge
      ];
      // pile of crispy fried chicken nuggets (detail=0 to stay under tri cap)
      const nuggets = [
        [0.0, 0.7, 0.0, 0.22], [-0.3, 0.65, 0.15, 0.2], [0.28, 0.68, -0.1, 0.19],
        [-0.15, 0.72, -0.2, 0.18], [0.2, 0.66, 0.2, 0.2], [0.0, 0.78, 0.15, 0.16],
      ];
      for (const [x, y, z, r] of nuggets) {
        parts.push(ico(r, 0, 0xffffff, { x, y, z })); // tinted golden brown
      }
      // basil leaves on top (the signature garnish)
      parts.push(box(0.12, 0.04, 0.18, 0x2a5a20, { x: 0.1, y: 0.88, z: 0.05, rz: 0.2 }));
      parts.push(box(0.1, 0.04, 0.14, 0x3a6a30, { x: -0.15, y: 0.86, z: -0.1, rz: -0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] oyster_omelet 蚵仔煎 — oyster omelet on a plate                */
  /* ---------------------------------------------------------------- */
  {
    id: 'oyster_omelet',
    displayName: '蚵仔煎',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8d8b8, 0xf0e0c8, 0xd8c8a8, 0xc8b898, 0xf8e8d0],
    yOffset: -0.62,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // plate
        cyl(1.1, 1.0, 0.1, 10, 0xf8f4f0, { y: 0.05 }),
        cyl(1.12, 1.1, 0.04, 10, 0xe8e4e0, { y: 0.12, open: true }), // rim
      ];
      // omelet base (starchy, slightly translucent egg batter)
      parts.push(sph(0.8, 0xf0e0c8, { ws: 8, hs: 5, sy: 0.3, y: 0.22, hex2: 0xe8d8b8 }));
      // visible oysters embedded
      parts.push(sph(0.12, 0xc8b8a0, { ws: 5, hs: 4, x: 0.2, y: 0.28, z: 0.1 }));
      parts.push(sph(0.1, 0xd0c0a8, { ws: 5, hs: 4, x: -0.15, y: 0.26, z: -0.12 }));
      parts.push(sph(0.11, 0xc8b8a0, { ws: 5, hs: 4, x: 0.05, y: 0.3, z: 0.25 }));
      // green vegetable (bok choy/spinach)
      parts.push(box(0.2, 0.06, 0.15, 0x5a8a40, { x: -0.35, y: 0.3, z: 0.2 }));
      parts.push(box(0.18, 0.05, 0.12, 0x6a9a50, { x: 0.3, y: 0.28, z: -0.25 }));
      // sweet chili sauce drizzle (orange-red)
      parts.push(box(0.5, 0.03, 0.15, 0xd85030, { y: 0.36, rz: 0.1 }));
      parts.push(box(0.4, 0.03, 0.12, 0xe86040, { y: 0.35, x: 0.1, rz: -0.15 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — temple_lantern 廟口燈籠 temple entrance lantern */
  /* ---------------------------------------------------------------- */
  {
    id: 'temple_lantern',
    displayName: '廟口燈籠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xe85a3a, 0xf0c040, 0xc02824, 0x3a2a22],
    yOffset: -0.024,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // top & bottom wooden caps
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 1.78 }),
        cyl(0.34, 0.34, 0.16, 8, 0x3a2a22, { y: 0.42 }),
        // bulbous red lantern body (stacked discs make the barrel curve)
        cyl(0.5, 0.4, 0.34, 8, 0xd8302a, { y: 0.6, hex2: 0xe85a3a }),
        cyl(0.66, 0.5, 0.3, 8, 0xe85a3a, { y: 0.9 }),
        cyl(0.66, 0.66, 0.3, 8, 0xe85a3a, { y: 1.18 }),
        cyl(0.5, 0.66, 0.3, 8, 0xe85a3a, { y: 1.46 }),
        cyl(0.4, 0.5, 0.2, 8, 0xd8302a, { y: 1.66, hex2: 0xc02824 }),
        // gold trim rings
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.04, open: true }),
        cyl(0.67, 0.67, 0.05, 8, 0xf0c040, { y: 1.32, open: true }),
        // tassel hanging below
        cyl(0.06, 0.06, 0.2, 6, 0xf0c040, { y: 0.24 }),
        cone(0.12, 0.3, 6, 0xf0c040, { y: 0.0 }),
        // mounting pole rising from the cart
        cyl(0.09, 0.09, 1.2, 6, 0x3a2a22, { y: -0.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — food_stall 小吃攤車 night market food cart     */
  /* ---------------------------------------------------------------- */
  {
    id: 'food_stall',
    displayName: '小吃攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.25,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc23028, 0xe8e4de, 0xf0c040, 0x9a5a24, 0x4a6a8a],
    yOffset: -0.31,
    upright: true,
    collisionScale: 0.74,
    buildGeometry(rng) {
      const parts = [
        // stainless cart body / counter
        box(3.2, 1.1, 1.6, 0xe8e4de, { y: 1.0, hex2: 0xd8d4ce }),
        box(3.3, 0.2, 1.7, 0xc8ccd2, { y: 1.6 }), // worktop
        // lower cabinet / skirt
        box(3.0, 0.6, 1.5, 0x9a5a24, { y: 0.5, hex2: 0xb5712f }),
        // four corner posts holding the awning
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: -1.45, y: 2.6, z: -0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: 1.45, y: 2.6, z: -0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: -1.45, y: 2.6, z: 0.6 }),
        cyl(0.1, 0.1, 2.2, 5, 0x8a9098, { x: 1.45, y: 2.6, z: 0.6 }),
        // striped awning roof (red/white)
        box(3.6, 0.16, 2.0, 0xc23028, { y: 3.75, hex2: 0xc23028 }),
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: -1.1, y: 3.76 }), // white stripe
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: 0.0, y: 3.76 }),
        box(0.5, 0.18, 2.0, 0xe8e4de, { x: 1.1, y: 3.76 }),
        // little hanging menu valance
        box(3.6, 0.4, 0.1, 0xf0c040, { y: 3.5, z: 1.0 }),
        // two cart wheels
        cyl(0.4, 0.4, 0.18, 8, 0x3a2a22, { rx: HALF_PI, x: -1.1, y: 0.3, z: 0.85 }),
        cyl(0.4, 0.4, 0.18, 8, 0x3a2a22, { rx: HALF_PI, x: 1.1, y: 0.3, z: 0.85 }),
        // a steaming pot on the counter
        cyl(0.5, 0.5, 0.5, 9, 0x4a6a8a, { x: 0.9, y: 1.95 }),
        cyl(0.54, 0.54, 0.08, 9, 0x8a9098, { x: 0.9, y: 2.22, open: true }),
        // a stack of bowls
        cyl(0.3, 0.3, 0.3, 8, 0xe8e4de, { x: -0.9, y: 1.85 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
