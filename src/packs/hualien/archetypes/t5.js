/**
 * @file archetypes/t5.js — Hualien pack T5 「太魯閣峽谷」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the Taroko Gorge scale band
 * (radiusNominal 12–60 m real). Eight absorbable archetypes (slots 0–7,
 * spawnWeight 1.0) plus two repeatable CHUNK LANDMARKS (slots 8–9,
 * spawnWeight ~0.3). ids are the FROZEN CONTRACT declared in
 * packs/hualien/tiers.js — spelling must NOT drift.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * ALL 10 archetypes are Hualien/Taroko-specific — featuring marble boulders,
 * suspension bridges, trail railings, cliff rocks, and gorge scenery.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

// Taroko gorge colors
const MARBLE_W = 0xe8e0d8; // white marble
const MARBLE_G = 0xb0b8a8; // grey-green marble
const MARBLE_D = 0x8a8a80; // darker marble
const CLIFF = 0x7a7a70; // cliff rock
const WOOD = 0x6a5040; // wooden structures
const STEEL = 0x6a7080; // steel structures

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 大理石岩塊 marble_boulder ----------------------------- */
  {
    id: 'marble_boulder',
    displayName: '大理石岩塊',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xe8e0d8, 0xd0c8c0, 0xb8b0a8, 0x9a9a90, 0xc8c0b8],
    yOffset: -0.35,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Large marble boulder - Taroko's famous white marble
      const parts = [];
      // Main boulder mass - irregular
      parts.push(sph(1.8, MARBLE_W, { y: 1.0, ws: 7, hs: 5, sy: 0.7, hex2: MARBLE_G }));
      // Secondary masses for irregular shape
      parts.push(sph(1.0, MARBLE_G, { x: 0.8, y: 0.6, z: 0.5, ws: 6, hs: 4, sy: 0.65 }));
      parts.push(sph(0.8, MARBLE_D, { x: -0.7, y: 0.5, z: -0.4, ws: 6, hs: 4, sy: 0.7 }));
      parts.push(sph(0.6, 0xc8c0b8, { x: 0.3, y: 1.4, z: -0.6, ws: 5, hs: 4 }));
      // Veining texture (darker stripes)
      parts.push(box(2.5, 0.08, 0.15, 0x9a9a90, { y: 0.9, rz: 0.2 }));
      parts.push(box(1.8, 0.06, 0.12, MARBLE_D, { y: 1.2, x: 0.3, rz: -0.15 }));
      return finish(parts);
    },
  },

  /* ---- slot 1: 吊橋塔 suspension_tower ------------------------------- */
  {
    id: 'suspension_tower',
    displayName: '吊橋塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 25,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a7080, 0x8a9098, 0xc8c0b0, 0x5a6068, 0xe0d8c8],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Suspension bridge tower - common in Taroko trails
      const parts = [];
      // Main tower posts (A-frame style)
      parts.push(cyl(0.3, 0.35, 5.0, 6, STEEL, { x: -0.8, y: 2.5, rz: 0.08 }));
      parts.push(cyl(0.3, 0.35, 5.0, 6, STEEL, { x: 0.8, y: 2.5, rz: -0.08 }));
      // Cross beam at top
      parts.push(box(2.4, 0.4, 0.5, 0x5a6068, { y: 4.8 }));
      // Cable anchors on top
      parts.push(cyl(0.15, 0.15, 0.8, 6, 0x8a9098, { x: -0.6, y: 5.3 }));
      parts.push(cyl(0.15, 0.15, 0.8, 6, 0x8a9098, { x: 0.6, y: 5.3 }));
      // Main cables drooping
      parts.push(cyl(0.06, 0.06, 4.0, 4, 0x4a5058, { x: -0.6, y: 3.5, rz: 0.6 }));
      parts.push(cyl(0.06, 0.06, 4.0, 4, 0x4a5058, { x: 0.6, y: 3.5, rz: -0.6 }));
      // Bridge deck section
      parts.push(box(3.0, 0.2, 1.4, WOOD, { y: 0.6, hex2: 0x8a7060 }));
      // Deck planks
      parts.push(box(2.8, 0.08, 1.3, 0x7a6050, { y: 0.74 }));
      // Handrail cables
      parts.push(box(0.04, 0.8, 3.0, 0x4a5058, { x: -0.65, y: 1.1, rz: 0 }));
      parts.push(box(0.04, 0.8, 3.0, 0x4a5058, { x: 0.65, y: 1.1, rz: 0 }));
      // Concrete foundation
      parts.push(box(2.0, 0.5, 1.8, 0xc8c0b0, { y: 0.25 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 步道欄杆 trail_railing ------------------------------- */
  {
    id: 'trail_railing',
    displayName: '步道欄杆',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x7a6050, 0x8a7060, 0x6a5040, 0x5a4030, 0x9a8070],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Trail safety railing - common on Taroko hiking paths (simplified for tri budget)
      const parts = [];
      // Path surface
      parts.push(box(5.0, 0.2, 1.4, 0x8a8278, { y: 0.1 }));
      // Railing posts (wooden) - 3 posts each side, 4 segments
      for (let i = 0; i < 3; i++) {
        const px = -1.8 + i * 1.8;
        parts.push(cyl(0.12, 0.12, 1.4, 4, WOOD, { x: px, y: 0.9, z: 0.65 }));
        parts.push(cyl(0.12, 0.12, 1.4, 4, WOOD, { x: px, y: 0.9, z: -0.65 }));
      }
      // Horizontal rails (top and mid)
      parts.push(box(4.4, 0.12, 0.1, 0x8a7060, { y: 1.5, z: 0.65 }));
      parts.push(box(4.4, 0.12, 0.1, 0x8a7060, { y: 1.5, z: -0.65 }));
      parts.push(box(4.4, 0.1, 0.08, 0x7a6050, { y: 1.0, z: 0.65 }));
      parts.push(box(4.4, 0.1, 0.08, 0x7a6050, { y: 1.0, z: -0.65 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 山壁岩石 cliff_rock ---------------------------------- */
  {
    id: 'cliff_rock',
    displayName: '山壁岩石',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 30,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0x7a7a70, 0x8a8a80, 0x6a6a60, 0x9a9a90, 0x5a5a50],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Cliff rock formation - Taroko's dramatic gorge walls
      const parts = [];
      // Main cliff face
      parts.push(box(3.0, 4.5, 2.0, CLIFF, { y: 2.25, hex2: 0x6a6a60 }));
      // Layered rock texture
      parts.push(box(3.2, 0.3, 0.3, 0x8a8a80, { y: 1.0, z: 1.0 }));
      parts.push(box(2.8, 0.25, 0.25, MARBLE_G, { y: 2.2, z: 1.05 }));
      parts.push(box(3.0, 0.2, 0.2, 0x9a9a90, { y: 3.4, z: 1.0 }));
      // Protruding rock sections
      parts.push(box(1.2, 1.5, 0.8, 0x6a6a60, { x: 1.0, y: 1.5, z: 0.9 }));
      parts.push(box(0.8, 1.2, 0.6, MARBLE_D, { x: -1.1, y: 2.8, z: 0.8 }));
      // Small vegetation patches
      parts.push(sph(0.4, 0x4a6a4a, { x: 0.5, y: 4.2, z: 0.9, ws: 5, hs: 3 }));
      parts.push(sph(0.3, 0x3a5a3a, { x: -0.8, y: 3.8, z: 0.85, ws: 5, hs: 3 }));
      // Fallen rocks at base
      parts.push(sph(0.5, CLIFF, { x: 0.8, y: 0.3, z: 1.3, ws: 5, hs: 4, sy: 0.6 }));
      parts.push(sph(0.35, 0x8a8a80, { x: -0.5, y: 0.25, z: 1.2, ws: 5, hs: 4, sy: 0.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 停車塔 parking_tower --------------------------------- */
  {
    id: 'parking_tower',
    displayName: '停車塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x9aa0a6, 0x7a8088, 0xc0c4ca, 0x5a6068, 0xe0a838],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Parking structure - common at Taroko trailheads
      const parts = [
        box(2.0, 7.0, 2.4, 0xffffff, { y: 3.6 }), // shaft (tinted concrete)
        // corner columns
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: -1.15 }),
        box(2.0, 0.4, 2.4, 0x7a8088, { y: 7.3 }), // roof slab
        box(1.0, 0.7, 0.1, 0xe0a838, { y: 0.5, z: 1.22 }), // entry gate (yellow)
      ];
      // 6 deck floors
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 })); // open deck shadow
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 })); // car chip
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 峽谷看板 gorge_sign ---------------------------------- */
  {
    id: 'gorge_sign',
    displayName: '峽谷看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a5040, 0x8a7060, 0x4a6a5a, 0xf0e8d8, 0x3a5a4a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Information signboard - common at Taroko viewpoints
      const parts = [];
      // Main support posts (wooden)
      parts.push(cyl(0.2, 0.22, 3.0, 6, WOOD, { x: -1.5, y: 1.5 }));
      parts.push(cyl(0.2, 0.22, 3.0, 6, WOOD, { x: 1.5, y: 1.5 }));
      // Cross beam
      parts.push(box(3.4, 0.25, 0.2, 0x8a7060, { y: 2.9 }));
      // Sign panel (wooden frame with info)
      parts.push(box(3.2, 2.0, 0.15, 0x4a6a5a, { y: 1.8, hex2: 0x3a5a4a }));
      parts.push(box(2.8, 1.6, 0.08, 0xf0e8d8, { y: 1.8, z: 0.08 })); // info area
      // Map/diagram section
      parts.push(box(1.2, 0.8, 0.04, 0xd0e8d0, { x: -0.6, y: 2.0, z: 0.12 }));
      // Text area
      parts.push(box(1.0, 0.5, 0.03, 0x4a3a30, { x: 0.7, y: 2.2, z: 0.13 }));
      // Roof cover (to protect from rain)
      parts.push(box(3.6, 0.1, 0.8, 0x5a4030, { y: 3.1, rx: -0.15 }));
      // Stone base
      parts.push(box(3.8, 0.3, 1.0, 0x9a9288, { y: 0.15 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 遊客中心 visitor_center ----------------------------- */
  {
    id: 'visitor_center',
    displayName: '遊客中心',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 35,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e0d8, 0xd0c8c0, 0x4a6a5a, 0x8a7060, 0xc8c0b8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taroko Visitor Center style building
      const parts = [];
      // Main building body
      parts.push(box(4.5, 2.2, 3.0, 0xe8e0d8, { y: 1.2, hex2: 0xd0c8c0 }));
      // Sloped roof (mountain style)
      parts.push(box(5.0, 0.15, 3.4, 0x4a6a5a, { y: 2.5, z: 0.8, rx: -0.25 }));
      parts.push(box(5.0, 0.15, 3.4, 0x4a6a5a, { y: 2.5, z: -0.8, rx: 0.25 }));
      // Ridge
      parts.push(box(5.2, 0.12, 0.2, 0x3a5a4a, { y: 2.8 }));
      // Entrance portico
      parts.push(box(2.5, 1.5, 1.0, 0xf0e8e0, { y: 0.85, z: 1.8 }));
      parts.push(box(2.6, 0.12, 1.2, 0x8a7060, { y: 1.65, z: 1.85 })); // portico roof
      // Columns
      parts.push(cyl(0.12, 0.12, 1.5, 6, WOOD, { x: -1.0, y: 0.85, z: 2.25 }));
      parts.push(cyl(0.12, 0.12, 1.5, 6, WOOD, { x: 1.0, y: 0.85, z: 2.25 }));
      // Glass entrance
      parts.push(box(1.5, 1.2, 0.08, 0x8fc4d8, { y: 0.7, z: 1.58 }));
      // Windows
      parts.push(box(0.8, 0.7, 0.06, 0x7ab4c8, { x: -1.6, y: 1.2, z: 1.52 }));
      parts.push(box(0.8, 0.7, 0.06, 0x7ab4c8, { x: 1.6, y: 1.2, z: 1.52 }));
      // Information sign
      parts.push(box(1.8, 0.5, 0.1, 0x4a6a5a, { y: 2.0, z: 1.6 }));
      parts.push(box(1.5, 0.35, 0.05, 0xf0e8d8, { y: 2.0, z: 1.66 }));
      // Landscaping
      parts.push(sph(0.5, 0x4a7a4a, { x: 2.0, y: 0.4, z: 1.5, ws: 6, hs: 4 }));
      parts.push(sph(0.4, 0x3a6a3a, { x: -2.0, y: 0.35, z: 1.4, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 隧道口 tunnel_mouth ---------------------------------- */
  {
    id: 'tunnel_mouth',
    displayName: '隧道口',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x5a5a50, 0x7a7a70, 0x3a3a30, 0x9a9a90, 0xf0e0b0],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Tunnel entrance - Taroko has many carved through marble
      const parts = [];
      // Cliff/rock face surrounding tunnel
      parts.push(box(5.0, 4.0, 2.5, CLIFF, { y: 2.0, hex2: 0x6a6a60 }));
      // Tunnel opening (dark interior)
      parts.push(cyl(1.5, 1.5, 2.0, 8, 0x1a1a18, { y: 1.8, z: 1.0, rx: HALF_PI }));
      // Tunnel arch reinforcement
      parts.push(torus(1.6, 0.15, 6, 8, 0x5a5a50, { y: 1.8, z: 0.7, rx: HALF_PI, arc: PI }));
      // Rock texture layers
      parts.push(box(5.2, 0.3, 0.3, MARBLE_G, { y: 3.2, z: 1.2 }));
      parts.push(box(4.8, 0.25, 0.25, 0x8a8a80, { y: 1.0, z: 1.15 }));
      // Road surface
      parts.push(box(4.0, 0.15, 3.5, 0x4a4a48, { y: 0.08, z: 0 }));
      // Road markings
      parts.push(box(0.15, 0.02, 3.0, 0xf0e0b0, { y: 0.16, z: 0 }));
      // Warning sign
      parts.push(box(0.6, 0.6, 0.08, 0xf0e040, { x: 2.2, y: 2.0, z: 1.0 }));
      parts.push(box(0.5, 0.5, 0.04, 0x2a2a28, { x: 2.2, y: 2.0, z: 1.05 }));
      // Lighting
      parts.push(cyl(0.1, 0.1, 0.3, 6, 0xf0e0a0, { x: 0, y: 3.2, z: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 燕子口觀景台 swallow_viewpoint (CHUNK LANDMARK) ------- */
  {
    id: 'swallow_viewpoint',
    displayName: '燕子口觀景台',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xe8e0d8, 0xb0b8a8, 0x7a6050, 0x5a5a50, 0x4a6a5a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Swallow Grotto viewing platform - famous Taroko spot
      const parts = [];
      // Cliff backdrop (marble)
      parts.push(box(4.5, 6.0, 2.0, MARBLE_W, { x: -1.5, y: 3.0, hex2: MARBLE_G }));
      // Cave openings in cliff
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.2 + rng() * 0.1, 0.2, 0.3, 5, 0x3a3a38, {
          x: -0.55 - rng() * 0.3, y: 2.0 + i * 1.2, z: 1.0, rx: HALF_PI,
        }));
      }
      // Viewing platform
      parts.push(box(4.0, 0.25, 2.5, 0x8a8278, { y: 0.12, z: 1.5 }));
      // Safety railing
      parts.push(box(4.0, 0.1, 0.08, 0x5a5a50, { y: 1.0, z: 2.65 }));
      // Railing posts
      for (let i = 0; i < 5; i++) {
        parts.push(cyl(0.06, 0.06, 0.9, 5, WOOD, { x: -1.6 + i * 0.8, y: 0.55, z: 2.65 }));
      }
      // Trail carved into cliff (the famous Yanzikou trail)
      parts.push(box(1.2, 0.15, 4.0, 0x7a7068, { x: 0.8, y: 0.15, z: 0 }));
      // Trail railing along cliff
      parts.push(box(0.04, 0.6, 3.5, 0x5a5a50, { x: 1.35, y: 0.45, z: -0.2 }));
      // Information sign
      parts.push(box(0.8, 1.0, 0.1, 0x4a6a5a, { x: 1.5, y: 0.7, z: 2.2 }));
      parts.push(box(0.65, 0.75, 0.05, 0xf0e8d8, { x: 1.5, y: 0.7, z: 2.26 }));
      // River below (turquoise)
      parts.push(box(3.0, 0.1, 2.0, 0x5ab8c8, { x: 0.5, y: -0.3, z: -0.5, hex2: 0x3a8898 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 九曲洞牌坊 jiuqudong_arch (CHUNK LANDMARK) ------------ */
  {
    id: 'jiuqudong_arch',
    displayName: '九曲洞牌坊',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 45,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x8a7060, 0xa09080, 0xe8e0d8, 0x4a6a5a, 0xf0e8d0],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Jiuqudong (Nine Turns Cave) entrance arch
      const parts = [];
      // Main stone pillars
      parts.push(box(0.8, 4.5, 0.8, 0x8a7a68, { x: -2.5, y: 2.25, hex2: 0xa09080 }));
      parts.push(box(0.8, 4.5, 0.8, 0x8a7a68, { x: 2.5, y: 2.25, hex2: 0xa09080 }));
      // Pillar bases
      parts.push(box(1.0, 0.4, 1.0, 0x9a9288, { x: -2.5, y: 0.2 }));
      parts.push(box(1.0, 0.4, 1.0, 0x9a9288, { x: 2.5, y: 0.2 }));
      // Cross beam (traditional style)
      parts.push(box(6.0, 0.5, 0.6, 0x8a7060, { y: 4.3 }));
      parts.push(box(5.8, 0.3, 0.5, 0xa09080, { y: 3.9 }));
      // Name plaque
      parts.push(box(2.5, 0.8, 0.2, 0x4a6a5a, { y: 4.3, hex2: 0x3a5a4a }));
      parts.push(box(2.2, 0.55, 0.1, 0xf0e8d0, { y: 4.3, z: 0.1 }));
      // Decorative roof element
      parts.push(box(6.4, 0.15, 1.0, 0x4a6a5a, { y: 4.65, z: 0.4, rx: -0.2 }));
      parts.push(box(6.4, 0.15, 1.0, 0x4a6a5a, { y: 4.65, z: -0.4, rx: 0.2 }));
      // Ridge ornament
      parts.push(box(6.6, 0.12, 0.15, 0x3a5a4a, { y: 4.85 }));
      // Surrounding cliff/marble context
      parts.push(box(2.0, 3.0, 1.5, MARBLE_G, { x: -4.0, y: 1.5, hex2: MARBLE_D }));
      parts.push(box(1.8, 2.5, 1.3, MARBLE_W, { x: 4.0, y: 1.25, hex2: MARBLE_G }));
      // Path
      parts.push(box(5.5, 0.12, 2.5, 0x7a7068, { y: 0.06 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
