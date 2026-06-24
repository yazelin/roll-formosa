/**
 * @file packs/yilan/archetypes/t3.js — Roll Formosa Yilan pack, Tier 3
 * (蘭陽平原). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色蘭陽平原 藍紫起調 (dusk plain, blue-purple onset) — but each
 * object keeps its own true-to-life Yilan countryside colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (傳藝牌樓 / 田間水車)
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

  /* 2 ── 稻草捆 rice bale — cylindrical straw bale in Yilan rice paddies ── */
  {
    id: 'rice_bale',
    displayName: '稻草捆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc8a860, 0xb89850, 0xd8b870, 0xa08040, 0xe8c880],
    yOffset: -0.28,
    upright: false,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const straw = 0xffffff; // tinted golden straw
      const parts = [];
      // main cylindrical bale body (lying on side)
      parts.push(cyl(0.8, 0.8, 1.4, 10, straw, { rx: HALF_PI, y: 0.8, hex2: 0xd8b870 }));
      // straw texture - darker strands visible
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * PI * 2;
        parts.push(box(0.02, 0.02, 1.3, 0xa08040, {
          x: Math.cos(angle) * 0.75,
          y: 0.8 + Math.sin(angle) * 0.75,
          z: 0,
        }));
      }
      // binding twine bands
      parts.push(cyl(0.82, 0.82, 0.06, 10, 0x6a5a3a, { rx: HALF_PI, y: 0.8, z: 0.35 }));
      parts.push(cyl(0.82, 0.82, 0.06, 10, 0x6a5a3a, { rx: HALF_PI, y: 0.8, z: -0.35 }));
      // loose straw wisps sticking out
      parts.push(box(0.15, 0.04, 0.3, 0xe8c880, { y: 0.85, z: 0.75, rx: 0.2 }));
      parts.push(box(0.12, 0.04, 0.25, 0xe8c880, { y: 0.75, z: -0.72, rx: -0.15 }));
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
      // neon tube border (torus arc rings as glow strokes) — top & bottom bars
      parts.push(box(0.06, 0.1, 1.16, glow, { x: 0.18, y: 1.66 }));
      parts.push(box(0.06, 0.1, 1.16, glow2, { x: 0.18, y: 0.34 }));
      parts.push(box(0.06, 1.36, 0.1, glow, { x: 0.18, y: 1.0, z: 0.6 }));
      parts.push(box(0.06, 1.36, 0.1, glow2, { x: 0.18, y: 1.0, z: -0.6 }));
      // neon glyph rings (two circular characters suggestion)
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

  /* 5 ── 田間棕櫚 field palm — tall betel nut palm common in Yilan fields ── */
  {
    id: 'field_palm',
    displayName: '田間棕櫚',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a5a38, 0x3a6a3a, 0x4a8a4a, 0x2a4a2a, 0x8a7a58],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // tall slender trunk with ring texture
      parts.push(cyl(0.14, 0.18, 3.5, 5, 0x8a7a58, { y: 1.75, hex2: 0x6a5a38 }));
      // ring marks on trunk (fewer rings)
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.19, 0.19, 0.04, 5, 0x5a4a28, { y: 0.5 + i * 0.8 }));
      }
      // crown shaft (green collar below fronds)
      parts.push(cyl(0.16, 0.22, 0.5, 5, 0x4a8a4a, { y: 3.6 }));
      // palm fronds (fewer leaves)
      const frondAngles = [0, 1.2, 2.4, 3.6, 4.8];
      for (const angle of frondAngles) {
        const fx = Math.cos(angle) * 0.8;
        const fz = Math.sin(angle) * 0.8;
        const tilt = 0.6 + (rng ? rng() * 0.3 : 0.15);
        parts.push(box(0.08, 1.2, 0.5, 0x3a6a3a, {
          x: fx, y: 4.2, z: fz,
          rx: tilt * Math.sin(angle),
          rz: -tilt * Math.cos(angle),
        }));
      }
      // center tuft
      parts.push(cone(0.25, 0.6, 4, 0x2a4a2a, { y: 4.4 }));
      return finish(parts);
    },
  },

  /* 6 ── 棚架 awning frame (street-stall canopy frame + tarp) ──────────── */
  {
    id: 'awning_frame',
    displayName: '棚架',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x9aa0ac, 0xc4203a, 0xe8e8ee, 0x2f6db0, 0x6d7079],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.66,
    buildGeometry(rng) {
      const tarp = rng() < 0.5 ? 0xc4203a : 0x2f6db0; // red or blue striped tarp
      const parts = [];
      const post = 0x9aa0ac;
      // 4 corner posts
      const legs = [[-1.1, 1.1], [1.1, 1.1], [-1.1, -1.1], [1.1, -1.1]];
      for (const [lx, lz] of legs) {
        parts.push(cyl(0.06, 0.06, 2.0, 6, post, { x: lx, y: 1.0, z: lz }));
      }
      // top frame rails
      parts.push(box(2.32, 0.08, 0.08, 0x6d7079, { x: 0, y: 2.0, z: 1.1 }));
      parts.push(box(2.32, 0.08, 0.08, 0x6d7079, { x: 0, y: 2.0, z: -1.1 }));
      parts.push(box(0.08, 0.08, 2.32, 0x6d7079, { x: -1.1, y: 2.0 }));
      parts.push(box(0.08, 0.08, 2.32, 0x6d7079, { x: 1.1, y: 2.0 }));
      // pitched tarp roof — two slabs meeting at a low ridge
      parts.push(box(2.5, 0.05, 1.35, tarp, { x: 0, y: 2.22, z: 0.62, rx: -0.28 }));
      parts.push(box(2.5, 0.05, 1.35, 0xe8e8ee, { x: 0, y: 2.22, z: -0.62, rx: 0.28 }));
      // ridge cap
      parts.push(box(2.5, 0.06, 0.1, tarp, { x: 0, y: 2.42 }));
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

  /* 8 ── 傳藝牌樓 Chuanyi Center pailou (CHUNK LANDMARK) ─────────────────── */
  {
    id: 'chuanyi_pailou',
    displayName: '傳藝牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0xd8d3c5, 0x8a6a3a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const parts = [];
      // stone plinth feet
      parts.push(box(0.6, 0.35, 0.6, 0xd8d3c5, { x: -1.9, y: 0.18 }));
      parts.push(box(0.6, 0.35, 0.6, 0xd8d3c5, { x: 1.9, y: 0.18 }));
      // red columns
      parts.push(cyl(0.20, 0.24, 3.2, 8, red, { x: -1.9, y: 1.95 }));
      parts.push(cyl(0.20, 0.24, 3.2, 8, red, { x: 1.9, y: 1.95 }));
      // gold architrave beam
      parts.push(box(4.2, 0.35, 0.42, gold, { y: 3.55 }));
      // central plaque with "傳藝中心" feel
      parts.push(box(1.4, 0.8, 0.12, 0x2a2a2a, { y: 3.55 }));
      parts.push(box(1.2, 0.6, 0.14, gold, { y: 3.55 }));
      // traditional tiled roof (green glazed tiles)
      parts.push(box(4.8, 0.15, 0.9, green, { y: 3.9, z: 0.35, rx: -0.32 }));
      parts.push(box(4.8, 0.15, 0.9, green, { y: 3.9, z: -0.35, rx: 0.32 }));
      // roof ridge with finial
      parts.push(box(4.8, 0.12, 0.14, gold, { y: 4.18 }));
      // swallowtail tips (燕尾)
      parts.push(cone(0.15, 0.45, 6, gold, { x: -2.4, y: 4.35, rz: 0.5 }));
      parts.push(cone(0.15, 0.45, 6, gold, { x: 2.4, y: 4.35, rz: -0.5 }));
      // hanging lanterns
      parts.push(sph(0.16, red, { x: -0.8, y: 3.0, ws: 6, hs: 4 }));
      parts.push(sph(0.16, red, { x: 0.8, y: 3.0, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 9 ── 田間水車 waterwheel in rice paddies (CHUNK LANDMARK) ────────────── */
  {
    id: 'waterwheel',
    displayName: '田間水車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x6a5a38, 0x8a7a58, 0x4a3a28, 0xc8b890, 0x5a4a32],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const darkWood = 0x4a3a28;
      const parts = [];
      // support frame A-frame posts
      parts.push(cyl(0.12, 0.14, 2.8, 4, darkWood, { x: -1.0, y: 1.4, rz: 0.15 }));
      parts.push(cyl(0.12, 0.14, 2.8, 4, darkWood, { x: 1.0, y: 1.4, rz: -0.15 }));
      // cross beam holding axle
      parts.push(box(2.2, 0.18, 0.18, darkWood, { y: 2.5 }));
      // main wheel (large circle with paddles)
      parts.push(cyl(1.8, 1.8, 0.12, 8, wood, { rz: HALF_PI, y: 1.6, hex2: 0xc8b890 }));
      // hub
      parts.push(cyl(0.25, 0.25, 0.25, 5, darkWood, { rz: HALF_PI, y: 1.6 }));
      // spokes (fewer)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * PI * 2;
        parts.push(box(0.08, 1.5, 0.08, darkWood, {
          y: 1.6,
          ry: angle,
          rz: HALF_PI,
        }));
      }
      // water paddles around rim (fewer)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * PI * 2;
        const py = 1.6 + Math.sin(angle) * 1.7;
        parts.push(box(0.5, 0.25, 0.08, 0x8a7a58, {
          x: 0, y: py,
          ry: angle,
        }));
      }
      // water trough below
      parts.push(box(3.0, 0.15, 0.5, darkWood, { y: 0.08, z: 0.8 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
