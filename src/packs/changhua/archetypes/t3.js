/**
 * @file packs/changhua/archetypes/t3.js — Roll Formosa Changhua pack, Tier 3
 * (鹿港老街 / Lukang Old Street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 老街古韻紅磚瓦 (old street red brick charm) — objects carry
 * true-to-life Lukang street colors for legibility.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (老街牌樓 / 媽祖廟門)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T3_ARCHETYPES = [
  /* 0 ── 蒸籠 steamer basket ─────────────────────────────────────────────── */
  {
    id: 'steamer_basket',
    displayName: '蒸籠',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.6,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc8a868, 0xb89858, 0xd8b878, 0xa08048, 0xe8c888],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // Stack of bamboo steamer baskets (2 stacks to reduce tris)
      for (let i = 0; i < 2; i++) {
        const y = i * 0.6 + 0.3;
        parts.push(cyl(0.9, 0.9, 0.5, 8, 0xffffff, { y })); // basket body (tinted bamboo)
        parts.push(cyl(0.92, 0.92, 0.06, 8, 0xa08048, { y: y + 0.22, open: true })); // rim
      }
      // Domed bamboo lid on top
      parts.push(sph(0.85, 0xffffff, { ws: 8, hs: 4, thetaLen: HALF_PI * 0.7, y: 1.35 }));
      parts.push(cyl(0.15, 0.15, 0.2, 5, 0xa08048, { y: 1.65 })); // lid handle
      return finish(parts);
    },
  },

  /* 1 ── 媽祖神像(小) small Mazu statue ────────────────────────────────────── */
  {
    id: 'mazu_statue_small',
    displayName: '媽祖神像(小)',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xc82828, 0xf0b429, 0xe8dcc8, 0x8b5a28, 0xd83838],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      return finish([
        // Base pedestal
        box(0.8, 0.3, 0.6, 0x8b5a28, { y: 0.15 }),
        // Robe body (flowing red garment)
        cyl(0.5, 0.6, 1.2, 8, 0xffffff, { y: 0.9 }), // red robe (tinted)
        // Sleeves
        cyl(0.18, 0.22, 0.6, 6, 0xffffff, { rz: HALF_PI, x: -0.55, y: 1.2 }),
        cyl(0.18, 0.22, 0.6, 6, 0xffffff, { rz: HALF_PI, x: 0.55, y: 1.2 }),
        // Head
        sph(0.35, 0xe8dcc8, { ws: 8, hs: 6, y: 1.75 }),
        // Crown/headdress
        cyl(0.38, 0.3, 0.3, 8, 0xf0b429, { y: 2.05 }),
        box(0.5, 0.2, 0.1, 0xf0b429, { y: 2.2 }), // crown front piece
        // Crown ornaments
        sph(0.08, 0xf0b429, { ws: 4, hs: 3, y: 2.35 }),
        // Gold trim on robe
        cyl(0.52, 0.52, 0.1, 8, 0xf0b429, { y: 1.45, open: true }),
      ]);
    },
  },

  /* 2 ── 紅磚柱 red brick pillar ────────────────────────────────────────────── */
  {
    id: 'red_brick_pillar',
    displayName: '紅磚柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xb84a3a, 0xa04030, 0xc85a4a, 0x903828, 0xd86a5a],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // Main brick column
      parts.push(box(0.7, 2.6, 0.7, 0xffffff, { y: 1.3, hex2: 0xc85a4a })); // tinted red brick
      // Base plinth
      parts.push(box(0.85, 0.25, 0.85, 0x8a7a6a, { y: 0.13 }));
      // Capital top
      parts.push(box(0.85, 0.2, 0.85, 0x8a7a6a, { y: 2.7 }));
      // Brick coursing lines (horizontal mortar joints)
      for (let i = 0; i < 8; i++) {
        parts.push(box(0.72, 0.03, 0.72, 0xd8ccc0, { y: 0.4 + i * 0.3, open: true }));
      }
      return finish(parts);
    },
  },

  /* 3 ── 石獅(小) small stone lion ─────────────────────────────────────────── */
  {
    id: 'stone_lion_small',
    displayName: '石獅(小)',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
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

  /* 4 ── 三輪車 pedicab/tricycle ──────────────────────────────────────────── */
  {
    id: 'pedicab',
    displayName: '三輪車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.2,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xd8dde4, 0x1a1c2a, 0xf0b429, 0x8a5a28],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [];
      // Passenger seat box
      parts.push(box(1.2, 0.8, 1.0, 0xffffff, { x: 0.3, y: 0.7 })); // tinted blue
      // Seat cushion
      parts.push(box(1.0, 0.15, 0.85, 0x8a5a28, { x: 0.3, y: 1.15 }));
      // Back rest
      parts.push(box(1.0, 0.5, 0.1, 0xffffff, { x: 0.3, y: 1.35, z: -0.45 }));
      // Canopy frame
      parts.push(cyl(0.04, 0.04, 0.8, 4, 0x3a3a3a, { x: -0.2, y: 1.5, z: 0.4 }));
      parts.push(cyl(0.04, 0.04, 0.8, 4, 0x3a3a3a, { x: 0.8, y: 1.5, z: 0.4 }));
      parts.push(box(1.1, 0.06, 0.9, 0xf0b429, { x: 0.3, y: 1.9 })); // canopy
      // Front steering area
      parts.push(box(0.4, 0.4, 0.5, 0x3a3a3a, { x: -0.8, y: 0.5 }));
      // Handlebars
      parts.push(cyl(0.03, 0.03, 0.6, 4, 0x2a2a2a, { x: -0.85, y: 0.9, rx: HALF_PI }));
      // Front wheel
      parts.push(cyl(0.35, 0.35, 0.12, 10, 0x1a1c2a, { rx: HALF_PI, x: -0.85, y: 0.35 }));
      parts.push(cyl(0.15, 0.15, 0.13, 8, 0xd8dde4, { rx: HALF_PI, x: -0.85, y: 0.35 })); // hub
      // Rear wheels (two)
      parts.push(cyl(0.4, 0.4, 0.12, 10, 0x1a1c2a, { rx: HALF_PI, x: 0.6, y: 0.4, z: 0.6 }));
      parts.push(cyl(0.4, 0.4, 0.12, 10, 0x1a1c2a, { rx: HALF_PI, x: 0.6, y: 0.4, z: -0.6 }));
      return finish(parts);
    },
  },

  /* 5 ── 路樹 street tree (trimmed boulevard tree) ─────────────────────────── */
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

  /* 6 ── 棚架 awning frame (street-stall canopy frame + tarp) ──────────────── */
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

  /* 7 ── 古井 old well ───────────────────────────────────────────────────── */
  {
    id: 'old_well',
    displayName: '古井',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x9c9686, 0xb9b3a4, 0x6e6a5e, 0xd8d3c5, 0x4a7aa8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      return finish([
        // Stone well rim
        cyl(0.9, 0.95, 0.6, 10, 0xffffff, { y: 0.3 }), // tinted stone
        cyl(0.75, 0.75, 0.5, 10, 0x2a3038, { y: 0.35 }), // dark interior hole
        // Well cap frame (wooden)
        cyl(0.04, 0.04, 1.2, 4, 0x6a4a30, { x: -0.7, y: 0.9 }),
        cyl(0.04, 0.04, 1.2, 4, 0x6a4a30, { x: 0.7, y: 0.9 }),
        box(1.5, 0.08, 0.12, 0x6a4a30, { y: 1.5 }), // crossbar
        // Bucket rope pulley
        cyl(0.12, 0.12, 0.15, 6, 0x8a5a28, { y: 1.5, rx: HALF_PI }),
        // Hanging bucket
        cyl(0.25, 0.22, 0.35, 8, 0x6a4a30, { y: 0.9, x: 0.3 }),
        cyl(0.22, 0.22, 0.06, 8, 0x4a3a28, { y: 1.1, x: 0.3, open: true }), // bucket rim
        // Water surface hint inside
        cyl(0.7, 0.7, 0.05, 10, 0x4a7aa8, { y: 0.2 }),
      ]);
    },
  },

  /* 8 ── 老街牌樓 old street arch (CHUNK LANDMARK) ──────────────────────────── */
  {
    id: 'lukang_old_street_arch',
    displayName: '老街牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb84a3a, 0xf0b429, 0x2e5a3a, 0xe8dcc8, 0xc85a4a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // Two red brick pillars
      parts.push(box(0.5, 3.4, 0.5, 0xffffff, { x: -2.0, y: 1.7, hex2: 0xc85a4a })); // tinted brick
      parts.push(box(0.5, 3.4, 0.5, 0xffffff, { x: 2.0, y: 1.7, hex2: 0xc85a4a }));
      // Stone bases
      parts.push(box(0.65, 0.3, 0.65, 0xb9b3a4, { x: -2.0, y: 0.15 }));
      parts.push(box(0.65, 0.3, 0.65, 0xb9b3a4, { x: 2.0, y: 0.15 }));
      // Pillar caps
      parts.push(box(0.6, 0.2, 0.6, 0xf0b429, { x: -2.0, y: 3.5 }));
      parts.push(box(0.6, 0.2, 0.6, 0xf0b429, { x: 2.0, y: 3.5 }));
      // Arched top beam
      parts.push(torus(2.0, 0.25, 4, 8, 0xf0b429, { x: 0, y: 3.4, arc: PI }));
      // Signboard banner
      parts.push(box(3.4, 0.8, 0.2, 0x2e5a3a, { x: 0, y: 4.1 })); // green background
      parts.push(box(3.2, 0.15, 0.22, 0xf0b429, { x: 0, y: 4.4 })); // gold top trim
      parts.push(box(3.2, 0.15, 0.22, 0xf0b429, { x: 0, y: 3.8 })); // gold bottom trim
      // Decorative lanterns
      for (let i = 0; i < 4; i++) {
        const lx = -1.4 + i * 0.93;
        parts.push(sph(0.18, 0xc82828, { x: lx, y: 2.9, ws: 6, hs: 4 }));
      }
      return finish(parts);
    },
  },

  /* 9 ── 媽祖廟門 Mazu temple gate (CHUNK LANDMARK) ─────────────────────────── */
  {
    id: 'mazu_temple_gate',
    displayName: '媽祖廟門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc82828, 0xf0b429, 0x2e5a3a, 0xe8dcc8, 0x8b5a28],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xffffff; // tinted vermilion
      const gold = 0xf0b429;
      const green = 0x2e5a3a;
      const parts = [];
      // Stone plinth feet
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2 }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2 }));
      // Two vermilion columns
      parts.push(cyl(0.24, 0.28, 3.4, 8, red, { x: -1.8, y: 2.1 }));
      parts.push(cyl(0.24, 0.28, 3.4, 8, red, { x: 1.8, y: 2.1 }));
      // Gold cross beams
      parts.push(box(4.4, 0.35, 0.45, gold, { x: 0, y: 3.75 }));
      parts.push(box(4.0, 0.22, 0.4, red, { x: 0, y: 3.4 }));
      // Central plaque
      parts.push(box(1.2, 0.75, 0.18, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(1.0, 0.55, 0.2, gold, { x: 0, y: 3.7 }));
      // Tiled hip roof (green glaze)
      parts.push(cyl(1.6, 1.6, 4.0, 4, green, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 4.1 }));
      // Ridge with swallowtail tips
      parts.push(box(4.2, 0.16, 0.2, gold, { y: 4.55 }));
      parts.push(cone(0.2, 0.5, 6, gold, { x: -2.2, y: 4.65, rz: 0.5 }));
      parts.push(cone(0.2, 0.5, 6, gold, { x: 2.2, y: 4.65, rz: -0.5 }));
      // Door
      parts.push(box(1.2, 1.8, 0.1, 0x6a2a1a, { y: 1.3, z: 0.3 }));
      parts.push(box(1.3, 0.2, 0.12, gold, { y: 2.25, z: 0.3 })); // door lintel
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
