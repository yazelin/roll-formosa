/**
 * @file packs/changhua/archetypes/t1.js — T1 鹿港柑仔店 (Lukang corner-store items).
 *
 * Tier 1 of the Roll Formosa Changhua ladder (鹿港老街, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/changhua/tiers.js:
 *   slots [0..7] absorbable 老街小物 (spawnWeight 1.0),
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
  /* [0] chopstick_sleeve 竹筷套 — bamboo chopstick sleeve wrapper      */
  /* ---------------------------------------------------------------- */
  {
    id: 'chopstick_sleeve',
    displayName: '竹筷套',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.055,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8a868, 0xb89858, 0xd8b878, 0xa08048, 0xe8c888],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Paper sleeve (elongated flat box)
        box(0.3, 0.08, 2.2, 0xffffff, { rz: HALF_PI }), // paper wrapper (tinted)
        // Red decorative band
        box(0.28, 0.09, 0.3, 0xc83828, { rz: HALF_PI, x: 0.6 }),
        // Chopstick tips peeking out
        cyl(0.04, 0.04, 0.4, 4, 0x8b5a28, { rz: HALF_PI, x: -1.0 }),
        cyl(0.04, 0.04, 0.4, 4, 0x8b5a28, { rz: HALF_PI, x: -1.0, z: 0.08 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] incense_bundle 線香束 — bundle of thin incense sticks          */
  /* ---------------------------------------------------------------- */
  {
    id: 'incense_bundle',
    displayName: '線香束',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb8302a, 0x8a4a2a, 0xd8a23a, 0xe6c060, 0x6a3a1e],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // Bundle of incense sticks
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * PI * 2;
        const r = i === 0 ? 0 : 0.08;
        parts.push(cyl(0.03, 0.03, 2.4, 4, 0xffffff, {
          x: Math.cos(angle) * r,
          z: Math.sin(angle) * r,
          y: 1.2,
        }));
      }
      // Red paper band wrapping the bundle
      parts.push(cyl(0.14, 0.14, 0.3, 8, 0xc83828, { y: 0.5, open: true }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 檳榔 — fresh green betel nut: glossy oval with a pale tip */
  /* ---------------------------------------------------------------- */
  {
    id: 'betel_nut',
    displayName: '檳榔',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x5a8a2e, 0x6fa238, 0x4a7a26, 0xc8d49a, 0x86b04a],
    yOffset: -0.0002,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        sph(0.62, 0x6fa238, { ws: 9, hs: 7, sy: 1.5, y: 0.62, hex2: 0x5a8a2e }), // green ovoid
        cone(0.26, 0.34, 8, 0xc8d49a, { y: 1.42 }), // pale stem tip
        sph(0.18, 0x4a7a26, { ws: 6, hs: 4, y: 0.08 }), // darker base nub
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] lantern_ornament 燈籠飾 — small decorative lantern charm       */
  /* ---------------------------------------------------------------- */
  {
    id: 'lantern_ornament',
    displayName: '燈籠飾',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc82828, 0xd83838, 0xf0b429, 0xb82020, 0xe84848],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Top cap
        cyl(0.25, 0.25, 0.12, 8, 0xf0b429, { y: 1.5 }),
        // Lantern body (stacked cylinders for shape)
        cyl(0.35, 0.25, 0.2, 8, 0xffffff, { y: 1.35 }),
        cyl(0.45, 0.35, 0.25, 8, 0xffffff, { y: 1.1 }),
        cyl(0.45, 0.45, 0.3, 8, 0xffffff, { y: 0.8 }),
        cyl(0.35, 0.45, 0.25, 8, 0xffffff, { y: 0.55 }),
        cyl(0.25, 0.35, 0.2, 8, 0xffffff, { y: 0.35 }),
        // Bottom cap
        cyl(0.25, 0.25, 0.12, 8, 0xf0b429, { y: 0.2 }),
        // Tassel
        cyl(0.05, 0.05, 0.15, 4, 0xf0b429, { y: 0.08 }),
        cone(0.08, 0.2, 6, 0xf0b429, { y: -0.08, rx: PI }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] mazu_amulet 媽祖符 — Mazu temple protection amulet             */
  /* ---------------------------------------------------------------- */
  {
    id: 'mazu_amulet',
    displayName: '媽祖符',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc82828, 0xf0b429, 0xe8d8a0, 0xd83030, 0xb82020],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Rectangular amulet body (red fabric)
        box(0.8, 1.4, 0.12, 0xffffff, { y: 0.7 }), // red cloth (tinted)
        // Gold border trim
        box(0.82, 0.08, 0.13, 0xf0b429, { y: 1.36 }),
        box(0.82, 0.08, 0.13, 0xf0b429, { y: 0.04 }),
        box(0.08, 1.4, 0.13, 0xf0b429, { x: -0.37, y: 0.7 }),
        box(0.08, 1.4, 0.13, 0xf0b429, { x: 0.37, y: 0.7 }),
        // Central character/symbol (gold)
        box(0.4, 0.5, 0.14, 0xf0b429, { y: 0.75 }),
        // Hanging loop at top
        torus(0.12, 0.03, 4, 8, 0xf0b429, { y: 1.55 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] ox_tongue_biscuit 牛舌餅袋 — bag of ox-tongue biscuits         */
  /* ---------------------------------------------------------------- */
  {
    id: 'ox_tongue_biscuit',
    displayName: '牛舌餅袋',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.11,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc88a4a, 0xf4e3c0, 0xb87838, 0xe0b070, 0xa66828],
    yOffset: -0.18,
    upright: false,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Plastic bag body (bulging)
        sph(0.85, 0xf4f0ea, { ws: 8, hs: 6, sy: 0.7, y: 0.5 }),
        // Visible biscuits inside (elongated ovals)
        sph(0.3, 0xc88a4a, { ws: 6, hs: 4, sy: 0.3, sx: 1.8, y: 0.4, z: 0.3 }),
        sph(0.28, 0xb87838, { ws: 6, hs: 4, sy: 0.3, sx: 1.7, y: 0.55, z: -0.2 }),
        sph(0.26, 0xe0b070, { ws: 6, hs: 4, sy: 0.3, sx: 1.6, y: 0.35, z: 0.0 }),
        // Bag tie at top
        cyl(0.15, 0.08, 0.2, 6, 0xd83a34, { y: 0.95 }),
        // Printed label
        box(0.5, 0.2, 0.02, 0xc82828, { y: 0.5, z: 0.62 }),
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
  /* [7] 胡椒餅 — pepper bun: round sesame-crusted baked bun */
  /* ---------------------------------------------------------------- */
  {
    id: 'pepper_bun',
    displayName: '胡椒餅',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc88a4a, 0xb87838, 0xe0b070, 0xa66828, 0xf0e8d0],
    yOffset: -0.4474,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // domed baked top, flatter bottom
        sph(0.92, 0xc88a4a, { ws: 10, hs: 6, sy: 0.62, y: 0.55, thetaLen: PI * 0.62, hex2: 0xe0b070 }),
        cyl(0.92, 0.86, 0.34, 10, 0xb87838, { y: 0.17 }), // crusty side wall
        cyl(0.86, 0.86, 0.08, 10, 0xa66828, { y: 0.02 }), // browned base
      ];
      // scattered sesame seeds on the dome (deterministic ring)
      const seeds = 9;
      for (let i = 0; i < seeds; i++) {
        const a = (i / seeds) * PI * 2;
        const r = 0.42 + (i % 2) * 0.22;
        parts.push(
          sph(0.07, 0xf0e8d0, { ws: 4, hs: 3, x: Math.cos(a) * r, y: 0.72 - (i % 3) * 0.05, z: Math.sin(a) * r })
        );
      }
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
    id: 'pinball_table',
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
