/**
 * @file packs/yunlin/archetypes/t3.js — Roll Formosa Yunlin pack, Tier 3
 * (西螺大街 / Xiluo main street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色西螺大街 藍紫起調 (dusk street, blue-purple onset) — but each
 * object keeps its own true-to-life Yunlin street colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (醬油廠大門 / 大廟牌樓)
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
      // windshield (darker)
      parts.push(box(0.06, 0.42, 0.86, 0x1a2330, { x: -0.55, y: 1.0 }));
      // front bumper / face
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

  /* 2 ── 醬油桶 soy sauce barrel (large industrial barrel) ─────────────── */
  {
    id: 'soy_barrel',
    displayName: '醬油桶',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a2818, 0x5a3820, 0x2a1810, 0x7a4828],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      return finish([
        // Main barrel body (dark wood)
        cyl(0.85, 0.85, 2.0, 10, 0xffffff, { y: 1.0, hex2: 0x5a3820 }),
        // Metal bands around barrel
        cyl(0.88, 0.88, 0.12, 10, 0x4a4a48, { y: 0.3, open: true }),
        cyl(0.88, 0.88, 0.12, 10, 0x4a4a48, { y: 1.0, open: true }),
        cyl(0.88, 0.88, 0.12, 10, 0x4a4a48, { y: 1.7, open: true }),
        // Barrel top lid
        cyl(0.82, 0.82, 0.1, 10, 0x5a3820, { y: 2.05 }),
        // Bung hole on top
        cyl(0.12, 0.12, 0.08, 6, 0x2a1810, { y: 2.12, x: 0.3 }),
        // Brand label
        box(0.6, 0.4, 0.04, 0xf0d8a0, { y: 1.0, z: 0.87 }),
        box(0.5, 0.25, 0.02, 0x8a2010, { y: 1.0, z: 0.90 }), // text area
        // Wooden stave texture lines
        box(0.04, 1.9, 0.04, 0x3a2010, { y: 1.0, z: 0.82 }),
        box(0.04, 1.9, 0.04, 0x3a2010, { y: 1.0, z: -0.82, x: 0.3 }),
      ]);
    },
  },

  /* 3 ── 鐵捲門 roll-up shutter (shopfront) ────────────────────────────── */
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
      const metal = rng() < 0.5 ? 0xa9adb6 : 0xb0a878; // grey or beige shutter
      const parts = [];
      // side frame channels
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: -1.3, y: 1.2 }));
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: 1.3, y: 1.2 }));
      // shutter face = stack of horizontal slats (alternating shade)
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

  /* 4 ── 路燈柱 lamppost (street light) ─────────────────────────────────── */
  {
    id: 'lamppost',
    displayName: '路燈柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x5a6068, 0x7a8088, 0xf0e0a0, 0x4a5058, 0xe8d888],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.4,
    buildGeometry(rng) {
      return finish([
        // Base plate
        box(0.6, 0.12, 0.6, 0x4a4a48, { y: 0.06 }),
        // Main pole
        cyl(0.12, 0.16, 4.5, 8, 0x5a6068, { y: 2.25 }),
        // Curved arm at top
        cyl(0.08, 0.08, 0.8, 6, 0x5a6068, { x: 0.35, y: 4.3, rz: -0.5 }),
        // Lamp housing
        cyl(0.25, 0.18, 0.35, 8, 0x4a5058, { x: 0.7, y: 4.2 }),
        // Light dome (glowing)
        sph(0.22, 0xf0e0a0, { ws: 8, hs: 5, x: 0.7, y: 4.0, thetaLen: HALF_PI * 1.2 }),
        // Secondary arm (other side)
        cyl(0.08, 0.08, 0.8, 6, 0x5a6068, { x: -0.35, y: 4.3, rz: 0.5 }),
        cyl(0.25, 0.18, 0.35, 8, 0x4a5058, { x: -0.7, y: 4.2 }),
        sph(0.22, 0xf0e0a0, { ws: 8, hs: 5, x: -0.7, y: 4.0, thetaLen: HALF_PI * 1.2 }),
        // Service panel on pole
        box(0.2, 0.3, 0.08, 0x3a3a38, { y: 1.5, z: 0.14 }),
      ]);
    },
  },

  /* 5 ── 稻草人 scarecrow (agricultural Yunlin icon) ───────────────────── */
  {
    id: 'scarecrow',
    displayName: '稻草人',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd8b868, 0x8a6a40, 0x4a7a4a, 0xc84030, 0xf0e0c0],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      return finish([
        // Vertical pole
        cyl(0.08, 0.1, 3.5, 6, 0x8a6a40, { y: 1.75 }),
        // Crossbar (arms)
        cyl(0.06, 0.06, 2.0, 6, 0x7a5a30, { y: 2.8, rz: HALF_PI }),
        // Straw head (bundled)
        sph(0.35, 0xd8b868, { ws: 8, hs: 6, y: 3.4, hex2: 0xc8a858 }),
        // Hat
        cyl(0.45, 0.45, 0.15, 8, 0x6a5030, { y: 3.7 }),
        cone(0.35, 0.4, 8, 0x5a4020, { y: 3.95 }),
        // Straw body/torso
        cyl(0.25, 0.35, 0.8, 8, 0xd8b868, { y: 2.4, hex2: 0xe8c878 }),
        // Old shirt (draped)
        box(0.7, 0.6, 0.25, 0x4a7a4a, { y: 2.5 }),
        // Straw arm bundles
        cyl(0.12, 0.08, 0.6, 6, 0xd8b868, { x: -0.8, y: 2.8, rz: -0.3 }),
        cyl(0.12, 0.08, 0.6, 6, 0xd8b868, { x: 0.8, y: 2.8, rz: 0.3 }),
        // Face features
        sph(0.06, 0x2a2a28, { ws: 4, hs: 3, y: 3.45, z: 0.28, x: -0.1 }), // eye
        sph(0.06, 0x2a2a28, { ws: 4, hs: 3, y: 3.45, z: 0.28, x: 0.1 }), // eye
        box(0.15, 0.04, 0.05, 0xc84030, { y: 3.32, z: 0.3 }), // mouth
        // Straw wisps hanging down
        cyl(0.04, 0.02, 0.4, 4, 0xc8a848, { y: 1.9, x: 0.2, rz: 0.2 }),
        cyl(0.04, 0.02, 0.35, 4, 0xc8a848, { y: 1.85, x: -0.15, rz: -0.15 }),
      ]);
    },
  },

  /* 6 ── 榕樹 banyan tree (roadside) ──────────────────────────────────── */
  {
    id: 'banyan_tree',
    displayName: '榕樹',
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
      // canopy = clustered low-detail icospheres for a leafy blob
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
      // Hanging aerial roots (banyan characteristic)
      parts.push(cyl(0.03, 0.02, 0.5, 4, 0x7a5a3a, { x: 0.3, y: 1.3, z: 0.2 }));
      parts.push(cyl(0.03, 0.02, 0.6, 4, 0x7a5a3a, { x: -0.25, y: 1.2, z: -0.15 }));
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
      // curled mane (icosphere collar) + brow ridges
      parts.push(sph(0.4, 0x9c9686, { x: -0.18, y: 1.42, ws: 7, hs: 4 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: 0.16, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: -0.16, ws: 5, hs: 3 }));
      // front legs
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: 0.2 }));
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: -0.2 }));
      // paws on a ball (left) — the lion's embroidered ball
      parts.push(sph(0.16, 0xc4203a, { x: -0.5, y: 0.32, z: 0.2, ws: 6, hs: 4 }));
      // tail
      parts.push(sph(0.22, stone2, { x: 0.42, y: 1.05, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 醬油廠大門 soy sauce factory gate (CHUNK LANDMARK) ────────────── */
  {
    id: 'soy_factory_gate',
    displayName: '醬油廠大門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a5a30, 0xb87840, 0xf0c040, 0x4a3018, 0xf8e8c0],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [];
      // Two brick pillars
      parts.push(box(0.6, 3.2, 0.6, 0x9a5a30, { x: -2.0, y: 1.6, hex2: 0xb87840 }));
      parts.push(box(0.6, 3.2, 0.6, 0x9a5a30, { x: 2.0, y: 1.6, hex2: 0xb87840 }));
      // Pillar caps
      parts.push(box(0.75, 0.2, 0.75, 0x6a4020, { x: -2.0, y: 3.3 }));
      parts.push(box(0.75, 0.2, 0.75, 0x6a4020, { x: 2.0, y: 3.3 }));
      // Arched beam connecting pillars
      torus(2.05, 0.2, 4, 8, 0x8a5a30, { y: 3.1, arc: PI });
      // Factory name sign board
      parts.push(box(3.4, 0.8, 0.12, 0xf8e8c0, { y: 3.6 }));
      parts.push(box(3.2, 0.6, 0.08, 0x4a2010, { y: 3.6, z: 0.08 })); // text area
      // Decorative trim
      parts.push(box(3.6, 0.1, 0.15, 0xf0c040, { y: 3.98 }));
      parts.push(box(3.6, 0.1, 0.15, 0xf0c040, { y: 3.22 }));
      // Gate doors (wooden, partially open)
      parts.push(box(1.5, 2.4, 0.1, 0x5a3820, { x: -1.0, y: 1.2, ry: -0.3 }));
      parts.push(box(1.5, 2.4, 0.1, 0x5a3820, { x: 1.0, y: 1.2, ry: 0.3 }));
      // Soy sauce barrel visible through gate
      parts.push(cyl(0.3, 0.3, 0.5, 8, 0x3a2010, { x: 0, y: 0.25, z: -0.4 }));
      // Lanterns on pillars
      parts.push(sph(0.18, 0xd83028, { ws: 6, hs: 4, x: -2.0, y: 2.8, z: 0.4 }));
      parts.push(sph(0.18, 0xd83028, { ws: 6, hs: 4, x: 2.0, y: 2.8, z: 0.4 }));
      return finish(parts);
    },
  },

  /* 9 ── 雲林大廟牌樓 Yunlin temple pailou gateway (CHUNK LANDMARK) ─────── */
  {
    id: 'yunlin_temple_pailou',
    displayName: '雲林大廟牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0x2a2c34, 0xd8d3c5, 0x6e6a5e],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const parts = [];
      // stone plinth feet
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2, hex2: 0x6e6a5e }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2, hex2: 0x6e6a5e }));
      // two red columns
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: -1.8, y: 2.1 }));
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: 1.8, y: 2.1 }));
      // gold cross beams (architrave, double bar)
      parts.push(box(4.4, 0.32, 0.45, gold, { x: 0, y: 3.7 }));
      parts.push(box(4.0, 0.22, 0.4, red, { x: 0, y: 3.35 }));
      // central plaque
      parts.push(box(1.1, 0.7, 0.16, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(0.9, 0.5, 0.2, gold, { x: 0, y: 3.7 }));
      // tiled hip roof — green pitched slabs over the beam
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // smaller secondary roof above
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 7, hs: 5 })); // finial bead
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
