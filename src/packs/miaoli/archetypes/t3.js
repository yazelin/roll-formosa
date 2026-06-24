/**
 * @file packs/miaoli/archetypes/t3.js — Roll Formosa Miaoli pack, Tier 3
 * (三義木雕街 / Sanyi woodcarving street). 10 ArchetypeDefs in the FROZEN slot
 * order declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 三義木雕街暮色藍紫 (dusk woodcarving street, blue-purple onset) —
 * but each object keeps its own true-to-life Miaoli colors so it stays legible:
 * 機車、小貨車、木雕象、木藝招牌、鐵捲門、桐花樹、木工棚架、石獅、木雕店門面、廟前牌樓.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (木雕店門面 / 廟前牌樓)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 *
 * T3 theme: 三義木雕街 — Sanyi woodcarving street items
 * Items: scooter, mini_truck, wood_elephant, wood_sign, roll_shutter,
 *        tung_tree, wood_awning, stone_lion, woodcarving_shop, temple_pailou
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
    yOffset: -0.3305,
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
    yOffset: -0.6095,
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

  /* 2 ── 木雕象 wood-carved elephant (三義木雕代表作) ───────────────────── */
  {
    id: 'wood_elephant',
    displayName: '木雕象',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.8,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0x5a3a1a, 0xc8a870],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood color
      const dark = 0x5a3a1a;
      const parts = [];
      // body (barrel shaped)
      parts.push(sph(0.9, wood, { ws: 8, hs: 5, sx: 1.3, y: 0.9, hex2: 0xa08050 }));
      // head
      parts.push(sph(0.55, wood, { ws: 7, hs: 5, x: -0.95, y: 1.2, hex2: 0x8a6a3a }));
      // trunk (curved cone)
      parts.push(cyl(0.18, 0.08, 1.0, 6, 0x8a6a3a, { x: -1.4, y: 0.6, rz: 0.6, hex2: dark }));
      parts.push(cyl(0.1, 0.06, 0.5, 5, dark, { x: -1.7, y: 0.15, rz: 1.0 }));
      // ears (flat discs)
      parts.push(sph(0.35, wood, { ws: 6, hs: 3, sx: 0.3, x: -0.7, y: 1.4, z: 0.55, rz: 0.3 }));
      parts.push(sph(0.35, wood, { ws: 6, hs: 3, sx: 0.3, x: -0.7, y: 1.4, z: -0.55, rz: -0.3 }));
      // four legs
      parts.push(cyl(0.2, 0.22, 0.7, 6, wood, { x: -0.4, y: 0.35, z: 0.4 }));
      parts.push(cyl(0.2, 0.22, 0.7, 6, wood, { x: -0.4, y: 0.35, z: -0.4 }));
      parts.push(cyl(0.2, 0.22, 0.7, 6, wood, { x: 0.6, y: 0.35, z: 0.4 }));
      parts.push(cyl(0.2, 0.22, 0.7, 6, wood, { x: 0.6, y: 0.35, z: -0.4 }));
      // tail
      parts.push(cyl(0.05, 0.03, 0.4, 4, dark, { x: 1.0, y: 0.8, rz: -0.3 }));
      // tusks (small white cones)
      parts.push(cone(0.06, 0.35, 5, 0xf4f0e8, { x: -1.25, y: 0.85, z: 0.2, rz: 0.8 }));
      parts.push(cone(0.06, 0.35, 5, 0xf4f0e8, { x: -1.25, y: 0.85, z: -0.2, rz: 0.8 }));
      return finish(parts);
    },
  },

  /* 3 ── 木藝招牌 wooden craft shop sign ─────────────────────────────── */
  {
    id: 'wood_sign',
    displayName: '木藝招牌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0xc8a870, 0xf4e8d0],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.65,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const darkWood = 0x5a3a1a;
      const parts = [];
      // vertical post
      parts.push(cyl(0.12, 0.14, 2.2, 6, darkWood, { x: -0.8, y: 1.1 }));
      // horizontal arm bracket
      parts.push(box(0.15, 0.15, 0.6, darkWood, { x: -0.6, y: 1.9, z: 0.3 }));
      // hanging sign board (carved wood look)
      parts.push(box(1.4, 0.9, 0.12, wood, { y: 1.2, hex2: 0xa08050 }));
      // decorative frame around sign
      parts.push(box(1.5, 0.1, 0.14, darkWood, { y: 1.65 }));
      parts.push(box(1.5, 0.1, 0.14, darkWood, { y: 0.75 }));
      parts.push(box(0.1, 0.9, 0.14, darkWood, { x: -0.7, y: 1.2 }));
      parts.push(box(0.1, 0.9, 0.14, darkWood, { x: 0.7, y: 1.2 }));
      // carved pattern (simplified as relief boxes)
      parts.push(box(0.6, 0.4, 0.04, 0xc8a870, { y: 1.2, z: 0.08 }));
      // hanging chains
      parts.push(cyl(0.03, 0.03, 0.35, 4, 0x7a8090, { x: -0.5, y: 1.85 }));
      parts.push(cyl(0.03, 0.03, 0.35, 4, 0x7a8090, { x: 0.5, y: 1.85 }));
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
    yOffset: -0.2986,
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

  /* 5 ── 桐花樹 tung oil tree (油桐花, Miaoli 桐花季 symbol) ────────────── */
  {
    id: 'tung_tree',
    displayName: '桐花樹',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a3d28, 0x2f6b39, 0x3f8a47, 0xffffff, 0x245029],
    yOffset: -0.12,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [];
      const bark = 0x5a3d28;
      // trunk with characteristic rough bark
      parts.push(cyl(0.2, 0.28, 1.8, 6, bark, { x: 0, y: 0.9, hex2: 0x7a5a3a }));
      // main branches
      parts.push(cyl(0.1, 0.15, 0.8, 5, bark, { x: 0.3, y: 2.0, rz: -0.5 }));
      parts.push(cyl(0.1, 0.15, 0.8, 5, bark, { x: -0.3, y: 2.0, rz: 0.5 }));
      // canopy = clustered low-detail spheres for leafy blob (reduced from 5 to 4)
      const greens = [0x2f6b39, 0x3f8a47, 0x245029];
      const blobs = [
        [0, 2.3, 0, 0.85],
        [0.5, 2.1, 0.2, 0.55],
        [-0.45, 2.15, -0.2, 0.5],
        [-0.2, 2.35, 0.45, 0.45],
      ];
      for (let i = 0; i < blobs.length; i++) {
        const [bx, by, bz, br] = blobs[i];
        const c = greens[i % greens.length];
        parts.push(sph(br, c, { x: bx, y: by, z: bz, ws: 5, hs: 3, hex2: 0x3f8a47 }));
      }
      // tung flowers (white 5-petal clusters - simplified, reduced from 6 to 4)
      const flowers = [
        [0.4, 2.5, 0.3], [-0.3, 2.6, 0.1], [0.1, 2.7, -0.3], [-0.5, 2.3, 0.4],
      ];
      for (const [fx, fy, fz] of flowers) {
        parts.push(sph(0.12, 0xffffff, { ws: 4, hs: 2, x: fx, y: fy, z: fz }));
        // yellow center
        parts.push(sph(0.04, 0xffd84d, { ws: 3, hs: 2, x: fx, y: fy + 0.08, z: fz }));
      }
      return finish(parts);
    },
  },

  /* 6 ── 木工棚架 wooden craft workshop awning frame ────────────────────── */
  {
    id: 'wood_awning',
    displayName: '木工棚架',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0xc8a870, 0x5a3a1a],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.66,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const darkWood = 0x5a3a1a;
      const parts = [];
      // 4 corner posts (rough wood)
      const legs = [[-1.0, 1.0], [1.0, 1.0], [-1.0, -1.0], [1.0, -1.0]];
      for (const [lx, lz] of legs) {
        parts.push(cyl(0.1, 0.12, 2.0, 6, wood, { x: lx, y: 1.0, z: lz, hex2: 0xa08050 }));
      }
      // top frame rails (wooden beams)
      parts.push(box(2.2, 0.12, 0.12, darkWood, { x: 0, y: 2.0, z: 1.0 }));
      parts.push(box(2.2, 0.12, 0.12, darkWood, { x: 0, y: 2.0, z: -1.0 }));
      parts.push(box(0.12, 0.12, 2.2, darkWood, { x: -1.0, y: 2.0 }));
      parts.push(box(0.12, 0.12, 2.2, darkWood, { x: 1.0, y: 2.0 }));
      // crossbeam rafters
      parts.push(box(2.2, 0.1, 0.1, 0x8a6a3a, { x: 0, y: 2.15, z: 0.5 }));
      parts.push(box(2.2, 0.1, 0.1, 0x8a6a3a, { x: 0, y: 2.15, z: -0.5 }));
      // canvas/tarp roof
      parts.push(box(2.3, 0.05, 2.2, 0xc8a870, { y: 2.22, hex2: 0xe8d8b0 }));
      // work bench inside
      parts.push(box(1.5, 0.1, 0.8, 0xa08050, { x: 0, y: 0.85, z: 0.3 }));
      parts.push(box(0.1, 0.8, 0.1, darkWood, { x: -0.65, y: 0.45, z: 0.3 }));
      parts.push(box(0.1, 0.8, 0.1, darkWood, { x: 0.65, y: 0.45, z: 0.3 }));
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
    yOffset: -0.1533,
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

  /* 8 ── 木雕店門面 woodcarving shop front (CHUNK LANDMARK) ────────────── */
  {
    id: 'woodcarving_shop',
    displayName: '木雕店門面',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x8a6a3a, 0x6a4a2a, 0xa08050, 0xc8a870, 0xf4e8d0],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const wood = 0xffffff; // tinted wood
      const darkWood = 0x5a3a1a;
      const parts = [];
      // main shop facade wall
      parts.push(box(4.0, 3.2, 0.2, wood, { y: 1.6, hex2: 0xa08050 }));
      // shop entrance opening (dark recess)
      parts.push(box(1.5, 2.2, 0.25, 0x2a2a2e, { y: 1.1, z: 0.05 }));
      // wooden door frame
      parts.push(box(0.15, 2.4, 0.12, darkWood, { x: -0.82, y: 1.2, z: 0.15 }));
      parts.push(box(0.15, 2.4, 0.12, darkWood, { x: 0.82, y: 1.2, z: 0.15 }));
      parts.push(box(1.8, 0.2, 0.12, darkWood, { y: 2.35, z: 0.15 }));
      // signboard above
      parts.push(box(3.5, 0.7, 0.15, 0xc8a870, { y: 2.85, z: 0.18, hex2: 0xe8d8b0 }));
      parts.push(box(3.6, 0.1, 0.16, darkWood, { y: 3.2, z: 0.18 }));
      parts.push(box(3.6, 0.1, 0.16, darkWood, { y: 2.5, z: 0.18 }));
      // display items outside (wooden sculptures on stands)
      // carved figure on left
      parts.push(cyl(0.25, 0.3, 0.5, 6, darkWood, { x: -1.5, y: 0.25, z: 0.5 })); // pedestal
      parts.push(sph(0.3, 0x8a6a3a, { ws: 6, hs: 4, x: -1.5, y: 0.8, z: 0.5 })); // sculpture
      // carved figure on right
      parts.push(cyl(0.25, 0.3, 0.5, 6, darkWood, { x: 1.5, y: 0.25, z: 0.5 })); // pedestal
      parts.push(box(0.35, 0.6, 0.2, 0xa08050, { x: 1.5, y: 0.8, z: 0.5 })); // sculpture
      // awning
      parts.push(box(4.2, 0.1, 0.8, 0x8a6a3a, { y: 3.4, z: 0.4, rx: -0.2 }));
      return finish(parts);
    },
  },

  /* 9 ── 廟前牌樓 temple pailou gateway (CHUNK LANDMARK) ───────────────── */
  {
    id: 'temple_pailou',
    displayName: '廟前牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0x2a2c34, 0xd8d3c5, 0x6e6a5e],
    yOffset: -0.2438,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const parts = [];
      // stone plinth feet
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2, hex2: 0x6e6a5e }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2, hex2: 0x6e6a5e }));
      // two red columns
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: -1.8, y: 2.1 }));
      parts.push(cyl(0.22, 0.26, 3.4, 8, red, { x: 1.8, y: 2.1 }));
      // gold cross beams (architrave, double bar)
      parts.push(box(4.4, 0.32, 0.45, gold, { x: 0, y: 3.7 }));
      parts.push(box(4.0, 0.22, 0.4, red, { x: 0, y: 3.35 }));
      // central plaque
      parts.push(box(1.1, 0.7, 0.16, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(0.9, 0.5, 0.2, gold, { x: 0, y: 3.7 }));
      // tiled hip roof — green pitched slabs over the beam
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // smaller secondary roof above
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 7, hs: 5 })); // finial bead
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
