/**
 * @file packs/kinmen/archetypes/t3.js — Roll Formosa Kinmen pack, Tier 3
 * (戰地碼頭 / wartime harbor wharf). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5-2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6-10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 戰地暮色藍紫 (wartime dusk, blue-purple) — but each
 * object keeps its own true-to-life colors so it stays legible.
 *
 * Slots [0..7] absorbable harbor/military objects; slots [8..9] (軍港牌坊 / 漁船吊架)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T3_ARCHETYPES = [
  /* 0 -- 機車 scooter ---------------------------------------------------- */
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

  /* 1 -- 小貨車 mini truck ------------------------------------------------ */
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

  /* 2 -- 彈藥箱 ammo crate (military theme) ------------------------------- */
  {
    id: 'ammo_crate',
    displayName: '彈藥箱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.6,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a5a30, 0x3a4a28, 0x5a6a38, 0x2a3a18, 0x6a7a48],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const green = 0xffffff; // olive drab military
      const parts = [];
      // main crate body
      parts.push(box(1.4, 0.7, 0.8, green, { y: 0.35, hex2: 0x5a6a38 }));
      // lid
      parts.push(box(1.42, 0.1, 0.82, 0x4a5a30, { y: 0.72 }));
      // metal reinforcement strips
      parts.push(box(1.44, 0.04, 0.04, 0x404040, { y: 0.5, z: 0.4 }));
      parts.push(box(1.44, 0.04, 0.04, 0x404040, { y: 0.5, z: -0.4 }));
      parts.push(box(0.04, 0.72, 0.84, 0x404040, { x: 0.7, y: 0.36 }));
      parts.push(box(0.04, 0.72, 0.84, 0x404040, { x: -0.7, y: 0.36 }));
      // handles on sides
      parts.push(torus(0.12, 0.025, 4, 6, 0x505050, { x: 0.72, y: 0.45, rz: HALF_PI, arc: PI }));
      parts.push(torus(0.12, 0.025, 4, 6, 0x505050, { x: -0.72, y: 0.45, rz: -HALF_PI, arc: PI }));
      // stenciled markings (simplified)
      parts.push(box(0.4, 0.15, 0.02, 0x202020, { y: 0.4, z: 0.41 }));
      parts.push(box(0.25, 0.08, 0.02, 0xd8d080, { y: 0.45, z: 0.42 }));
      return finish(parts);
    },
  },

  /* 3 -- 纜繩柱 mooring bollard ------------------------------------------ */
  {
    id: 'mooring_bollard',
    displayName: '纜繩柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x404048, 0x303038, 0x505058, 0x202028, 0x606068],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const metal = 0xffffff;
      const parts = [];
      // base plate
      parts.push(cyl(0.8, 0.85, 0.15, 8, metal, { y: 0.08, hex2: 0x505058 }));
      // main bollard body
      parts.push(cyl(0.5, 0.55, 1.0, 8, metal, { y: 0.65 }));
      // top mushroom cap
      parts.push(cyl(0.65, 0.55, 0.2, 8, 0x404048, { y: 1.2 }));
      parts.push(sph(0.65, metal, { ws: 6, hs: 3, y: 1.35, sy: 0.4, thetaLen: HALF_PI }));
      // rope wrapped around
      parts.push(torus(0.58, 0.06, 4, 6, 0x8a7a60, { y: 0.65, rx: HALF_PI }));
      parts.push(torus(0.55, 0.05, 4, 6, 0x8a7a60, { y: 0.85, rx: HALF_PI }));
      // rust streaks
      parts.push(box(0.08, 0.5, 0.02, 0x804020, { x: 0.48, y: 0.5, rz: 0.1 }));
      return finish(parts);
    },
  },

  /* 4 -- 軍用桶 military barrel ------------------------------------------- */
  {
    id: 'military_barrel',
    displayName: '軍用桶',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x4a5a30, 0x3a4a28, 0x5a6a38, 0x2a3a18, 0x6a7a48],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      const green = 0xffffff; // olive drab
      const parts = [];
      // barrel body
      parts.push(cyl(0.55, 0.5, 0.3, 10, green, { y: 0.15 }));
      parts.push(cyl(0.6, 0.55, 0.6, 10, green, { y: 0.5, hex2: 0x5a6a38 }));
      parts.push(cyl(0.6, 0.6, 0.5, 10, green, { y: 0.95 }));
      parts.push(cyl(0.55, 0.6, 0.3, 10, green, { y: 1.3 }));
      // reinforcement rings
      parts.push(cyl(0.62, 0.62, 0.06, 10, 0x404040, { y: 0.3, open: true }));
      parts.push(cyl(0.62, 0.62, 0.06, 10, 0x404040, { y: 1.15, open: true }));
      // top cap
      parts.push(cyl(0.5, 0.5, 0.08, 10, 0x4a5a30, { y: 1.48 }));
      // small cap openings
      parts.push(cyl(0.08, 0.08, 0.06, 6, 0x303030, { x: 0.2, y: 1.52 }));
      parts.push(cyl(0.06, 0.06, 0.06, 6, 0x303030, { x: -0.15, y: 1.52 }));
      // military stencil marking
      parts.push(box(0.3, 0.15, 0.02, 0xd8d080, { y: 0.8, z: 0.59 }));
      return finish(parts);
    },
  },

  /* 5 -- 漁網堆 pile of fishing nets ------------------------------------- */
  {
    id: 'fishing_net_pile',
    displayName: '漁網堆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4080a0, 0x306080, 0x50a0c0, 0x205060, 0x60c0e0],
    yOffset: -0.4,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const net = 0xffffff;
      const parts = [];
      // main net pile
      parts.push(sph(1.0, net, { ws: 6, hs: 5, y: 0.5, sy: 0.55, hex2: 0x60c0e0 }));
      parts.push(sph(0.7, net, { ws: 5, hs: 4, x: 0.4, y: 0.6, sy: 0.5 }));
      parts.push(sph(0.6, net, { ws: 5, hs: 3, x: -0.35, y: 0.55, sy: 0.45 }));
      // net rope details
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI * 2;
        const r = 0.6 + rng() * 0.2;
        parts.push(cyl(0.04, 0.04, 0.5, 4, 0x306080, {
          x: Math.cos(a) * r, z: Math.sin(a) * r, y: 0.6 + rng() * 0.2,
          rz: 0.3 + rng() * 0.4, ry: a
        }));
      }
      // float balls attached
      parts.push(sph(0.15, 0xff6020, { ws: 4, hs: 3, x: 0.7, y: 0.8, z: 0.3 }));
      parts.push(sph(0.12, 0x20a0ff, { ws: 4, hs: 3, x: -0.5, y: 0.75, z: 0.4 }));
      return finish(parts);
    },
  },

  /* 6 -- 木麻黃 casuarina tree (Kinmen's iconic wind-break tree) ---------- */
  {
    id: 'casuarina_tree',
    displayName: '木麻黃',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a4030, 0x2a5030, 0x3a6838, 0x1a4020, 0x7a5a3a],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const trunk = 0x5a4030;
      const foliage = 0x2a5030;
      const parts = [];
      // trunk - slender, slightly curved (wind-shaped)
      parts.push(cyl(0.12, 0.18, 2.2, 6, trunk, { y: 1.1, hex2: 0x7a5a3a, rz: 0.08 }));
      // trunk texture rings
      for (let i = 0; i < 5; i++) {
        parts.push(cyl(0.15, 0.15, 0.04, 6, 0x4a3020, { y: 0.3 + i * 0.4, rz: 0.08 }));
      }
      // drooping needle-like foliage (casuarina characteristic)
      // multiple elongated cone shapes for feathery appearance
      parts.push(cone(0.5, 1.5, 8, foliage, { y: 2.8, hex2: 0x3a6838 }));
      parts.push(cone(0.4, 1.2, 7, 0x3a6838, { x: 0.3, y: 2.5, rz: 0.2 }));
      parts.push(cone(0.35, 1.0, 7, foliage, { x: -0.25, y: 2.6, rz: -0.15 }));
      parts.push(cone(0.3, 0.9, 6, 0x1a4020, { x: 0.15, y: 2.3, z: 0.2, rz: 0.1 }));
      // some lower branches
      parts.push(cyl(0.04, 0.03, 0.6, 4, trunk, { x: 0.25, y: 1.6, rz: -0.5 }));
      parts.push(cone(0.25, 0.7, 6, foliage, { x: 0.5, y: 1.7, rz: -0.3 }));
      return finish(parts);
    },
  },

  /* 7 -- 石獅 stone guardian lion ---------------------------------------- */
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

  /* 8 -- 軍港牌坊 military port gate (CHUNK LANDMARK) --------------------- */
  {
    id: 'military_port_pailou',
    displayName: '軍港牌坊',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x404850, 0x505860, 0x303840, 0x606870, 0x202830],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const concrete = 0xffffff; // military gray
      const metal = 0x505860;
      const parts = [];
      // two concrete pillars
      parts.push(box(0.6, 3.5, 0.6, concrete, { x: -2.0, y: 1.75, hex2: 0x606870 }));
      parts.push(box(0.6, 3.5, 0.6, concrete, { x: 2.0, y: 1.75, hex2: 0x606870 }));
      // pillar bases
      parts.push(box(0.8, 0.3, 0.8, 0x303840, { x: -2.0, y: 0.15 }));
      parts.push(box(0.8, 0.3, 0.8, 0x303840, { x: 2.0, y: 0.15 }));
      // pillar caps with military emblem area
      parts.push(box(0.7, 0.2, 0.7, metal, { x: -2.0, y: 3.55 }));
      parts.push(box(0.7, 0.2, 0.7, metal, { x: 2.0, y: 3.55 }));
      // main beam across top
      parts.push(box(4.8, 0.5, 0.5, concrete, { y: 3.85, hex2: 0x505860 }));
      // signboard - military style
      parts.push(box(2.8, 0.7, 0.15, 0x303840, { y: 3.85 }));
      // star emblem (simplified)
      parts.push(sph(0.2, 0xd8d080, { ws: 5, hs: 3, y: 3.85, z: 0.1 }));
      // roof structure - flat military style
      parts.push(box(5.2, 0.2, 0.8, 0x404850, { y: 4.25 }));
      // guard booth area suggestion
      parts.push(box(0.4, 0.4, 0.4, 0x303840, { x: -2.0, y: 2.5, z: 0.5 }));
      // flag pole mount
      parts.push(cyl(0.06, 0.08, 1.5, 6, metal, { x: 0, y: 4.8 }));
      // flag
      parts.push(box(0.6, 0.35, 0.02, 0xc02020, { x: 0.3, y: 5.3 }));
      return finish(parts);
    },
  },

  /* 9 -- 漁船吊架 boat crane/lift (CHUNK LANDMARK) ----------------------- */
  {
    id: 'boat_crane',
    displayName: '漁船吊架',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xf08020, 0xe07010, 0xff9030, 0xd06010, 0xffa040],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const orange = 0xffffff;
      const steel = 0x606068;
      const parts = [];
      // main vertical mast
      parts.push(box(0.4, 4.0, 0.4, orange, { x: -1.5, y: 2.0, hex2: 0xff9030 }));
      // mast base plate
      parts.push(box(0.8, 0.2, 0.8, steel, { x: -1.5, y: 0.1 }));
      // diagonal support struts
      parts.push(box(0.15, 2.5, 0.15, steel, { x: -0.8, y: 1.0, rz: 0.5 }));
      parts.push(box(0.15, 2.5, 0.15, steel, { x: -0.8, y: 1.0, z: 0.4, rz: 0.5 }));
      parts.push(box(0.15, 2.5, 0.15, steel, { x: -0.8, y: 1.0, z: -0.4, rz: 0.5 }));
      // horizontal boom arm
      parts.push(box(3.5, 0.3, 0.25, orange, { x: 0.2, y: 3.8, hex2: 0xe07010 }));
      // boom support cables
      parts.push(cyl(0.03, 0.03, 2.2, 4, 0x404040, { x: -0.5, y: 3.0, rz: 0.8 }));
      parts.push(cyl(0.03, 0.03, 2.2, 4, 0x404040, { x: 0.8, y: 3.0, rz: 0.6 }));
      // pulley at end of boom
      parts.push(cyl(0.15, 0.15, 0.1, 8, steel, { x: 1.9, y: 3.75, rx: HALF_PI }));
      // hook assembly
      parts.push(cyl(0.04, 0.04, 1.5, 4, 0x404040, { x: 1.9, y: 3.0 }));
      parts.push(cyl(0.12, 0.1, 0.2, 8, 0xffcc00, { x: 1.9, y: 2.3 }));
      parts.push(torus(0.15, 0.04, 5, 8, 0xffcc00, { x: 1.9, y: 2.1, arc: PI * 1.5 }));
      // operator cabin on mast
      parts.push(box(0.6, 0.5, 0.5, 0x404048, { x: -1.5, y: 2.8 }));
      parts.push(box(0.55, 0.35, 0.02, 0x80c0e0, { x: -1.5, y: 2.9, z: 0.26 }));
      // warning stripes on boom
      parts.push(box(0.2, 0.32, 0.27, 0x202020, { x: 1.0, y: 3.8 }));
      parts.push(box(0.2, 0.32, 0.27, 0x202020, { x: 1.5, y: 3.8 }));
      // counterweight
      parts.push(box(0.6, 0.5, 0.4, steel, { x: -2.0, y: 3.5 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
