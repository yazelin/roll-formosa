/**
 * @file packs/penghu/archetypes/t3.js — Roll Formosa Penghu pack, Tier 3
 * (觀光碼頭 / tourist harbor). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 碧海漁港 藍綠起調 (azure harbor, blue-green onset) — each
 * object keeps its own true-to-life Penghu harbor colors so it stays legible.
 *
 * Slots [0..7] absorbable harbor objects; slots [8..9] (觀光碼頭吊車 / 漁港牌樓)
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

  /* 2 ── 漁船 fishing boat (small Penghu fishing vessel) ──────────────── */
  {
    id: 'fishing_boat',
    displayName: '漁船',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.8,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2266aa, 0xc4203a, 0xe8e8ee, 0x5a3d28, 0x1a3050],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.72,
    buildGeometry(rng) {
      const hull = rng() < 0.5 ? 0x2266aa : 0xc4203a; // blue or red hull
      const parts = [];
      // hull bottom (tapered box)
      parts.push(box(2.4, 0.4, 0.9, hull, { x: 0, y: 0.2, hex2: 0x1a3050 }));
      // hull sides (gunwales)
      parts.push(box(2.2, 0.25, 0.08, 0xe8e8ee, { x: 0, y: 0.52, z: 0.44 }));
      parts.push(box(2.2, 0.25, 0.08, 0xe8e8ee, { x: 0, y: 0.52, z: -0.44 }));
      // bow (pointed front)
      parts.push(box(0.35, 0.5, 0.7, hull, { x: 1.2, y: 0.35, hex2: 0x1a3050 }));
      parts.push(cone(0.3, 0.6, 6, hull, { x: 1.5, y: 0.35, rz: -HALF_PI }));
      // stern (flat back)
      parts.push(box(0.15, 0.55, 0.85, 0x5a3d28, { x: -1.15, y: 0.38 }));
      // deck planks
      parts.push(box(1.8, 0.08, 0.75, 0x8b7355, { x: -0.15, y: 0.48 }));
      // cabin / wheelhouse
      parts.push(box(0.6, 0.55, 0.55, 0xe8e8ee, { x: -0.5, y: 0.82 }));
      parts.push(box(0.55, 0.35, 0.5, 0x1a3050, { x: -0.48, y: 0.95 })); // window dark
      // mast
      parts.push(cyl(0.04, 0.04, 1.0, 6, 0x5a3d28, { x: 0.3, y: 1.0 }));
      // boom arm
      parts.push(cyl(0.025, 0.025, 0.7, 6, 0x5a3d28, { x: 0.5, y: 1.2, rz: 0.4 }));
      // buoy / float
      parts.push(sph(0.15, 0xff6644, { x: 0.85, y: 0.6, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 3 ── 鐵捲門 roll-up shutter (harbor warehouse) ─────────────────────── */
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

  /* 4 ── 繫纜柱 mooring bollard (harbor mooring post) ──────────────────── */
  {
    id: 'mooring_bollard',
    displayName: '繫纜柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.6,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2a2c30, 0xfff04a, 0x1a1c20, 0x4a4c50, 0x8a8c90],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [];
      // concrete base
      parts.push(cyl(0.5, 0.55, 0.25, 8, 0x8a8c90, { x: 0, y: 0.125 }));
      // main bollard body (tapered cylinder)
      parts.push(cyl(0.25, 0.38, 0.9, 8, 0x2a2c30, { x: 0, y: 0.7, hex2: 0x1a1c20 }));
      // bollard cap (mushroom top)
      parts.push(cyl(0.35, 0.28, 0.2, 8, 0x2a2c30, { x: 0, y: 1.2 }));
      // yellow warning stripe
      parts.push(cyl(0.32, 0.32, 0.12, 8, 0xfff04a, { x: 0, y: 0.95 }));
      // mooring rope coil
      parts.push(torus(0.3, 0.06, 5, 8, 0x8b7355, { x: 0, y: 0.65, rx: 0.3 }));
      parts.push(torus(0.28, 0.05, 5, 8, 0x9b8365, { x: 0.05, y: 0.55, rx: -0.2, rz: 0.3 }));
      return finish(parts);
    },
  },

  /* 5 ── 漁網捲大 large rolled fishing net ─────────────────────────────── */
  {
    id: 'fishing_net_big',
    displayName: '漁網捲大',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.4,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2a5f3a, 0x1a4028, 0x8b7355, 0xff6644, 0x3a7a4a],
    yOffset: -0.4,
    upright: false,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const netColor = rng() < 0.5 ? 0x2a5f3a : 0x1a6050; // green or teal net
      const parts = [];
      // main rolled net cylinder (lying on side)
      parts.push(cyl(0.7, 0.7, 1.8, 10, netColor, { x: 0, y: 0.7, rz: HALF_PI, hex2: 0x1a4028 }));
      // inner core (rope bundle visible at ends)
      parts.push(cyl(0.25, 0.25, 0.1, 8, 0x8b7355, { x: 0.95, y: 0.7, rz: HALF_PI }));
      parts.push(cyl(0.25, 0.25, 0.1, 8, 0x8b7355, { x: -0.95, y: 0.7, rz: HALF_PI }));
      // float balls attached (orange/red floats typical of fishing nets)
      parts.push(sph(0.18, 0xff6644, { x: 0.6, y: 1.35, ws: 6, hs: 4 }));
      parts.push(sph(0.15, 0xff6644, { x: -0.3, y: 1.4, ws: 6, hs: 4 }));
      parts.push(sph(0.16, 0xff8844, { x: 0.1, y: 1.38, ws: 6, hs: 4 }));
      // lead weights at bottom edge
      parts.push(sph(0.1, 0x4a4c50, { x: 0.5, y: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x4a4c50, { x: -0.4, y: 0.12, ws: 5, hs: 3 }));
      parts.push(sph(0.1, 0x4a4c50, { x: 0.0, y: 0.1, ws: 5, hs: 3 }));
      // loose net drape
      parts.push(box(0.6, 0.08, 0.5, netColor, { x: 0.7, y: 0.25, rz: 0.3 }));
      return finish(parts);
    },
  },

  /* 6 ── 碼頭棕櫚 harbor palm (tropical palm tree at harbor) ──────────── */
  {
    id: 'harbor_palm',
    displayName: '碼頭棕櫚',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a4030, 0x2a6a30, 0x3a8a40, 0x1a5020, 0x7a5a40],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // trunk (tapered single cylinder)
      parts.push(cyl(0.12, 0.22, 1.6, 6, 0x5a4030, { y: 0.8, hex2: 0x7a5a40 }));
      // trunk texture rings (simplified)
      parts.push(cyl(0.23, 0.23, 0.06, 6, 0x4a3020, { y: 0.4, open: true }));
      parts.push(cyl(0.18, 0.18, 0.06, 6, 0x4a3020, { y: 1.0, open: true }));
      // crown of palm fronds (simplified to 5 cones)
      const frondColor = 0x2a6a30;
      const frondColor2 = 0x3a8a40;
      parts.push(cone(0.12, 0.9, 5, frondColor, { x: 0.5, y: 2.0, z: 0.3, rz: 0.5, rx: -0.4 }));
      parts.push(cone(0.12, 0.9, 5, frondColor2, { x: -0.5, y: 1.95, z: 0.3, rz: -0.5, rx: -0.4 }));
      parts.push(cone(0.12, 0.9, 5, frondColor, { x: 0.3, y: 2.05, z: -0.5, rz: 0.3, rx: -0.3 }));
      parts.push(cone(0.12, 0.9, 5, frondColor2, { x: -0.3, y: 1.9, z: -0.4, rz: -0.3, rx: -0.35 }));
      parts.push(cone(0.12, 0.9, 5, frondColor, { x: 0.0, y: 2.1, z: 0.5, rz: 0.0, rx: -0.5 }));
      // coconut cluster
      parts.push(sph(0.1, 0x5a4528, { x: 0.08, y: 1.72, ws: 5, hs: 3 }));
      return finish(parts);
    },
  },

  /* 7 ── 石敢當 shigandang protective stone (traditional Penghu) ──────── */
  {
    id: 'shigandang',
    displayName: '石敢當',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x8a8680, 0x6a6560, 0xa8a4a0, 0x5a5650, 0xc4203a],
    yOffset: -0.2,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const stone = 0x8a8680;
      const stone2 = 0xa8a4a0;
      const parts = [];
      // stone base (rough rectangular)
      parts.push(box(0.7, 0.25, 0.5, 0x6a6560, { x: 0, y: 0.125, hex2: 0x5a5650 }));
      // main stone slab (tall rectangular monolith)
      parts.push(box(0.55, 1.4, 0.35, stone, { x: 0, y: 0.95, hex2: stone2 }));
      // carved top (slightly tapered / rounded)
      parts.push(box(0.5, 0.2, 0.32, stone2, { x: 0, y: 1.72 }));
      parts.push(sph(0.2, stone2, { x: 0, y: 1.85, ws: 6, hs: 4 }));
      // carved Chinese characters area (darker inset rectangle)
      parts.push(box(0.38, 0.7, 0.04, 0x5a5650, { x: 0, y: 1.05, z: 0.17 }));
      // red paint on carved characters (traditional)
      parts.push(box(0.06, 0.15, 0.05, 0xc4203a, { x: -0.1, y: 1.2, z: 0.19 }));
      parts.push(box(0.06, 0.15, 0.05, 0xc4203a, { x: 0.1, y: 1.2, z: 0.19 }));
      parts.push(box(0.15, 0.06, 0.05, 0xc4203a, { x: 0, y: 1.1, z: 0.19 }));
      // moss / weathering
      parts.push(sph(0.08, 0x4a6a4a, { x: 0.25, y: 0.4, z: 0.18, ws: 5, hs: 3 }));
      parts.push(sph(0.06, 0x4a6a4a, { x: -0.22, y: 0.35, z: 0.16, ws: 5, hs: 3 }));
      return finish(parts);
    },
  },

  /* 8 ── 觀光碼頭吊車 pier crane (CHUNK LANDMARK) ──────────────────────── */
  {
    id: 'pier_crane',
    displayName: '觀光碼頭吊車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xff8c1a, 0x2a2c30, 0xfff04a, 0x1a1c20, 0x7a7c80],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      const orange = 0xff8c1a;
      const dark = 0x2a2c30;
      const parts = [];
      // base platform
      parts.push(box(1.8, 0.3, 1.4, 0x7a7c80, { x: 0, y: 0.15 }));
      // main tower / mast (lattice structure simplified)
      parts.push(box(0.35, 3.5, 0.35, orange, { x: 0, y: 2.0, hex2: 0xdd7010 }));
      // lattice cross braces (simplified as thin boxes)
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.4, 0.06, 0.06, dark, { x: 0, y: 0.6 + i * 0.7, rz: 0.5 }));
        parts.push(box(0.4, 0.06, 0.06, dark, { x: 0, y: 0.6 + i * 0.7, rz: -0.5 }));
      }
      // boom arm (horizontal jib)
      parts.push(box(2.8, 0.22, 0.22, orange, { x: 0.8, y: 3.6, hex2: 0xdd7010 }));
      // boom support cables (simplified as thin cylinders)
      parts.push(cyl(0.03, 0.03, 1.6, 6, 0x4a4c50, { x: 0.9, y: 3.1, rz: 0.7 }));
      parts.push(cyl(0.03, 0.03, 1.4, 6, 0x4a4c50, { x: -0.5, y: 3.2, rz: -0.6 }));
      // counterweight at back
      parts.push(box(0.5, 0.5, 0.4, dark, { x: -1.2, y: 3.5 }));
      // hook assembly
      parts.push(cyl(0.04, 0.04, 0.8, 6, 0x4a4c50, { x: 1.8, y: 3.0 }));
      parts.push(box(0.2, 0.25, 0.15, 0xfff04a, { x: 1.8, y: 2.5 }));
      // hook
      parts.push(torus(0.12, 0.03, 4, 6, dark, { x: 1.8, y: 2.3, arc: PI }));
      // warning stripes on boom
      parts.push(box(0.25, 0.24, 0.24, 0x2a2c30, { x: 2.0, y: 3.6 }));
      parts.push(box(0.25, 0.24, 0.24, 0xfff04a, { x: 1.5, y: 3.6 }));
      // cabin / operator box
      parts.push(box(0.6, 0.6, 0.5, 0xe8e8ee, { x: 0.15, y: 3.9 }));
      parts.push(box(0.55, 0.35, 0.04, 0x1a3050, { x: 0.15, y: 3.95, z: 0.26 })); // window
      return finish(parts);
    },
  },

  /* 9 ── 漁港牌樓 fishing port gate (CHUNK LANDMARK) ──────────────────── */
  {
    id: 'fishport_pailou',
    displayName: '漁港牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x2266aa, 0xe8b53a, 0xe8e8ee, 0x2a2c34, 0x1a5080],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const blue = 0x2266aa;
      const gold = 0xe8b53a;
      const white = 0xe8e8ee;
      const parts = [];
      // stone plinth feet
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: -1.8, y: 0.2, hex2: 0x8a8680 }));
      parts.push(box(0.7, 0.4, 0.7, 0xd8d3c5, { x: 1.8, y: 0.2, hex2: 0x8a8680 }));
      // two blue columns (ocean-themed)
      parts.push(cyl(0.24, 0.28, 3.4, 6, blue, { x: -1.8, y: 2.1, hex2: 0x1a5080 }));
      parts.push(cyl(0.24, 0.28, 3.4, 6, blue, { x: 1.8, y: 2.1, hex2: 0x1a5080 }));
      // column caps
      parts.push(box(0.55, 0.15, 0.55, gold, { x: -1.8, y: 3.85 }));
      parts.push(box(0.55, 0.15, 0.55, gold, { x: 1.8, y: 3.85 }));
      // cross beam (architrave)
      parts.push(box(4.4, 0.35, 0.45, white, { x: 0, y: 3.65 }));
      // central plaque (fish market / harbor name)
      parts.push(box(1.3, 0.75, 0.18, 0x2a2c34, { x: 0, y: 3.65 }));
      parts.push(box(1.1, 0.55, 0.2, gold, { x: 0, y: 3.65 }));
      // wave-pattern roof (simplified)
      parts.push(box(4.8, 0.12, 0.8, blue, { x: 0, y: 4.0, z: 0.35, rx: -0.25 }));
      parts.push(box(4.8, 0.12, 0.8, blue, { x: 0, y: 4.0, z: -0.35, rx: 0.25 }));
      // roof ridge with decorative finials
      parts.push(box(4.8, 0.1, 0.12, gold, { x: 0, y: 4.2 }));
      // finials at corners
      parts.push(sph(0.2, gold, { x: -2.4, y: 4.3, ws: 5, hs: 3 }));
      parts.push(sph(0.2, gold, { x: 2.4, y: 4.3, ws: 5, hs: 3 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
