/**
 * @file packs/penghu/archetypes/t3.js — Roll Formosa Penghu pack, Tier 3
 * (漁港碼頭 / harbor dock street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Penghu themes: fishing boats, basalt walls, wind generators, harbor structures
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 海風藍調 (sea-wind blues) — but each
 * object keeps its own true-to-life Penghu harbor colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (漁港牌樓 / 玄武岩牆)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/* yOffset note: finish() recenters on the bounding-sphere center, so an object
 * built symmetric about y=0 ends roughly centered. The engine rest convention
 * is yOffset = -1 - minY_normalized; for our ground-sitting builds (taller than
 * wide, base near sphere bottom) that lands around -0.5..-0.85. Small tumbling
 * items use 0. Values below are tuned per build's vertical mass distribution. */

/** @type {ArchetypeDef[]} */
export const T3_ARCHETYPES = [
  /* 0 ── 機車 scooter ─────────────────────────────────────────────────── */
  {
    id: 'scooter',
    displayName: '機車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x2b2f4a, 0xc4203a, 0xe8e8ee, 0x1a1c2a, 0x7a8090],
    yOffset: -0.33,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const body = rng() < 0.5 ? 0xc4203a : 0x2f6db0; // red or blue scooter
      const parts = [];
      // floorboard / step-through deck
      parts.push(box(1.5, 0.12, 0.5, 0x1a1c2a, { x: 0, y: 0.32 }));
      // rear body / seat hump
      parts.push(box(0.9, 0.45, 0.46, body, { x: 0.45, y: 0.62 }));
      parts.push(box(0.72, 0.16, 0.42, 0x14151f, { x: 0.42, y: 0.9 })); // seat
      // front leg-shield rising to handlebars
      parts.push(box(0.34, 0.95, 0.44, body, { x: -0.62, y: 0.72 }));
      // headlight nacelle
      parts.push(box(0.22, 0.26, 0.4, 0xe8e8ee, { x: -0.78, y: 1.12 }));
      // handlebars
      parts.push(cyl(0.035, 0.035, 0.62, 6, 0x7a8090, { x: -0.74, y: 1.32, rx: HALF_PI }));
      // mirror stalks
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: 0.3, ws: 6, hs: 4 }));
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: -0.3, ws: 6, hs: 4 }));
      // two wheels (z-axis cylinders -> rotate so round face faces side)
      const wheel = (wx) => [
        cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, rx: HALF_PI }),
        cyl(0.13, 0.13, 0.17, 8, 0x7a8090, { x: wx, y: 0.3, rx: HALF_PI }),
      ];
      parts.push(...wheel(-0.66));
      parts.push(...wheel(0.66));
      return finish(parts);
    },
  },

  /* 1 ── 漁船 small fishing boat (sampan style) ───────────────────────── */
  {
    id: 'fishing_boat',
    displayName: '漁船',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x40a0e0, 0x2080c0, 0xf0f0f0, 0x3090d0, 0x1070b0],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const hull = 0xffffff;
      const parts = [];
      // hull body (elongated box with tapered ends)
      parts.push(box(3.0, 0.6, 1.0, hull, { y: 0.3 }));
      // bow taper
      parts.push(box(0.8, 0.5, 0.8, hull, { x: -1.7, y: 0.25, rz: -0.15 }));
      parts.push(cone(0.4, 0.6, 6, hull, { x: -2.2, y: 0.25, rz: -HALF_PI }));
      // stern
      parts.push(box(0.5, 0.55, 0.9, hull, { x: 1.6, y: 0.28 }));
      // gunwale (top edge rail)
      parts.push(box(3.2, 0.12, 0.08, 0xd0d0d0, { x: 0, y: 0.62, z: 0.5 }));
      parts.push(box(3.2, 0.12, 0.08, 0xd0d0d0, { x: 0, y: 0.62, z: -0.5 }));
      // cabin/wheelhouse
      parts.push(box(0.8, 0.7, 0.7, 0xf0f0f0, { x: 0.5, y: 1.0 }));
      parts.push(box(0.6, 0.35, 0.05, 0x4080b0, { x: 0.2, y: 1.15, z: 0.38 })); // window
      // mast
      parts.push(cyl(0.05, 0.04, 1.2, 5, 0x7a6a5a, { x: -0.3, y: 1.3 }));
      // boom
      parts.push(cyl(0.03, 0.03, 0.8, 5, 0x7a6a5a, { x: -0.3, y: 1.6, rz: 0.4 }));
      // outboard engine at stern
      parts.push(box(0.25, 0.4, 0.2, 0x3a3a40, { x: 1.75, y: 0.1 }));
      parts.push(cyl(0.06, 0.06, 0.4, 5, 0x505050, { x: 1.85, y: -0.15 }));
      return finish(parts);
    },
  },

  /* 2 ── 碼頭繫船柱 harbor mooring bollard ─────────────────────────────── */
  {
    id: 'mooring_bollard',
    displayName: '繫船柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.6,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a4a50, 0x5a5a60, 0x3a3a40, 0x6a6a70, 0xf0c020],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      const metal = 0xffffff;
      // concrete base
      parts.push(cyl(0.6, 0.65, 0.25, 8, 0x9a9a98, { y: 0.12 }));
      // main bollard post
      parts.push(cyl(0.35, 0.3, 1.2, 8, metal, { y: 0.85 }));
      // mushroom cap
      parts.push(cyl(0.45, 0.35, 0.2, 8, metal, { y: 1.55 }));
      parts.push(sph(0.45, metal, { y: 1.65, ws: 8, hs: 4, thetaLen: HALF_PI }));
      // yellow warning band
      parts.push(cyl(0.38, 0.38, 0.15, 8, 0xf0c020, { y: 0.6 }));
      // rope wrapped around
      parts.push(torus(0.42, 0.06, 5, 8, 0x9a8a6a, { y: 1.0, rx: 0.3 }));
      parts.push(torus(0.4, 0.05, 5, 8, 0x9a8a6a, { y: 1.2, rx: -0.2 }));
      return finish(parts);
    },
  },

  /* 3 ── 燈塔造型裝飾 lighthouse decoration ──────────────────────────── */
  {
    id: 'lighthouse_decor',
    displayName: '燈塔裝飾',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0f0f0, 0xc04040, 0x3a3a40, 0xe8e8e8, 0xb03030],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const white = 0xffffff;
      const parts = [];
      // stone base
      parts.push(cyl(0.55, 0.6, 0.25, 8, 0x9a9a90, { y: 0.12 }));
      // tower body (tapered cylinder with bands)
      parts.push(cyl(0.4, 0.5, 1.8, 8, white, { y: 1.15 }));
      // red horizontal bands
      parts.push(cyl(0.42, 0.42, 0.2, 8, 0xc04040, { y: 0.5 }));
      parts.push(cyl(0.38, 0.38, 0.2, 8, 0xc04040, { y: 1.1 }));
      parts.push(cyl(0.35, 0.35, 0.2, 8, 0xc04040, { y: 1.7 }));
      // lantern room
      parts.push(cyl(0.32, 0.35, 0.1, 8, 0x3a3a40, { y: 2.1 }));
      parts.push(cyl(0.35, 0.35, 0.25, 8, 0x80c0e0, { y: 2.25 })); // glass
      // dome roof
      parts.push(sph(0.35, 0x3a3a40, { y: 2.38, ws: 8, hs: 4, thetaLen: HALF_PI }));
      // lightning rod
      parts.push(cyl(0.02, 0.02, 0.3, 4, 0x3a3a40, { y: 2.65 }));
      return finish(parts);
    },
  },

  /* 4 ── 大仙人掌 large wild cactus clump ────────────────────────────── */
  {
    id: 'large_cactus',
    displayName: '大仙人掌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a9a3a, 0x5aaa4a, 0x3a8a2a, 0x6aba5a, 0x2a7a1a],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const cactus = 0xffffff;
      const parts = [];
      // ground/soil base
      parts.push(cyl(1.2, 1.3, 0.2, 6, 0x8a7a5a, { y: 0.1 }));
      // main large paddle
      parts.push(sph(0.8, cactus, { ws: 6, hs: 4, sy: 1.6, sz: 0.35, y: 1.2 }));
      // secondary paddles (reduced)
      parts.push(sph(0.55, cactus, { ws: 5, hs: 3, sy: 1.4, sz: 0.3, x: 0.6, y: 1.8, rz: 0.35 }));
      parts.push(sph(0.5, cactus, { ws: 5, hs: 3, sy: 1.3, sz: 0.3, x: -0.55, y: 1.6, rz: -0.3 }));
      parts.push(sph(0.4, cactus, { ws: 5, hs: 3, sy: 1.2, sz: 0.28, x: 0.0, y: 2.3, rz: 0.1 }));
      // cactus fruits (reduced)
      parts.push(sph(0.12, 0xb83060, { x: 0.5, y: 2.4, z: 0.2, ws: 4, hs: 2 }));
      parts.push(sph(0.1, 0xc84070, { x: -0.3, y: 2.0, z: 0.15, ws: 4, hs: 2 }));
      return finish(parts);
    },
  },

  /* 5 ── 玄武岩柱 basalt column cluster ──────────────────────────────── */
  {
    id: 'basalt_columns',
    displayName: '玄武岩柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a4a50, 0x3a3a40, 0x5a5a60, 0x2a2a30, 0x6a6a70],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const basalt = 0xffffff;
      const parts = [];
      // hexagonal column cluster (iconic Penghu geological feature)
      // center column
      parts.push(cyl(0.35, 0.35, 2.0, 6, basalt, { y: 1.0 }));
      // surrounding columns at different heights
      const angles = [0, PI / 3, (2 * PI) / 3, PI, (4 * PI) / 3, (5 * PI) / 3];
      const heights = [1.6, 1.8, 1.4, 1.7, 1.5, 1.9];
      for (let i = 0; i < 6; i++) {
        const a = angles[i];
        const r = 0.58;
        const h = heights[i];
        parts.push(cyl(0.28, 0.28, h, 6, basalt, {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r,
          y: h / 2,
          hex2: 0x5a5a60
        }));
      }
      // rough base
      parts.push(cyl(1.1, 1.2, 0.2, 8, 0x4a4a48, { y: 0.1 }));
      return finish(parts);
    },
  },

  /* 6 ── 防風石牆 traditional wind-break stone wall ──────────────────── */
  {
    id: 'windbreak_wall',
    displayName: '防風石牆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.8,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x9a8a78, 0xaa9a88, 0x8a7a68, 0xba9a88, 0x7a6a58],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // curved wall section (coral stone / basalt mix)
      parts.push(box(3.0, 1.2, 0.4, stone, { y: 0.6 }));
      // individual stone texture
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 6; col++) {
          const sx = -1.2 + col * 0.5 + (row % 2) * 0.25;
          const sy = 0.25 + row * 0.4;
          const shade = (row + col) % 2 === 0 ? 0xb0a090 : 0x908070;
          parts.push(box(0.42, 0.32, 0.1, shade, { x: sx, y: sy, z: 0.22 }));
        }
      }
      // capstones on top
      parts.push(box(3.1, 0.12, 0.5, 0xa09080, { y: 1.26 }));
      // moss/lichen patches
      parts.push(sph(0.15, 0x6a8a4a, { x: -0.8, y: 0.9, z: 0.25, ws: 5, hs: 3, sy: 0.3 }));
      parts.push(sph(0.12, 0x5a7a3a, { x: 0.5, y: 0.5, z: 0.25, ws: 5, hs: 3, sy: 0.3 }));
      return finish(parts);
    },
  },

  /* 7 ── 碼頭燈柱 harbor lamp post ────────────────────────────────────── */
  {
    id: 'harbor_lamp',
    displayName: '碼頭燈柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x3a3a40, 0x4a4a50, 0xf0d060, 0x2a2a30, 0xe0c050],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const metal = 0xffffff;
      const parts = [];
      // concrete base
      parts.push(cyl(0.4, 0.45, 0.25, 8, 0x9a9a98, { y: 0.12 }));
      // lamp post
      parts.push(cyl(0.12, 0.15, 3.2, 8, metal, { y: 1.75 }));
      // crossarm
      parts.push(cyl(0.06, 0.06, 0.8, 6, metal, { y: 3.2, rz: HALF_PI }));
      // lamp head (octagonal lantern style)
      parts.push(cyl(0.25, 0.2, 0.4, 8, metal, { y: 3.45 }));
      parts.push(cyl(0.3, 0.25, 0.08, 8, metal, { y: 3.28 }));
      // glass panels (glowing warm)
      parts.push(cyl(0.22, 0.18, 0.35, 8, 0xf0d060, { y: 3.45 }));
      // top cap
      parts.push(cone(0.22, 0.2, 8, metal, { y: 3.75 }));
      // finial
      parts.push(sph(0.06, metal, { y: 3.9, ws: 5, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 漁港牌樓 harbor gateway arch (CHUNK LANDMARK) ──────────────── */
  {
    id: 'harbor_arch',
    displayName: '漁港牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x40a0e0, 0xf0f0f0, 0xc04040, 0x3a3a40, 0x2080c0],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      const blue = 0x40a0e0;
      const white = 0xf0f0f0;
      // two main pillars
      parts.push(box(0.5, 3.5, 0.5, blue, { x: -2.0, y: 1.75 }));
      parts.push(box(0.5, 3.5, 0.5, blue, { x: 2.0, y: 1.75 }));
      // pillar caps
      parts.push(box(0.65, 0.2, 0.65, white, { x: -2.0, y: 3.6 }));
      parts.push(box(0.65, 0.2, 0.65, white, { x: 2.0, y: 3.6 }));
      // connecting beam with wave motif
      parts.push(box(4.5, 0.5, 0.35, blue, { y: 3.85 }));
      parts.push(box(4.3, 0.15, 0.38, white, { y: 4.18 }));
      // wave decoration on top
      parts.push(torus(0.6, 0.12, 4, 8, white, { x: -1.0, y: 4.3, arc: PI }));
      parts.push(torus(0.6, 0.12, 4, 8, white, { x: 1.0, y: 4.3, arc: PI }));
      // fish/anchor decoration on pillars
      parts.push(sph(0.2, 0xf0d060, { x: -2.0, y: 2.5, z: 0.3, ws: 6, hs: 4 })); // gold emblem
      parts.push(sph(0.2, 0xf0d060, { x: 2.0, y: 2.5, z: 0.3, ws: 6, hs: 4 }));
      // red signboard
      parts.push(box(2.0, 0.6, 0.12, 0xc04040, { y: 3.85, z: 0.25 }));
      return finish(parts);
    },
  },

  /* 9 ── 大型風獅爺 large wind lion statue (CHUNK LANDMARK) ──────────── */
  {
    id: 'large_wind_lion',
    displayName: '大型風獅爺',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc8b898, 0xd8c8a8, 0xb8a888, 0xe8d8b8, 0xa89878],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // large stone pedestal base
      parts.push(box(1.8, 0.5, 1.4, 0x9a8a6a, { y: 0.25, hex2: 0x8a7a5a }));
      // seated lion body (larger folk-art style)
      parts.push(box(1.2, 1.4, 1.0, stone, { y: 1.45 }));
      // large head
      parts.push(sph(0.75, stone, { y: 2.8, ws: 6, hs: 4 }));
      // wild mane (thick ring)
      parts.push(torus(0.55, 0.2, 4, 6, 0xc0a070, { y: 2.7 }));
      // face features
      parts.push(box(0.4, 0.35, 0.4, stone, { y: 2.5, z: 0.6 })); // snout
      // prominent eyes
      parts.push(sph(0.12, 0x2a2a2e, { x: -0.25, y: 3.0, z: 0.5, ws: 4, hs: 3 }));
      parts.push(sph(0.12, 0x2a2a2e, { x: 0.25, y: 3.0, z: 0.5, ws: 4, hs: 3 }));
      // front paws
      parts.push(box(0.35, 0.5, 0.35, stone, { x: -0.4, y: 0.95, z: 0.5 }));
      parts.push(box(0.35, 0.5, 0.35, stone, { x: 0.4, y: 0.95, z: 0.5 }));
      // red sash/ribbon
      parts.push(box(0.8, 0.15, 0.15, 0xc04040, { y: 2.0, z: 0.55 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
