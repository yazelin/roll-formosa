/**
 * @file packs/hualien/archetypes/t3.js — Roll Formosa Hualien pack, Tier 3
 * (七星潭海濱 / Qixingtan Beach). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 七星潭海濱夜色 — beach twilight with ocean breeze and moonlit
 * pebbles, featuring driftwood, kites, and the famous Qixingtan scenery.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (海濱拱門 / 涼亭廊架)
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

  /* 2 ── 漂流木 driftwood (七星潭特色) ──────────────────────────────────── */
  {
    id: 'driftwood',
    displayName: '漂流木',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a5038, 0x8a6a48, 0x5a4030, 0x9a7a58, 0x4a3828],
    yOffset: -0.75,
    upright: false,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const wood = 0x6a5038;
      const woodL = 0x8a6a48;
      const parts = [];
      // main trunk - weathered, curved driftwood
      parts.push(cyl(0.18, 0.12, 2.4, 6, wood, { rz: 0.15, y: 0.2, hex2: woodL }));
      // branch stubs
      parts.push(cyl(0.08, 0.05, 0.6, 5, woodL, { x: 0.3, y: 0.35, rz: 0.8 }));
      parts.push(cyl(0.07, 0.04, 0.5, 5, wood, { x: -0.5, y: 0.25, rz: -0.6 }));
      parts.push(cyl(0.06, 0.03, 0.4, 5, 0x5a4030, { x: 0.7, y: 0.18, rz: 0.4 }));
      // weathered texture knots
      parts.push(sph(0.1, 0x4a3828, { x: 0.1, y: 0.22, z: 0.12, ws: 5, hs: 3 }));
      parts.push(sph(0.08, 0x5a4030, { x: -0.3, y: 0.2, z: -0.08, ws: 5, hs: 3 }));
      // root end (wider, gnarled)
      parts.push(cyl(0.22, 0.18, 0.3, 6, 0x5a4030, { x: -1.0, y: 0.18, rz: 0.2 }));
      return finish(parts);
    },
  },

  /* 3 ── 鵝卵石堆 pebble stack (七星潭著名景觀) ───────────────────────── */
  {
    id: 'pebble_stack',
    displayName: '鵝卵石堆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x7a7a78, 0x8a8a88, 0x6a6a68, 0x9a9a98, 0x5a5a58],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // stacked pebbles - the famous Qixingtan pebble stacking tradition
      const pebbleColors = [0x7a7a78, 0x8a8a88, 0x6a6a68, 0x9a9a98, 0x5a5a58];
      // base layer - larger pebbles
      parts.push(sph(0.35, pebbleColors[0], { x: -0.2, y: 0.2, z: 0.1, ws: 6, hs: 4, sy: 0.7 }));
      parts.push(sph(0.32, pebbleColors[1], { x: 0.25, y: 0.18, z: -0.05, ws: 6, hs: 4, sy: 0.65 }));
      parts.push(sph(0.28, pebbleColors[2], { x: 0.0, y: 0.16, z: 0.25, ws: 6, hs: 4, sy: 0.7 }));
      // middle layer
      parts.push(sph(0.24, pebbleColors[3], { x: 0.0, y: 0.45, z: 0.05, ws: 6, hs: 4, sy: 0.65 }));
      parts.push(sph(0.2, pebbleColors[4], { x: -0.12, y: 0.48, z: -0.1, ws: 6, hs: 4, sy: 0.7 }));
      // top pebbles
      parts.push(sph(0.16, pebbleColors[1], { x: -0.02, y: 0.72, z: 0.0, ws: 6, hs: 4, sy: 0.6 }));
      parts.push(sph(0.12, pebbleColors[0], { x: 0.0, y: 0.92, z: 0.0, ws: 5, hs: 3, sy: 0.65 }));
      return finish(parts);
    },
  },

  /* 4 ── 風箏 kite (七星潭放風箏活動) ─────────────────────────────────── */
  {
    id: 'kite',
    displayName: '風箏',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.4,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe04040, 0x40a0e0, 0xf0e040, 0x40e080, 0xf0f0f0],
    yOffset: 0.1,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      const kiteColor = [0xe04040, 0x40a0e0, 0xf0e040, 0x40e080][Math.floor(rng() * 4)];
      const parts = [];
      // diamond kite body (two triangles meeting at center)
      parts.push(box(1.6, 0.03, 1.2, kiteColor, { y: 1.8, rx: 0.3, hex2: 0xf0f0f0 }));
      // cross frame
      parts.push(cyl(0.025, 0.025, 1.7, 4, 0x8a6a40, { y: 1.8, rx: 0.3 }));
      parts.push(cyl(0.025, 0.025, 1.3, 4, 0x8a6a40, { y: 1.8, rx: 0.3, rz: HALF_PI }));
      // tail ribbons
      const tailColors = [0xe04040, 0xf0e040, 0x40a0e0];
      for (let i = 0; i < 3; i++) {
        const tz = -0.3 + i * 0.3;
        parts.push(box(0.08, 0.6, 0.04, tailColors[i], { x: -0.1, y: 1.0, z: tz, rx: 0.5 }));
        parts.push(box(0.06, 0.4, 0.03, tailColors[(i + 1) % 3], { x: -0.2, y: 0.5, z: tz, rx: 0.6 }));
      }
      // kite string (going down to ground)
      parts.push(cyl(0.01, 0.01, 1.8, 4, 0xf0f0e0, { x: 0, y: 0.9, rx: 0.2 }));
      // spool handle on ground
      parts.push(cyl(0.08, 0.08, 0.2, 6, 0x6a5040, { y: 0.1 }));
      return finish(parts);
    },
  },

  /* 5 ── 七星潭涼亭 qixing pavilion (海濱觀景亭) ───────────────────────── */
  {
    id: 'qixing_pavilion',
    displayName: '七星潭涼亭',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x6a5a48, 0x8a7a60, 0x4a6a5a, 0xb0a080, 0x3a5a4a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const wood = 0x6a5a48;
      const roof = 0x4a6a5a;
      const parts = [];
      // platform base
      parts.push(box(2.2, 0.15, 2.0, 0x8a8278, { y: 0.08 }));
      // 4 corner posts
      const postPos = [[-0.85, 0.85], [0.85, 0.85], [-0.85, -0.85], [0.85, -0.85]];
      for (const [px, pz] of postPos) {
        parts.push(cyl(0.1, 0.1, 1.8, 6, wood, { x: px, y: 1.0, z: pz }));
      }
      // beam structure
      parts.push(box(2.0, 0.12, 0.12, 0x8a7a60, { y: 1.85, z: 0.85 }));
      parts.push(box(2.0, 0.12, 0.12, 0x8a7a60, { y: 1.85, z: -0.85 }));
      parts.push(box(0.12, 0.12, 1.82, 0x8a7a60, { x: 0.85, y: 1.85 }));
      parts.push(box(0.12, 0.12, 1.82, 0x8a7a60, { x: -0.85, y: 1.85 }));
      // pitched roof (two sloped panels)
      parts.push(box(2.4, 0.08, 1.3, roof, { y: 2.25, z: 0.55, rx: -0.35, hex2: 0x3a5a4a }));
      parts.push(box(2.4, 0.08, 1.3, roof, { y: 2.25, z: -0.55, rx: 0.35, hex2: 0x3a5a4a }));
      // ridge
      parts.push(box(2.5, 0.1, 0.15, 0xb0a080, { y: 2.55 }));
      // bench inside
      parts.push(box(1.4, 0.1, 0.4, wood, { y: 0.35 }));
      parts.push(box(0.1, 0.25, 0.4, wood, { x: -0.6, y: 0.2 }));
      parts.push(box(0.1, 0.25, 0.4, wood, { x: 0.6, y: 0.2 }));
      return finish(parts);
    },
  },

  /* 6 ── 棕櫚 harbor palm (港邊棕櫚樹) ────────────────────────────────── */
  {
    id: 'harbor_palm',
    displayName: '棕櫚',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.4,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a4030, 0x3a7a3a, 0x4a8a4a, 0x2a6a2a, 0x7a5a40],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const trunk = 0x5a4030;
      const frond = 0x3a7a3a;
      const parts = [];
      // trunk with texture rings
      parts.push(cyl(0.18, 0.25, 2.8, 7, trunk, { y: 1.4, hex2: 0x7a5a40 }));
      // trunk ring textures
      for (let i = 0; i < 5; i++) {
        parts.push(cyl(0.21, 0.19, 0.08, 7, 0x4a3020, { y: 0.4 + i * 0.5 }));
      }
      // palm fronds radiating from top
      const frondAngles = [0, PI / 3, 2 * PI / 3, PI, 4 * PI / 3, 5 * PI / 3];
      for (const angle of frondAngles) {
        const fx = Math.cos(angle) * 0.3;
        const fz = Math.sin(angle) * 0.3;
        // frond stem
        parts.push(cyl(0.04, 0.02, 1.2, 4, 0x4a8a4a, {
          x: fx, y: 3.1, z: fz,
          rx: 0.8 * Math.cos(angle + HALF_PI),
          rz: 0.8 * Math.sin(angle + HALF_PI),
        }));
        // frond leaf (flattened cone)
        parts.push(cone(0.5, 0.8, 5, frond, {
          x: fx * 2.5, y: 3.3, z: fz * 2.5,
          rx: 0.9 * Math.cos(angle + HALF_PI),
          rz: 0.9 * Math.sin(angle + HALF_PI),
          hex2: 0x2a6a2a,
        }));
      }
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
      // paws on a ball (left)
      parts.push(sph(0.16, 0xc4203a, { x: -0.5, y: 0.32, z: 0.2, ws: 6, hs: 4 }));
      // tail
      parts.push(sph(0.22, stone2, { x: 0.42, y: 1.05, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 海濱拱門 beach arch (CHUNK LANDMARK) ──────────────────────────── */
  {
    id: 'beach_arch',
    displayName: '海濱拱門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a7a68, 0xa09080, 0x6a8a9a, 0xf0e8d8, 0x5a9aaa],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // two stone pillars
      parts.push(box(0.5, 3.0, 0.5, 0x8a7a68, { x: -2.0, y: 1.5, hex2: 0xa09080 }));
      parts.push(box(0.5, 3.0, 0.5, 0x8a7a68, { x: 2.0, y: 1.5, hex2: 0xa09080 }));
      // pillar caps
      parts.push(box(0.65, 0.15, 0.65, 0xa09080, { x: -2.0, y: 3.08 }));
      parts.push(box(0.65, 0.15, 0.65, 0xa09080, { x: 2.0, y: 3.08 }));
      // arched top (curved torus)
      parts.push(torus(2.05, 0.25, 4, 8, 0x6a8a9a, { x: 0, y: 3.0, arc: PI }));
      // welcome sign
      parts.push(box(3.2, 0.6, 0.15, 0x5a9aaa, { x: 0, y: 3.6, hex2: 0x6a8a9a }));
      parts.push(box(3.0, 0.4, 0.08, 0xf0e8d8, { x: 0, y: 3.6, z: 0.08 })); // sign face
      // decorative wave pattern on top
      parts.push(box(3.4, 0.12, 0.18, 0x5a9aaa, { x: 0, y: 3.96 }));
      // stone base
      parts.push(box(4.8, 0.2, 1.0, 0xa09080, { y: 0.1 }));
      return finish(parts);
    },
  },

  /* 9 ── 涼亭廊架 beach pergola (CHUNK LANDMARK) ──────────────────────── */
  {
    id: 'beach_pergola',
    displayName: '涼亭廊架',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x7a6a58, 0x9a8a70, 0x5a7a6a, 0xd0c8b8, 0x4a6a5a],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const wood = 0x7a6a58;
      const parts = [];
      // foundation platform
      parts.push(box(4.5, 0.15, 2.5, 0x9a9288, { y: 0.08 }));
      // 6 posts (2 rows of 3)
      const postX = [-1.8, 0, 1.8];
      for (const px of postX) {
        parts.push(cyl(0.12, 0.12, 2.2, 6, wood, { x: px, y: 1.2, z: 0.9 }));
        parts.push(cyl(0.12, 0.12, 2.2, 6, wood, { x: px, y: 1.2, z: -0.9 }));
      }
      // main beams (longitudinal)
      parts.push(box(4.0, 0.14, 0.14, 0x9a8a70, { y: 2.3, z: 0.9 }));
      parts.push(box(4.0, 0.14, 0.14, 0x9a8a70, { y: 2.3, z: -0.9 }));
      // cross beams (pergola slats)
      for (let i = 0; i < 5; i++) {
        const bx = -1.6 + i * 0.8;
        parts.push(box(0.1, 0.1, 2.0, wood, { x: bx, y: 2.38 }));
      }
      // top lattice (bamboo/wood slats for shade)
      parts.push(box(3.8, 0.04, 1.9, 0x5a7a6a, { y: 2.44, hex2: 0x4a6a5a }));
      // bench seats under pergola
      parts.push(box(1.2, 0.08, 0.4, wood, { x: -0.9, y: 0.35, z: 0 }));
      parts.push(box(1.2, 0.08, 0.4, wood, { x: 0.9, y: 0.35, z: 0 }));
      // bench legs
      parts.push(box(0.08, 0.22, 0.35, wood, { x: -1.4, y: 0.18 }));
      parts.push(box(0.08, 0.22, 0.35, wood, { x: -0.4, y: 0.18 }));
      parts.push(box(0.08, 0.22, 0.35, wood, { x: 0.4, y: 0.18 }));
      parts.push(box(0.08, 0.22, 0.35, wood, { x: 1.4, y: 0.18 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
