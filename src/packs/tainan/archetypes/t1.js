/**
 * @file packs/taipei/archetypes/t1.js — T1 夜市攤頭 (night-market stall items).
 *
 * Tier 1 of the Roll Formosa Taipei ladder (夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/taipei/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (攤車燈籠 / 彈珠台, spawnWeight ~0.3).
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
  /* [0] 蚵仔煎 — golden fried egg-batter pancake, red sauce drizzle,    */
  /*     oyster bits + green veg, on a small plate.                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'oyster_omelette',
    displayName: '蚵仔煎',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe0a648, 0xc8842e, 0xd83a28, 0x4a7a2e, 0xefe6d2],
    yOffset: -0.5283,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // small plate beneath
        cyl(1.0, 0.92, 0.12, 8, 0xefe6d2, { y: 0.06, hex2: 0xf6f0e2 }),
        cyl(0.84, 0.84, 0.04, 8, 0xe6dcc6, { y: 0.14, open: true }), // plate rim
        // browned underside of the pancake
        cyl(0.86, 0.78, 0.12, 8, 0xc8842e, { y: 0.22 }),
        // golden domed egg-batter top
        sph(0.86, 0xe0a648, { ws: 8, hs: 5, sy: 0.42, y: 0.3, thetaLen: PI * 0.6, hex2: 0xeebb5e }),
        // glossy reddish sauce drizzle (a couple of squiggly bands across the top)
        torus(0.5, 0.06, 4, 7, 0xd83a28, { ry: 0.4, y: 0.46, arc: PI * 1.3 }),
        torus(0.34, 0.05, 4, 7, 0xd83a28, { ry: -0.6, y: 0.5, arc: PI }),
      ];
      // oyster bits (pale) + green vegetable specks scattered on top
      const bits = 5;
      for (let i = 0; i < bits; i++) {
        const a = (i / bits) * PI * 2;
        const r = 0.32 + (i % 2) * 0.26;
        const veg = i % 2 === 0;
        parts.push(
          sph(veg ? 0.08 : 0.1, veg ? 0x4a7a2e : 0xe8dcc0, {
            ws: 4, hs: 3, x: Math.cos(a) * r, y: 0.5 - (i % 3) * 0.04, z: Math.sin(a) * r,
          })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 地瓜球 — heap of ~5-6 golden-brown fried sweet-potato QQ balls */
  /*     spilling from a small paper cup/bag.                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'sweet_potato_ball',
    displayName: '地瓜球',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd89038, 0xc07828, 0xe8aa54, 0xa05e1e, 0xefe2c8],
    yOffset: -0.2084,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // small paper cup tilted, holding the balls
        cyl(0.62, 0.46, 0.9, 7, 0xefe2c8, { rz: 0.18, y: 0.55, hex2: 0xf6efdc }),
        cyl(0.64, 0.64, 0.06, 7, 0xe4d6ba, { rz: 0.18, x: -0.1, y: 0.98, open: true }), // cup rim
      ];
      // heaped cluster of round QQ balls
      const balls = [
        [0.0, 0.42, 0.0, 0.46],
        [0.46, 0.5, 0.12, 0.42],
        [-0.34, 0.56, -0.28, 0.4],
        [0.16, 0.9, -0.1, 0.44],
        [-0.18, 0.96, 0.26, 0.4],
        [0.44, 1.02, -0.14, 0.36], // one spilling over the rim
      ];
      for (let i = 0; i < balls.length; i++) {
        const [bx, by, bz, br] = balls[i];
        const hex = i % 2 === 0 ? 0xd89038 : 0xe8aa54;
        parts.push(sph(br, hex, { ws: 6, hs: 5, x: bx, y: by, z: bz, hex2: 0xc07828 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 烤香腸 — plump glossy grilled Taiwanese sausage on a skewer    */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_sausage',
    displayName: '烤香腸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa63a26, 0x8a2c1c, 0xc24a30, 0x6a3a1e, 0x3a2010],
    yOffset: -0.6019,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // wooden skewer stick running lengthwise (x)
        cyl(0.07, 0.07, 3.0, 6, 0x6a3a1e, { rz: HALF_PI, y: 0.0, hex2: 0x8a5a32 }),
        // fat reddish-brown sausage body, rounded ends
        sph(0.5, 0xa63a26, { ws: 9, hs: 6, sx: 2.2, y: 0.0, hex2: 0xc24a30 }),
        // charred glaze rings cinched around the sausage
        cyl(0.52, 0.52, 0.1, 8, 0x6a3a1e, { rz: HALF_PI, x: -0.4 }),
        cyl(0.52, 0.52, 0.1, 8, 0x6a3a1e, { rz: HALF_PI, x: 0.4 }),
        // darker char patch on top
        sph(0.5, 0x3a2010, { ws: 7, hs: 4, sx: 1.0, thetaLen: PI * 0.4, y: 0.18, hex2: 0x8a2c1c }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 雞蛋糕 — cluster of small golden domed egg cakes from the mould */
  /* ---------------------------------------------------------------- */
  {
    id: 'egg_cake',
    displayName: '雞蛋糕',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8b860, 0xd8a448, 0xf0cc80, 0xb87e30, 0xc8923a],
    yOffset: -0.7115,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // a row/cluster of little browned round egg cakes joined together
      const cakes = [
        [0.0, 0.0, 0.55],
        [0.72, 0.1, 0.5],
        [-0.7, 0.06, 0.52],
        [0.36, -0.66, 0.5],
      ];
      for (let i = 0; i < cakes.length; i++) {
        const [cx, cz, cr] = cakes[i];
        const top = i % 2 === 0 ? 0xf0cc80 : 0xe8b860;
        // domed cake top
        parts.push(sph(cr, 0xd8a448, { ws: 7, hs: 4, sy: 0.78, x: cx, y: 0.36, z: cz, thetaLen: PI * 0.62, hex2: top }));
        // browned base ring of each cake
        parts.push(cyl(cr * 0.92, cr * 0.8, 0.16, 6, 0xb87e30, { x: cx, y: 0.1, z: cz }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 烤鳥蛋 — skewer of ~5 pale-cream quail eggs, brushed with sauce */
  /* ---------------------------------------------------------------- */
  {
    id: 'quail_egg_skewer',
    displayName: '烤鳥蛋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf2e6cc, 0xe6d4b0, 0xd8a23a, 0x8a5a32, 0xc8843a],
    yOffset: -0.7443,
    upright: false,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [
        // thin wooden skewer stick running lengthwise (x)
        cyl(0.06, 0.06, 3.2, 6, 0x8a5a32, { rz: HALF_PI, y: 0.0, hex2: 0xa67242 }),
      ];
      // 5 small quail eggs threaded in a row, brushed with sauce
      const n = 5;
      for (let i = 0; i < n; i++) {
        const px = -1.0 + i * 0.5;
        parts.push(sph(0.36, 0xf2e6cc, { ws: 6, hs: 4, sx: 1.25, x: px, y: 0.0, hex2: 0xe6d4b0 }));
        // glossy sauce glaze cap on each egg
        parts.push(sph(0.34, 0xc8843a, { ws: 5, hs: 3, sx: 1.2, thetaLen: PI * 0.5, x: px, y: 0.12, hex2: 0xd8a23a }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 烤杏鮑菇 — bamboo skewer with 3-4 browned king-oyster chunks    */
  /* ---------------------------------------------------------------- */
  {
    id: 'king_oyster_skewer',
    displayName: '烤杏鮑菇',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c49a, 0xc0a878, 0xa6824e, 0x8a5a32, 0x6a4422],
    yOffset: -0.7301,
    upright: false,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const parts = [
        // bamboo skewer running lengthwise (x)
        cyl(0.06, 0.06, 3.4, 6, 0x8a5a32, { rz: HALF_PI, y: 0.0, hex2: 0xa67242 }),
      ];
      // 4 chunky grilled king-oyster-mushroom pieces threaded on it
      const n = 4;
      for (let i = 0; i < n; i++) {
        const px = -0.96 + i * 0.64;
        const top = i % 2 === 0 ? 0xc0a878 : 0xd8c49a;
        // mushroom chunk body (short fat cylinder, browned ends via gradient)
        parts.push(cyl(0.46, 0.46, 0.5, 7, 0x8a5a32, { rz: HALF_PI, x: px, y: 0.0, hex2: top }));
        // grilled browned end cap on the outward face
        parts.push(cyl(0.48, 0.48, 0.08, 6, 0x8a5a32, { rz: HALF_PI, x: px + 0.25, y: 0.0 }));
        // char stripe on top
        parts.push(box(0.4, 0.06, 0.4, 0x6a4422, { x: px, y: 0.44, z: 0.0 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 紅白塑膠袋 — knotted red-and-white plastic carrier bag */
  /* ---------------------------------------------------------------- */
  {
    id: 'redwhite_bag',
    displayName: '紅白塑膠袋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.13,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4de, 0xd83a34, 0xf4f0ea, 0xc23028, 0xeceae4],
    yOffset: -0.1822,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // bulging white bag body — fuller at the bottom where the goods sit
        sph(0.92, 0xf4f0ea, { ws: 8, hs: 6, sy: 1.05, y: 0.64, hex2: 0xe8e4de }),
        // BOLD red/white horizontal stripes (classic 紅白條紋) — wide bands
        // standing slightly proud of the body so they read as stripes, not rings
        cyl(0.97, 1.0, 0.4, 8, 0xd83a34, { y: 0.3, open: true }),
        cyl(0.99, 0.9, 0.4, 8, 0xd83a34, { y: 0.86, open: true }),
        // gathered white neck pinching up to the handles
        cyl(0.4, 0.82, 0.34, 7, 0xf4f0ea, { y: 1.3 }),
        // two upright red vest-loop handles
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: -0.32, y: 1.72, arc: PI }),
        torus(0.32, 0.09, 5, 6, 0xd83a34, { x: 0.32, y: 1.72, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 棺材板 — Tainan coffin toast: thick deep-fried bread box with    */
  /*     a lifted lid + creamy seafood-chowder filling, on a paper boat.  */
  /* ---------------------------------------------------------------- */
  {
    id: 'coffin_toast',
    displayName: '棺材板',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc88a4a, 0xb87838, 0xe8c98a, 0xf0e8d8, 0xd8a45a],
    yOffset: -0.42,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const crust = 0xc88a4a; // golden deep-fried toast
      const inside = 0xf2ead4; // pale bread interior
      const filling = 0xf0e0c0; // creamy chowder filling
      return finish([
        // paper boat tray underneath
        box(2.2, 0.1, 1.5, 0xf0e8d8, { y: 0.05, hex2: 0xe6dcc4 }),
        // thick fried bread block (the "coffin"), golden crust
        box(1.9, 0.9, 1.25, crust, { y: 0.6, hex2: 0xd8a45a }),
        // hollow scoop showing pale bread + creamy filling on top
        box(1.4, 0.4, 0.9, inside, { y: 1.05 }),
        // creamy seafood-chowder filling mounded in the scoop
        sph(0.7, filling, { ws: 8, hs: 4, sy: 0.5, sx: 1.1, y: 1.18, hex2: 0xf6eee0 }),
        // the lifted bread lid leaning at the back
        box(1.6, 0.16, 1.1, crust, { y: 1.4, z: -0.45, rx: -0.5, hex2: 0xe8c98a }),
        // a few diced filling bits (carrot/pea specks)
        sph(0.1, 0xe07a3a, { ws: 4, hs: 3, x: 0.3, y: 1.3, z: 0.1 }),
        sph(0.09, 0x4a7a2e, { ws: 4, hs: 3, x: -0.34, y: 1.3, z: 0.16 }),
        sph(0.09, 0xe07a3a, { ws: 4, hs: 3, x: 0.0, y: 1.32, z: -0.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 攤車燈籠 stall-cart paper lantern on a pole */
  /* ---------------------------------------------------------------- */
  {
    id: 'stall_lantern',
    displayName: '攤車燈籠',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xe85a3a, 0xf0c040, 0xc02824, 0x3a2a22],
    yOffset: -0.0238,
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
  /* [9] CHUNK LANDMARK — 花園夜市拱門 night-market entrance arch:        */
  /*     two posts + top sign beam, red lanterns + a hung banner.        */
  /* ---------------------------------------------------------------- */
  {
    id: 'garden_market_arch',
    displayName: '花園夜市拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xc0392b, 0xe04a2a, 0xf0c040, 0x8a3a2a, 0x3a2a22],
    yOffset: -0.3417,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // two upright posts
        box(0.34, 2.6, 0.34, 0x8a3a2a, { x: -1.5, y: 1.3, hex2: 0xc0392b }),
        box(0.34, 2.6, 0.34, 0x8a3a2a, { x: 1.5, y: 1.3, hex2: 0xc0392b }),
        // post bases
        box(0.5, 0.24, 0.5, 0x3a2a22, { x: -1.5, y: 0.12 }),
        box(0.5, 0.24, 0.5, 0x3a2a22, { x: 1.5, y: 0.12 }),
        // top sign beam joining the posts
        box(3.6, 0.6, 0.4, 0xc0392b, { y: 2.85, hex2: 0xe04a2a }),
        // gold trim on the sign beam
        box(3.6, 0.1, 0.42, 0xf0c040, { y: 3.12 }),
        box(3.6, 0.1, 0.42, 0xf0c040, { y: 2.58 }),
        // banner hung across below the beam
        box(2.6, 0.46, 0.06, 0xe04a2a, { y: 2.3, z: 0.18, hex2: 0xc0392b }),
      ];
      // a couple of small red lanterns hanging from the beam
      for (const lx of [-0.9, 0.9]) {
        parts.push(cyl(0.04, 0.04, 0.22, 5, 0x3a2a22, { x: lx, y: 2.46 })); // cord
        parts.push(sph(0.26, 0xc0392b, { ws: 6, hs: 4, sy: 1.1, x: lx, y: 2.12, hex2: 0xe04a2a })); // lantern body
        parts.push(cyl(0.1, 0.1, 0.05, 6, 0xf0c040, { x: lx, y: 2.36 })); // top cap
        parts.push(cyl(0.1, 0.1, 0.05, 6, 0xf0c040, { x: lx, y: 1.9 })); // bottom cap
        parts.push(cone(0.08, 0.16, 5, 0xf0c040, { x: lx, y: 1.78 })); // tassel
      }
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
