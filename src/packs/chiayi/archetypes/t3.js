/**
 * @file packs/chiayi/archetypes/t3.js — Roll Formosa Chiayi pack, Tier 3
 * (中央噴水池 / central fountain roundabout). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色中央噴水池 藍紫起調 (dusk roundabout, blue-purple onset) — but each
 * object keeps its own true-to-life Chiayi street colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (噴水池圓環 / 城隍廟牌樓)
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

  /* 2 ── 圓環花圃 roundabout planter / traffic island planter ────────────── */
  {
    id: 'roundabout_planter',
    displayName: '圓環花圃',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x3a6838, 0x4a8848, 0xc8b090, 0x2a5828, 0x68a868],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // concrete curb ring
      parts.push(cyl(1.1, 1.15, 0.3, 10, 0xc8c0b0, { y: 0.15, open: true }));
      // soil mound
      parts.push(sph(1.0, 0x7a5a40, { ws: 8, hs: 4, y: 0.3, thetaLen: PI * 0.6 }));
      // shrubs / flowers (green clusters)
      const greens = [0x3a6838, 0x4a8848, 0x2a5828];
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * PI * 2;
        const r = 0.5 + (rng() - 0.5) * 0.2;
        parts.push(sph(0.35, greens[i % 3], {
          ws: 6, hs: 4, x: Math.sin(ang) * r, y: 0.55, z: Math.cos(ang) * r,
          hex2: 0x68a868,
        }));
      }
      // center flower cluster (colorful)
      parts.push(sph(0.25, 0xe85858, { ws: 5, hs: 3, y: 0.75 }));
      parts.push(sph(0.2, 0xf8d838, { ws: 5, hs: 3, x: 0.15, y: 0.7, z: 0.1 }));
      return finish(parts);
    },
  },

  /* 3 ── 鐵捲門 roll-up shutter (shopfront) ─────────────────────────────── */
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

  /* 4 ── 路燈柱 street lamppost (Chiayi city style) ────────────────────── */
  {
    id: 'lamppost',
    displayName: '路燈柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x4a5058, 0x5a6068, 0xffd860, 0x3a4048, 0xffe8a0],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      const parts = [];
      const post = 0x4a5058;
      // base plate
      parts.push(box(0.5, 0.12, 0.5, 0x3a4048, { y: 0.06 }));
      // main pole (tapered)
      parts.push(cyl(0.08, 0.12, 3.2, 6, post, { y: 1.7 }));
      // curved arm
      parts.push(cyl(0.05, 0.05, 0.8, 5, post, { x: 0.3, y: 3.2, rz: -0.5 }));
      // lamp head
      parts.push(sph(0.2, 0xffd860, { ws: 6, hs: 4, x: 0.6, y: 3.15 }));
      parts.push(cone(0.22, 0.15, 6, 0x5a6068, { x: 0.6, y: 3.3 }));
      // banner bracket
      parts.push(box(0.04, 0.6, 0.04, post, { x: 0.15, y: 2.2 }));
      parts.push(box(0.3, 0.45, 0.02, 0xc83828, { x: 0.3, y: 2.2 })); // red banner
      return finish(parts);
    },
  },

  /* 5 ── 諸羅樹蛙像 tree frog statue (Chiayi mascot) ───────────────────── */
  {
    id: 'tree_frog_statue',
    displayName: '諸羅樹蛙像',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x58a848, 0x78c868, 0x3a8830, 0xf0d858, 0x486838],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const green = 0x58a848;
      const parts = [];
      // stone plinth
      parts.push(box(0.8, 0.25, 0.6, 0xb8b0a0, { y: 0.12 }));
      // body (seated frog shape)
      parts.push(sph(0.5, green, { ws: 7, hs: 5, y: 0.6, sz: 0.8, hex2: 0x78c868 }));
      // head
      parts.push(sph(0.32, green, { ws: 6, hs: 4, y: 1.0, z: 0.15, hex2: 0x78c868 }));
      // big eyes (诸罗树蛙 characteristic)
      parts.push(sph(0.12, 0xf0d858, { ws: 5, hs: 3, x: -0.12, y: 1.15, z: 0.3 }));
      parts.push(sph(0.12, 0xf0d858, { ws: 5, hs: 3, x: 0.12, y: 1.15, z: 0.3 }));
      parts.push(sph(0.05, 0x202020, { ws: 4, hs: 2, x: -0.12, y: 1.15, z: 0.38 })); // pupil
      parts.push(sph(0.05, 0x202020, { ws: 4, hs: 2, x: 0.12, y: 1.15, z: 0.38 })); // pupil
      // front legs
      parts.push(cyl(0.08, 0.1, 0.35, 5, green, { x: -0.25, y: 0.35, z: 0.25, rx: 0.3 }));
      parts.push(cyl(0.08, 0.1, 0.35, 5, green, { x: 0.25, y: 0.35, z: 0.25, rx: 0.3 }));
      // back legs (folded)
      parts.push(sph(0.18, green, { ws: 5, hs: 3, x: -0.35, y: 0.45, z: -0.1, hex2: 0x3a8830 }));
      parts.push(sph(0.18, green, { ws: 5, hs: 3, x: 0.35, y: 0.45, z: -0.1, hex2: 0x3a8830 }));
      return finish(parts);
    },
  },

  /* 6 ── 榕樹 banyan tree (giant with aerial roots) ────────────────────── */
  {
    id: 'banyan_tree',
    displayName: '榕樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a3d28, 0x2f6b39, 0x3f8a47, 0x7a5a3a, 0x245029],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      const bark = 0x5a3d28;
      // massive trunk with buttress
      parts.push(cyl(0.3, 0.45, 1.2, 8, bark, { y: 0.6, hex2: 0x7a5a3a }));
      // buttress roots spreading out
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * PI * 2;
        parts.push(cyl(0.08, 0.15, 0.5, 5, bark, {
          x: Math.sin(ang) * 0.35, y: 0.25, z: Math.cos(ang) * 0.35,
          rx: -Math.cos(ang) * 0.4, rz: Math.sin(ang) * 0.4,
        }));
      }
      // aerial roots hanging down
      for (let i = 0; i < 4; i++) {
        const rx = (rng() - 0.5) * 0.8;
        const rz = (rng() - 0.5) * 0.8;
        parts.push(cyl(0.03, 0.04, 0.7, 4, 0x7a5a3a, { x: rx, y: 1.3, z: rz }));
      }
      // broad canopy
      const greens = [0x2f6b39, 0x3f8a47, 0x245029];
      parts.push(sph(1.1, greens[0], { ws: 7, hs: 5, y: 2.0, sx: 1.3, sy: 0.7, sz: 1.3, hex2: 0x3f8a47 }));
      parts.push(sph(0.7, greens[1], { ws: 6, hs: 4, x: 0.6, y: 1.8, z: 0.4, hex2: 0x2f6b39 }));
      parts.push(sph(0.65, greens[2], { ws: 6, hs: 4, x: -0.5, y: 1.9, z: -0.3, hex2: 0x3f8a47 }));
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

  /* 8 ── 中央噴水池 fountain roundabout (CHUNK LANDMARK) ─────────────────── */
  {
    id: 'fountain_roundabout',
    displayName: '中央噴水池',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc8d8e8, 0x3080c0, 0xb8b0a0, 0xe8e0d0, 0x58a0d8, 0x68b8f0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      const stone = 0xb8b0a0;
      const water = 0x58a0d8;
      // outer circular basin (traffic island) - reduced segs 12→8
      parts.push(cyl(2.2, 2.4, 0.4, 8, stone, { y: 0.2, open: true, hex2: 0xc8c0b0 }));
      // inner ring raised edge - reduced segs 12→8
      parts.push(cyl(1.8, 2.0, 0.5, 8, stone, { y: 0.25, open: true }));
      // water surface - reduced segs 12→8
      parts.push(cyl(1.75, 1.75, 0.08, 8, water, { y: 0.35, hex2: 0x68b8f0 }));
      // central pedestal - reduced segs 8→6
      parts.push(cyl(0.5, 0.6, 0.8, 6, stone, { y: 0.7, hex2: 0xe8e0d0 }));
      parts.push(cyl(0.35, 0.5, 0.25, 6, stone, { y: 1.15 }));
      // fountain jet centerpiece
      parts.push(cyl(0.15, 0.2, 0.6, 5, 0x707880, { y: 1.55 }));
      // water sprays (cone shapes for spray effect)
      parts.push(cone(0.08, 0.4, 4, 0xc8d8e8, { y: 2.0, hex2: 0xe0f0ff }));
      parts.push(cone(0.25, 0.3, 5, 0xa0d0f0, { y: 1.85, hex2: 0xc8e8ff }));
      // falling water droplets - reduced from 6 to 4
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * PI * 2;
        const r = 0.6 + (rng() - 0.5) * 0.2;
        parts.push(sph(0.08, 0xc8e0f8, { ws: 3, hs: 2, x: Math.sin(ang) * r, y: 1.4 + (rng() * 0.3), z: Math.cos(ang) * r }));
      }
      // decorative lamp posts around edge
      for (const lx of [-1.5, 1.5]) {
        parts.push(cyl(0.06, 0.06, 1.2, 4, 0x505860, { x: lx, y: 0.8, z: 0 }));
        parts.push(sph(0.12, 0xffd860, { ws: 4, hs: 2, x: lx, y: 1.45, z: 0 }));
      }
      return finish(parts);
    },
  },

  /* 9 ── 城隍廟牌樓 Chenghuang Temple pailou gateway (CHUNK LANDMARK) ────── */
  {
    id: 'chenghuang_pailou',
    displayName: '城隍廟牌樓',
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
      // stone plinth feet (嘉義城隍廟 style)
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2, hex2: 0x6e6a5e }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2, hex2: 0x6e6a5e }));
      // two red columns
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: -1.8, y: 2.1 }));
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: 1.8, y: 2.1 }));
      // gold cross beams (architrave)
      parts.push(box(4.4, 0.32, 0.45, gold, { x: 0, y: 3.7 }));
      parts.push(box(4.0, 0.22, 0.4, red, { x: 0, y: 3.35 }));
      // central plaque with 城隍廟 characters
      parts.push(box(1.3, 0.8, 0.16, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(1.1, 0.6, 0.2, gold, { x: 0, y: 3.7 }));
      // tiled hip roof — green pitched slabs (嘉義城隍廟 style green tiles)
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // dragon finials (simplified)
      parts.push(sph(0.15, gold, { x: -2.3, y: 4.6, ws: 5, hs: 3 }));
      parts.push(sph(0.15, gold, { x: 2.3, y: 4.6, ws: 5, hs: 3 }));
      // smaller secondary roof above
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 7, hs: 5 })); // finial bead
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
