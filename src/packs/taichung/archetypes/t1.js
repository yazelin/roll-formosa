/**
 * @file packs/taichung/archetypes/t1.js — T1 逢甲夜市攤頭 (Fengjia night-market stall items).
 *
 * Tier 1 of the Roll Formosa Taichung ladder (逢甲夜市, 全台最大夜市).
 * 10 ArchetypeDefs in the FROZEN id order from packs/taichung/tiers.js:
 *   slots [0..7] absorbable night-market小物 (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (飲料杯塔 / 大腸香腸烤台, spawnWeight ~0.3).
 *
 * Localized for 逢甲: keeps the pan-Taiwan generics any 夜市 has (養樂多 / 寶特瓶
 * 飲料、滷味夾、紅白塑膠袋), swaps the food slots to 逢甲 signatures —
 * 章魚小丸子 / 雞蛋糕 / 可麗餅 / 起司馬鈴薯, and re-themes both chunk landmarks to
 * Fengjia stall props (a giant drink cup and a sausage grill cart). Deliberately
 * avoids the curated collectibles 大腸包小腸 / 珍奶.
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
  /* [0] 養樂多 — squat Yakult bottle: white body, pinched waist, red label */
  /* ---------------------------------------------------------------- */
  {
    id: 'yakult',
    displayName: '養樂多',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf7f4ee, 0xe4d9c4, 0xc8442e, 0xb03828, 0xf0e8d8],
    yOffset: -0.1645,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        cyl(0.62, 0.46, 0.5, 9, 0xf7f4ee, { y: 0.25 }), // tapered base
        cyl(0.66, 0.62, 0.55, 9, 0xf7f4ee, { y: 0.78 }), // belly
        cyl(0.5, 0.66, 0.3, 9, 0xf7f4ee, { y: 1.2 }), // shoulder pinch
        cyl(0.46, 0.5, 0.18, 9, 0xf7f4ee, { y: 1.44 }), // neck
        cyl(0.5, 0.5, 0.06, 9, 0xc8442e, { y: 1.55 }), // foil cap
        // red label band wrapping the belly
        cyl(0.69, 0.66, 0.34, 9, 0xc8442e, { y: 0.66, open: true }),
        cyl(0.65, 0.63, 0.1, 9, 0xf7f4ee, { y: 0.78, open: true }), // white stripe in label
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 寶特瓶 — clear PET water bottle: ribbed body, blue screw cap */
  /* ---------------------------------------------------------------- */
  {
    id: 'pet_bottle',
    displayName: '寶特瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xcfe6e2, 0xbfdfe8, 0x2f6fb0, 0xeaf4f2, 0x9cc6d2],
    yOffset: -0.1095,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      return finish([
        cyl(0.5, 0.46, 0.28, 9, 0xcfe6e2, { y: 0.16 }), // foot
        cyl(0.5, 0.5, 0.9, 9, 0xcfe6e2, { y: 0.74, hex2: 0xeaf4f2 }), // body
        // grip rings
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.55 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 0.78 }),
        cyl(0.53, 0.53, 0.05, 9, 0xbfdfe8, { y: 1.01 }),
        cyl(0.32, 0.5, 0.34, 9, 0xcfe6e2, { y: 1.36 }), // shoulder
        cyl(0.22, 0.22, 0.22, 9, 0xeaf4f2, { y: 1.62 }), // neck
        cyl(0.27, 0.27, 0.2, 9, 0x2f6fb0, { y: 1.78 }), // blue cap
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 章魚小丸子 — takoyaki: browned dough ball drizzled with sauce + bonito */
  /* ---------------------------------------------------------------- */
  {
    id: 'takoyaki',
    displayName: '章魚小丸子',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8853a, 0xb0712a, 0x6a3a1e, 0xe8c060, 0xd8c8a8],
    yOffset: -0.1999,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // browned dough ball (slightly squashed)
        sph(0.86, 0xc8853a, { ws: 9, hs: 7, sy: 0.92, y: 0.82, hex2: 0xe0a04a }),
        cyl(0.5, 0.62, 0.18, 8, 0xb0712a, { y: 0.1 }), // crisped underside
        // dark brown takoyaki-sauce zig-zag (two crossing bars on top)
        box(1.5, 0.08, 0.16, 0x6a3a1e, { ry: 0.5, y: 1.46 }),
        box(1.5, 0.08, 0.16, 0x6a3a1e, { ry: -0.5, y: 1.5 }),
        // pale mayo stripe
        box(1.3, 0.06, 0.1, 0xf0e8d0, { ry: 0.1, y: 1.56 }),
      ];
      // bonito flakes fluttering on the crown (deterministic ring)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * PI * 2;
        parts.push(
          box(0.22, 0.04, 0.14, 0xd8b078, {
            x: Math.cos(a) * 0.34,
            y: 1.62 + (i % 2) * 0.06,
            z: Math.sin(a) * 0.34,
            rz: 0.3,
          })
        );
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 雞蛋糕 — egg cake: little golden castella puffs joined in a cluster */
  /* ---------------------------------------------------------------- */
  {
    id: 'egg_cake',
    displayName: '雞蛋糕',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf0c468, 0xe0a840, 0xf6dca0, 0xd89a30, 0xc88828],
    yOffset: -0.6441,
    upright: false,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // four conjoined golden puffs in a 2x2 cluster
      const spots = [
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
      ];
      for (let i = 0; i < spots.length; i++) {
        const [px, pz] = spots[i];
        // domed top
        parts.push(
          sph(0.66, 0xf0c468, { ws: 7, hs: 4, sy: 0.72, x: px, y: 0.62, z: pz, thetaLen: PI * 0.6, hex2: 0xf6dca0 })
        );
        // browned base
        parts.push(cyl(0.5, 0.62, 0.36, 6, 0xe0a840, { x: px, y: 0.2, z: pz, hex2: 0xd89a30 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 可麗餅 — crepe cone: rolled crispy crepe in a paper sleeve */
  /* ---------------------------------------------------------------- */
  {
    id: 'crepe_cone',
    displayName: '可麗餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c884, 0xd8a850, 0xf4eee0, 0xb86a3a, 0x8a4a2a],
    yOffset: -0.0809,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      return finish([
        // crispy folded crepe body — wide open mouth tapering to a point
        cone(0.7, 2.4, 8, 0xe8c884, { rx: PI, y: 0.0, hex2: 0xd8a850 }),
        // browned crisp seam down one side
        box(0.1, 2.3, 0.14, 0xb86a3a, { x: 0.42, y: 0.0, rz: 0.18 }),
        // white paper sleeve at the bottom third
        cyl(0.4, 0.24, 0.9, 8, 0xf4eee0, { y: -0.78, hex2: 0xeae2d0 }),
        // filling peeking out the top (cream swirl)
        sph(0.34, 0xf4eee0, { ws: 7, hs: 5, sy: 1.2, y: 1.32 }),
        sph(0.2, 0x8a4a2a, { ws: 6, hs: 4, x: 0.12, y: 1.5 }), // chocolate dab
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 滷味夾 — luwei serving tongs: two steel arms hinged at a pivot */
  /* ---------------------------------------------------------------- */
  {
    id: 'luwei_tongs',
    displayName: '滷味夾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.11,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8ccd2, 0xaeb4bc, 0xe0e4ea, 0x8a9098, 0xd4d8de],
    yOffset: -0.5971,
    upright: false,
    collisionScale: 0.6,
    buildGeometry(rng) {
      return finish([
        cyl(0.16, 0.16, 0.16, 8, 0x8a9098, { rz: HALF_PI, y: 0.0 }), // hinge pivot
        // upper arm: opens toward +x, angled up
        box(2.1, 0.12, 0.16, 0xc8ccd2, { rz: 0.22, x: 0.95, y: 0.28 }),
        box(0.4, 0.12, 0.34, 0xe0e4ea, { rz: 0.22, x: 1.95, y: 0.5 }), // upper scoop pad
        // lower arm: angled down
        box(2.1, 0.12, 0.16, 0xaeb4bc, { rz: -0.22, x: 0.95, y: -0.28 }),
        box(0.4, 0.12, 0.34, 0xd4d8de, { rz: -0.22, x: 1.95, y: -0.5 }), // lower scoop pad
        // spring loop behind the pivot
        torus(0.22, 0.05, 5, 8, 0xaeb4bc, { rz: HALF_PI, x: -0.34, y: 0.0, arc: PI * 1.4 }),
      ]);
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
        // bulging body — wider at the bottom where the goods sit
        sph(0.9, 0xe8e4de, { ws: 8, hs: 5, sy: 0.95, y: 0.78, hex2: 0xf4f0ea }),
        box(1.5, 0.6, 1.2, 0xe8e4de, { y: 0.36 }), // boxy lumpy contents
        // red bands (classic 紅白條紋)
        cyl(0.86, 0.86, 0.2, 8, 0xd83a34, { y: 0.5, open: true }),
        cyl(0.78, 0.78, 0.16, 8, 0xc23028, { y: 0.92, open: true }),
        // gathered neck + twist
        cyl(0.5, 0.78, 0.34, 7, 0xeceae4, { y: 1.34 }),
        cyl(0.22, 0.22, 0.26, 6, 0xe8e4de, { y: 1.62 }), // knot
        // two loop handles
        torus(0.34, 0.07, 4, 6, 0xd83a34, { x: -0.36, y: 1.78, arc: PI }),
        torus(0.34, 0.07, 4, 6, 0xe8e4de, { x: 0.36, y: 1.78, arc: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [7] 起司馬鈴薯 — cheese potato: split baked spud oozing molten cheese */
  /* ---------------------------------------------------------------- */
  {
    id: 'cheese_potato',
    displayName: '起司馬鈴薯',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb88a4a, 0xa6783a, 0xf0d060, 0xe8b840, 0x8a5a28],
    yOffset: -0.2859,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // baked potato body, slightly oval
        sph(0.92, 0xb88a4a, { ws: 9, hs: 6, sy: 0.66, y: 0.6, hex2: 0xa6783a }),
        cyl(0.78, 0.7, 0.2, 9, 0x8a5a28, { y: 0.12 }), // browned underside
        // split-open cheese filling mounded in the middle
        sph(0.66, 0xf0d060, { ws: 8, hs: 5, sy: 0.7, y: 0.96, thetaLen: PI * 0.62, hex2: 0xe8b840 }),
        box(1.3, 0.16, 0.5, 0xf0d060, { y: 0.92 }), // cheese spilling along the cut
      ];
      // cheese drips down the sides (deterministic)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        parts.push(cyl(0.06, 0.1, 0.4, 5, 0xf0d060, { x: Math.cos(a) * 0.66, y: 0.6, z: Math.sin(a) * 0.66 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 飲料杯塔 oversized stall drink cup with dome lid + straw */
  /* ---------------------------------------------------------------- */
  {
    id: 'drink_cup_tower',
    displayName: '飲料杯塔',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xeef2f4, 0xd6e2e8, 0xe85a3a, 0xc8d6da, 0xf6c038],
    yOffset: -0.0346,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        // clear plastic cup, tapering to a narrow base
        cyl(0.7, 0.46, 1.8, 10, 0xeef2f4, { y: 0.7, hex2: 0xd6e2e8 }),
        // drink fill line (orange-ish tea)
        cyl(0.66, 0.5, 1.1, 10, 0xf6c038, { y: 0.5, open: true, hex2: 0xe89a30 }),
        // rim ring
        cyl(0.72, 0.72, 0.08, 10, 0xc8d6da, { y: 1.6, open: true }),
        // domed lid
        sph(0.72, 0xeef2f4, { ws: 10, hs: 5, sy: 0.6, y: 1.62, thetaLen: PI * 0.55 }),
        cyl(0.72, 0.7, 0.12, 10, 0xc8d6da, { y: 1.66 }), // lid skirt
        // fat red straw poking through the dome at an angle
        cyl(0.13, 0.13, 1.8, 6, 0xe85a3a, { x: 0.18, y: 2.3, rz: 0.18 }),
        cyl(0.14, 0.14, 0.2, 6, 0xc8442e, { x: 0.32, y: 3.05, rz: 0.18 }), // bevelled straw tip
      ];
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 大腸香腸烤台 sausage grill cart: skewered links over coals */
  /* ---------------------------------------------------------------- */
  {
    id: 'sausage_grill',
    displayName: '大腸香腸烤台',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x8a4a32, 0xa6562e, 0x3a2a22, 0xd87a3a, 0xc8c4be],
    yOffset: -0.4480,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // grill box body (steel cart top holding the coals)
        box(2.6, 0.5, 1.3, 0xc8c4be, { y: 0.7, hex2: 0xb0aca6 }),
        box(2.7, 0.16, 1.4, 0x8a9098, { y: 0.46 }), // base lip
        // glowing charcoal bed inside
        box(2.3, 0.12, 1.0, 0xd87a3a, { y: 0.96, hex2: 0xe8a040 }),
        // grill grate bars across the top
      ];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.04, 0.04, 1.1, 3, 0x3a2a22, { rx: HALF_PI, x: -0.85 + i * 0.55, y: 1.04 }));
      }
      // four fat browned sausages resting on the grate (flat-capped cyls)
      const sausageHex = [0xa6562e, 0x8a4a32, 0xb85a30, 0x9a5028];
      for (let i = 0; i < 4; i++) {
        const px = -0.78 + i * 0.52;
        parts.push(
          cyl(0.18, 0.18, 1.0, 6, sausageHex[i], { rx: HALF_PI, x: px, y: 1.14, hex2: 0xd87a3a })
        );
      }
      // four stubby cart legs
      parts.push(cyl(0.14, 0.14, 0.9, 4, 0x3a2a22, { x: -1.1, y: 0.0, z: 0.5 }));
      parts.push(cyl(0.14, 0.14, 0.9, 4, 0x3a2a22, { x: 1.1, y: 0.0, z: 0.5 }));
      parts.push(cyl(0.14, 0.14, 0.9, 4, 0x3a2a22, { x: -1.1, y: 0.0, z: -0.5 }));
      parts.push(cyl(0.14, 0.14, 0.9, 4, 0x3a2a22, { x: 1.1, y: 0.0, z: -0.5 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
