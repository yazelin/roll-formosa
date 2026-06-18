/**
 * @file packs/kaohsiung/archetypes/t3.js — Roll Formosa Kaohsiung pack, Tier 3
 * (哈瑪星港邊 / scooter-sea + harbour edge). 10 ArchetypeDefs in the FROZEN
 * slot order declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色哈瑪星港邊藍 (dusk scooter sea, harbour-blue onset) — but
 * each object keeps its own true-to-life 高雄/港都 colors so it stays legible:
 * 港邊的機車陣、鹽埕鐵捲門、港邊的貨櫃 / 繫纜柱 / 漁網 / 棕櫚 / 龍門吊車 / 漁港牌樓.
 *
 * Slots [0..7] absorbable street/harbour objects; slots [8..9]
 * (龍門吊車 / 漁港牌樓) are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
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

  /* 2 ── 貨櫃 shipping container (港邊堆疊貨櫃) ──────────────────────────── */
  {
    id: 'shipping_container',
    displayName: '貨櫃',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xc2562b, 0x2f6db0, 0x3f8a47, 0xd8c24a, 0x2a2c30],
    yOffset: -0.5674,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // 高雄港色彩繽紛的貨櫃 — pick one of the classic line colors
      const hull = [0xc2562b, 0x2f6db0, 0x3f8a47, 0xd8c24a][Math.floor(rng() * 4)];
      const hull2 = 0x2a2c30;
      const parts = [];
      // main corrugated box body (vertical gradient to a grimy top edge)
      parts.push(box(2.4, 1.2, 1.05, hull, { x: 0, y: 0.66, hex2: hull }));
      // corrugation ribs (vertical strips across the long faces)
      for (let i = 0; i < 6; i++) {
        const rx = -0.95 + i * 0.38;
        parts.push(box(0.06, 1.04, 0.03, hull2, { x: rx, y: 0.66, z: 0.535 }));
        parts.push(box(0.06, 1.04, 0.03, hull2, { x: rx, y: 0.66, z: -0.535 }));
      }
      // top & bottom rails
      parts.push(box(2.44, 0.1, 1.09, hull2, { x: 0, y: 1.26 }));
      parts.push(box(2.44, 0.1, 1.09, hull2, { x: 0, y: 0.06 }));
      // corner castings (4 little dark blocks along the top edge)
      const corner = (cx, cz) => box(0.18, 0.18, 0.18, 0x1a1c20, { x: cx, y: 1.19, z: cz });
      parts.push(corner(-1.12, 0.46), corner(1.12, 0.46));
      parts.push(corner(-1.12, -0.46), corner(1.12, -0.46));
      // doors end — twin door leaves with locking bars
      parts.push(box(0.04, 1.0, 0.5, hull2, { x: 1.21, y: 0.66, z: 0.27 }));
      parts.push(box(0.04, 1.0, 0.5, hull2, { x: 1.21, y: 0.66, z: -0.27 }));
      parts.push(box(0.04, 0.9, 0.06, 0x8c8a82, { x: 1.24, y: 0.66, z: 0.22 }));
      parts.push(box(0.04, 0.9, 0.06, 0x8c8a82, { x: 1.24, y: 0.66, z: -0.22 }));
      return finish(parts);
    },
  },

  /* 3 ── 鐵捲門 roll-up shutter (鹽埕街屋 shopfront) ────────────────────── */
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

  /* 4 ── 繫纜柱 mooring bollard (碼頭繫纜鑄鐵柱) ────────────────────────── */
  {
    id: 'mooring_bollard',
    displayName: '繫纜柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2a2c34, 0x3a3d46, 0xc4203a, 0x9aa0ac, 0x4a4e58],
    yOffset: -0.2040,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const iron = rng() < 0.5 ? 0x2a2c34 : 0x39414e; // weathered black or navy iron
      const parts = [];
      // concrete dock pad
      parts.push(box(1.0, 0.12, 1.0, 0x8c8a82, { x: 0, y: 0.06, hex2: 0x6e6a5e }));
      // bolt-down base flange
      parts.push(cyl(0.4, 0.46, 0.18, 10, iron, { x: 0, y: 0.21 }));
      // tapered cast-iron column
      parts.push(cyl(0.24, 0.34, 0.95, 10, iron, { x: 0, y: 0.75, hex2: 0x4a4e58 }));
      // mushroom cap head
      parts.push(cyl(0.4, 0.26, 0.34, 10, iron, { x: 0, y: 1.35 }));
      parts.push(sph(0.36, 0x3a3d46, { x: 0, y: 1.5, ws: 8, hs: 4, hex2: iron }));
      // painted hazard band near the top
      parts.push(cyl(0.345, 0.345, 0.12, 10, 0xc4203a, { x: 0, y: 1.0 }));
      // a loop of mooring rope draped over (torus)
      parts.push(torus(0.34, 0.06, 5, 8, 0xb0a878, { x: 0, y: 1.18, rx: 0.45, hex2: 0x9c8a5a }));
      return finish(parts);
    },
  },

  /* 5 ── 漁網捲 fishing-net roll (漁港捲起的漁網與浮球) ──────────────────── */
  {
    id: 'fishing_net_roll',
    displayName: '漁網捲',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2f7d6b, 0x3f9a86, 0x1f5c4e, 0xd8c24a, 0xc4203a],
    yOffset: -0.3012,
    upright: true,
    collisionScale: 0.74,
    buildGeometry(rng) {
      const net = rng() < 0.5 ? 0x2f7d6b : 0x3f6f9a; // teal-green or blue netting
      const net2 = 0x1f5c4e;
      const parts = [];
      // the rolled net body — a fat horizontal drum lying on the quay
      parts.push(cyl(0.62, 0.62, 1.6, 9, net, { x: 0, y: 0.62, rz: HALF_PI, hex2: net2 }));
      // wound rope rings cinching the roll (toruses around the drum)
      for (const rx of [-0.5, 0.5]) {
        parts.push(torus(0.64, 0.07, 4, 8, 0xb0a878, { x: rx, y: 0.62, ry: HALF_PI }));
      }
      // a few colored floats / buoys tucked into the bundle
      const floats = [
        [0.5, 1.15, 0.3, 0.22, 0xc4203a],
        [-0.4, 1.1, -0.2, 0.2, 0xd8c24a],
        [0.0, 1.2, -0.35, 0.18, 0xe8e8ee],
        [-0.2, 1.18, 0.4, 0.17, 0xff8c1a],
      ];
      for (const [fx, fy, fz, fr, fc] of floats) {
        parts.push(sph(fr, fc, { x: fx, y: fy, z: fz, ws: 6, hs: 4 }));
      }
      // loose net skirt hanging off the front
      parts.push(box(1.5, 0.5, 0.05, net, { x: 0, y: 0.4, z: 0.6, rx: 0.3, hex2: net2 }));
      return finish(parts);
    },
  },

  /* 6 ── 港邊棕櫚 harbour palm (西子灣 / 港邊行道椰子樹) ─────────────────── */
  {
    id: 'harbor_palm',
    displayName: '港邊棕櫚',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x7a5a3a, 0x5a3d28, 0x2f7d39, 0x3f9a47, 0x245029],
    yOffset: -0.1495,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const parts = [];
      const bark = 0x7a5a3a;
      // slim ringed trunk leaning very slightly (sea breeze)
      parts.push(cyl(0.12, 0.2, 2.4, 7, bark, { x: 0, y: 1.2, rz: 0.06, hex2: 0x9c7a4a }));
      // trunk ring scars (a few stacked discs read as ringed bark)
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.16 - i * 0.012, 0.16 - i * 0.012, 0.05, 7, 0x5a3d28, { x: 0.0, y: 0.55 + i * 0.45 }));
      }
      // crown shaft hub
      parts.push(sph(0.2, 0x2f7d39, { x: 0.06, y: 2.45, ws: 6, hs: 4 }));
      // radiating palm fronds — flattened tapered cones around the crown
      const greens = [0x2f7d39, 0x3f9a47, 0x245029];
      const fronds = 7;
      for (let i = 0; i < fronds; i++) {
        const a = (i / fronds) * PI * 2;
        const dip = -0.5 - (i % 2) * 0.25;
        const c = greens[i % greens.length];
        parts.push(cone(0.16, 1.5, 4, c, {
          x: 0.06 + Math.cos(a) * 0.7,
          y: 2.4,
          z: Math.sin(a) * 0.7,
          rz: HALF_PI + dip * Math.cos(a),
          rx: dip * Math.sin(a),
          ry: -a,
          sx: 0.35,
        }));
      }
      // a couple of coconuts at the crown
      parts.push(sph(0.12, 0x5a3d28, { x: 0.18, y: 2.3, z: 0.1, ws: 6, hs: 4 }));
      parts.push(sph(0.12, 0x5a3d28, { x: -0.05, y: 2.3, z: -0.12, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },

  /* 7 ── 石獅 stone guardian lion (廟前 / 港邊鎮煞石獅) ──────────────────── */
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

  /* 8 ── 龍門吊車 gantry crane (港邊橋式起重機, CHUNK LANDMARK) ──────────── */
  {
    id: 'gantry_crane',
    displayName: '龍門吊車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xd8c24a, 0xe8d76a, 0x2a2c34, 0xc4203a, 0x9aa0ac, 0x3a3d46],
    yOffset: -0.4756,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const yellow = 0xd8c24a;
      const yellow2 = 0xe8d76a;
      const dark = 0x2a2c34;
      const parts = [];
      // rail sills on the quay
      parts.push(box(4.6, 0.12, 0.18, 0x3a3d46, { x: 0, y: 0.06, z: 1.5 }));
      parts.push(box(4.6, 0.12, 0.18, 0x3a3d46, { x: 0, y: 0.06, z: -1.5 }));
      // 4 A-frame legs (portal) with bogies
      const leg = (lx, lz) => [
        cyl(0.18, 0.18, 0.22, 6, dark, { x: lx, y: 0.18, z: lz }), // bogie
        box(0.24, 3.4, 0.24, yellow, { x: lx, y: 1.95, z: lz, hex2: yellow2 }),
      ];
      parts.push(...leg(-1.7, 1.5), ...leg(1.7, 1.5));
      parts.push(...leg(-1.7, -1.5), ...leg(1.7, -1.5));
      // cross bracing between front/back legs
      parts.push(box(0.16, 0.16, 3.2, dark, { x: -1.7, y: 2.4 }));
      parts.push(box(0.16, 0.16, 3.2, dark, { x: 1.7, y: 2.4 }));
      // top portal beam (the 龍門 horizontal box girder)
      parts.push(box(4.2, 0.5, 0.5, yellow, { x: 0, y: 3.7, z: 1.5, hex2: yellow2 }));
      parts.push(box(4.2, 0.5, 0.5, yellow, { x: 0, y: 3.7, z: -1.5, hex2: yellow2 }));
      // the cantilever boom reaching out over the water (long top arm)
      parts.push(box(0.5, 0.45, 3.6, yellow2, { x: 0, y: 3.95 }));
      parts.push(box(0.5, 0.45, 2.0, yellow2, { x: 0, y: 3.95, z: 2.6 })); // sea-side overhang
      // machinery house / operator cab hanging under the beam
      parts.push(box(0.7, 0.6, 0.7, 0x9aa0ac, { x: 0, y: 3.2, z: 0.9, hex2: 0x6d7079 }));
      parts.push(box(0.4, 0.35, 0.4, 0x1a2330, { x: 0, y: 3.2, z: 1.26 })); // cab window
      // trolley + hoist cables + spreader (the bit that grabs containers)
      parts.push(box(0.5, 0.2, 0.5, 0xc4203a, { x: 0, y: 3.65, z: 2.4 }));
      parts.push(cyl(0.02, 0.02, 1.6, 5, 0x3a3d46, { x: -0.15, y: 2.8, z: 2.4 }));
      parts.push(cyl(0.02, 0.02, 1.6, 5, 0x3a3d46, { x: 0.15, y: 2.8, z: 2.4 }));
      parts.push(box(1.1, 0.16, 0.6, 0xc4203a, { x: 0, y: 1.95, z: 2.4, hex2: 0x8c1a2c }));
      return finish(parts);
    },
  },

  /* 9 ── 漁港牌樓 fishport pailou (旗津 / 蚵仔寮漁港牌樓, CHUNK LANDMARK) ── */
  {
    id: 'fishport_pailou',
    displayName: '漁港牌樓',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f6c8a, 0x2a2c34, 0xd8d3c5, 0x2f8a6b],
    yOffset: -0.2438,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const blue = 0x1f6c8a; // 港邊海藍 instead of temple green
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
      // central plaque (漁港名)
      parts.push(box(1.3, 0.7, 0.16, 0x2a2c34, { x: 0, y: 3.7 }));
      parts.push(box(1.1, 0.5, 0.2, gold, { x: 0, y: 3.7 }));
      // tiled hip roof — blue pitched slabs over the beam (上下兩坡 + 起翹)
      parts.push(box(5.0, 0.16, 0.9, blue, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, blue, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips (cones at the eaves)
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 5, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 5, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // smaller secondary roof above (pagoda-ish stack)
      parts.push(box(2.6, 0.14, 0.7, blue, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, blue, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      // finial — an anchor-ish bead nodding to the fishing port
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 6, hs: 4 }));
      // two small fish-float lanterns slung under the beam
      parts.push(sph(0.2, 0x2f8a6b, { x: -1.0, y: 3.0, ws: 6, hs: 4 }));
      parts.push(sph(0.2, 0xe8b53a, { x: 1.0, y: 3.0, ws: 6, hs: 4 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
