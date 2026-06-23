/**
 * @file packs/nantou/archetypes/t1.js — T1 埔里小吃街 (Puli snack street items).
 *
 * Tier 1 of the Roll Formosa Nantou ladder (埔里小吃街, enterTrueRadius 0.10 m).
 * 10 ArchetypeDefs in the FROZEN id order from packs/nantou/tiers.js:
 *   slots [0..7] absorbable 埔里小吃 items (spawnWeight 1.0),
 *   slots [8..9] repeatable CHUNK LANDMARKS (小吃拱門 / 茶攤車, spawnWeight ~0.3).
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
  /* [0] 紹興酒瓶 — Shaoxing rice wine bottle from Puli winery */
  /* ---------------------------------------------------------------- */
  {
    id: 'shaoxing_bottle',
    displayName: '紹興酒瓶',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a50, 0x6a4a38, 0xc02020, 0xa08060, 0x9a7a5a],
    yOffset: -0.11,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // wide ceramic body (bulbous)
        sph(0.5, 0x8a6a50, { ws: 8, hs: 6, y: 0.45, sy: 0.9, hex2: 0x9a7a5a }),
        // shoulder (tapers to neck)
        cyl(0.35, 0.2, 0.3, 8, 0x8a6a50, { y: 0.95, hex2: 0x6a4a38 }),
        // neck (narrow)
        cyl(0.15, 0.12, 0.35, 8, 0x8a6a50, { y: 1.25, hex2: 0x9a7a5a }),
        // lip/rim
        cyl(0.16, 0.16, 0.06, 8, 0x6a4a38, { y: 1.46 }),
        // cork stopper
        cyl(0.1, 0.12, 0.12, 6, 0xa08060, { y: 1.55 }),
        // red seal (traditional label)
        box(0.25, 0.2, 0.02, 0xc02020, { y: 0.5, z: 0.48 }),
        // base (flat bottom)
        cyl(0.42, 0.42, 0.06, 8, 0x6a4a38, { y: 0.03 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [1] 蜜餞 — preserved plum/fruit in a small jar */
  /* ---------------------------------------------------------------- */
  {
    id: 'preserved_plum',
    displayName: '蜜餞',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.05,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc88040, 0xa86030, 0xe0a060, 0x8a5030, 0xf0c080],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // small glass jar
        cyl(0.4, 0.4, 0.7, 8, 0xe8e0d0, { y: 0.4 }),
        // lid (plastic cap)
        cyl(0.42, 0.42, 0.12, 8, 0xc02828, { y: 0.78 }),
        // visible preserved fruit through glass (brownish)
        cyl(0.32, 0.32, 0.55, 6, 0xc88040, { y: 0.35, hex2: 0xa86030 }),
        // jar bottom ridge
        cyl(0.42, 0.4, 0.08, 8, 0xd8d0c0, { y: 0.06 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [2] 紹興香腸 — Shaoxing wine sausage, dark-red cured meat */
  /* ---------------------------------------------------------------- */
  {
    id: 'shaoxing_sausage',
    displayName: '紹興香腸',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a2a1a, 0xa03828, 0x6a1a10, 0xb84830, 0xc8a080],
    yOffset: -0.0,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // curved sausage body (two linked segments)
        sph(0.4, 0x8a2a1a, { ws: 7, hs: 5, x: -0.3, y: 0.3, sx: 1.4, sy: 0.7, sz: 0.7, hex2: 0xa03828 }),
        sph(0.4, 0xa03828, { ws: 7, hs: 5, x: 0.3, y: 0.3, sx: 1.4, sy: 0.7, sz: 0.7, hex2: 0x6a1a10 }),
        // tie string in middle
        cyl(0.08, 0.08, 0.06, 6, 0xc8a080, { x: 0, y: 0.3, rz: HALF_PI }),
        // ends slightly darker
        sph(0.15, 0x6a1a10, { ws: 5, hs: 4, x: -0.7, y: 0.3 }),
        sph(0.15, 0x6a1a10, { ws: 5, hs: 4, x: 0.7, y: 0.3 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [3] 茶壺 — traditional teapot (Yixing style) */
  /* ---------------------------------------------------------------- */
  {
    id: 'teapot',
    displayName: '茶壺',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.08,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x7a4a3a, 0x5a3a2a, 0x9a6a5a, 0x8a5a4a, 0x6a4030],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      return finish([
        // pot body (squat sphere)
        sph(0.6, 0x7a4a3a, { ws: 8, hs: 6, y: 0.5, sy: 0.7, hex2: 0x9a6a5a }),
        // lid
        sph(0.32, 0x5a3a2a, { ws: 6, hs: 4, y: 0.9, sy: 0.5 }),
        // lid knob
        sph(0.1, 0x8a5a4a, { ws: 5, hs: 3, y: 1.05 }),
        // spout (angled cone)
        cone(0.12, 0.5, 6, 0x7a4a3a, { x: 0.7, y: 0.55, rz: -0.6 }),
        // handle (torus arc)
        torus(0.28, 0.06, 4, 6, 0x6a4030, { x: -0.55, y: 0.55, arc: PI * 0.8, ry: HALF_PI }),
        // foot ring
        cyl(0.35, 0.35, 0.08, 8, 0x5a3a2a, { y: 0.06 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [4] 茶葉罐 — tea canister (cylindrical tin) */
  /* ---------------------------------------------------------------- */
  {
    id: 'tea_canister',
    displayName: '茶葉罐',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.07,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x2a5a3a, 0x3a7a4a, 0xc8a040, 0x1a4a2a, 0xe8d080],
    yOffset: -0.16,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // cylindrical body (green tea tin)
        cyl(0.45, 0.45, 1.2, 8, 0x2a5a3a, { y: 0.6, hex2: 0x3a7a4a }),
        // lid (slightly wider)
        cyl(0.48, 0.48, 0.2, 8, 0x2a5a3a, { y: 1.25 }),
        // gold label band
        cyl(0.47, 0.47, 0.25, 8, 0xc8a040, { y: 0.6, open: true }),
        // gold rim at top
        cyl(0.49, 0.49, 0.04, 8, 0xe8d080, { y: 1.16, open: true }),
        // base rim
        cyl(0.47, 0.47, 0.04, 8, 0x1a4a2a, { y: 0.04 }),
      ]);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [5] 竹筍 — fresh bamboo shoot (conical with leaf layers) */
  /* ---------------------------------------------------------------- */
  {
    id: 'bamboo_shoot',
    displayName: '竹筍',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.09,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8a870, 0xa88850, 0x8a6830, 0xe0c890, 0x6a5020],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // conical body (layered husks)
        cone(0.6, 1.6, 8, 0xc8a870, { y: 0.8, hex2: 0xa88850 }),
        // outer husk layers (wider rings near base)
        cyl(0.58, 0.52, 0.2, 8, 0xa88850, { y: 0.25 }),
        cyl(0.52, 0.45, 0.2, 8, 0x8a6830, { y: 0.45 }),
        cyl(0.45, 0.38, 0.18, 8, 0xa88850, { y: 0.62 }),
        // tip (pale inner shoot)
        cone(0.18, 0.4, 6, 0xe0c890, { y: 1.45 }),
        // base cut (darker)
        cyl(0.58, 0.58, 0.08, 8, 0x6a5020, { y: 0.04 }),
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
  /* [7] 肉圓 — Puli-style meatball (translucent wrapper) */
  /* ---------------------------------------------------------------- */
  {
    id: 'puli_meatball',
    displayName: '肉圓',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.06,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c090, 0xc0a070, 0xa08050, 0xe8d0a0, 0x805830],
    yOffset: -0.42,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // translucent wrapper (squat dome shape)
        sph(0.8, 0xd8c090, { ws: 8, hs: 6, sy: 0.65, y: 0.45, hex2: 0xe8d0a0 }),
        // visible meat filling (darker center)
        sph(0.5, 0xa08050, { ws: 6, hs: 4, y: 0.4 }),
        // bottom (slightly flat)
        cyl(0.7, 0.7, 0.1, 8, 0xc0a070, { y: 0.08 }),
      ];
      // sauce drizzle on top
      parts.push(box(0.5, 0.04, 0.08, 0x805830, { y: 0.72, rz: 0.3 }));
      parts.push(box(0.4, 0.04, 0.08, 0x805830, { y: 0.7, rz: -0.4 }));
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [8] CHUNK LANDMARK — 小吃拱門 Puli snack-street arch */
  /* ---------------------------------------------------------------- */
  {
    id: 'puli_snack_arch',
    displayName: '小吃拱門',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.22,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xd8302a, 0xe85a3a, 0xf0c040, 0xc02824, 0x2a8a3a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [
        // two stout pillars
        box(0.35, 2.4, 0.35, 0xd8302a, { x: -1.5, y: 1.2, hex2: 0xe85a3a }),
        box(0.35, 2.4, 0.35, 0xd8302a, { x: 1.5, y: 1.2, hex2: 0xe85a3a }),
        // pillar caps
        box(0.5, 0.15, 0.5, 0xf0c040, { x: -1.5, y: 2.45 }),
        box(0.5, 0.15, 0.5, 0xf0c040, { x: 1.5, y: 2.45 }),
        // arched top beam (curved torus arc spanning the gap)
        torus(1.55, 0.18, 4, 8, 0xf0c040, { x: 0, y: 2.4, arc: PI }),
        // signboard banner across the top
        box(2.8, 0.55, 0.15, 0x2a8a3a, { x: 0, y: 2.95, hex2: 0xc02824 }),
        box(2.6, 0.1, 0.16, 0xf0c040, { x: 0, y: 3.16 }),
        box(2.6, 0.1, 0.16, 0xf0c040, { x: 0, y: 2.72 }),
        // hanging lanterns under the arch
      ];
      for (let i = 0; i < 4; i++) {
        const lx = -1.2 + i * 0.8;
        const c = [0xd8302a, 0xf0c040, 0xe85a3a, 0xc02824][i % 4];
        parts.push(sph(0.14, c, { x: lx, y: 2.1, ws: 6, hs: 4 }));
      }
      return finish(parts);
    },
  },

  /* ---------------------------------------------------------------- */
  /* [9] CHUNK LANDMARK — 茶攤車 tea vendor cart */
  /* ---------------------------------------------------------------- */
  {
    id: 'tea_stall',
    displayName: '茶攤車',
    tier: 1,
    naturalBand: 1,
    radiusNominal: 0.24,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x8a6a4a, 0x6a4a30, 0x2a5a3a, 0xd8d0c0, 0xc8a040],
    yOffset: -0.37,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const parts = [
        // cart body (wooden cabinet)
        box(1.6, 0.8, 0.9, 0x8a6a4a, { y: 0.6, hex2: 0x6a4a30 }),
        // counter / stainless top
        box(1.72, 0.08, 0.98, 0xd8d0c0, { y: 1.04 }),
        // display jars (tea leaves)
        cyl(0.18, 0.18, 0.4, 6, 0x2a5a3a, { x: -0.5, y: 1.28 }),
        cyl(0.18, 0.18, 0.4, 6, 0x2a5a3a, { x: 0, y: 1.28 }),
        cyl(0.18, 0.18, 0.4, 6, 0x2a5a3a, { x: 0.5, y: 1.28 }),
        // glass lid on jars
        cyl(0.19, 0.19, 0.06, 6, 0xe8e0d0, { x: -0.5, y: 1.5 }),
        cyl(0.19, 0.19, 0.06, 6, 0xe8e0d0, { x: 0, y: 1.5 }),
        cyl(0.19, 0.19, 0.06, 6, 0xe8e0d0, { x: 0.5, y: 1.5 }),
        // awning poles
        cyl(0.04, 0.04, 1.0, 5, 0x6a4a30, { x: -0.7, y: 1.58, z: 0.38 }),
        cyl(0.04, 0.04, 1.0, 5, 0x6a4a30, { x: 0.7, y: 1.58, z: 0.38 }),
        // awning (green canvas)
        box(1.8, 0.08, 1.0, 0x2a5a3a, { y: 2.1, rx: -0.15 }),
        // front valance
        box(1.8, 0.2, 0.04, 0xc8a040, { y: 1.95, z: 0.5 }),
        // two cart wheels
        cyl(0.28, 0.28, 0.12, 8, 0x2a2830, { rx: HALF_PI, x: -0.65, y: 0.28, z: 0 }),
        cyl(0.28, 0.28, 0.12, 8, 0x2a2830, { rx: HALF_PI, x: 0.65, y: 0.28, z: 0 }),
        // push handle
        cyl(0.04, 0.04, 0.8, 5, 0x6a4a30, { rz: HALF_PI, x: 0.95, y: 0.9, rx: 0.2 }),
      ];
      return finish(parts);
    },
  },
];

export default T1_ARCHETYPES;
