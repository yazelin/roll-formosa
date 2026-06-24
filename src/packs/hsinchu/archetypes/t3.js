/**
 * @file packs/hsinchu/archetypes/t3.js — Roll Formosa Hsinchu pack, Tier 3
 * (東門街巷 / East Gate alley streets). 10 ArchetypeDefs in the FROZEN
 * slot order declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色東門城街巷藍紫起調 (dusk East Gate alley, blue-purple onset)
 * — but each object keeps its own true-to-life 新竹/風城 colors so it stays
 * legible: 機車陣、變電箱、風城旗幟、東門城牌樓、古井.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (東門城牌樓 / 古井)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/* yOffset note: finish() recenters on the bounding-sphere center then scales to
 * a unit sphere, so the ground-rest convention is yOffset = -1 - minY_normalized
 * (object sits on the ground plane y=0). Values below were computed from each
 * finished build's bounding-box min.y. */

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

  /* 3 ── 米粉束 mifun_bundle — Hsinchu rice noodle bundle drying ─────────── */
  {
    id: 'mifun_bundle',
    displayName: '米粉束',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf4e8d0, 0xf0dcc0, 0xe8d4b8, 0xfff8f0, 0xd8c8a8],
    yOffset: -0.30,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      // Hsinchu's famous rice noodles (米粉) bundled and drying
      // The city is known for drying rice noodles in the famous Hsinchu wind
      const parts = [];
      // wooden drying rack frame
      parts.push(cyl(0.08, 0.1, 2.2, 5, 0x7a5a3a, { x: -0.8, y: 1.1 })); // left post
      parts.push(cyl(0.08, 0.1, 2.2, 5, 0x7a5a3a, { x: 0.8, y: 1.1 })); // right post
      parts.push(cyl(0.06, 0.06, 1.8, 5, 0x8a6a4a, { y: 2.1, rz: HALF_PI })); // crossbar top
      parts.push(cyl(0.06, 0.06, 1.8, 5, 0x8a6a4a, { y: 0.5, rz: HALF_PI })); // crossbar bottom
      // rice noodle bundles hanging (draped white noodle threads)
      const bundleX = [-0.5, 0.0, 0.5];
      for (const bx of bundleX) {
        // each bundle is a cylinder with white cream color
        parts.push(cyl(0.22, 0.18, 1.4, 6, 0xffffff, { x: bx, y: 1.3 })); // noodle bundle
        // highlight strands
        parts.push(box(0.04, 1.3, 0.1, 0xf4e8d0, { x: bx - 0.08, y: 1.3, z: 0.12 }));
        parts.push(box(0.04, 1.3, 0.1, 0xf0dcc0, { x: bx + 0.08, y: 1.3, z: -0.1 }));
      }
      // ground base / platform
      parts.push(box(2.0, 0.12, 0.8, 0x8c8a82, { y: 0.06 }));
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
    yOffset: -0.30,
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

  /* 6 ── 風城旗幟 wind banner (Hsinchu wind city theme) ────────────────── */
  {
    id: 'wind_banner',
    displayName: '風城旗幟',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xc4203a, 0xe8e8ee, 0xffd04a, 0x6d7079],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const flag = rng() < 0.5 ? 0x2f6db0 : 0xc4203a; // blue or red banner
      const flag2 = rng() < 0.5 ? 0xffd04a : 0xe8e8ee; // gold or white accent
      const parts = [];
      // tall pole
      parts.push(cyl(0.08, 0.12, 3.6, 6, 0x6d7079, { x: 0, y: 1.8 }));
      // pole base / foot
      parts.push(cyl(0.22, 0.28, 0.3, 8, 0x4a4e58, { x: 0, y: 0.15 }));
      // finial ball on top
      parts.push(sph(0.14, 0xffd04a, { x: 0, y: 3.68, ws: 6, hs: 4 }));
      // banner body (curved in the wind — tilted box with ripple)
      parts.push(box(0.06, 1.8, 0.9, flag, { x: 0.5, y: 2.8, rz: 0.15, hex2: flag2 }));
      // secondary ripple layer for wind effect
      parts.push(box(0.04, 1.6, 0.7, flag2, { x: 0.7, y: 2.7, rz: 0.25 }));
      // crossbar at top
      parts.push(cyl(0.04, 0.04, 1.0, 5, 0x6d7079, { x: 0.5, y: 3.55, rz: HALF_PI }));
      // wind city text suggestion (decorative horizontal bars on banner)
      parts.push(box(0.08, 0.12, 0.6, 0xe8e8ee, { x: 0.52, y: 3.1, rz: 0.15 }));
      parts.push(box(0.08, 0.12, 0.5, 0xe8e8ee, { x: 0.52, y: 2.7, rz: 0.15 }));
      parts.push(box(0.08, 0.12, 0.4, 0xe8e8ee, { x: 0.52, y: 2.3, rz: 0.15 }));
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

  /* 8 ── 東門城牌樓 dongmen pailou (East Gate style pailou, CHUNK LANDMARK) */
  {
    id: 'dongmen_pailou',
    displayName: '東門城牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb9b3a4, 0x9c9686, 0xb01f2e, 0xe8b53a, 0x1f5c3a],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const stone = 0xb9b3a4;
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const parts = [];
      // stone plinth base (East Gate style)
      parts.push(box(4.0, 0.5, 1.8, stone, { x: 0, y: 0.25, hex2: 0x9c9686 }));
      // two main stone pillars
      parts.push(box(0.5, 3.0, 0.5, stone, { x: -1.5, y: 1.95, hex2: 0xd8d3c5 }));
      parts.push(box(0.5, 3.0, 0.5, stone, { x: 1.5, y: 1.95, hex2: 0xd8d3c5 }));
      // cross beam (architrave)
      parts.push(box(4.2, 0.4, 0.6, stone, { x: 0, y: 3.6, hex2: 0x9c9686 }));
      // central plaque with red background
      parts.push(box(1.4, 0.6, 0.12, red, { x: 0, y: 3.6 }));
      parts.push(box(1.2, 0.4, 0.14, gold, { x: 0, y: 3.6 })); // gold text plate
      // tiled hip roof — green glazed tiles (traditional city gate style)
      parts.push(box(4.6, 0.2, 1.2, green, { x: 0, y: 4.0, z: 0.3, rx: -0.3 }));
      parts.push(box(4.6, 0.2, 1.2, green, { x: 0, y: 4.0, z: -0.3, rx: 0.3 }));
      // ridge
      parts.push(box(4.6, 0.16, 0.2, gold, { x: 0, y: 4.3 }));
      // upswept eave tips
      parts.push(cone(0.2, 0.5, 5, gold, { x: -2.3, y: 4.4, rz: 0.5 }));
      parts.push(cone(0.2, 0.5, 5, gold, { x: 2.3, y: 4.4, rz: -0.5 }));
      // gate archway suggestion (dark recess)
      parts.push(box(2.4, 2.2, 0.3, 0x2a2c34, { x: 0, y: 1.6 }));
      // decorative lion guardians at base (small)
      parts.push(sph(0.22, 0x9c9686, { x: -1.8, y: 0.7, z: 0.7, ws: 5, hs: 3 }));
      parts.push(sph(0.22, 0x9c9686, { x: 1.8, y: 0.7, z: 0.7, ws: 5, hs: 3 }));
      return finish(parts);
    },
  },

  /* 9 ── 古井 ancient well (traditional stone well, CHUNK LANDMARK) ────── */
  {
    id: 'ancient_well',
    displayName: '古井',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb9b3a4, 0x9c9686, 0x6e6a5e, 0x5a5e48, 0x7a5a3a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const stone = 0xb9b3a4;
      const stone2 = 0x9c9686;
      const moss = 0x5a5e48;
      const parts = [];
      // ground paving around well (reduced segments for tri cap)
      parts.push(cyl(1.4, 1.5, 0.2, 8, 0x8c8a82, { x: 0, y: 0.1, hex2: 0x6e6a5e }));
      // circular stone well wall
      parts.push(cyl(0.9, 1.0, 0.9, 8, stone, { x: 0, y: 0.65, hex2: stone2, open: true }));
      // inner ring (dark water suggestion)
      parts.push(cyl(0.75, 0.75, 0.2, 8, 0x2a3038, { x: 0, y: 0.3 }));
      // well rim / lip
      parts.push(torus(0.95, 0.12, 5, 8, stone2, { x: 0, y: 1.12 }));
      // stone cap / cover posts (traditional well frame)
      parts.push(cyl(0.12, 0.14, 1.6, 5, stone, { x: -0.7, y: 1.9 }));
      parts.push(cyl(0.12, 0.14, 1.6, 5, stone, { x: 0.7, y: 1.9 }));
      // crossbeam for bucket rope
      parts.push(cyl(0.08, 0.08, 1.6, 5, 0x7a5a3a, { x: 0, y: 2.65, rz: HALF_PI }));
      // small roof over the well
      parts.push(box(1.8, 0.14, 1.0, 0x6a4a32, { x: 0, y: 2.85, z: 0.35, rx: -0.35 }));
      parts.push(box(1.8, 0.14, 1.0, 0x6a4a32, { x: 0, y: 2.85, z: -0.35, rx: 0.35 }));
      // moss patches on stones
      parts.push(sph(0.18, moss, { x: 0.6, y: 0.8, z: 0.7, ws: 4, hs: 3 }));
      parts.push(sph(0.15, moss, { x: -0.5, y: 0.9, z: -0.6, ws: 4, hs: 3 }));
      // bucket (hanging)
      parts.push(cyl(0.14, 0.18, 0.3, 5, 0x7a5a3a, { x: 0, y: 2.2 }));
      // rope
      parts.push(cyl(0.02, 0.02, 0.5, 4, 0xb0a878, { x: 0, y: 2.4 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
