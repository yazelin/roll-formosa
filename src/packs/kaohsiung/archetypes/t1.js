/**
 * @file packs/kaohsiung/archetypes/t1.js — T1 六合夜市 (高雄夜市小吃 / night-market street food).
 *
 * Tier 1 of the Roll Formosa Kaohsiung ladder (六合夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/kaohsiung/tiers.js:
 *   slots [0..7] absorbable 夜市小吃 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (夜市拱門 / 攤車, spawnWeight ~0.3).
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
  /* [0] 木瓜牛奶 — tall plastic cup of papaya milk, dome lid + straw    */
  /* ---------------------------------------------------------------- */
  {
    id: 'papaya_milk',
    displayName: '木瓜牛奶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf7b86a, 0xf0a050, 0xffe7c4, 0xe8903a, 0xfff2df],
    yOffset: -0.0626,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // tapered tall cup, creamy orange papaya-milk fill (takes palette tint)
        cyl(0.62, 0.46, 1.5, 9, 0xf7b86a, { y: 0.75, hex2: 0xffe7c4 }),
        cyl(0.46, 0.46, 0.06, 9, 0xe8903a, { y: 0.03 }), // base ring
        // clear dome lid
        sph(0.62, 0xfff2df, { ws: 9, hs: 5, sy: 0.55, y: 1.5, thetaLen: PI * 0.5 }),
        cyl(0.64, 0.62, 0.1, 9, 0xffe7c4, { y: 1.55, open: true }), // lid rim
        // fat striped night-market straw
        cyl(0.07, 0.07, 1.1, 6, 0xe8903a, { x: 0.18, y: 2.0 }),
        cyl(0.075, 0.075, 0.16, 6, 0xfff2df, { x: 0.18, y: 1.78, open: true }), // straw stripe
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 烤魷魚 — grilled squid splayed on a skewer, charred edges       */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_squid',
    displayName: '烤魷魚',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd99a5a, 0xc77f3e, 0xe8b878, 0xa85f2a, 0xf0d0a0],
    yOffset: -0.0008,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // bamboo skewer running up through the body
        cyl(0.05, 0.05, 2.4, 6, 0xe0c890, { y: 0.0 }),
        // flattened grilled mantle (the wide squid body), splayed open
        box(1.3, 0.16, 1.7, 0xd99a5a, { y: 0.7, hex2: 0xe8b878 }),
        // curled head / fin caps top
        cone(0.7, 0.7, 7, 0xc77f3e, { y: 1.5 }),
      ];
      // tentacle strips fanning out from the bottom of the mantle
      const legs = 6;
      for (let i = 0; i < legs; i++) {
        const a = (i / legs) * PI * 2;
        parts.push(
          cyl(0.06, 0.09, 0.7, 5, 0xa85f2a, {
            rz: 0.5,
            x: Math.cos(a) * 0.5,
            y: -0.2,
            z: Math.sin(a) * 0.5,
            ry: a,
          })
        );
      }
      // charred score marks on the mantle
      parts.push(box(1.32, 0.04, 0.14, 0xa85f2a, { y: 0.79, z: -0.4 }));
      parts.push(box(1.32, 0.04, 0.14, 0xa85f2a, { y: 0.79, z: 0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 鹽水雞 — salt-poached chicken pieces piled in a paper bowl      */
  /* ---------------------------------------------------------------- */
  {
    id: 'salt_chicken',
    displayName: '鹽水雞',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf2e2bf, 0xe8d2a0, 0xf6ecd6, 0xd8bf88, 0xbed09a],
    yOffset: -0.5270,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // shallow paper takeaway bowl
        cyl(1.0, 0.66, 0.5, 10, 0xf6ecd6, { y: 0.25, hex2: 0xe8d2a0 }),
        cyl(0.66, 0.66, 0.06, 10, 0xd8bf88, { y: 0.02 }), // base
        cyl(1.02, 1.0, 0.08, 10, 0xf2e2bf, { y: 0.48, open: true }), // rim
      ];
      // heaped pale chicken chunks
      const chunks = [
        [0.0, 0.62, 0.0, 0.42],
        [-0.34, 0.58, 0.2, 0.32],
        [0.36, 0.56, -0.16, 0.3],
        [0.1, 0.56, 0.36, 0.28],
        [-0.28, 0.54, -0.3, 0.28],
      ];
      for (const [x, y, z, r] of chunks) {
        parts.push(sph(r, 0xf2e2bf, { ws: 6, hs: 4, sy: 0.8, x, y, z, hex2: 0xe8d2a0 }));
      }
      // green scallion / cucumber flecks on top
      parts.push(box(0.16, 0.06, 0.16, 0xbed09a, { x: 0.2, y: 0.76, z: 0.1 }));
      parts.push(box(0.16, 0.06, 0.16, 0xbed09a, { x: -0.18, y: 0.74, z: -0.2 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 香腸 — fat grilled Taiwanese sausage on a skewer                */
  /* ---------------------------------------------------------------- */
  {
    id: 'sausage',
    displayName: '香腸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb5402f, 0xc8523a, 0x9a3526, 0xd9694a, 0xe0c890],
    yOffset: -0.7146,
    upright: false,
    collisionScale: 0.7,
    buildGeometry(rng) {
      return finish([
        // glossy red-brown sausage barrel
        cyl(0.5, 0.5, 2.0, 9, 0xb5402f, { rz: HALF_PI, hex2: 0xd9694a }),
        // rounded grilled ends
        sph(0.5, 0xc8523a, { ws: 9, hs: 5, x: -1.0 }),
        sph(0.5, 0xc8523a, { ws: 9, hs: 5, x: 1.0 }),
        // bamboo skewer poking out one end
        cyl(0.07, 0.07, 1.4, 6, 0xe0c890, { rz: HALF_PI, x: 1.4 }),
        // a couple of dark grill char bands
        cyl(0.52, 0.52, 0.1, 9, 0x9a3526, { rz: HALF_PI, x: -0.35, open: true }),
        cyl(0.52, 0.52, 0.1, 9, 0x9a3526, { rz: HALF_PI, x: 0.35, open: true }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 海產攤碗 — seafood bowl: prawn + clams in a glossy broth bowl    */
  /* ---------------------------------------------------------------- */
  {
    id: 'seafood_bowl',
    displayName: '海產攤碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.1,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e0d0, 0xd8ccb6, 0xf2ece0, 0xc8b896, 0xe07a4a],
    yOffset: -0.5967,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // wide ceramic seafood bowl
        cyl(1.1, 0.6, 0.6, 11, 0xf2ece0, { y: 0.3, hex2: 0xe8e0d0 }),
        cyl(0.6, 0.6, 0.08, 11, 0xc8b896, { y: 0.02 }), // foot
        cyl(1.12, 1.1, 0.08, 11, 0xd8ccb6, { y: 0.58, open: true }), // rim
        // amber broth surface
        cyl(1.0, 1.0, 0.04, 11, 0xd8a86a, { y: 0.5 }),
      ];
      // a curled prawn (two segments + tail)
      parts.push(cyl(0.18, 0.14, 0.5, 6, 0xe07a4a, { rz: 0.7, x: 0.0, y: 0.62, z: -0.1 }));
      parts.push(cyl(0.14, 0.1, 0.4, 6, 0xe07a4a, { rz: -0.4, x: 0.34, y: 0.58, z: -0.05 }));
      parts.push(cone(0.16, 0.26, 5, 0xf0a070, { x: -0.32, y: 0.6, z: -0.15 })); // tail fan
      // two clams (paired half-shell domes)
      parts.push(sph(0.26, 0xd8ccb6, { ws: 6, hs: 4, sy: 0.55, x: -0.34, y: 0.56, z: 0.34, thetaLen: PI * 0.55 }));
      parts.push(sph(0.26, 0xc8b896, { ws: 6, hs: 4, sy: 0.55, x: 0.36, y: 0.56, z: 0.32, thetaLen: PI * 0.55 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 木瓜牛奶杯 — short tumbler cup of papaya milk, no lid           */
  /* ---------------------------------------------------------------- */
  {
    id: 'milk_cup',
    displayName: '木瓜牛奶杯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xfbd9a8, 0xf4c184, 0xfff0db, 0xe8a85e, 0xffe2bd],
    yOffset: -0.1809,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        // squat tapered glass tumbler with creamy fill
        cyl(0.7, 0.54, 1.0, 9, 0xfbd9a8, { y: 0.5, hex2: 0xfff0db }),
        cyl(0.54, 0.54, 0.06, 9, 0xe8a85e, { y: 0.03 }), // base
        cyl(0.72, 0.7, 0.08, 9, 0xffe2bd, { y: 0.98, open: true }), // glass rim
        // papaya-milk surface (lighter froth ring)
        cyl(0.66, 0.66, 0.05, 9, 0xfff0db, { y: 0.9 }),
        // short straw leaning in the cup
        cyl(0.06, 0.06, 1.0, 6, 0xe8a85e, { rz: 0.2, x: 0.22, y: 1.1 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [6] 烤玉米 — grilled corn brushed with dark sauce on a skewer       */
  /* ---------------------------------------------------------------- */
  {
    id: 'grilled_corn',
    displayName: '烤玉米',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0c64a, 0xe8b030, 0xf8dd80, 0xc88a2a, 0x9a6a1e],
    yOffset: -0.0011,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const parts = [
        // bamboo handle skewer through the bottom
        cyl(0.07, 0.07, 1.0, 6, 0xe0c890, { y: -0.3 }),
        // yellow corn cob, rounded ends
        cyl(0.42, 0.42, 1.6, 10, 0xf0c64a, { y: 0.9, hex2: 0xf8dd80 }),
        sph(0.42, 0xf0c64a, { ws: 10, hs: 5, y: 1.7 }), // top tip
        sph(0.38, 0xe8b030, { ws: 10, hs: 5, y: 0.12 }), // bottom
      ];
      // sauce-brushed darker bands (basted grill marks)
      parts.push(cyl(0.44, 0.44, 0.12, 10, 0xc88a2a, { y: 0.6, open: true }));
      parts.push(cyl(0.44, 0.44, 0.12, 10, 0x9a6a1e, { y: 1.05, open: true }));
      parts.push(cyl(0.44, 0.44, 0.12, 10, 0xc88a2a, { y: 1.5, open: true }));
      // kernel dimple rings for texture
      for (let i = 0; i < 2; i++) {
        parts.push(cyl(0.43, 0.43, 0.04, 10, 0xe8b030, { y: 0.5 + i * 0.7, open: true }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 黑輪串 — oden skewer: fishcake + egg + radish on a bamboo stick */
  /* ---------------------------------------------------------------- */
  {
    id: 'oden_skewer',
    displayName: '黑輪串',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe6dcc4, 0xf0e8d0, 0xd8c8a0, 0xc8a85a, 0xefe3c0],
    yOffset: -0.0013,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      return finish([
        // bamboo skewer
        cyl(0.06, 0.06, 2.6, 6, 0xe0c890, { y: 0.0 }),
        // bottom: flat oden fishcake (黑輪) disc
        cyl(0.6, 0.6, 0.3, 9, 0xe6dcc4, { y: -0.6, hex2: 0xf0e8d0 }),
        cyl(0.62, 0.62, 0.06, 9, 0xc8a85a, { y: -0.45, open: true }), // browned edge
        // middle: white boiled egg
        sph(0.5, 0xf0e8d0, { ws: 9, hs: 6, sy: 1.15, y: 0.2 }),
        // upper: pale radish (白蘿蔔) cylinder
        cyl(0.46, 0.5, 0.5, 9, 0xefe3c0, { y: 0.95, hex2: 0xe6dcc4 }),
        // top: small triangular fish-tofu wedge
        cone(0.4, 0.5, 5, 0xd8c8a0, { y: 1.5 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 夜市拱門 lit night-market entrance arch         */
  /* ---------------------------------------------------------------- */
  {
    id: 'night_market_arch',
    displayName: '夜市拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xf0c040, 0xe85a3a, 0xc02824, 0x3a2a22],
    yOffset: -0.2782,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // two red square pillars
        box(0.5, 3.4, 0.5, 0xd8302a, { x: -1.9, y: 1.7, hex2: 0xe85a3a }),
        box(0.5, 3.4, 0.5, 0xd8302a, { x: 1.9, y: 1.7, hex2: 0xe85a3a }),
        // pillar plinths
        box(0.7, 0.4, 0.7, 0x3a2a22, { x: -1.9, y: 0.2 }),
        box(0.7, 0.4, 0.7, 0x3a2a22, { x: 1.9, y: 0.2 }),
        // top signboard beam spanning the arch (六合夜市 banner)
        box(4.6, 0.7, 0.6, 0xc02824, { y: 3.7, hex2: 0xd8302a }),
        // gold trim on the signboard
        box(4.7, 0.12, 0.62, 0xf0c040, { y: 4.05 }),
        box(4.7, 0.12, 0.62, 0xf0c040, { y: 3.35 }),
        // little tiled roof cresting the sign
        box(5.0, 0.18, 0.9, 0xf0c040, { y: 4.2 }),
        cone(0.4, 0.5, 4, 0xf0c040, { y: 4.5, ry: PI / 4 }), // center finial
      ];
      // string of hanging lanterns under the beam
      const lant = 5;
      for (let i = 0; i < lant; i++) {
        const x = -1.6 + i * 0.8;
        parts.push(cyl(0.22, 0.22, 0.34, 6, 0xf0c040, { x, y: 3.0 }));
        parts.push(cyl(0.04, 0.04, 0.2, 4, 0x3a2a22, { x, y: 3.3 })); // hanger cord
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 攤車 night-market food cart with awning & wheels*/
  /* ---------------------------------------------------------------- */
  {
    id: 'stall',
    displayName: '攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.25,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc23028, 0xe8e4de, 0xf0c040, 0x9a5a24, 0x4a6a8a],
    yOffset: -0.3066,
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
