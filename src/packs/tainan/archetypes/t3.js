/**
 * @file packs/taipei/archetypes/t3.js — Roll Formosa Taipei pack, Tier 3
 * (機車海 / scooter-sea street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色機車海 藍紫起調 (dusk street, blue-purple onset) — but each
 * object keeps its own true-to-life Taipei street colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (夜市拱門 / 廟前牌樓)
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

  /* 2 ── 變電箱 transformer / pad-mount box ────────────────────────────── */
  {
    id: 'transformer_box',
    displayName: '變電箱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x4f7d52, 0x3a5e3c, 0xd8d2a8, 0x2a2c30, 0xb0a060],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const green = 0x4f7d52;
      const parts = [];
      // concrete plinth
      parts.push(box(1.05, 0.18, 0.85, 0x8c8a82, { x: 0, y: 0.09 }));
      // main cabinet body (gradient to a darker top)
      parts.push(box(0.95, 1.5, 0.75, green, { x: 0, y: 0.95, hex2: 0x3a5e3c }));
      // louver vents (front strips)
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.7, 0.06, 0.02, 0x2a2c30, { x: 0, y: 0.55 + i * 0.22, z: 0.385 }));
      }
      // hazard plate
      parts.push(box(0.3, 0.3, 0.02, 0xd8d2a8, { x: 0.28, y: 1.05, z: 0.39 }));
      // lid / roof lip
      parts.push(box(1.02, 0.1, 0.82, 0x3a5e3c, { x: 0, y: 1.74 }));
      // bushing knobs on roof
      parts.push(cyl(0.07, 0.09, 0.18, 8, 0xb0a060, { x: -0.25, y: 1.86 }));
      parts.push(cyl(0.07, 0.09, 0.18, 8, 0xb0a060, { x: 0.25, y: 1.86 }));
      return finish(parts);
    },
  },

  /* 3 ── 海安路彩繪牆 free-standing street-art mural wall ──────────────── */
  {
    id: 'haian_mural',
    displayName: '海安路彩繪牆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xb8b0a2, 0xff5c5c, 0x32a0d8, 0xffcf3a, 0x4fb86a, 0x9a5cc4],
    yOffset: -0.2044,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const concrete = 0xb8b0a2;
      const frame = 0x8c857a;
      const colors = [0xff5c5c, 0x32a0d8, 0xffcf3a, 0x4fb86a, 0x9a5cc4];
      const parts = [];
      // rough concrete wall panel (tall rectangle)
      parts.push(box(0.18, 2.6, 1.9, concrete, { x: 0, y: 1.3, hex2: 0xa39b8e }));
      // concrete frame edges
      parts.push(box(0.24, 2.7, 0.14, frame, { x: 0, y: 1.3, z: 0.95 }));
      parts.push(box(0.24, 2.7, 0.14, frame, { x: 0, y: 1.3, z: -0.95 }));
      parts.push(box(0.24, 0.16, 1.9, frame, { x: 0, y: 2.55 }));
      parts.push(box(0.24, 0.16, 1.9, frame, { x: 0, y: 0.08 }));
      // colorful blocky mural patches on the wall face
      const patches = [
        [2.1, 0.5, 0.7, 0.7],
        [1.6, -0.45, 0.55, 0.6],
        [1.1, 0.35, 0.5, 0.45],
        [0.7, -0.3, 0.45, 0.5],
        [1.85, -0.15, 0.4, 0.4],
        [0.35, 0.3, 0.4, 0.45],
      ];
      for (let i = 0; i < patches.length; i++) {
        const [py, pz, ph, pd] = patches[i];
        parts.push(box(0.05, ph, pd, colors[i % colors.length], { x: 0.11, y: py, z: pz }));
      }
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

  /* 5 ── 路樹 street tree (trimmed boulevard tree) ─────────────────────── */
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

  /* 8 ── 神農街牌坊 Shennong St paifang gateway (CHUNK LANDMARK) ───────── */
  {
    id: 'shennong_arch',
    displayName: '神農街牌坊',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0xd8d3c5, 0x6e6a5e, 0x2a2c34],
    yOffset: -0.3207,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const stone = 0xd8d3c5;
      const parts = [];
      // four upright posts (two pairs, fore & aft)
      const posts = [[-1.9, 0.4], [1.9, 0.4], [-1.9, -0.4], [1.9, -0.4]];
      for (const [px, pz] of posts) {
        parts.push(cyl(0.2, 0.24, 3.2, 8, red, { x: px, y: 1.9, z: pz }));
        // stone plinth foot
        parts.push(box(0.6, 0.4, 0.6, stone, { x: px, y: 0.2, z: pz, hex2: 0x6e6a5e }));
      }
      // horizontal cross beams joining the posts
      parts.push(box(4.4, 0.3, 0.4, gold, { x: 0, y: 3.5 }));
      parts.push(box(4.0, 0.2, 0.34, red, { x: 0, y: 3.16 }));
      // central plaque board
      parts.push(box(1.1, 0.6, 0.16, 0x2a2c34, { x: 0, y: 3.5, z: 0.42 }));
      parts.push(box(0.9, 0.44, 0.04, gold, { x: 0, y: 3.5, z: 0.51 }));
      // small tiled roof crown on top (two pitched slabs)
      parts.push(box(4.6, 0.16, 0.8, green, { x: 0, y: 3.86, z: 0.36, rx: -0.34 }));
      parts.push(box(4.6, 0.16, 0.8, green, { x: 0, y: 3.86, z: -0.36, rx: 0.34 }));
      // ridge with swallowtail eave tips
      parts.push(box(4.6, 0.14, 0.16, gold, { x: 0, y: 4.12 }));
      parts.push(cone(0.16, 0.44, 6, gold, { x: -2.3, y: 4.26, rz: 0.5 }));
      parts.push(cone(0.16, 0.44, 6, gold, { x: 2.3, y: 4.26, rz: -0.5 }));
      return finish(parts);
    },
  },

  /* 9 ── 劍獅柱 sword-lion pillar (CHUNK LANDMARK) ─────────────────────── */
  {
    id: 'sword_lion_pillar',
    displayName: '劍獅柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc6bfae, 0x9c9686, 0xd8d3c5, 0xb01f2e, 0x6e6a5e, 0xe8b53a],
    yOffset: -0.054,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const stone = 0xc6bfae;
      const stone2 = 0xd8d3c5;
      const dark = 0x6e6a5e;
      const parts = [];
      // stone plinth base
      parts.push(box(1.0, 0.5, 1.0, 0x9c9686, { x: 0, y: 0.25, hex2: dark }));
      // tapered stone column
      parts.push(cyl(0.42, 0.55, 2.6, 8, stone, { x: 0, y: 1.8, hex2: stone2 }));
      // capital ring under the medallion
      parts.push(cyl(0.6, 0.5, 0.24, 8, stone2, { x: 0, y: 3.2 }));
      // round sword-lion medallion (disc facing forward)
      parts.push(cyl(0.7, 0.7, 0.22, 8, stone2, { x: 0, y: 3.7, z: 0.12, rx: HALF_PI }));
      // fierce little lion face on the medallion
      parts.push(sph(0.5, stone, { x: 0, y: 3.7, z: 0.24, ws: 7, hs: 4 }));
      // mane bumps around the face
      parts.push(sph(0.2, dark, { x: -0.4, y: 4.0, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: 0.4, y: 4.0, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: -0.4, y: 3.4, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: 0.4, y: 3.4, z: 0.15, ws: 5, hs: 3 }));
      // eyes
      parts.push(sph(0.1, 0x2a2c34, { x: -0.16, y: 3.82, z: 0.6, ws: 4, hs: 3 }));
      parts.push(sph(0.1, 0x2a2c34, { x: 0.16, y: 3.82, z: 0.6, ws: 4, hs: 3 }));
      // sword the lion bites (crossing the mouth, diagonal)
      parts.push(box(1.3, 0.1, 0.1, 0xb8c0c8, { x: 0, y: 3.5, z: 0.55, rz: 0.5 }));
      parts.push(box(0.34, 0.18, 0.12, 0xe8b53a, { x: -0.5, y: 3.22, z: 0.55, rz: 0.5 })); // hilt guard
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
