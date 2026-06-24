/**
 * @file packs/nantou/archetypes/t3.js — Roll Formosa Nantou pack, Tier 3
 * (茶園梯田 / tea terrace hills). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色茶園 藍紫起調 (dusk tea hills, blue-purple onset) — but each
 * object keeps its own true-to-life Nantou tea country colors so it stays legible.
 *
 * Slots [0..7] absorbable tea country objects; slots [8..9] (製茶工廠 / 凍頂牌樓)
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

  /* 1 ── 小貨車 mini truck ───────────────────────────────────────────── */
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

  /* 2 ── 茶樹叢 tea bush cluster ────────────────────────────────────── */
  {
    id: 'tea_bush_cluster',
    displayName: '茶樹叢',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a6a3a, 0x4a8a4a, 0x2a5a2a, 0x5aa05a, 0x1a4a1a],
    yOffset: -0.22,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [];
      // main canopy (clustered low spheres for tea bush row)
      const greens = [0x3a6a3a, 0x4a8a4a, 0x2a5a2a, 0x5aa05a];
      const blobs = [
        [-0.6, 0.6, 0, 0.6],
        [0, 0.65, 0.1, 0.7],
        [0.6, 0.58, -0.1, 0.55],
        [-0.3, 0.72, 0.4, 0.45],
        [0.35, 0.7, -0.35, 0.48],
      ];
      for (let i = 0; i < blobs.length; i++) {
        const [bx, by, bz, br] = blobs[i];
        const c = greens[i % greens.length];
        parts.push(sph(br, c, { x: bx, y: by, z: bz, ws: 7, hs: 5, sy: 0.7, hex2: 0x5aa05a }));
      }
      // soil/mulch base
      parts.push(box(2.0, 0.15, 1.0, 0x5a4030, { y: 0.08 }));
      return finish(parts);
    },
  },

  /* 3 ── 鐵捲門 roll shutter ───────────────────────────────────────── */
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

  /* 4 ── 採茶棚 tea picking shed ───────────────────────────────────── */
  {
    id: 'tea_picking_shed',
    displayName: '採茶棚',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0x6a4a30, 0x9aa0ac, 0x3a6a3a, 0xd8d0c0],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.66,
    buildGeometry(rng) {
      const parts = [];
      const post = 0x8a6a4a;
      // 4 corner posts (wooden)
      const legs = [[-1.1, 1.1], [1.1, 1.1], [-1.1, -1.1], [1.1, -1.1]];
      for (const [lx, lz] of legs) {
        parts.push(cyl(0.08, 0.08, 2.0, 6, post, { x: lx, y: 1.0, z: lz }));
      }
      // top frame rails
      parts.push(box(2.32, 0.08, 0.08, 0x6a4a30, { x: 0, y: 2.0, z: 1.1 }));
      parts.push(box(2.32, 0.08, 0.08, 0x6a4a30, { x: 0, y: 2.0, z: -1.1 }));
      parts.push(box(0.08, 0.08, 2.32, 0x6a4a30, { x: -1.1, y: 2.0 }));
      parts.push(box(0.08, 0.08, 2.32, 0x6a4a30, { x: 1.1, y: 2.0 }));
      // corrugated metal roof (two slabs meeting at ridge)
      parts.push(box(2.5, 0.06, 1.35, 0x9aa0ac, { x: 0, y: 2.22, z: 0.62, rx: -0.28 }));
      parts.push(box(2.5, 0.06, 1.35, 0x9aa0ac, { x: 0, y: 2.22, z: -0.62, rx: 0.28 }));
      // ridge cap
      parts.push(box(2.5, 0.06, 0.1, 0x6a4a30, { x: 0, y: 2.42 }));
      // tea basket on floor
      parts.push(cyl(0.35, 0.4, 0.3, 8, 0xb09060, { x: 0.4, y: 0.15 }));
      return finish(parts);
    },
  },

  /* 5 ── 茶園石階 tea terrace steps ────────────────────────────────── */
  {
    id: 'tea_terrace_steps',
    displayName: '茶園石階',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a8a7a, 0x6a6a5a, 0xa0a090, 0x5a5a4a, 0x3a6a3a],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // stacked stone steps
      for (let i = 0; i < 5; i++) {
        const w = 2.0 - i * 0.15;
        const shade = i % 2 === 0 ? 0x8a8a7a : 0x6a6a5a;
        parts.push(box(w, 0.25, 0.8, shade, { y: 0.125 + i * 0.28, z: -i * 0.3 }));
      }
      // side retaining walls
      parts.push(box(0.15, 1.5, 2.0, 0x5a5a4a, { x: -1.1, y: 0.75, z: -0.5 }));
      parts.push(box(0.15, 1.5, 2.0, 0x5a5a4a, { x: 1.1, y: 0.75, z: -0.5 }));
      // tea bush accent at top
      parts.push(sph(0.4, 0x3a6a3a, { x: 0, y: 1.6, z: -1.2, ws: 6, hs: 4, sy: 0.6 }));
      return finish(parts);
    },
  },

  /* 6 ── 檳榔樹 betel palm ──────────────────────────────────────────── */
  {
    id: 'betel_palm',
    displayName: '檳榔樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a4030, 0x3a6a3a, 0x4a8a4a, 0x7a5a40, 0x2a5a2a],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // tall slender trunk (bamboo-like rings)
      parts.push(cyl(0.14, 0.18, 2.8, 7, 0x7a5a40, { y: 1.4, hex2: 0x5a4030 }));
      // trunk ring marks
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.16, 0.16, 0.04, 6, 0x5a4030, { y: 0.4 + i * 0.45 }));
      }
      // crown shaft (green collar)
      parts.push(cyl(0.18, 0.15, 0.5, 6, 0x3a6a3a, { y: 2.9 }));
      // palm fronds (simplified as angled cones)
      const frondAngles = [0, PI / 3, PI * 2 / 3, PI, PI * 4 / 3, PI * 5 / 3];
      for (const a of frondAngles) {
        parts.push(cone(0.1, 1.2, 5, 0x4a8a4a, {
          x: Math.cos(a) * 0.4,
          y: 3.2,
          z: Math.sin(a) * 0.4,
          rx: 0.8,
          ry: a,
        }));
      }
      return finish(parts);
    },
  },

  /* 7 ── 石獅 stone guardian lion ────────────────────────────────────── */
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

  /* 8 ── 製茶工廠 tea factory (CHUNK LANDMARK) ───────────────────────── */
  {
    id: 'tea_factory',
    displayName: '製茶工廠',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd8d0c0, 0x8a6a4a, 0x5a7a5a, 0x9aa0ac, 0xc83828],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [];
      // main factory building
      parts.push(box(3.0, 1.8, 2.0, 0xd8d0c0, { y: 0.9, hex2: 0xc8c0b0 }));
      // corrugated metal roof (pitched)
      parts.push(box(3.2, 0.1, 1.2, 0x9aa0ac, { y: 1.95, z: 0.5, rx: -0.3 }));
      parts.push(box(3.2, 0.1, 1.2, 0x9aa0ac, { y: 1.95, z: -0.5, rx: 0.3 }));
      // ridge
      parts.push(box(3.2, 0.08, 0.15, 0x8a8a7a, { y: 2.15 }));
      // front loading dock
      parts.push(box(2.4, 0.3, 0.8, 0x8a8a7a, { y: 0.15, z: 1.3 }));
      // large roll door
      parts.push(box(1.4, 1.4, 0.08, 0x7a7a6a, { y: 0.7, z: 1.02 }));
      // tea processing sign
      parts.push(box(1.8, 0.4, 0.06, 0x5a7a5a, { y: 1.5, z: 1.02 }));
      // side chimney/vent
      parts.push(cyl(0.2, 0.2, 0.8, 6, 0x6a6a5a, { x: 1.3, y: 2.3 }));
      // tea baskets outside
      parts.push(cyl(0.35, 0.4, 0.3, 8, 0xb09060, { x: -1.2, y: 0.15, z: 1.4 }));
      parts.push(cyl(0.35, 0.4, 0.3, 8, 0xb09060, { x: -0.6, y: 0.15, z: 1.4 }));
      return finish(parts);
    },
  },

  /* 9 ── 凍頂牌樓 Dongding pailou (CHUNK LANDMARK) ───────────────────── */
  {
    id: 'dongding_pailou',
    displayName: '凍頂牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2a5a3a, 0xe8b53a, 0xb01f2e, 0xd8d3c5, 0x1f5c3a],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const green = 0x2a5a3a;
      const gold = 0xe8b53a;
      const red = 0xb01f2e;
      const parts = [];
      // stone plinth feet
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2, hex2: 0x6e6a5e }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2, hex2: 0x6e6a5e }));
      // two green columns (tea theme)
      parts.push(cyl(0.22, 0.26, 3.4, 8, green, { x: -1.8, y: 2.1 }));
      parts.push(cyl(0.22, 0.26, 3.4, 8, green, { x: 1.8, y: 2.1 }));
      // gold cross beams (architrave, double bar)
      parts.push(box(4.4, 0.32, 0.45, gold, { x: 0, y: 3.7 }));
      parts.push(box(4.0, 0.22, 0.4, green, { x: 0, y: 3.35 }));
      // central plaque "凍頂烏龍"
      parts.push(box(1.4, 0.7, 0.16, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(1.2, 0.5, 0.2, gold, { x: 0, y: 3.7 }));
      // tiled hip roof — green (tea leaves color)
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // smaller secondary roof
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 7, hs: 5 })); // finial bead
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
