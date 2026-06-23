/**
 * @file packs/pingtung/archetypes/t3.js — Roll Formosa Pingtung pack, Tier 3
 * (墾丁海灘 / Kenting beach). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Slots [0..7] absorbable beach/street objects; slots [8..9] (墾丁海灘拱門 / 沙灘酒吧)
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
      const body = rng() < 0.5 ? 0xc4203a : 0x2f6db0;
      const parts = [];
      parts.push(box(1.5, 0.12, 0.5, 0x1a1c2a, { x: 0, y: 0.32 }));
      parts.push(box(0.9, 0.45, 0.46, body, { x: 0.45, y: 0.62 }));
      parts.push(box(0.72, 0.16, 0.42, 0x14151f, { x: 0.42, y: 0.9 }));
      parts.push(box(0.34, 0.95, 0.44, body, { x: -0.62, y: 0.72 }));
      parts.push(box(0.22, 0.26, 0.4, 0xe8e8ee, { x: -0.78, y: 1.12 }));
      parts.push(cyl(0.035, 0.035, 0.62, 6, 0x7a8090, { x: -0.74, y: 1.32, rx: HALF_PI }));
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: 0.3, ws: 6, hs: 4 }));
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: -0.3, ws: 6, hs: 4 }));
      const wheel = (wx) => [
        cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, rx: HALF_PI }),
        cyl(0.13, 0.13, 0.17, 8, 0x7a8090, { x: wx, y: 0.3, rx: HALF_PI }),
      ];
      parts.push(...wheel(-0.66));
      parts.push(...wheel(0.66));
      return finish(parts);
    },
  },

  /* 1 ── 小貨車 mini truck ─────────────────────────────────────────────── */
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
      parts.push(box(2.0, 0.22, 1.0, 0x9aa0ac, { x: 0.35, y: 0.55 }));
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: 0.47 }));
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: -0.47 }));
      parts.push(box(0.06, 0.3, 1.0, 0x7d828e, { x: 1.32, y: 0.78 }));
      parts.push(box(0.85, 0.7, 1.0, cab, { x: -0.95, y: 0.85 }));
      parts.push(box(0.06, 0.42, 0.86, 0x1a2330, { x: -0.55, y: 1.0 }));
      parts.push(box(0.18, 0.4, 1.02, 0x3a3f52, { x: -1.42, y: 0.55 }));
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: 0.34 }));
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: -0.34 }));
      const wheel = (wx, wz) => cyl(0.28, 0.28, 0.18, 10, 0x14151f, { x: wx, y: 0.28, z: wz, rx: HALF_PI });
      parts.push(wheel(-0.9, 0.52), wheel(-0.9, -0.52), wheel(0.9, 0.52), wheel(0.9, -0.52));
      return finish(parts);
    },
  },

  /* 2 ── 香蕉艇 banana ride (chunk, not collectible) ─────────────────────── */
  {
    id: 'banana_ride',
    displayName: '香蕉艇',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xffd040, 0xffe060, 0xffb020, 0x2a2a2a, 0x40a0ff],
    yOffset: -0.45,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Inflatable banana-shaped boat
      const parts = [
        // Main banana body - inflatable tubes
        cyl(0.5, 0.4, 3.0, 10, 0xffffff, { rz: HALF_PI, hex2: 0xffd040 }),
        // Curved banana ends
        sph(0.4, 0xffe060, { ws: 8, hs: 5, x: 1.6, sx: 0.8, sy: 1.0 }),
        sph(0.5, 0xffe060, { ws: 8, hs: 5, x: -1.6, sx: 0.7, sy: 1.0 }),
        // Saddle seats
        box(0.5, 0.15, 0.6, 0x2a2a2a, { x: -0.6, y: 0.45 }),
        box(0.5, 0.15, 0.6, 0x2a2a2a, { x: 0.3, y: 0.45 }),
        // Handle straps
        torus(0.15, 0.04, 4, 6, 0x40a0ff, { x: -0.6, y: 0.6, rx: HALF_PI }),
        torus(0.15, 0.04, 4, 6, 0x40a0ff, { x: 0.3, y: 0.6, rx: HALF_PI }),
        // Tow rope attachment
        cyl(0.08, 0.08, 0.3, 6, 0x2a2a2a, { x: 1.7, y: 0.2 }),
      ];
      return finish(parts);
    },
  },

  /* 3 ── 衝浪板 surfboard ─────────────────────────────────────────────── */
  {
    id: 'surfboard',
    displayName: '衝浪板',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x40c0ff, 0xff6040, 0xffd040, 0x40ff80, 0xffffff],
    yOffset: -0.85,
    upright: false,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const boardColor = [0x40c0ff, 0xff6040, 0xffd040, 0x40ff80][Math.floor(rng() * 4)];
      return finish([
        // Main board body - elongated oval
        box(2.8, 0.12, 0.7, 0xffffff, { hex2: boardColor }),
        // Rounded nose
        sph(0.35, boardColor, { ws: 6, hs: 4, x: 1.4, sy: 0.3, sz: 1.0 }),
        // Tapered tail
        cone(0.35, 0.6, 6, boardColor, { rz: HALF_PI, x: -1.6, sy: 0.3 }),
        // Center stripe design
        box(2.4, 0.14, 0.12, 0xffffff, { y: 0.02 }),
        // Fin (thruster setup - center)
        box(0.06, 0.2, 0.15, 0x2a2a2a, { x: -1.0, y: -0.16 }),
        // Side fins
        box(0.06, 0.15, 0.12, 0x2a2a2a, { x: -0.8, y: -0.14, z: 0.25 }),
        box(0.06, 0.15, 0.12, 0x2a2a2a, { x: -0.8, y: -0.14, z: -0.25 }),
        // Deck grip pad
        box(0.8, 0.02, 0.4, 0x3a3a3a, { x: -0.4, y: 0.08 }),
      ]);
    },
  },

  /* 4 ── 救生圈 life buoy ─────────────────────────────────────────────── */
  {
    id: 'life_buoy',
    displayName: '救生圈',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xff4040, 0xffffff, 0xe83030, 0xf0f0f0, 0xff5050],
    yOffset: -0.0,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // Main ring - red/white, lower segments to stay under tri cap
        torus(0.8, 0.3, 6, 8, 0xffffff, { hex2: 0xff4040 }),
        // Red stripe boxes (4 sections)
        box(0.35, 0.32, 0.62, 0xff4040, { x: 0.8, z: 0, ry: 0 }),
        box(0.35, 0.32, 0.62, 0xff4040, { x: 0, z: 0.8, ry: HALF_PI }),
        box(0.35, 0.32, 0.62, 0xff4040, { x: -0.8, z: 0, ry: PI }),
        box(0.35, 0.32, 0.62, 0xff4040, { x: 0, z: -0.8, ry: -HALF_PI }),
        // Rope handles - simple cylinders instead of torus
        cyl(0.04, 0.04, 0.3, 6, 0xf0e8d0, { x: 1.1, y: 0, rx: HALF_PI }),
        cyl(0.04, 0.04, 0.3, 6, 0xf0e8d0, { x: -1.1, y: 0, rx: HALF_PI }),
      ];
      return finish(parts);
    },
  },

  /* 5 ── 陽傘堆 beach umbrella pile ───────────────────────────────────── */
  {
    id: 'beach_umbrella_pile',
    displayName: '陽傘堆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xff6040, 0x40c0ff, 0xffd040, 0x40ff80, 0xff40a0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const colors = [0xff6040, 0x40c0ff, 0xffd040, 0x40ff80, 0xff40a0];
      const parts = [];
      // Three folded umbrellas leaning together
      for (let i = 0; i < 3; i++) {
        const angle = -0.3 + i * 0.3;
        const x = -0.6 + i * 0.6;
        const c = colors[i % colors.length];
        // Folded canopy
        cone(0.5, 1.8, 8, c, { x, y: 1.8, rz: angle });
        // Pole
        parts.push(cyl(0.05, 0.05, 2.2, 6, 0xd8d8d8, { x, y: 1.1, rz: angle }));
        // Tip
        parts.push(cone(0.08, 0.15, 6, 0x2a2a2a, { x: x - Math.sin(angle) * 2.3, y: 2.7 + Math.cos(angle) * 0.2, rz: angle }));
      }
      // Base stand/holder
      parts.push(box(1.8, 0.3, 0.4, 0x6a6a6a, { y: 0.15 }));
      parts.push(box(1.6, 0.2, 0.3, 0x8a8a8a, { y: 0.35 }));
      return finish(parts);
    },
  },

  /* 6 ── 椰子樹 coconut palm ──────────────────────────────────────────── */
  {
    id: 'coconut_palm',
    displayName: '椰子樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a5040, 0x40a048, 0x50b058, 0x308038, 0x8a7050],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [
        // Trunk - slightly curved (reduced segments)
        cyl(0.25, 0.18, 2.8, 6, 0x6a5040, { y: 1.4, hex2: 0x8a7050 }),
        // Trunk ring texture (removed torus, use simple rings)
        cyl(0.26, 0.26, 0.08, 6, 0x5a4030, { y: 0.5 }),
        cyl(0.24, 0.24, 0.08, 6, 0x5a4030, { y: 1.2 }),
        // Crown base
        sph(0.3, 0x50b058, { ws: 5, hs: 3, y: 2.9 }),
        // Palm fronds - 5 fixed fronds instead of loop
        box(0.15, 0.04, 1.4, 0x40a048, { x: 0.6, z: 0, y: 2.95, ry: 0, rx: 0.5, hex2: 0x308038 }),
        box(0.15, 0.04, 1.4, 0x40a048, { x: 0.18, z: 0.57, y: 3.0, ry: 1.26, rx: 0.4, hex2: 0x308038 }),
        box(0.15, 0.04, 1.4, 0x40a048, { x: -0.48, z: 0.35, y: 2.9, ry: 2.51, rx: 0.6, hex2: 0x308038 }),
        box(0.15, 0.04, 1.4, 0x40a048, { x: -0.48, z: -0.35, y: 3.0, ry: 3.77, rx: 0.4, hex2: 0x308038 }),
        box(0.15, 0.04, 1.4, 0x40a048, { x: 0.18, z: -0.57, y: 2.95, ry: 5.03, rx: 0.5, hex2: 0x308038 }),
        // Coconuts in crown (reduced sphere segments)
        sph(0.15, 0x8a6040, { ws: 4, hs: 3, x: 0.1, y: 2.7, z: 0.15 }),
        sph(0.14, 0x8a6040, { ws: 4, hs: 3, x: -0.12, y: 2.75, z: -0.1 }),
      ];
      return finish(parts);
    },
  },

  /* 7 ── 石獅 stone guardian lion ─────────────────────────────────────── */
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
      parts.push(box(0.9, 0.4, 0.7, 0x9c9686, { x: 0, y: 0.2, hex2: 0x6e6a5e }));
      parts.push(box(0.6, 0.7, 0.55, stone, { x: 0.1, y: 0.72, hex2: stone2 }));
      parts.push(box(0.55, 0.6, 0.5, stone, { x: -0.18, y: 1.0, hex2: stone2 }));
      parts.push(sph(0.34, stone, { x: -0.3, y: 1.5, ws: 7, hs: 5, hex2: stone2 }));
      parts.push(sph(0.4, 0x9c9686, { x: -0.18, y: 1.42, ws: 7, hs: 4 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: 0.16, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: -0.16, ws: 5, hs: 3 }));
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: 0.2 }));
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: -0.2 }));
      parts.push(sph(0.16, 0xc4203a, { x: -0.5, y: 0.32, z: 0.2, ws: 6, hs: 4 }));
      parts.push(sph(0.22, stone2, { x: 0.42, y: 1.05, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 墾丁海灘拱門 beach arch (CHUNK LANDMARK) ─────────────────────── */
  {
    id: 'beach_arch',
    displayName: '墾丁海灘拱門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x40c0ff, 0xffd040, 0xff6040, 0x40ff80, 0xffffff],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [
        // Two beach-themed pillars (blue ocean/sand colors)
        box(0.45, 3.2, 0.45, 0x40c0ff, { x: -2.0, y: 1.6, hex2: 0x60d0ff }),
        box(0.45, 3.2, 0.45, 0x40c0ff, { x: 2.0, y: 1.6, hex2: 0x60d0ff }),
        // Pillar caps with wave pattern
        box(0.6, 0.18, 0.6, 0xffffff, { x: -2.0, y: 3.28 }),
        box(0.6, 0.18, 0.6, 0xffffff, { x: 2.0, y: 3.28 }),
        // Arched top - wave themed
        torus(2.05, 0.22, 4, 8, 0xffd040, { y: 3.2, arc: PI }),
        // Sign board with beach motif
        box(3.6, 0.7, 0.18, 0xff6040, { y: 3.9, hex2: 0xff8060 }),
        box(3.4, 0.5, 0.08, 0xffffff, { y: 3.9, z: 0.06 }),
        // Decorative palm silhouettes
        cone(0.3, 0.8, 6, 0x40ff80, { x: -1.4, y: 4.2, rz: 0.2 }),
        cone(0.3, 0.8, 6, 0x40ff80, { x: 1.4, y: 4.2, rz: -0.2 }),
        // Hanging tropical lights
      ];
      for (let i = 0; i < 5; i++) {
        const lx = -1.6 + i * 0.8;
        const c = [0xff6040, 0xffd040, 0x40c0ff, 0x40ff80, 0xff40a0][i];
        parts.push(sph(0.15, c, { ws: 5, hs: 4, x: lx, y: 2.7 }));
      }
      return finish(parts);
    },
  },

  /* 9 ── 沙灘酒吧 beach bar (CHUNK LANDMARK) ──────────────────────────── */
  {
    id: 'beach_bar',
    displayName: '沙灘酒吧',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a7050, 0x40c0ff, 0xff6040, 0xffd040, 0x40a048],
    yOffset: -0.30,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const wood = 0x8a7050;
      const parts = [
        // Bamboo/wood bar counter
        box(3.0, 0.2, 1.0, 0xd8c8a0, { y: 1.1 }),
        box(3.2, 0.1, 1.1, wood, { y: 1.0 }),
        // Bar front panel with tiki pattern
        box(3.0, 0.9, 0.1, wood, { y: 0.55, z: 0.5, hex2: 0x6a5030 }),
        // Bar stools (reduced segments)
        cyl(0.2, 0.2, 0.6, 5, wood, { x: -1.0, y: 0.3, z: 0.9 }),
        cyl(0.25, 0.25, 0.08, 5, 0xffd040, { x: -1.0, y: 0.65, z: 0.9 }),
        cyl(0.2, 0.2, 0.6, 5, wood, { x: 1.0, y: 0.3, z: 0.9 }),
        cyl(0.25, 0.25, 0.08, 5, 0x40c0ff, { x: 1.0, y: 0.65, z: 0.9 }),
        // Thatched palm roof
        box(3.6, 0.3, 1.8, 0x40a048, { y: 2.5, hex2: 0x308028 }),
        // Roof poles (reduced to 2)
        cyl(0.1, 0.1, 1.5, 5, wood, { x: -1.5, y: 1.85, z: 0.0 }),
        cyl(0.1, 0.1, 1.5, 5, wood, { x: 1.5, y: 1.85, z: 0.0 }),
        // String lights (simple spheres instead of torus)
        sph(0.08, 0xfff0a0, { ws: 4, hs: 3, x: -1.0, y: 2.2 }),
        sph(0.08, 0xfff0a0, { ws: 4, hs: 3, x: 0.0, y: 2.2 }),
        sph(0.08, 0xfff0a0, { ws: 4, hs: 3, x: 1.0, y: 2.2 }),
      ];
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
