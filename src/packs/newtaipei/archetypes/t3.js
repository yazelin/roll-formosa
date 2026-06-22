/**
 * @file packs/newtaipei/archetypes/t3.js — Roll Formosa New Taipei pack, Tier 3
 * (淡水河岸 / Tamsui riverside street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色淡水河岸 藍紫起調 (dusk riverside, blue-purple onset) — but each
 * object keeps its own true-to-life New Taipei street colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (河岸碼頭 / 漁船)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

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
      // two wheels
      const wheel = (wx) => [
        cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, rx: HALF_PI }),
        cyl(0.13, 0.13, 0.17, 8, 0x7a8090, { x: wx, y: 0.3, rx: HALF_PI }),
      ];
      parts.push(...wheel(-0.66));
      parts.push(...wheel(0.66));
      return finish(parts);
    },
  },

  /* 1 ── 小貨車 mini truck (blue Kei-style pickup) ─────────────────────── */
  {
    id: 'mini_truck',
    displayName: '小貨車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.6,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xd8dde4, 0x1a1c2a, 0x9aa0ac, 0x3a3f52],
    yOffset: -0.61,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const cab = rng() < 0.5 ? 0x2f6db0 : 0xd8dde4;
      const parts = [];
      // flatbed deck
      parts.push(box(2.0, 0.22, 1.0, 0x9aa0ac, { x: 0.35, y: 0.55 }));
      // bed side rails
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: 0.47 }));
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: -0.47 }));
      parts.push(box(0.06, 0.3, 1.0, 0x7d828e, { x: 1.32, y: 0.78 })); // tailgate
      // cab
      parts.push(box(0.85, 0.7, 1.0, cab, { x: -0.95, y: 0.85 }));
      // windshield
      parts.push(box(0.06, 0.42, 0.86, 0x1a2330, { x: -0.55, y: 1.0 }));
      // front bumper
      parts.push(box(0.18, 0.4, 1.02, 0x3a3f52, { x: -1.42, y: 0.55 }));
      // headlights
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: 0.34 }));
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: -0.34 }));
      // 4 wheels
      const wheel = (wx, wz) => cyl(0.28, 0.28, 0.18, 10, 0x14151f, { x: wx, y: 0.28, z: wz, rx: HALF_PI });
      parts.push(wheel(-0.9, 0.52), wheel(-0.9, -0.52), wheel(0.9, 0.52), wheel(0.9, -0.52));
      return finish(parts);
    },
  },

  /* 2 ── 渡輪票亭 ferry ticket booth ────────────────────────────────────── */
  {
    id: 'ferry_booth',
    displayName: '渡輪票亭',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a6ea0, 0xe8e8ee, 0x2a55a8, 0xffd040, 0x1a2a40],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // Main booth structure — small kiosk
      parts.push(box(1.2, 1.4, 1.0, 0x3a6ea0, { y: 0.8, hex2: 0x2a55a8 }));
      // Ticket window opening
      parts.push(box(0.6, 0.5, 0.1, 0x1a2a40, { y: 1.0, z: 0.52 })); // dark opening
      // Window counter shelf
      parts.push(box(0.8, 0.08, 0.2, 0xe8e8ee, { y: 0.72, z: 0.55 }));
      // Roof overhang
      parts.push(box(1.4, 0.12, 1.2, 0xe8e8ee, { y: 1.56 }));
      parts.push(box(1.5, 0.08, 1.3, 0x2a55a8, { y: 1.68 })); // roof top
      // Sign board
      parts.push(box(1.0, 0.35, 0.06, 0xffd040, { y: 1.85, z: 0.55 }));
      // Price list board
      parts.push(box(0.5, 0.6, 0.04, 0xf8f4e8, { y: 0.95, z: -0.52 }));
      // Door on side
      parts.push(box(0.5, 1.0, 0.08, 0x1a2a40, { x: -0.62, y: 0.6 }));
      // Small anchor decoration
      parts.push(cyl(0.08, 0.08, 0.5, 6, 0x4a4a4a, { x: 0.45, y: 0.4, z: 0.52, rx: 0.2 }));
      return finish(parts);
    },
  },

  /* 3 ── 霓虹招牌 neon sign (cantilever shop sign) ─────────────────────── */
  {
    id: 'neon_sign',
    displayName: '霓虹招牌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x14161f, 0xff3c78, 0x32d6ff, 0xfff04a, 0x39e08a],
    yOffset: -0.27,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const glow = [0xff3c78, 0x32d6ff, 0xfff04a, 0x39e08a][Math.floor(rng() * 4)];
      const glow2 = 0x32d6ff;
      const parts = [];
      // wall mount bracket
      parts.push(box(0.2, 1.8, 0.2, 0x2a2c34, { x: -1.05, y: 1.1 }));
      // boom arm
      parts.push(cyl(0.05, 0.05, 1.0, 6, 0x3a3d46, { x: -0.55, y: 1.7, rz: HALF_PI }));
      // dark sign backing panel
      parts.push(box(0.12, 1.5, 1.3, 0x14161f, { x: 0.1, y: 1.0 }));
      // neon tube border — top & bottom bars
      parts.push(box(0.06, 0.1, 1.16, glow, { x: 0.18, y: 1.66 }));
      parts.push(box(0.06, 0.1, 1.16, glow2, { x: 0.18, y: 0.34 }));
      parts.push(box(0.06, 1.36, 0.1, glow, { x: 0.18, y: 1.0, z: 0.6 }));
      parts.push(box(0.06, 1.36, 0.1, glow2, { x: 0.18, y: 1.0, z: -0.6 }));
      // neon glyph rings
      parts.push(torus(0.26, 0.05, 6, 10, glow, { x: 0.2, y: 1.28, ry: HALF_PI }));
      parts.push(torus(0.26, 0.05, 6, 10, 0xfff04a, { x: 0.2, y: 0.68, ry: HALF_PI }));
      return finish(parts);
    },
  },

  /* 4 ── 鐵捲門 roll-up shutter (shopfront) ────────────────────────────── */
  {
    id: 'roll_shutter',
    displayName: '鐵捲門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.8,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xa9adb6, 0x7c818c, 0x5a5e68, 0xc9ccd2, 0x3a3d46],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const metal = rng() < 0.5 ? 0xa9adb6 : 0xb0a878;
      const parts = [];
      // side frame channels
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: -1.3, y: 1.2 }));
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: 1.3, y: 1.2 }));
      // shutter face = stack of horizontal slats
      const slats = 11;
      for (let i = 0; i < slats; i++) {
        const y = 0.25 + i * 0.2;
        const shade = i % 2 === 0 ? metal : 0x7c818c;
        parts.push(box(2.5, 0.18, 0.08, shade, { x: 0, y, z: 0 }));
      }
      // roll housing box on top
      parts.push(box(2.7, 0.4, 0.34, 0x3a3d46, { x: 0, y: 2.5 }));
      parts.push(cyl(0.18, 0.18, 2.5, 8, 0x4a4e58, { x: 0, y: 2.5, rz: HALF_PI }));
      // bottom rail
      parts.push(box(2.6, 0.16, 0.14, 0x3a3d46, { x: 0, y: 0.12 }));
      return finish(parts);
    },
  },

  /* 5 ── 路樹 street tree ─────────────────────────────────────────────── */
  {
    id: 'street_tree',
    displayName: '路樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a3d28, 0x2f6b39, 0x3f8a47, 0x245029, 0x7a5a3a],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const parts = [];
      // trunk
      parts.push(cyl(0.16, 0.24, 1.4, 7, 0x5a3d28, { x: 0, y: 0.7, hex2: 0x7a5a3a }));
      // root collar / tree grate ring
      parts.push(torus(0.4, 0.07, 5, 8, 0x3a3d46, { x: 0, y: 0.04, rx: HALF_PI }));
      // canopy = clustered spheres
      const greens = [0x2f6b39, 0x3f8a47, 0x245029];
      const blobs = [
        [0, 2.0, 0, 0.95],
        [0.55, 1.75, 0.2, 0.6],
        [-0.5, 1.8, -0.25, 0.62],
        [0.15, 2.45, -0.1, 0.6],
        [-0.2, 2.2, 0.5, 0.5],
      ];
      for (let i = 0; i < blobs.length; i++) {
        const [bx, by, bz, br] = blobs[i];
        const c = greens[i % greens.length];
        parts.push(sph(br, c, { x: bx, y: by, z: bz, ws: 6, hs: 4, hex2: 0x3f8a47 }));
      }
      return finish(parts);
    },
  },

  /* 6 ── 藍白渡船 blue-white Tamsui ferry boat ──────────────────────────── */
  {
    id: 'blue_ferry',
    displayName: '藍白渡船',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a6ea0, 0xe8e8ee, 0x2a55a8, 0xffd040, 0x1a2a40],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // Hull — boat shape (tapered box)
      parts.push(box(2.8, 0.6, 1.0, 0x3a6ea0, { y: 0.3, hex2: 0x2a55a8 }));
      // Hull tapering at bow (front)
      parts.push(box(0.5, 0.5, 0.8, 0x3a6ea0, { x: 1.55, y: 0.25 }));
      parts.push(cone(0.4, 0.6, 6, 0x3a6ea0, { x: 1.95, y: 0.3, rz: -HALF_PI }));
      // Hull tapering at stern (back)
      parts.push(box(0.4, 0.45, 0.85, 0x2a55a8, { x: -1.5, y: 0.28 }));
      // White upper deck
      parts.push(box(2.4, 0.12, 0.95, 0xe8e8ee, { y: 0.66 }));
      // Cabin structure
      parts.push(box(1.4, 0.7, 0.8, 0xe8e8ee, { y: 1.05 }));
      // Cabin windows
      for (let i = 0; i < 3; i++) {
        const x = -0.5 + i * 0.5;
        parts.push(box(0.25, 0.25, 0.05, 0x1a2a40, { x, y: 1.1, z: 0.42 }));
      }
      // Roof
      parts.push(box(1.5, 0.1, 0.9, 0x2a55a8, { y: 1.45 }));
      // Pilot house
      parts.push(box(0.5, 0.4, 0.5, 0xe8e8ee, { x: 0.6, y: 1.65 }));
      parts.push(box(0.45, 0.25, 0.04, 0x1a2a40, { x: 0.6, y: 1.7, z: 0.27 })); // windshield
      // Railing
      parts.push(box(2.3, 0.04, 0.04, 0xe8e8ee, { y: 0.9, z: 0.48 }));
      parts.push(box(2.3, 0.04, 0.04, 0xe8e8ee, { y: 0.9, z: -0.48 }));
      // Life ring
      parts.push(torus(0.12, 0.03, 6, 8, 0xffd040, { x: -0.8, y: 0.9, z: 0.5 }));
      return finish(parts);
    },
  },

  /* 7 ── 石獅 stone guardian lion (temple-gate shishi) ─────────────────── */
  {
    id: 'stone_lion',
    displayName: '石獅',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xb9b3a4, 0x9c9686, 0xd8d3c5, 0x6e6a5e, 0xc4203a],
    yOffset: -0.16,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const stone = 0xb9b3a4;
      const stone2 = 0xd8d3c5;
      const parts = [];
      // plinth base
      parts.push(box(0.9, 0.4, 0.7, 0x9c9686, { x: 0, y: 0.2, hex2: 0x6e6a5e }));
      // haunches / seated body
      parts.push(box(0.6, 0.7, 0.55, stone, { x: 0.1, y: 0.72, hex2: stone2 }));
      // chest rising to head
      parts.push(box(0.55, 0.6, 0.5, stone, { x: -0.18, y: 1.0, hex2: stone2 }));
      // head
      parts.push(sph(0.34, stone, { x: -0.3, y: 1.5, ws: 7, hs: 5, hex2: stone2 }));
      // curled mane
      parts.push(sph(0.4, 0x9c9686, { x: -0.18, y: 1.42, ws: 7, hs: 4 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: 0.16, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: -0.16, ws: 5, hs: 3 }));
      // front legs
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: 0.2 }));
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: -0.2 }));
      // paws on a ball
      parts.push(sph(0.16, 0xc4203a, { x: -0.5, y: 0.32, z: 0.2, ws: 6, hs: 4 }));
      // tail
      parts.push(sph(0.22, stone2, { x: 0.42, y: 1.05, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 河岸碼頭 river pier (CHUNK LANDMARK) ───────────────────────────── */
  {
    id: 'river_pier',
    displayName: '河岸碼頭',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a7a6a, 0x6a5a4a, 0xe8e8ee, 0x3a6ea0, 0x4a4a4a],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const parts = [];
      // Main pier platform
      parts.push(box(3.5, 0.3, 2.0, 0x8a7a6a, { y: 0.6, hex2: 0x6a5a4a }));
      // Support pillars (2 pairs)
      parts.push(cyl(0.22, 0.22, 1.0, 5, 0x4a4a4a, { x: -1.2, y: 0.1, z: 0.6 }));
      parts.push(cyl(0.22, 0.22, 1.0, 5, 0x4a4a4a, { x: 1.2, y: 0.1, z: 0.6 }));
      parts.push(cyl(0.22, 0.22, 1.0, 5, 0x4a4a4a, { x: -1.2, y: 0.1, z: -0.6 }));
      parts.push(cyl(0.22, 0.22, 1.0, 5, 0x4a4a4a, { x: 1.2, y: 0.1, z: -0.6 }));
      // Railing posts (3)
      parts.push(cyl(0.05, 0.05, 0.6, 4, 0x6a5a4a, { x: -1.4, y: 1.05, z: 0.9 }));
      parts.push(cyl(0.05, 0.05, 0.6, 4, 0x6a5a4a, { x: 0, y: 1.05, z: 0.9 }));
      parts.push(cyl(0.05, 0.05, 0.6, 4, 0x6a5a4a, { x: 1.4, y: 1.05, z: 0.9 }));
      // Railing top rail
      parts.push(box(3.0, 0.08, 0.08, 0x6a5a4a, { y: 1.38, z: 0.9 }));
      // Mooring bollard
      parts.push(cyl(0.16, 0.18, 0.3, 5, 0x4a4a4a, { x: 1.3, y: 0.9, z: 0.5 }));
      return finish(parts);
    },
  },

  /* 9 ── 漁船 fishing boat (CHUNK LANDMARK) ─────────────────────────────── */
  {
    id: 'fishing_boat',
    displayName: '漁船',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2a55a8, 0xe8e8ee, 0xc83828, 0x6a5a4a, 0xffd040],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      // Hull — traditional fishing boat shape
      parts.push(box(3.0, 0.7, 1.2, 0x2a55a8, { y: 0.35, hex2: 0x3a6ea0 }));
      // Bow (pointed front)
      parts.push(box(0.6, 0.6, 1.0, 0x2a55a8, { x: 1.65, y: 0.3 }));
      parts.push(cone(0.5, 0.8, 6, 0x2a55a8, { x: 2.1, y: 0.35, rz: -HALF_PI }));
      // Stern (flat back)
      parts.push(box(0.3, 0.65, 1.15, 0x3a6ea0, { x: -1.55, y: 0.35 }));
      // Waterline stripe (red)
      parts.push(box(3.0, 0.1, 1.22, 0xc83828, { y: 0.1 }));
      // Deck
      parts.push(box(2.6, 0.1, 1.1, 0x6a5a4a, { y: 0.72 }));
      // Cabin
      parts.push(box(1.0, 0.6, 0.8, 0xe8e8ee, { x: -0.5, y: 1.05 }));
      parts.push(box(0.9, 0.35, 0.04, 0x1a2a40, { x: -0.5, y: 1.15, z: 0.42 })); // window
      // Roof
      parts.push(box(1.1, 0.08, 0.9, 0x4a5a6a, { x: -0.5, y: 1.4 }));
      // Mast
      parts.push(cyl(0.06, 0.05, 1.5, 5, 0x6a5a4a, { x: 0.5, y: 1.5 }));
      // Boom
      parts.push(cyl(0.04, 0.04, 1.2, 4, 0x6a5a4a, { x: 0.5, y: 1.8, rz: 0.3 }));
      // Fishing nets (draped)
      parts.push(sph(0.3, 0x4a6a5a, { ws: 5, hs: 4, x: 1.0, y: 0.85, sy: 0.5 }));
      // Buoys
      parts.push(sph(0.12, 0xffd040, { ws: 5, hs: 4, x: 1.2, y: 0.9, z: 0.4 }));
      parts.push(sph(0.12, 0xe85030, { ws: 5, hs: 4, x: 1.2, y: 0.9, z: -0.3 }));
      // Outboard motor at stern
      parts.push(box(0.2, 0.4, 0.25, 0x2a2a2a, { x: -1.65, y: 0.3 }));
      parts.push(cyl(0.06, 0.06, 0.4, 5, 0x3a3a3a, { x: -1.75, y: 0.05 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
