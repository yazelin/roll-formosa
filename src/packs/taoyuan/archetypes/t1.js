/**
 * @file packs/taoyuan/archetypes/t1.js — T1 中壢夜市攤頭 (night-market stall items).
 *
 * Tier 1 of the Roll Formosa Taoyuan ladder (中壢夜市, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/taoyuan/tiers.js:
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
  /* [2] 落花生 — raw peanut in shell, Taoyuan farming specialty      */
  /* ---------------------------------------------------------------- */
  {
    id: 'ground_nut',
    displayName: '落花生',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc4a070, 0xb89060, 0xd8b888, 0xa88050, 0xe0c498],
    yOffset: -0.10,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Raw peanut in shell - Taoyuan/Daxi area farms peanuts for 花生糖
      return finish([
        // double-bulb peanut shell, narrowed in the middle
        sph(0.55, 0xffffff, { ws: 8, hs: 6, y: 0.55, sx: 0.9, hex2: 0xd8b888 }), // lower bulb
        sph(0.45, 0xffffff, { ws: 8, hs: 6, y: 1.35, sx: 0.85, hex2: 0xe0c498 }), // upper bulb
        // pinched waist between the two chambers
        cyl(0.32, 0.38, 0.25, 8, 0xb89060, { y: 0.95 }),
        // textured surface ridges (characteristic peanut shell pattern)
        box(0.08, 0.6, 0.06, 0xa88050, { x: 0.35, y: 0.6, z: 0.0 }),
        box(0.08, 0.6, 0.06, 0xa88050, { x: -0.35, y: 0.6, z: 0.0 }),
        box(0.06, 0.45, 0.08, 0xa88050, { x: 0.0, y: 1.3, z: 0.3 }),
        // stem remnant at top
        cyl(0.08, 0.06, 0.12, 5, 0x8a6a40, { y: 1.78 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 香 — single thin incense stick: red shaft, glowing ember tip */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_stick',
    displayName: '香',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8302a, 0x8a4a2a, 0xd8a23a, 0xe6c060, 0x6a3a1e],
    yOffset: -0.0008,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      return finish([
        cyl(0.05, 0.05, 2.7, 6, 0xb8302a, { y: 0.0 }), // red bamboo stick
        cyl(0.07, 0.06, 0.9, 6, 0x8a4a2a, { y: -1.0 }), // incense-paste lower coat
        cyl(0.085, 0.085, 0.12, 6, 0x6a3a1e, { y: 1.32 }), // burnt char band
        sph(0.1, 0xe6c060, { ws: 6, hs: 4, y: 1.46 }), // glowing ember tip
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 金紙 — stack of joss paper: cream sheets, central gold-foil square */
  /* ---------------------------------------------------------------- */
  {
    id: 'joss_paper',
    displayName: '金紙',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8c468, 0xf0deb0, 0xd8a83a, 0xc89a2e, 0xf4e8c8],
    yOffset: -0.5589,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // stacked cream sheets, faint layering via alternating tints
      for (let i = 0; i < 7; i++) {
        const tint = i % 2 === 0 ? 0xf0deb0 : 0xe8d8a8;
        parts.push(box(1.5, 0.12, 1.1, tint, { y: 0.06 + i * 0.12 }));
      }
      // central gold-foil square on the top sheet
      parts.push(box(0.62, 0.04, 0.62, 0xe8c468, { y: 0.9, hex2: 0xd8a83a }));
      // red ledger stripe along one edge
      parts.push(box(0.16, 0.86, 1.12, 0xc24028, { x: -0.67, y: 0.43 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 牛肉麵碗 — Zhongli beef noodle bowl                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'beef_noodle_bowl',
    displayName: '牛肉麵碗',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.12,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf4f0e8, 0xe8e2d8, 0xd4cec4, 0xf8f4ec, 0xfcf8f0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // ceramic bowl body - tapered, wider at top
        cyl(1.1, 0.7, 0.9, 10, 0xf4f0e8, { y: 0.45, hex2: 0xfcf8f0 }),
        // rim ring
        cyl(1.14, 1.08, 0.12, 10, 0xe8e2d8, { y: 0.94 }),
        // broth surface (dark, rich beef soup)
        cyl(0.95, 0.95, 0.08, 10, 0x5a3820, { y: 0.88 }),
        // noodles visible (pale strands peeking through)
        box(0.6, 0.06, 0.4, 0xf0e8c8, { x: 0.2, y: 0.92, z: 0.1 }),
        box(0.5, 0.06, 0.35, 0xf4ead0, { x: -0.25, y: 0.94, z: -0.15 }),
        // beef slices
        sph(0.22, 0x8a4028, { ws: 5, hs: 3, sy: 0.4, x: 0.3, y: 0.98, z: -0.2 }),
        sph(0.18, 0x7a3822, { ws: 5, hs: 3, sy: 0.4, x: -0.2, y: 0.96, z: 0.25 }),
        // green onion garnish
        cyl(0.04, 0.04, 0.2, 4, 0x4a8a3a, { rx: HALF_PI, x: 0.0, y: 1.0, z: 0.3 }),
        cyl(0.04, 0.04, 0.15, 4, 0x5a9a4a, { rx: HALF_PI, x: -0.35, y: 0.98, z: 0.0, ry: 0.5 }),
      ];
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
  /* [7] 蔥油餅 — Zhongli scallion pancake                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'scallion_pancake',
    displayName: '蔥油餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8a858, 0xc89848, 0xe8b868, 0xb88838, 0xf8c878],
    yOffset: -0.70,
    upright: false,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const parts = [
        // flat round pancake, golden fried surface
        cyl(1.0, 1.0, 0.25, 12, 0xffffff, { y: 0.125 }), // main body (tinted golden)
        // crispy browned edges
        cyl(1.02, 1.02, 0.08, 12, 0xb88838, { y: 0.04, open: true }),
        // visible green scallion bits baked into surface
        box(0.15, 0.06, 0.08, 0x4a8a3a, { x: 0.3, y: 0.28, z: 0.2 }),
        box(0.12, 0.06, 0.06, 0x5a9a4a, { x: -0.4, y: 0.28, z: -0.1 }),
        box(0.1, 0.06, 0.07, 0x4a8a3a, { x: 0.15, y: 0.28, z: -0.35 }),
        box(0.13, 0.06, 0.08, 0x5a9a4a, { x: -0.2, y: 0.28, z: 0.4 }),
        // oil sheen highlights
        box(0.3, 0.02, 0.25, 0xf8d070, { x: 0.1, y: 0.3, z: 0.05 }),
        box(0.25, 0.02, 0.2, 0xf0c060, { x: -0.3, y: 0.3, z: -0.2 }),
      ];
      return finish(parts);
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
  /* [9] CHUNK LANDMARK — 彈珠台 slanted wooden pinball board with pegs */
  /* ---------------------------------------------------------------- */
  {
    id: 'pinball_machine',
    displayName: '彈珠台',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb5712f, 0xcf8b3f, 0x9a5a24, 0xe0b85a, 0xd83a34],
    yOffset: -0.5306,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // slanted board: tilted around x so the far edge lifts
        box(2.0, 0.16, 2.6, 0xcf8b3f, { rx: -0.32, y: 0.6, hex2: 0xe0b85a }),
        // raised wooden side rails
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: -1.0, y: 0.72 }),
        box(0.16, 0.34, 2.7, 0x9a5a24, { rx: -0.32, x: 1.0, y: 0.72 }),
        box(2.16, 0.34, 0.16, 0x9a5a24, { rx: -0.32, y: 1.32, z: -1.28 }), // top rail
        box(2.16, 0.28, 0.16, 0xb5712f, { rx: -0.32, y: 0.04, z: 1.28 }), // bottom lip
        // four stubby legs
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: -0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: -0.86, y: 0.2, z: -0.9 }),
        cyl(0.12, 0.12, 0.7, 5, 0x9a5a24, { x: 0.86, y: 0.0, z: 0.9 }),
        cyl(0.12, 0.12, 1.1, 5, 0x9a5a24, { x: 0.86, y: 0.2, z: -0.9 }),
      ];
      // grid of brass pegs on the playfield (deterministic lattice)
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const px = -0.6 + c * 0.6;
          const pz = -0.6 + r * 0.6;
          // raise pegs along the tilt so they sit on the board surface
          const py = 0.78 + (-pz) * 0.33;
          parts.push(cyl(0.06, 0.06, 0.18, 4, 0xe0b85a, { rx: -0.32, x: px, y: py, z: pz }));
        }
      }
      // a couple of marbles resting at the low end
      parts.push(sph(0.12, 0xd83a34, { ws: 5, hs: 3, x: -0.3, y: 0.5, z: 1.0 }));
      parts.push(sph(0.12, 0xcfe6e2, { ws: 5, hs: 3, x: 0.35, y: 0.5, z: 1.0 }));
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
