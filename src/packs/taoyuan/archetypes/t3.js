/**
 * @file packs/taoyuan/archetypes/t3.js — Roll Formosa Taoyuan pack, Tier 3
 * (埤塘農路 / pond-road). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色埤塘藍起調 (dusk pond, blue-purple onset) — Taoyuan's
 * iconic irrigation ponds (埤塘) + bald cypress (落羽松) lined farm roads.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (夜市拱門 / 埤塘涼亭)
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

  /* 1 ── 農用搬運車 farm transport vehicle (Taoyuan farm area) ──────────── */
  {
    id: 'farm_transport',
    displayName: '農用搬運車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x4a8a3a, 0xd8dde4, 0x1a1c2a, 0xe0a030, 0x3a3f52],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Taoyuan agricultural area small transport vehicle (搬運車)
      const green = 0x4a8a3a;
      const parts = [];
      // flatbed platform
      parts.push(box(1.8, 0.16, 1.0, 0x6a7a6a, { x: 0.2, y: 0.4 }));
      // bed side rails (wooden slat style)
      parts.push(box(1.8, 0.25, 0.06, 0x8a6a48, { x: 0.2, y: 0.62, z: 0.47 }));
      parts.push(box(1.8, 0.25, 0.06, 0x8a6a48, { x: 0.2, y: 0.62, z: -0.47 }));
      // small engine/cab unit (green)
      parts.push(box(0.65, 0.6, 0.8, green, { x: -0.9, y: 0.55 }));
      // engine grille
      parts.push(box(0.06, 0.35, 0.6, 0x3a3f52, { x: -1.24, y: 0.45 }));
      // steering column/handlebar
      parts.push(cyl(0.04, 0.04, 0.5, 6, 0x3a3f52, { x: -0.75, y: 0.85, rx: -0.4 }));
      parts.push(cyl(0.03, 0.03, 0.4, 6, 0x3a3f52, { x: -0.65, y: 1.05, rz: HALF_PI }));
      // produce crates on back (typical of Taoyuan farm transport)
      parts.push(box(0.5, 0.3, 0.4, 0xe0a030, { x: 0.5, y: 0.68 }));
      parts.push(box(0.5, 0.3, 0.4, 0x4a8a3a, { x: 0.0, y: 0.68 }));
      // 4 wheels (small utility vehicle)
      const wheel = (wx, wz) => cyl(0.22, 0.22, 0.16, 8, 0x14151f, { x: wx, y: 0.22, z: wz, rx: HALF_PI });
      parts.push(wheel(-0.8, 0.48), wheel(-0.8, -0.48), wheel(0.8, 0.48), wheel(0.8, -0.48));
      return finish(parts);
    },
  },

  /* 2 ── 擂茶磨盤 Hakka Lei Cha grinding stone (客家擂茶研磨器) ───────────── */
  {
    id: 'leicha_grinder',
    displayName: '擂茶磨盤',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x8a8a82, 0x6a6a62, 0xaa9a8a, 0x4a4a42, 0x9a8a7a],
    yOffset: -0.30,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Hakka Lei Cha (擂茶) traditional grinding bowl and pestle
      // Common in Longtan and Taoyuan Hakka areas
      const stone = 0x8a8a82;
      const parts = [];
      // grooved grinding bowl (擂缽)
      cyl(0.8, 0.9, 0.5, 10, stone, { y: 0.25, hex2: 0xaa9a8a });
      parts.push(cyl(0.8, 0.9, 0.5, 10, stone, { y: 0.25, hex2: 0xaa9a8a }));
      // bowl rim
      parts.push(cyl(0.92, 0.92, 0.12, 10, 0x6a6a62, { y: 0.52, open: true }));
      // interior grooves (simplified as dark ring)
      parts.push(cyl(0.7, 0.7, 0.06, 10, 0x4a4a42, { y: 0.15 }));
      // green tea powder/paste inside
      parts.push(cyl(0.6, 0.6, 0.08, 9, 0x4a6a3a, { y: 0.35 }));
      // wooden pestle (擂棍) resting across
      parts.push(cyl(0.08, 0.1, 1.4, 6, 0x8a6a48, { rz: 0.4, y: 0.7, x: 0.15 }));
      // pestle head (thicker end)
      parts.push(sph(0.14, 0x6a4a32, { x: -0.45, y: 0.9, ws: 6, hs: 4 }));
      // wooden base stand
      parts.push(box(1.2, 0.15, 1.2, 0x6a4a32, { y: 0.07 }));
      return finish(parts);
    },
  },

  /* 3 ── 花生糖攤 peanut candy stall (大溪花生糖路邊攤) ───────────────────── */
  {
    id: 'peanut_candy_stall',
    displayName: '花生糖攤',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd4a060, 0xc89848, 0xe8b868, 0xb88838, 0x8a5a38],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Daxi's famous peanut candy (花生糖) roadside vendor stall
      const parts = [];
      const wood = 0x8a5a38;
      // simple table frame
      parts.push(box(2.0, 0.12, 1.2, wood, { y: 0.9 }));
      // four table legs
      parts.push(cyl(0.06, 0.06, 0.9, 6, wood, { x: -0.85, y: 0.45, z: 0.5 }));
      parts.push(cyl(0.06, 0.06, 0.9, 6, wood, { x: 0.85, y: 0.45, z: 0.5 }));
      parts.push(cyl(0.06, 0.06, 0.9, 6, wood, { x: -0.85, y: 0.45, z: -0.5 }));
      parts.push(cyl(0.06, 0.06, 0.9, 6, wood, { x: 0.85, y: 0.45, z: -0.5 }));
      // display trays of peanut candy (golden brown blocks)
      parts.push(box(0.7, 0.08, 0.5, 0xe0c070, { x: -0.5, y: 1.0 })); // tray 1
      parts.push(box(0.7, 0.08, 0.5, 0xe0c070, { x: 0.5, y: 1.0 })); // tray 2
      // stacked candy blocks
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.55, 0.08, 0.35, 0xd4a060, { x: -0.5, y: 1.12 + i * 0.09 }));
        parts.push(box(0.55, 0.08, 0.35, 0xc89848, { x: 0.5, y: 1.12 + i * 0.09 }));
      }
      // signboard
      parts.push(box(1.0, 0.4, 0.06, 0xc83828, { y: 1.7, z: 0.58 }));
      parts.push(box(0.8, 0.28, 0.04, 0xfff0c0, { y: 1.7, z: 0.62 })); // text area
      // umbrella pole
      parts.push(cyl(0.04, 0.04, 1.2, 6, 0x6a4a32, { x: 0.8, y: 1.6 }));
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

  /* 5 ── 落羽松 bald cypress (Taoyuan pond-side tree, 埤塘旁落羽松) ──────── */
  {
    id: 'bald_cypress',
    displayName: '落羽松',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.2,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a4a32, 0x8a6244, 0xc47838, 0xa85c30, 0x5a3824],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // flared trunk base (cypress knee / buttress roots typical of bald cypress)
      parts.push(cone(0.35, 0.6, 7, 0x6a4a32, { y: 0.3 }));
      // main trunk — narrowing upward
      parts.push(cyl(0.14, 0.22, 1.6, 7, 0x6a4a32, { y: 1.1, hex2: 0x8a6244 }));
      // upper trunk extending into canopy
      parts.push(cyl(0.08, 0.14, 1.0, 6, 0x8a6244, { y: 2.1 }));
      // feathery autumn foliage (落羽松秋色 rusty orange/copper — Taoyuan's pond-side icon)
      // pyramid-like conical canopy typical of bald cypress
      parts.push(cone(0.9, 1.8, 8, 0xc47838, { y: 2.8 }));
      // smaller foliage cones overlapping for fuller look
      parts.push(cone(0.7, 1.2, 7, 0xa85c30, { y: 2.2, x: 0.15 }));
      parts.push(cone(0.6, 1.0, 7, 0xb86840, { y: 2.5, x: -0.2, z: 0.15 }));
      // top tip
      parts.push(cone(0.3, 0.6, 6, 0xc47838, { y: 3.5 }));
      // a few hanging seed balls (small spheres)
      parts.push(sph(0.08, 0x5a4028, { x: 0.3, y: 2.0, z: 0.2, ws: 5, hs: 4 }));
      parts.push(sph(0.08, 0x5a4028, { x: -0.25, y: 1.8, z: -0.15, ws: 5, hs: 4 }));
      return finish(parts);
    },
  },

  /* 6 ── 埤塘閘門 pond sluice gate (灌溉水閘) ──────────────────────────── */
  {
    id: 'pond_sluice_gate',
    displayName: '埤塘閘門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a9098, 0x6a7078, 0x9a8a78, 0xb8b0a0, 0x4a5058],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Taoyuan's irrigation system: concrete sluice gates controlling pond water
      const parts = [];
      const concrete = 0x9a8a78;
      // concrete channel walls
      parts.push(box(0.3, 1.5, 2.0, concrete, { x: -0.9, y: 0.75 }));
      parts.push(box(0.3, 1.5, 2.0, concrete, { x: 0.9, y: 0.75 }));
      // gate frame crossbeam
      parts.push(box(2.1, 0.25, 0.25, 0x6a7078, { y: 1.55 }));
      // vertical gate (metal)
      parts.push(box(1.5, 1.0, 0.1, 0x4a5058, { y: 0.7 }));
      // gate lifting mechanism
      parts.push(cyl(0.08, 0.08, 1.2, 6, 0x8a9098, { y: 2.0 }));
      // handwheel at top
      torus(0.2, 0.03, 4, 8, 0x6a7078, { y: 2.5 });
      parts.push(torus(0.2, 0.03, 4, 8, 0x6a7078, { y: 2.5 }));
      // concrete base / apron
      parts.push(box(2.4, 0.25, 2.2, 0xb8b0a0, { y: 0.12 }));
      // water surface indication (dark)
      parts.push(box(1.4, 0.08, 1.8, 0x3a5a70, { y: 0.28 }));
      // wing walls (angled)
      parts.push(box(0.7, 1.0, 0.2, concrete, { x: -1.35, y: 0.5, z: -0.8, ry: 0.3 }));
      parts.push(box(0.7, 1.0, 0.2, concrete, { x: 1.35, y: 0.5, z: -0.8, ry: -0.3 }));
      return finish(parts);
    },
  },

  /* 7 ── 大溪老街神桌 Daxi Old Street altar table (神明桌) ──────────────── */
  {
    id: 'daxi_altar_table',
    displayName: '大溪老街神桌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x8a3824, 0x5a2818, 0x6a3020, 0xd8b048, 0xc04030],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Traditional Daxi woodcraft altar table (神明桌) - Daxi is famous for these
      const wood = 0x8a3824;
      const parts = [];
      // main table top
      parts.push(box(1.8, 0.15, 0.9, wood, { y: 1.05, hex2: 0x6a3020 }));
      // front apron (carved panel)
      parts.push(box(1.7, 0.35, 0.08, 0x5a2818, { y: 0.85, z: 0.42 }));
      // gold trim lines on apron
      parts.push(box(1.65, 0.04, 0.02, 0xd8b048, { y: 1.0, z: 0.47 }));
      parts.push(box(1.65, 0.04, 0.02, 0xd8b048, { y: 0.72, z: 0.47 }));
      // carved legs (cabriole style)
      parts.push(box(0.15, 0.9, 0.12, wood, { x: -0.75, y: 0.52, z: 0.35 }));
      parts.push(box(0.15, 0.9, 0.12, wood, { x: 0.75, y: 0.52, z: 0.35 }));
      parts.push(box(0.15, 0.9, 0.12, wood, { x: -0.75, y: 0.52, z: -0.35 }));
      parts.push(box(0.15, 0.9, 0.12, wood, { x: 0.75, y: 0.52, z: -0.35 }));
      // incense holder on top
      parts.push(cyl(0.12, 0.1, 0.2, 6, 0xd8b048, { y: 1.22 }));
      // small offerings (fruit)
      parts.push(sph(0.1, 0xe08020, { x: -0.4, y: 1.2, z: 0.15, ws: 5, hs: 4 })); // orange
      parts.push(sph(0.1, 0xe08020, { x: 0.4, y: 1.2, z: 0.15, ws: 5, hs: 4 })); // orange
      // red cloth drape
      parts.push(box(1.9, 0.08, 0.06, 0xc04030, { y: 1.1, z: 0.48 }));
      return finish(parts);
    },
  },

  /* 8 ── 夜市拱門 night-market arch (CHUNK LANDMARK) ───────────────────── */
  {
    id: 'night_market_arch',
    displayName: '夜市拱門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc4203a, 0xfff04a, 0x2f6db0, 0xe8e8ee, 0x39e08a, 0xff8c1a],
    yOffset: -0.23,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const parts = [];
      // two stout pillars
      parts.push(box(0.45, 3.2, 0.45, 0xc4203a, { x: -2.0, y: 1.6, hex2: 0xff8c1a }));
      parts.push(box(0.45, 3.2, 0.45, 0xc4203a, { x: 2.0, y: 1.6, hex2: 0xff8c1a }));
      // pillar caps
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: -2.0, y: 3.28 }));
      parts.push(box(0.6, 0.18, 0.6, 0xfff04a, { x: 2.0, y: 3.28 }));
      // arched top beam (curved torus arc spanning the gap)
      parts.push(torus(2.05, 0.22, 4, 8, 0xfff04a, { x: 0, y: 3.2, arc: PI }));
      // signboard banner across the top
      parts.push(box(3.6, 0.7, 0.18, 0x2f6db0, { x: 0, y: 3.9, hex2: 0x39e08a }));
      parts.push(box(3.4, 0.12, 0.2, 0xfff04a, { x: 0, y: 4.18 }));
      parts.push(box(3.4, 0.12, 0.2, 0xfff04a, { x: 0, y: 3.62 }));
      // hanging string of lanterns under the arch
      for (let i = 0; i < 5; i++) {
        const lx = -1.6 + i * 0.8;
        const c = [0xc4203a, 0xfff04a, 0xff8c1a][i % 3];
        parts.push(sph(0.18, c, { x: lx, y: 2.7, ws: 6, hs: 4 }));
      }
      return finish(parts);
    },
  },

  /* 9 ── 埤塘涼亭 pond pavilion (CHUNK LANDMARK) ─────────────────────────── */
  {
    id: 'pond_pavilion',
    displayName: '埤塘涼亭',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0x6a4a32, 0x8a6244, 0xc83828, 0xd8c8b0, 0x4a3a28],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const wood = 0x6a4a32;
      const roofTile = 0xc83828; // terracotta red roof
      const parts = [];
      // raised platform / deck (typical 涼亭 on the 埤塘 embankment)
      parts.push(box(3.2, 0.25, 3.2, 0xd8c8b0, { y: 0.12 }));
      // four corner posts
      parts.push(cyl(0.14, 0.16, 2.6, 6, wood, { x: -1.2, y: 1.45, z: -1.2 }));
      parts.push(cyl(0.14, 0.16, 2.6, 6, wood, { x: 1.2, y: 1.45, z: -1.2 }));
      parts.push(cyl(0.14, 0.16, 2.6, 6, wood, { x: -1.2, y: 1.45, z: 1.2 }));
      parts.push(cyl(0.14, 0.16, 2.6, 6, wood, { x: 1.2, y: 1.45, z: 1.2 }));
      // cross beams connecting posts
      parts.push(box(2.6, 0.14, 0.14, 0x8a6244, { y: 2.6, z: -1.2 }));
      parts.push(box(2.6, 0.14, 0.14, 0x8a6244, { y: 2.6, z: 1.2 }));
      parts.push(box(0.14, 0.14, 2.6, 0x8a6244, { y: 2.6, x: -1.2 }));
      parts.push(box(0.14, 0.14, 2.6, 0x8a6244, { y: 2.6, x: 1.2 }));
      // hip roof (四角亭頂) — four sloping faces meeting at center
      parts.push(cone(2.2, 1.2, 4, roofTile, { y: 3.35, ry: PI / 4 }));
      // roof eaves overhang
      parts.push(box(3.6, 0.08, 0.3, roofTile, { y: 2.78, z: 1.65 }));
      parts.push(box(3.6, 0.08, 0.3, roofTile, { y: 2.78, z: -1.65 }));
      parts.push(box(0.3, 0.08, 3.6, roofTile, { y: 2.78, x: 1.65 }));
      parts.push(box(0.3, 0.08, 3.6, roofTile, { y: 2.78, x: -1.65 }));
      // finial at roof peak
      parts.push(sph(0.14, 0xe8b840, { y: 3.98, ws: 6, hs: 4 }));
      // simple railing between posts
      parts.push(box(2.2, 0.08, 0.08, wood, { y: 0.6, z: 1.2 }));
      parts.push(box(2.2, 0.08, 0.08, wood, { y: 0.6, z: -1.2 }));
      parts.push(box(0.08, 0.08, 2.2, wood, { y: 0.6, x: 1.2 }));
      parts.push(box(0.08, 0.08, 2.2, wood, { y: 0.6, x: -1.2 }));
      // bench seats inside
      parts.push(box(1.8, 0.12, 0.35, 0x8a6244, { y: 0.4, z: 0 }));
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
