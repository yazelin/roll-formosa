/**
 * @file packs/keelung/archetypes/t3.js — Roll Formosa Keelung pack, Tier 3
 * (雨港漁街 / rainy fishing harbor street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色雨港藍起調 (dusk rainy port, blue-purple onset) — but each
 * object keeps its own true-to-life Keelung harbor colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (漁港牌樓 / 漁船小)
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

  /* 2 ── 漁網捲 fishing net roll (stacked fishing nets on harbor) ────────── */
  {
    id: 'fishing_net_roll',
    displayName: '漁網捲',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a6e5a, 0x2a5a48, 0x4a8070, 0x6aa090, 0xd08830],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // base net roll (horizontal cylinder)
      parts.push(cyl(0.7, 0.7, 1.6, 10, 0x3a6e5a, { rz: HALF_PI, y: 0.7, hex2: 0x2a5a48 }));
      // smaller roll on top
      parts.push(cyl(0.5, 0.5, 1.4, 8, 0x4a8070, { rz: HALF_PI, y: 1.5, hex2: 0x6aa090 }));
      // orange floats dangling
      parts.push(sph(0.12, 0xd08830, { x: 0.5, y: 0.3, z: 0.6, ws: 6, hs: 4 }));
      parts.push(sph(0.12, 0xd08830, { x: -0.4, y: 0.3, z: 0.55, ws: 6, hs: 4 }));
      parts.push(sph(0.12, 0xd08830, { x: 0.2, y: 0.28, z: -0.5, ws: 6, hs: 4 }));
      // rope coil beside
      parts.push(torus(0.18, 0.05, 6, 8, 0xc8b896, { x: -0.65, y: 0.15, rx: HALF_PI }));
      return finish(parts);
    },
  },

  /* 3 ── 繫纜柱 mooring bollard (harbor mooring post) ───────────────────── */
  {
    id: 'mooring_bollard',
    displayName: '繫纜柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.5,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2a2c34, 0x3a3e48, 0xf0c020, 0xe8e0d0, 0x5a5e68],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // concrete base
      parts.push(cyl(0.7, 0.8, 0.3, 8, 0x8a8a82, { y: 0.15 }));
      // main bollard body (mushroom shaped)
      parts.push(cyl(0.4, 0.5, 1.1, 8, 0x2a2c34, { y: 0.85, hex2: 0x3a3e48 }));
      // mushroom cap
      parts.push(cyl(0.65, 0.55, 0.25, 8, 0x2a2c34, { y: 1.5 }));
      // yellow warning band
      parts.push(cyl(0.52, 0.52, 0.15, 8, 0xf0c020, { y: 1.2 }));
      // rope wrapped around (simplified cylinders instead of torus to reduce tri count)
      parts.push(cyl(0.55, 0.55, 0.1, 8, 0xc8b896, { y: 0.9 }));
      parts.push(cyl(0.52, 0.52, 0.1, 8, 0xc8b896, { y: 1.05 }));
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
      // shutter face = stack of horizontal slats
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
      // canopy = clustered low-detail spheres
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

  /* 6 ── 雨棚架 rain awning (Keelung rainy harbor canopy) ─────────────────── */
  {
    id: 'rain_awning',
    displayName: '雨棚架',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x9aa0ac, 0x2f6db0, 0xe8e8ee, 0x3a8080, 0x6d7079],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.66,
    buildGeometry(rng) {
      // Keelung's iconic rain shelters — blue/teal tarps for the rainy harbor
      const tarp = rng() < 0.5 ? 0x2f6db0 : 0x3a8080; // blue or teal
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
      // pitched tarp roof — steeper for rain runoff
      parts.push(box(2.5, 0.05, 1.35, tarp, { x: 0, y: 2.28, z: 0.62, rx: -0.35 }));
      parts.push(box(2.5, 0.05, 1.35, 0xe8e8ee, { x: 0, y: 2.28, z: -0.62, rx: 0.35 }));
      // ridge cap
      parts.push(box(2.5, 0.06, 0.12, tarp, { x: 0, y: 2.52 }));
      // rain gutter
      parts.push(box(2.5, 0.04, 0.1, 0x7d828e, { x: 0, y: 2.0, z: 1.3 }));
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
      // curled mane
      parts.push(sph(0.4, 0x9c9686, { x: -0.18, y: 1.42, ws: 7, hs: 4 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: 0.16, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x6e6a5e, { x: -0.5, y: 1.62, z: -0.16, ws: 5, hs: 3 }));
      // front legs
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: 0.2 }));
      parts.push(cyl(0.11, 0.13, 0.55, 6, stone, { x: -0.32, y: 0.55, z: -0.2 }));
      // paws on a ball
      parts.push(sph(0.16, 0xc4203a, { x: -0.5, y: 0.32, z: 0.2, ws: 6, hs: 4 }));
      // tail
      parts.push(sph(0.22, stone2, { x: 0.42, y: 1.05, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 8 ── 漁港牌樓 fishport arch (CHUNK LANDMARK) ───────────────────────── */
  {
    id: 'fishport_arch',
    displayName: '漁港牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2f6db0, 0xfff04a, 0xe8e8ee, 0x3a8080, 0xff8c1a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // two stout pillars - blue for harbor theme
      parts.push(box(0.45, 3.2, 0.45, 0x2f6db0, { x: -2.0, y: 1.6, hex2: 0x3a8080 }));
      parts.push(box(0.45, 3.2, 0.45, 0x2f6db0, { x: 2.0, y: 1.6, hex2: 0x3a8080 }));
      // pillar caps
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: -2.0, y: 3.28 }));
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: 2.0, y: 3.28 }));
      // arched top beam
      parts.push(torus(2.05, 0.22, 4, 8, 0xfff04a, { x: 0, y: 3.2, arc: PI }));
      // signboard banner - harbor themed
      parts.push(box(3.6, 0.7, 0.18, 0xe8e8ee, { x: 0, y: 3.9, hex2: 0x3a8080 }));
      parts.push(box(3.4, 0.12, 0.2, 0xfff04a, { x: 0, y: 4.18 }));
      parts.push(box(3.4, 0.12, 0.2, 0xfff04a, { x: 0, y: 3.62 }));
      // fish motif decorations
      for (let i = 0; i < 3; i++) {
        const lx = -1.2 + i * 1.2;
        parts.push(sph(0.15, 0x2f6db0, { x: lx, y: 3.9, z: 0.12, ws: 6, hs: 4 }));
      }
      // anchor symbols on pillars
      parts.push(box(0.2, 0.4, 0.08, 0xff8c1a, { x: -2.0, y: 2.4, z: 0.24 }));
      parts.push(box(0.2, 0.4, 0.08, 0xff8c1a, { x: 2.0, y: 2.4, z: 0.24 }));
      return finish(parts);
    },
  },

  /* 9 ── 漁船小 small fishing boat (CHUNK LANDMARK) ────────────────────── */
  {
    id: 'small_fishing_boat',
    displayName: '漁船小',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2f6db0, 0xe8e8ee, 0xc4203a, 0x3a5a48, 0xd08830],
    yOffset: -0.65,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const hull = rng() < 0.5 ? 0x2f6db0 : 0x3a8080;
      const parts = [];
      // hull body (elongated box tapered at ends)
      parts.push(box(3.4, 0.6, 1.2, hull, { y: 0.5, hex2: 0x1a4a6a }));
      // bow taper
      parts.push(box(0.8, 0.5, 0.9, hull, { x: 1.9, y: 0.45, rz: 0.2 }));
      // stern taper
      parts.push(box(0.6, 0.55, 1.0, hull, { x: -1.7, y: 0.48 }));
      // deck
      parts.push(box(3.0, 0.1, 1.0, 0xc8b896, { y: 0.85 }));
      // cabin
      parts.push(box(1.0, 0.7, 0.8, 0xe8e8ee, { x: -0.3, y: 1.25 }));
      parts.push(box(0.85, 0.35, 0.06, 0x3a5a6a, { x: -0.3, y: 1.35, z: 0.42 })); // cabin window
      // mast
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0x8a7a5a, { x: 0.6, y: 1.6 }));
      // boom
      parts.push(cyl(0.03, 0.03, 1.0, 6, 0x8a7a5a, { x: 0.9, y: 1.8, rz: 0.6 }));
      // fishing gear / nets at stern
      parts.push(cyl(0.25, 0.25, 0.5, 8, 0x3a6e5a, { x: -1.2, y: 1.1, rz: HALF_PI }));
      // orange floats
      parts.push(sph(0.1, 0xd08830, { x: 1.0, y: 0.9, z: 0.4, ws: 6, hs: 4 }));
      parts.push(sph(0.1, 0xd08830, { x: 0.8, y: 0.9, z: -0.35, ws: 6, hs: 4 }));
      // waterline stripe
      parts.push(box(3.2, 0.08, 1.22, 0xc4203a, { y: 0.25 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
