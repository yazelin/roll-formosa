/**
 * @file packs/yunlin/archetypes/t4.js — Roll Formosa Yunlin pack, Tier 4
 *   北港街屋與廟 (Beigang streethouses and temple district).
 *
 * 10 ArchetypeDefs in the FROZEN slot order declared by tiers.js
 * TIERS[4].archetypeIds. Size band: radiusNominal 2.5–12 m (buildings, buses,
 * trucks).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure.
 *
 * Slots [0..7] absorbable; slots [8..9] (北港街屋 / 大廟) are repeatable
 * CHUNK LANDMARKS (lower spawnWeight, bigger radius).
 */

import {
  box, cyl, cone, sph, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/** @type {ArchetypeDef[]} */
export const T4_ARCHETYPES = [
  /* 0 ── 醬油工坊 soy_sauce_workshop (Xiluo soy sauce factory building) ─ */
  {
    id: 'soy_sauce_workshop',
    displayName: '醬油工坊',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x8a5a30, 0xa87040, 0x6a4020, 0xc89050, 0xf0e0c0],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Xiluo soy sauce workshop - traditional building with fermentation area
      const parts = [];
      // main building body (traditional brick)
      parts.push(box(2.0, 2.4, 1.6, 0xffffff, { y: 1.2, hex2: 0xd8a868 }));
      // sloped roof
      parts.push(box(2.2, 0.15, 1.8, 0x6a4020, { y: 2.5, rx: 0.12 }));
      // entrance with traditional signboard
      parts.push(box(1.0, 1.4, 0.08, 0x4a3018, { y: 0.8, z: 0.82 })); // door
      parts.push(box(1.4, 0.4, 0.06, 0xc83020, { y: 1.9, z: 0.84 })); // sign board
      // soy sauce barrels/urns outside
      parts.push(cyl(0.35, 0.3, 0.5, 7, 0x5a4028, { x: -0.7, y: 0.25, z: 0.95 }));
      parts.push(cyl(0.3, 0.25, 0.45, 7, 0x6a5038, { x: -1.1, y: 0.22, z: 0.85 }));
      parts.push(cyl(0.32, 0.28, 0.48, 7, 0x5a4028, { x: 0.8, y: 0.24, z: 0.9 }));
      // fermentation area with covered vats
      parts.push(box(0.8, 0.3, 0.8, 0x4a3018, { x: 1.2, y: 0.15, z: -0.3 })); // platform
      parts.push(cyl(0.25, 0.25, 0.4, 6, 0x3a2818, { x: 1.0, y: 0.5, z: -0.3 })); // vat
      parts.push(cyl(0.25, 0.25, 0.4, 6, 0x3a2818, { x: 1.4, y: 0.5, z: -0.3 })); // vat
      // hanging drying rack suggestion
      parts.push(box(0.06, 1.2, 0.06, 0x8a6040, { x: 0.5, y: 1.8, z: 0.9 }));
      parts.push(box(0.06, 1.2, 0.06, 0x8a6040, { x: -0.5, y: 1.8, z: 0.9 }));
      parts.push(box(1.1, 0.06, 0.06, 0x8a6040, { y: 2.4, z: 0.9 })); // crossbar
      return finish(parts);
    },
  },

  /* 1 ── 西螺豆腐厝 Xiluo tofu house (traditional shophouse) ────────────── */
  {
    id: 'xiluo_tofu_house',
    displayName: '西螺豆腐厝',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xc8b898, 0xe8d8b8, 0xb8a888, 0x8a5a30],
    yOffset: -0.20,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional narrow Xiluo old street shophouse (西螺老街窄樓)
      const parts = [];
      // main building body (cream/tan plaster)
      parts.push(box(1.4, 2.8, 1.8, 0xffffff, { y: 1.4, hex2: 0xe8d8c0 }));
      // arcade at ground level
      parts.push(box(1.3, 0.6, 0.15, 0x3a3a38, { y: 0.3, z: 0.85 }));
      // colonial-era decorative facade
      parts.push(box(1.45, 0.18, 0.08, 0xb84428, { y: 2.7, z: 0.92 })); // cornice
      parts.push(box(1.45, 0.08, 0.06, 0xf0c040, { y: 2.5, z: 0.93 })); // gold trim
      // upper floor windows with colonial frames
      parts.push(box(0.4, 0.5, 0.06, 0x5a788c, { x: -0.35, y: 1.8, z: 0.92 }));
      parts.push(box(0.4, 0.5, 0.06, 0x5a788c, { x: 0.35, y: 1.8, z: 0.92 }));
      // window shutters (green)
      parts.push(box(0.08, 0.5, 0.08, 0x2a6a4a, { x: -0.6, y: 1.8, z: 0.88 }));
      parts.push(box(0.08, 0.5, 0.08, 0x2a6a4a, { x: 0.6, y: 1.8, z: 0.88 }));
      // shop signboard
      parts.push(box(0.9, 0.35, 0.05, 0x8a3020, { y: 1.1, z: 0.94 }));
      // roof with traditional tiles
      parts.push(box(1.55, 0.12, 1.9, 0x6a4020, { y: 2.88 }));
      return finish(parts);
    },
  },

  /* 2 ── 穀倉 rice granary / grain silo (農村風景) ───────────────────────── */
  {
    id: 'grain_silo',
    displayName: '穀倉',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc8a060, 0xb89050, 0xd8b070, 0xa88040, 0x6a5030],
    yOffset: -0.10,
    upright: true,
    collisionScale: 0.88,
    buildGeometry(rng) {
      // Traditional Yunlin rice granary - cylindrical concrete silos with conical roofs
      const parts = [];
      // main cylindrical silo body
      parts.push(cyl(0.9, 0.9, 3.2, 10, 0xffffff, { y: 1.6, hex2: 0xe8d8c0 }));
      // conical roof cap
      parts.push(cone(1.0, 0.8, 10, 0x8a6040, { y: 3.6 }));
      // ventilation cap on top
      parts.push(cyl(0.15, 0.1, 0.25, 6, 0x6a5030, { y: 4.1 }));
      // secondary smaller silo
      parts.push(cyl(0.6, 0.6, 2.4, 8, 0xffffff, { x: 1.2, y: 1.2, hex2: 0xe0d0b8 }));
      parts.push(cone(0.7, 0.6, 8, 0x8a6040, { x: 1.2, y: 2.7 }));
      // grain chute/conveyor
      parts.push(box(0.2, 0.15, 1.5, 0x7a6848, { x: 0.6, y: 2.0, rz: -0.4 }));
      // loading platform at base
      parts.push(box(1.8, 0.15, 1.0, 0x8a8078, { x: 0.3, y: 0.08 }));
      // hopper door on main silo
      parts.push(box(0.5, 0.6, 0.1, 0x5a4828, { y: 0.5, z: 0.92 }));
      // ladder on side
      parts.push(box(0.06, 2.5, 0.08, 0x6a6058, { y: 1.5, z: -0.88 }));
      return finish(parts);
    },
  },

  /* 3 ── 超商 convenience store (7-11 / FamilyMart mass) ────────────────── */
  {
    id: 'convenience_store',
    displayName: '超商',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x28a848, 0xff8020, 0xe8e8e8, 0x2e8a4a, 0xf8f8f4],
    yOffset: -0.36,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const brand = rng() < 0.5 ? 0x28a848 : 0xff8020; // green or orange
      const parts = [];
      // box
      parts.push(box(2.4, 1.6, 1.5, 0xffffff, { y: 0.8 }));
      // glass storefront
      parts.push(box(2.3, 1.1, 0.08, 0x8ad0e0, { y: 0.75, z: 0.76 }));
      parts.push(box(2.3, 0.06, 0.12, 0x2a2c30, { y: 1.34, z: 0.76 })); // mullion
      // brand fascia
      parts.push(box(2.5, 0.35, 0.15, brand, { y: 1.58, z: 0.65 }));
      parts.push(box(2.5, 0.06, 0.16, 0xf8f8f4, { y: 1.78, z: 0.66 })); // white trim
      // signpost pylon
      parts.push(cyl(0.08, 0.1, 2.0, 6, 0x7a8898, { x: 1.4, y: 1.0, z: 1.0 }));
      parts.push(box(0.5, 0.7, 0.1, brand, { x: 1.4, y: 1.9, z: 1.0 }));
      // ice box outside
      parts.push(box(0.55, 0.55, 0.4, 0xe8e8e8, { x: -1.0, y: 0.28, z: 0.9 }));
      return finish(parts);
    },
  },

  /* 4 ── 公車 city bus (local public transport bus) ────────────────────── */
  {
    id: 'city_bus',
    displayName: '公車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xe8e8ee, 0xf0c020, 0x1a1c2a, 0x4a8ac8],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const brand = rng() < 0.5 ? 0x2f6db0 : 0x28a848;
      const parts = [];
      // body
      parts.push(box(4.2, 1.4, 1.2, brand, { y: 1.0 }));
      // window band
      parts.push(box(3.8, 0.5, 0.08, 0x5ab0d0, { y: 1.2, z: 0.62 }));
      parts.push(box(3.8, 0.5, 0.08, 0x5ab0d0, { y: 1.2, z: -0.62 }));
      // front windshield
      parts.push(box(0.08, 0.6, 1.0, 0x6ac0e0, { x: -2.05, y: 1.2 }));
      // headlights
      parts.push(box(0.06, 0.15, 0.2, 0xfff8c0, { x: -2.14, y: 0.7, z: 0.4 }));
      parts.push(box(0.06, 0.15, 0.2, 0xfff8c0, { x: -2.14, y: 0.7, z: -0.4 }));
      // destination LED
      parts.push(box(0.04, 0.18, 0.6, 0xf0c020, { x: -2.1, y: 1.45 }));
      // wheels (4)
      const wheel = (wx, wz) => cyl(0.32, 0.32, 0.2, 10, 0x14151f, { x: wx, y: 0.32, z: wz, rx: HALF_PI });
      parts.push(wheel(-1.4, 0.7), wheel(-1.4, -0.7), wheel(1.4, 0.7), wheel(1.4, -0.7));
      // roof AC unit
      parts.push(box(1.5, 0.22, 0.8, 0xe8e8ee, { y: 1.8 }));
      return finish(parts);
    },
  },

  /* 5 ── 垃圾車 garbage truck (municipal compactor) ─────────────────────── */
  {
    id: 'garbage_truck',
    displayName: '垃圾車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0c020, 0xe8a818, 0xd89008, 0x1a1c2a, 0x9aa0ac],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const yellow = 0xf0c020;
      const parts = [];
      // cab
      parts.push(box(1.1, 1.1, 1.2, yellow, { x: -1.55, y: 0.85 }));
      parts.push(box(0.06, 0.55, 0.95, 0x5ab0d0, { x: -2.02, y: 1.0 })); // windshield
      // compactor body
      parts.push(box(2.6, 1.6, 1.25, yellow, { x: 0.5, y: 1.0 }));
      // rear compactor opening
      parts.push(box(0.2, 1.3, 1.1, 0x3a3e48, { x: 1.8, y: 0.85 }));
      // warning stripes on back
      parts.push(box(0.08, 0.2, 1.0, 0x1a1c2a, { x: 1.86, y: 1.4 }));
      parts.push(box(0.08, 0.2, 1.0, 0x1a1c2a, { x: 1.86, y: 1.0 }));
      parts.push(box(0.08, 0.2, 1.0, 0x1a1c2a, { x: 1.86, y: 0.6 }));
      // wheels
      const wheel = (wx, wz) => cyl(0.35, 0.35, 0.22, 10, 0x14151f, { x: wx, y: 0.35, z: wz, rx: HALF_PI });
      parts.push(wheel(-1.3, 0.72), wheel(-1.3, -0.72), wheel(1.0, 0.72), wheel(1.0, -0.72));
      // roof beacon
      parts.push(cyl(0.15, 0.1, 0.18, 6, 0xc83020, { x: -1.55, y: 1.55 }));
      return finish(parts);
    },
  },

  /* 6 ── 加油站 gas station (service canopy + pumps) ────────────────────── */
  {
    id: 'gas_station',
    displayName: '加油站',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xc83020, 0xf8f8f4, 0x3a3e48, 0xf0c020, 0x2a6a9a],
    yOffset: -0.46,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const brand = rng() < 0.5 ? 0xc83020 : 0x2a6a9a;
      const parts = [];
      // canopy roof
      parts.push(box(4.0, 0.2, 2.5, 0xf8f8f4, { y: 2.8 }));
      parts.push(box(4.1, 0.08, 2.6, brand, { y: 2.72 })); // colored trim
      // support columns
      parts.push(cyl(0.15, 0.18, 2.6, 6, 0x3a3e48, { x: -1.6, y: 1.3, z: 1.0 }));
      parts.push(cyl(0.15, 0.18, 2.6, 6, 0x3a3e48, { x: 1.6, y: 1.3, z: 1.0 }));
      parts.push(cyl(0.15, 0.18, 2.6, 6, 0x3a3e48, { x: -1.6, y: 1.3, z: -1.0 }));
      parts.push(cyl(0.15, 0.18, 2.6, 6, 0x3a3e48, { x: 1.6, y: 1.3, z: -1.0 }));
      // pump islands (2)
      parts.push(box(0.5, 0.2, 1.8, 0x7a8090, { x: -0.6, y: 0.1 }));
      parts.push(box(0.5, 0.2, 1.8, 0x7a8090, { x: 0.6, y: 0.1 }));
      // pump units
      parts.push(box(0.35, 0.9, 0.3, 0xf8f8f4, { x: -0.6, y: 0.65, z: 0.5 }));
      parts.push(box(0.35, 0.9, 0.3, 0xf8f8f4, { x: -0.6, y: 0.65, z: -0.5 }));
      parts.push(box(0.35, 0.9, 0.3, 0xf8f8f4, { x: 0.6, y: 0.65, z: 0.5 }));
      parts.push(box(0.35, 0.9, 0.3, 0xf8f8f4, { x: 0.6, y: 0.65, z: -0.5 }));
      // price board
      parts.push(box(0.08, 0.8, 0.6, brand, { x: -2.1, y: 1.6, z: 0 }));
      parts.push(box(0.04, 0.4, 0.5, 0xf0c020, { x: -2.08, y: 1.6, z: 0 })); // numbers
      // office box at back
      parts.push(box(1.8, 1.3, 1.0, 0xe8e8e8, { x: 0, y: 0.65, z: -1.8 }));
      return finish(parts);
    },
  },

  /* 7 ── 騎樓柱 arcade pillar (shopfront covered arcade column) ─────────── */
  {
    id: 'arcade_pillar',
    displayName: '騎樓柱',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 3,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd0c8b8, 0xb8b0a0, 0xe0d8c8, 0x9a9284, 0x7a8090],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      const stone = 0xffffff;
      const parts = [];
      // square column
      parts.push(box(0.45, 3.4, 0.45, stone, { y: 1.7, hex2: 0xe0d8c8 }));
      // base pedestal
      parts.push(box(0.6, 0.25, 0.6, 0x9a9284, { y: 0.12 }));
      // capital
      parts.push(box(0.6, 0.2, 0.6, 0x9a9284, { y: 3.5 }));
      // beam fragment extending from top
      parts.push(box(1.4, 0.28, 0.5, 0xb8b0a0, { y: 3.55, x: 0.5 }));
      // small signage panel
      parts.push(box(0.6, 0.35, 0.06, 0xf8f0e0, { y: 2.5, z: 0.27 }));
      parts.push(box(0.5, 0.25, 0.04, 0xc83020, { y: 2.5, z: 0.30 }));
      // utility box attached
      parts.push(box(0.2, 0.25, 0.12, 0x4a5058, { y: 1.2, z: 0.3 }));
      return finish(parts);
    },
  },

  /* 8 ── 北港街屋群 Beigang streethouse mass (CHUNK LANDMARK) ─────────────── */
  {
    id: 'beigang_streethouse_mass',
    displayName: '北港街屋群',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb84428, 0xd85a38, 0xf0c040, 0x8a6050, 0xf8e8c0],
    yOffset: -0.16,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      const parts = [];
      // Row of 3 varying-height streethouses
      const heights = [2.8, 3.4, 2.5];
      const colors = [0xf8e8d0, 0xd8c8b0, 0xe8d8c0];
      for (let i = 0; i < 3; i++) {
        const x = -1.8 + i * 1.8;
        const h = heights[i];
        // Main building mass
        parts.push(box(1.6, h, 1.2, colors[i], { x, y: h / 2, hex2: 0xffffff }));
        // Arcade at ground level
        parts.push(box(1.5, 0.5, 0.08, 0x3a3a38, { x, y: 0.25, z: 0.58 }));
        // Colonial-style facade details
        parts.push(box(1.65, 0.15, 0.08, 0xb84428, { x, y: h - 0.1, z: 0.62 })); // cornice
        parts.push(box(1.65, 0.08, 0.06, 0xf0c040, { x, y: h - 0.3, z: 0.63 })); // gold trim
        // Windows
        for (let f = 1; f < Math.floor(h / 0.9); f++) {
          parts.push(box(0.45, 0.4, 0.05, 0x5a788c, { x: x - 0.4, y: 0.7 + f * 0.7, z: 0.62 }));
          parts.push(box(0.45, 0.4, 0.05, 0x5a788c, { x: x + 0.4, y: 0.7 + f * 0.7, z: 0.62 }));
        }
      }
      // Shared roof elements
      parts.push(box(5.6, 0.12, 1.25, 0x8a5a30, { y: 3.55 }));
      // Lanterns on middle building
      parts.push(sph(0.15, 0xd83028, { ws: 6, hs: 4, x: 0, y: 2.8, z: 0.7 }));
      parts.push(sph(0.15, 0xd83028, { ws: 6, hs: 4, x: 0, y: 2.4, z: 0.7 }));
      return finish(parts);
    },
  },

  /* 9 ── 大廟 temple mass (Beigang Chaotian Temple style) (CHUNK LANDMARK) ─ */
  {
    id: 'temple_mass',
    displayName: '大廟',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 15,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0xd8d3c5, 0x6e6a5e],
    yOffset: -0.15,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const stone = 0xd8d3c5;
      const parts = [];
      // Main hall body
      parts.push(box(4.0, 2.8, 3.0, 0xffffff, { y: 1.4, hex2: 0xf8f0e0 }));
      // Red front facade
      parts.push(box(4.1, 2.6, 0.12, red, { y: 1.4, z: 1.52 }));
      // Entry doors
      parts.push(box(1.0, 1.8, 0.1, 0x5a3820, { y: 0.9, z: 1.56 }));
      // Dragon columns flanking entry
      parts.push(cyl(0.2, 0.24, 2.4, 8, stone, { x: -1.5, y: 1.2, z: 1.45 }));
      parts.push(cyl(0.2, 0.24, 2.4, 8, stone, { x: 1.5, y: 1.2, z: 1.45 }));
      // Main roof (curved swallowtail style)
      parts.push(box(4.8, 0.2, 3.5, green, { y: 2.95, z: 0.4, rx: -0.15 }));
      parts.push(box(4.8, 0.2, 3.5, green, { y: 2.95, z: -0.4, rx: 0.15 }));
      parts.push(box(4.8, 0.16, 0.2, gold, { y: 3.2 })); // ridge
      // Swallowtail tips
      parts.push(cone(0.2, 0.6, 6, gold, { x: -2.4, y: 3.4, rz: 0.6 }));
      parts.push(cone(0.2, 0.6, 6, gold, { x: 2.4, y: 3.4, rz: -0.6 }));
      // Central ridge ornament (pagoda finial)
      parts.push(cyl(0.15, 0.12, 0.5, 6, gold, { y: 3.45 }));
      parts.push(sph(0.14, gold, { ws: 6, hs: 4, y: 3.8 }));
      // Secondary front roof (lower entrance canopy)
      parts.push(box(3.2, 0.15, 1.2, green, { y: 2.5, z: 1.8, rx: -0.2 }));
      parts.push(box(3.2, 0.1, 0.15, gold, { y: 2.65, z: 1.9 }));
      // Incense burner in front
      parts.push(cyl(0.35, 0.3, 0.5, 8, 0x8a6a30, { y: 0.25, z: 2.2 }));
      // Lanterns on columns
      parts.push(sph(0.18, 0xd83028, { ws: 6, hs: 4, x: -1.5, y: 2.3, z: 1.6 }));
      parts.push(sph(0.18, 0xd83028, { ws: 6, hs: 4, x: 1.5, y: 2.3, z: 1.6 }));
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
