/**
 * @file packs/taichung/archetypes/t3.js — Roll Formosa Taichung pack, Tier 3
 * (台灣大道車流 / Taiwan Boulevard arterial). 10 ArchetypeDefs in the FROZEN
 * slot order declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色林蔭大道 藍紫起調 (dusk boulevard, blue-purple onset) — but
 * each object keeps its own true-to-life Taichung street colors so it stays
 * legible. Taiwan Boulevard reads as a wide tree-lined arterial with a transit
 * lane (BRT-style 市公車), not a scooter sea: kept the 機車/小貨車 generics and
 * the boulevard-native 變電箱/霓虹招牌/路樹, and swapped the shopfront/stall/
 * temple-lion props for 候車亭 / 天橋 / 市公車.
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

  /* 3 ── 霓虹招牌 neon sign (cantilever shop sign) ─────────────────────── */
  {
    id: 'neon_sign',
    displayName: '霓虹招牌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x14161f, 0xff3c78, 0x32d6ff, 0xfff04a, 0x39e08a],
    yOffset: -0.27,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const glow = [0xff3c78, 0x32d6ff, 0xfff04a, 0x39e08a][Math.floor(rng() * 4)];
      const glow2 = 0x32d6ff;
      const parts = [];
      // wall mount bracket
      parts.push(box(0.2, 1.8, 0.2, 0x2a2c34, { x: -1.05, y: 1.1 }));
      // boom arm
      parts.push(cyl(0.05, 0.05, 1.0, 6, 0x3a3d46, { x: -0.55, y: 1.7, rz: HALF_PI }));
      // dark sign backing panel
      parts.push(box(0.12, 1.5, 1.3, 0x14161f, { x: 0.1, y: 1.0 }));
      // neon tube border (torus arc rings as glow strokes) — top & bottom bars
      parts.push(box(0.06, 0.1, 1.16, glow, { x: 0.18, y: 1.66 }));
      parts.push(box(0.06, 0.1, 1.16, glow2, { x: 0.18, y: 0.34 }));
      parts.push(box(0.06, 1.36, 0.1, glow, { x: 0.18, y: 1.0, z: 0.6 }));
      parts.push(box(0.06, 1.36, 0.1, glow2, { x: 0.18, y: 1.0, z: -0.6 }));
      // neon glyph rings (two circular characters suggestion)
      parts.push(torus(0.26, 0.05, 6, 10, glow, { x: 0.2, y: 1.28, ry: HALF_PI }));
      parts.push(torus(0.26, 0.05, 6, 10, 0xfff04a, { x: 0.2, y: 0.68, ry: HALF_PI }));
      return finish(parts);
    },
  },

  /* 4 ── 逢甲攤車 fengjia_cart (TAICHUNG SWAP: 逢甲夜市 night-market cart) */
  {
    id: 'fengjia_cart',
    displayName: '逢甲攤車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.6,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc4203a, 0xfff04a, 0x9a7a52, 0xe8e8ee, 0xff8c1a],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const cart = rng() < 0.5 ? 0xc4203a : 0xff8c1a; // red or orange cart trim
      const wood = 0x9a7a52;
      const parts = [];
      // cart body (wooden cabinet on wheels) — 逢甲夜市經典攤車
      parts.push(box(2.2, 0.9, 1.1, wood, { y: 0.65, hex2: 0x8a6a42 }));
      // stainless steel countertop
      parts.push(box(2.3, 0.1, 1.2, 0xc8c4be, { y: 1.15 }));
      // glass sneeze guard (simplified to single back panel)
      parts.push(box(2.1, 0.5, 0.06, 0xbcd6e6, { y: 1.45, z: -0.48 }));
      // front signboard (逢甲夜市攤販招牌)
      parts.push(box(2.0, 0.5, 0.08, cart, { y: 0.7, z: 0.58 }));
      parts.push(box(1.6, 0.16, 0.04, 0xfff04a, { y: 0.75, z: 0.64 })); // menu strip
      // two cart wheels (reduced segments)
      parts.push(cyl(0.3, 0.3, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: -0.85, y: 0.3, z: 0 }));
      parts.push(cyl(0.3, 0.3, 0.14, 6, 0x2e3138, { rx: HALF_PI, x: 0.85, y: 0.3, z: 0 }));
      // parasol canopy (simplified)
      parts.push(cyl(0.06, 0.06, 1.4, 5, wood, { y: 2.05 })); // center pole
      parts.push(cone(1.5, 0.6, 6, cart, { y: 2.85, hex2: 0xfff04a })); // parasol
      // string light bulbs (reduced count: 3 boxes instead of 6 spheres)
      parts.push(box(0.14, 0.14, 0.14, 0xfff04a, { x: 1.2, z: 0, y: 2.55 }));
      parts.push(box(0.14, 0.14, 0.14, 0xfff04a, { x: -0.6, z: 1.0, y: 2.55 }));
      parts.push(box(0.14, 0.14, 0.14, 0xfff04a, { x: -0.6, z: -1.0, y: 2.55 }));
      // food items on display (simplified: boxes instead of spheres)
      parts.push(box(0.26, 0.18, 0.26, 0xe8c870, { x: -0.4, y: 1.29 })); // potato
      parts.push(box(0.2, 0.14, 0.2, 0xd8a050, { x: 0.35, y: 1.27 })); // takoyaki
      return finish(parts);
    },
  },

  /* 5 ── 路樹 street tree (林蔭大道 boulevard tree) ────────────────────── */
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

  /* 6 ── 大甲媽遶境旗 mazu_pilgrimage_flag (TAICHUNG SWAP: Dajia Mazu flag) */
  {
    id: 'mazu_pilgrimage_flag',
    displayName: '大甲媽遶境旗',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.0,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc4203a, 0xfff04a, 0xb01f2e, 0xe8b53a, 0x1f5c3a],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const flagRed = 0xc4203a;
      const gold = 0xfff04a;
      const parts = [];
      // tall bamboo flagpole (大甲媽祖遶境進香旗)
      parts.push(cyl(0.1, 0.14, 4.0, 8, 0x8a7a52, { y: 2.0, hex2: 0x6a5a3a }));
      // pole finial — golden spearhead
      parts.push(cone(0.16, 0.4, 6, gold, { y: 4.2 }));
      // large rectangular banner flag (垂直神明旗)
      parts.push(box(0.08, 2.8, 1.4, flagRed, { y: 2.2, z: 0.7, hex2: 0xb01f2e }));
      // golden fringe trim at edges
      parts.push(box(0.04, 2.8, 0.06, gold, { y: 2.2, z: 1.38 }));
      parts.push(box(0.04, 2.8, 0.06, gold, { y: 2.2, z: 0.02 }));
      parts.push(box(0.04, 0.06, 1.36, gold, { y: 0.82, z: 0.7 })); // bottom fringe
      parts.push(box(0.04, 0.06, 1.36, gold, { y: 3.58, z: 0.7 })); // top fringe
      // 媽祖 character plate / emblem circle
      parts.push(cyl(0.5, 0.5, 0.08, 10, gold, { ry: HALF_PI, y: 2.6, z: 0.8 }));
      parts.push(cyl(0.35, 0.35, 0.1, 8, 0xb01f2e, { ry: HALF_PI, y: 2.6, z: 0.82 }));
      // dragon motif patterns (simplified geometric shapes)
      parts.push(box(0.04, 0.6, 0.3, gold, { y: 1.6, z: 0.7 }));
      parts.push(box(0.04, 0.6, 0.3, gold, { y: 3.0, z: 0.7 }));
      // weighted stone base (插旗石座)
      parts.push(box(0.7, 0.4, 0.7, 0x8a8278, { y: 0.2 }));
      return finish(parts);
    },
  },

  /* 7 ── 台中市公車 city bus (BRT-style boulevard transit) ─────────────── */
  {
    id: 'taichung_bus',
    displayName: '台中市公車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.3,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xe8eaef, 0x1a2330, 0x14151f, 0xd6dae0, 0xfff04a],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const livery = rng() < 0.5 ? 0x2f6db0 : 0x3a8f6e; // blue or green city livery
      const parts = [];
      // long body shell (gradient to a lighter roof)
      parts.push(box(3.0, 1.1, 1.0, livery, { x: 0, y: 0.95, hex2: 0xe8eaef }));
      // pale lower skirt band
      parts.push(box(3.0, 0.3, 1.02, 0xe8eaef, { x: 0, y: 0.5 }));
      // roof cap
      parts.push(box(2.7, 0.16, 0.9, 0xd6dae0, { x: 0, y: 1.56 }));
      // window band (both sides) — strip of tinted glass
      parts.push(box(2.5, 0.34, 0.04, 0x1a2330, { x: 0.1, y: 1.15, z: 0.5 }));
      parts.push(box(2.5, 0.34, 0.04, 0x1a2330, { x: 0.1, y: 1.15, z: -0.5 }));
      // windshield + front face
      parts.push(box(0.06, 0.5, 0.92, 0x1a2330, { x: -1.5, y: 1.15 }));
      // boarding door (front-right) darker recessed panel
      parts.push(box(0.05, 0.7, 0.34, 0x14151f, { x: -1.5, y: 0.78, z: 0.28 }));
      // headlights + destination sign
      parts.push(box(0.05, 0.12, 0.16, 0xfff2cc, { x: -1.52, y: 0.6, z: 0.34 }));
      parts.push(box(0.05, 0.12, 0.16, 0xfff2cc, { x: -1.52, y: 0.6, z: -0.34 }));
      parts.push(box(0.05, 0.18, 0.6, 0xfff04a, { x: -1.52, y: 1.5 })); // route LED
      // 4 wheels
      const wheel = (wx, wz) => cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, z: wz, rx: HALF_PI });
      parts.push(wheel(-1.0, 0.5), wheel(-1.0, -0.5), wheel(1.0, 0.5), wheel(1.0, -0.5));
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
    yOffset: -0.24,
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
      // tiled hip roof — green pitched slabs over the beam (上下兩坡 + 起翹)
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: 0.42, rx: -0.34 }));
      parts.push(box(5.0, 0.16, 0.9, green, { x: 0, y: 4.06, z: -0.42, rx: 0.34 }));
      // ridge with raised swallowtail tips (cones at the eaves)
      parts.push(box(5.0, 0.14, 0.16, gold, { x: 0, y: 4.34 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: -2.5, y: 4.5, rz: 0.5 }));
      parts.push(cone(0.18, 0.5, 6, gold, { x: 2.5, y: 4.5, rz: -0.5 }));
      // smaller secondary roof above (pagoda-ish stack)
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: 0.3, rx: -0.34 }));
      parts.push(box(2.6, 0.14, 0.7, green, { x: 0, y: 4.7, z: -0.3, rx: 0.34 }));
      parts.push(sph(0.18, gold, { x: 0, y: 4.95, ws: 7, hs: 5 })); // finial bead
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
