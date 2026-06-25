/**
 * @file archetypes/t5.js — Changhua pack T5 「扇形車庫與老街」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / civic
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/changhua/tiers.js — spelling must NOT drift.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * Palette = 4–5 hex tints (catalog.test enforces 4–6). Bodies meant to be
 * tinted per-instance are baked near-white (0xffffff) so instanceColor reads
 * through; fixed parts (glass, steel, asphalt) are baked dark/desaturated so
 * tints only nudge them.
 *
 * yOffset = -1 - minY of the normalized geometry: every object here sits on
 * the ground (bottom near the sphere's lowest point) so yOffset ≈ -1 + a
 * little, measured from the built geometry and rounded.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 老街牌樓 (old street archway / paifang) --------------- */
  {
    id: 'old_street_archway',
    displayName: '老街牌樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe0a83a, 0x2e5a3a, 0x6a4a32, 0xfff2c0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // 鹿港老街牌樓 (traditional Chinese paifang archway)
      const parts = [
        // main pillars (紅柱)
        cyl(0.4, 0.4, 5.5, 8, 0xc83828, { x: -2.5, y: 2.75 }),
        cyl(0.4, 0.4, 5.5, 8, 0xc83828, { x: 2.5, y: 2.75 }),
        cyl(0.35, 0.35, 5.0, 8, 0xc83828, { x: -1.0, y: 2.5 }),
        cyl(0.35, 0.35, 5.0, 8, 0xc83828, { x: 1.0, y: 2.5 }),
        // pillar bases
        box(1.0, 0.4, 1.0, 0x8a7a6a, { x: -2.5, y: 0.2 }),
        box(1.0, 0.4, 1.0, 0x8a7a6a, { x: 2.5, y: 0.2 }),
        box(0.9, 0.35, 0.9, 0x8a7a6a, { x: -1.0, y: 0.18 }),
        box(0.9, 0.35, 0.9, 0x8a7a6a, { x: 1.0, y: 0.18 }),
        // main horizontal beam (橫樑)
        box(6.0, 0.5, 0.8, 0xe0a83a, { y: 5.2 }),
        // secondary beam
        box(5.5, 0.3, 0.6, 0xc83828, { y: 4.6 }),
        // curved roof (燕尾脊)
        cyl(3.2, 3.2, 6.5, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 6.0 }),
        // roof ridge with swallowtails
        box(6.2, 0.2, 0.25, 0xe0a83a, { y: 6.8 }),
        box(0.8, 0.15, 0.2, 0xe0a83a, { rz: 0.5, x: -3.2, y: 6.9 }),
        box(0.8, 0.15, 0.2, 0xe0a83a, { rz: -0.5, x: 3.2, y: 6.9 }),
        // name plaque (匾額)
        box(2.2, 0.8, 0.15, 0x4a3a2a, { y: 5.2, z: 0.5 }),
        box(2.0, 0.6, 0.08, 0xfff2c0, { y: 5.2, z: 0.58 }),
        // decorative dragons
        box(0.6, 0.4, 0.3, 0xe0a83a, { x: -2.5, y: 5.8 }),
        box(0.6, 0.4, 0.3, 0xe0a83a, { x: 2.5, y: 5.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 扇形車庫單格 (fan-shaped roundhouse bay) -------------- */
  {
    id: 'roundhouse_bay',
    displayName: '扇形車庫單格',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x6a5a4a, 0x8a7a6a, 0xb85a3a, 0x3a3a3a, 0xd8d4cc],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 彰化扇形車庫單一車格 (single bay of the famous fan-shaped roundhouse)
      const parts = [
        // rear curved wall (弧形後牆)
        cyl(3.5, 3.5, 4.5, 12, 0xb85a3a, { y: 2.25, theta0: -0.4, thetaLen: 0.8 }),
        // side walls
        box(4.5, 4.5, 0.4, 0x8a7a6a, { x: 0, y: 2.25, z: 2.0 }),
        box(4.5, 4.5, 0.4, 0x8a7a6a, { x: 0, y: 2.25, z: -2.0 }),
        // floor / platform
        box(5.0, 0.3, 4.2, 0x6a5a4a, { y: 0.15 }),
        // rail tracks on floor
        box(5.5, 0.1, 0.15, 0x4a4a4a, { y: 0.25, z: 0.4 }),
        box(5.5, 0.1, 0.15, 0x4a4a4a, { y: 0.25, z: -0.4 }),
        // arched roof structure (拱形屋頂)
        cyl(2.8, 2.8, 5.5, 8, 0x6a5a4a, { theta0: 0, thetaLen: PI, rx: HALF_PI, y: 4.0 }),
        // roof ridge beam
        box(5.5, 0.3, 0.4, 0x5a4a3a, { y: 5.2 }),
        // entrance door frame
        box(0.3, 4.2, 4.2, 0x4a3a2a, { x: 2.6, y: 2.1 }),
        // maintenance pit
        box(4.0, 0.5, 0.8, 0x2a2a2a, { y: -0.1 }),
        // steam locomotive inside (simplified)
        cyl(0.5, 0.5, 2.0, 6, 0x2a2a2a, { rz: HALF_PI, x: -0.5, y: 0.8 }),
        box(0.8, 0.7, 0.8, 0x3a3a3a, { x: -1.8, y: 0.75 }),
        // smokestack
        cyl(0.15, 0.2, 0.4, 6, 0x2a2a2a, { x: 0.3, y: 1.25 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 蚵殼山 (oyster shell mound) -------------------------- */
  {
    id: 'oyster_shell_mound',
    displayName: '蚵殼山',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e4dc, 0xd8d4cc, 0xc8c4bc, 0xf0ece4, 0x9a968e],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 彰化芳苑蚵殼山 (coastal oyster shell processing mound)
      const parts = [
        // main mound shape (irregular pile of oyster shells)
        sph(2.8, 0xe8e4dc, { ws: 8, hs: 6, y: 1.4, sy: 0.6 }), // main dome
        sph(2.0, 0xd8d4cc, { ws: 7, hs: 5, x: 1.2, y: 1.0, sy: 0.5 }), // side pile
        sph(1.6, 0xc8c4bc, { ws: 6, hs: 5, x: -1.4, y: 0.8, sy: 0.5 }), // side pile
        sph(1.2, 0xf0ece4, { ws: 5, hs: 4, x: 0.5, z: 1.5, y: 0.6, sy: 0.5 }), // front pile
        // scattered shell texture (small bumps)
        sph(0.5, 0xe8e4dc, { ws: 4, hs: 3, x: 2.0, y: 0.9, z: 0.8 }),
        sph(0.5, 0xd8d4cc, { ws: 4, hs: 3, x: -2.0, y: 0.7, z: -0.6 }),
        sph(0.4, 0xc8c4bc, { ws: 4, hs: 3, x: 0, y: 2.0, z: 0 }),
        // ground base
        cyl(3.5, 3.5, 0.3, 10, 0x9a968e, { y: 0.15 }),
        // oyster processing equipment (simple)
        box(1.5, 1.2, 0.8, 0x6a6a6a, { x: -2.8, y: 0.6 }), // sorting table
        box(1.2, 0.6, 0.6, 0x4a4a4a, { x: -2.8, y: 1.5 }), // baskets
        // worker tools
        cyl(0.08, 0.08, 1.2, 4, 0x6a4a32, { x: -3.2, y: 0.6, rz: 0.3 }), // rake
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 花田 (Tianwei flower field) -------------------------- */
  {
    id: 'flower_field',
    displayName: '花田',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe04080, 0xffd040, 0xff6060, 0x4a8a4a, 0xe8e4dc],
    yOffset: -0.65,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // 田尾公路花園花田 (Tianwei Highway Garden flower field) - simplified for tri budget
      const parts = [
        // ground / soil base
        box(6.0, 0.2, 5.0, 0x6a5040, { y: 0.1 }),
      ];
      // colorful flower rows (simplified - 3 rows with flower mass blobs)
      const flowerColors = [0xe04080, 0xffd040, 0xff6060];
      for (let row = 0; row < 3; row++) {
        const z = -1.5 + row * 1.5;
        // raised bed
        parts.push(box(5.6, 0.25, 0.8, 0x5a4030, { y: 0.25, z }));
        // flower mass (continuous colorful strip)
        parts.push(box(5.4, 0.35, 0.6, flowerColors[row], { y: 0.55, z }));
        // green foliage base
        parts.push(box(5.4, 0.2, 0.55, 0x4a8a4a, { y: 0.38, z }));
      }
      // greenhouse frame at one end (simplified)
      parts.push(box(1.8, 2.0, 3.0, 0xe8e8e8, { x: -3.5, y: 1.0, hex2: 0xd0e8f0 }));
      parts.push(cyl(1.5, 1.5, 2.0, 5, 0xe0f0f8, { theta0: 0, thetaLen: PI, rx: HALF_PI, x: -3.5, y: 2.0 }));
      // irrigation pipe
      parts.push(cyl(0.08, 0.08, 5.5, 5, 0x4a6a8a, { rz: HALF_PI, y: 0.45, z: 2.2 }));
      // signpost
      parts.push(cyl(0.1, 0.1, 1.5, 5, 0x6a4a32, { x: 3.0, y: 0.75, z: 2.2 }));
      parts.push(box(1.0, 0.5, 0.08, 0xfff2c0, { x: 3.0, y: 1.6, z: 2.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 碾米廠 (Changhua rice mill) ------------------------ */
  {
    id: 'rice_mill',
    displayName: '碾米廠',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8a898, 0x9a8a78, 0xc8b8a8, 0x6a5a4a, 0xf0e8d0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 彰化碾米廠 (traditional rice mill building)
      const parts = [
        // main mill building
        box(3.0, 3.5, 2.5, 0xffffff, { y: 1.75, hex2: 0xc8b8a8 }), // brick body
        // corrugated tin roof
        box(3.2, 0.15, 2.7, 0x9a8a78, { y: 3.6, rx: 0.1 }),
        // roof ridge
        box(3.3, 0.2, 0.3, 0x8a7a6a, { y: 3.75 }),
        // large sliding doors
        box(1.4, 2.0, 0.1, 0x6a5a4a, { y: 1.0, z: 1.3 }),
        // rice silo/hopper
        cyl(0.8, 0.6, 2.5, 6, 0xb8a898, { x: -1.8, y: 2.5 }),
        cone(0.6, 0.5, 6, 0x9a8a78, { x: -1.8, y: 3.8 }),
        // conveyor chute
        box(0.3, 0.2, 1.5, 0x8a7a6a, { x: -1.8, y: 1.5, z: 0.5, rx: 0.3 }),
        // rice bags stacked outside
        box(0.6, 0.4, 0.4, 0xf0e8d0, { x: 1.2, y: 0.2, z: 1.5 }),
        box(0.6, 0.4, 0.4, 0xf0e8d0, { x: 1.8, y: 0.2, z: 1.5 }),
        box(0.6, 0.4, 0.4, 0xf0e8d0, { x: 1.5, y: 0.6, z: 1.5 }),
        // ventilation
        cyl(0.15, 0.15, 0.4, 5, 0x8a8a8a, { x: 1.0, y: 3.9 }),
        // signage
        box(1.5, 0.4, 0.08, 0xfff2c0, { y: 3.2, z: 1.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 葡萄園棚架 (Changhua vineyard trellis) -------------- */
  {
    id: 'vineyard_trellis',
    displayName: '葡萄園棚架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a8a4a, 0x5a7a3a, 0x8a6a4a, 0x9a5a8a, 0xf0e8d0],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 彰化大村葡萄園棚架 (Dacun grape vineyard trellis) - simplified for tri budget
      const parts = [
        // ground / soil
        box(5.0, 0.15, 4.0, 0x6a5040, { y: 0.08 }),
      ];
      // wooden support posts (reduced to 4)
      const posts = [[-2.0, -1.5], [-2.0, 1.5], [2.0, -1.5], [2.0, 1.5]];
      for (const [px, pz] of posts) {
        parts.push(cyl(0.12, 0.12, 2.5, 4, 0x8a6a4a, { x: px, z: pz, y: 1.25 }));
      }
      // horizontal trellis framework (reduced)
      parts.push(box(4.5, 0.1, 0.1, 0x7a5a3a, { y: 2.4, z: -1.5 }));
      parts.push(box(4.5, 0.1, 0.1, 0x7a5a3a, { y: 2.4, z: 1.5 }));
      parts.push(box(0.1, 0.1, 3.2, 0x7a5a3a, { y: 2.4, x: -2.0 }));
      parts.push(box(0.1, 0.1, 3.2, 0x7a5a3a, { y: 2.4, x: 2.0 }));
      // grape vine canopy (simplified - fewer segments)
      parts.push(sph(1.8, 0x6a8a4a, { ws: 5, hs: 3, y: 2.6, sy: 0.3 }));
      parts.push(sph(1.4, 0x5a7a3a, { ws: 5, hs: 3, x: 1.0, y: 2.5, sy: 0.3 }));
      // grape bunches (reduced to 2)
      parts.push(sph(0.3, 0x9a5a8a, { ws: 4, hs: 3, x: -0.5, y: 2.1, z: 0.3 }));
      parts.push(sph(0.28, 0x8a4a7a, { ws: 4, hs: 3, x: 0.8, y: 2.0, z: -0.4 }));
      // harvest basket
      parts.push(cyl(0.4, 0.35, 0.3, 5, 0xc8a868, { x: 1.5, y: 0.25, z: 1.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 醬油工坊 (Changhua soy sauce workshop) ------------- */
  {
    id: 'soy_sauce_workshop',
    displayName: '醬油工坊',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6a4a32, 0x8a6a4a, 0x4a3a2a, 0xc8a060, 0xf0e8d0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // 彰化傳統醬油工坊 (traditional soy sauce workshop)
      const parts = [
        // main building
        box(2.5, 2.8, 2.2, 0xffffff, { y: 1.4, hex2: 0xd8ccc0 }), // brick body
        // traditional tiled roof
        cyl(1.5, 1.5, 2.8, 4, 0x8a5030, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.0 }),
        // roof ridge
        box(2.9, 0.15, 0.2, 0x6a3a20, { y: 3.3 }),
        // wooden entrance
        box(0.8, 1.5, 0.1, 0x6a4a32, { y: 0.75, z: 1.15 }),
        // soy sauce fermentation vats (露天醬缸)
        cyl(0.5, 0.45, 0.6, 6, 0x4a3a2a, { x: -1.8, y: 0.3, z: 0 }),
        cyl(0.5, 0.45, 0.6, 6, 0x4a3a2a, { x: -1.8, y: 0.3, z: 0.9 }),
        cyl(0.5, 0.45, 0.6, 6, 0x4a3a2a, { x: -1.8, y: 0.3, z: -0.9 }),
        // vat covers (bamboo woven lids)
        cyl(0.52, 0.52, 0.08, 6, 0xc8a868, { x: -1.8, y: 0.65, z: 0 }),
        cyl(0.52, 0.52, 0.08, 6, 0xc8a868, { x: -1.8, y: 0.65, z: 0.9 }),
        // signboard
        box(1.2, 0.5, 0.08, 0x4a3a2a, { y: 2.4, z: 1.15 }),
        box(1.0, 0.35, 0.05, 0xfff2c0, { y: 2.4, z: 1.2 }),
        // drying rack with bottles
        box(1.5, 1.2, 0.1, 0x8a6a4a, { x: 1.5, y: 0.6, z: 0 }),
        box(0.15, 0.4, 0.15, 0x4a3a2a, { x: 1.3, y: 0.3, z: 0 }),
        box(0.15, 0.4, 0.15, 0x4a3a2a, { x: 1.7, y: 0.3, z: 0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 彰化火車站前 (Changhua train station front) ------- */
  {
    id: 'changhua_station_front',
    displayName: '彰化火車站前',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8ccc0, 0xc8b8a8, 0x8a5030, 0xe0a83a, 0x3a4a3a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // 彰化火車站 (historic Changhua Railway Station)
      const parts = [
        // main station building
        box(4.5, 2.8, 2.8, 0xffffff, { y: 1.4, hex2: 0xd8ccc0 }), // cream plaster body
        // colonial-style arched entrance portico
        box(2.0, 0.3, 0.8, 0xc8b8a8, { y: 2.9, z: 1.5 }), // portico top
        // three arched openings
        cyl(0.5, 0.5, 0.8, 5, 0x4a3a2a, { theta0: 0, thetaLen: PI, rx: HALF_PI, x: -0.7, y: 1.5, z: 1.5 }),
        cyl(0.5, 0.5, 0.8, 5, 0x4a3a2a, { theta0: 0, thetaLen: PI, rx: HALF_PI, x: 0, y: 1.5, z: 1.5 }),
        cyl(0.5, 0.5, 0.8, 5, 0x4a3a2a, { theta0: 0, thetaLen: PI, rx: HALF_PI, x: 0.7, y: 1.5, z: 1.5 }),
        // entrance columns
        cyl(0.12, 0.12, 2.0, 5, 0xd8ccc0, { x: -1.0, y: 1.0, z: 1.45 }),
        cyl(0.12, 0.12, 2.0, 5, 0xd8ccc0, { x: 1.0, y: 1.0, z: 1.45 }),
        // traditional tiled roof (hipped)
        cyl(1.6, 1.6, 4.8, 4, 0x8a5030, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.2 }),
        // roof ridge
        box(4.6, 0.15, 0.2, 0x6a3a20, { y: 3.5 }),
        // station clock
        cyl(0.35, 0.35, 0.1, 8, 0xf0ece4, { y: 2.5, z: 1.45 }),
        // platform canopy extending to side
        box(3.5, 0.12, 1.5, 0x8a8a8a, { x: 0, y: 2.2, z: -1.5 }),
        cyl(0.08, 0.08, 1.8, 5, 0x6a6a6a, { x: -1.5, y: 1.1, z: -2.0 }),
        cyl(0.08, 0.08, 1.8, 5, 0x6a6a6a, { x: 1.5, y: 1.1, z: -2.0 }),
        // station name sign
        box(1.8, 0.35, 0.08, 0xe0a83a, { y: 2.7, z: 1.45 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 商辦塔樓 commercial_tower (CHUNK LANDMARK) --------- */
  {
    id: 'commercial_tower',
    displayName: '商辦塔樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e4e66, 0xaecae0, 0x7a8aa0, 0x232c38, 0xe6eef6],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Big setback skyscraper — the district's repeatable landmark mass:
      // wide podium → tapered banded shaft → crown + antenna.
      return finish([
        // multi-floor podium
        box(4.2, 1.8, 3.4, 0xffffff, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x6a7888, { y: 1.85 }),
        // main banded shaft (tall)
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x28323e, 0xfff0c0, rng, { y: 6.5 }),
        // mullion fins front
        box(0.12, 9.0, 0.12, 0x2a3340, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x2a3340, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback
        box(2.4, 0.4, 1.9, 0x7a8aa0, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xe6eef6, 0x33404f, 0xfff0c0, rng, { y: 13.1 }),
        // crown
        box(1.5, 0.6, 1.2, 0xaecae0, { y: 15.1 }),
        cone(0.9, 1.2, 6, 0x55657a, { y: 16.0 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.6 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 18.9 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 百貨大樓 department_mass (CHUNK LANDMARK) ---------- */
  {
    id: 'department_mass',
    displayName: '百貨大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xcabfa8, 0xe8dcc4, 0x8a7c60, 0xb8443a, 0xf2ead6],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A whole department-store block: a broad multi-wing mall mass with a
      // curved glass atrium, escalator-glass front, brand crown.
      const parts = [
        // two stacked retail volumes (wide low + narrower upper)
        box(5.6, 3.6, 4.2, 0xffffff, { y: 2.0 }), // lower mass (tinted)
        box(4.2, 2.6, 3.4, 0xffffff, { y: 5.1 }), // upper mass
        box(5.7, 0.3, 4.3, 0x9a8c70, { y: 3.85 }), // mid cornice
        box(4.3, 0.3, 3.5, 0x9a8c70, { y: 6.45 }), // upper cornice
        // curved glass atrium bay on the front (half-cylinder)
        cyl(1.5, 1.5, 4.6, 9, 0x9fc4d8, { y: 2.3, z: 2.1, rx: HALF_PI,
          theta0: -HALF_PI, thetaLen: PI }),
        box(2.6, 4.4, 0.12, 0x2c3a44, { y: 2.3, z: 2.0 }), // atrium dark frame behind glass
        // entrance canopy + brand band
        box(3.2, 0.22, 1.2, 0xb8443a, { y: 1.5, z: 2.7 }),
        box(4.2, 0.7, 0.16, 0xb8443a, { y: 6.9, z: 1.74 }), // upper brand band
        box(4.0, 0.5, 0.06, 0xf2ead6, { y: 6.9, z: 1.82 }), // band face
        // rooftop services + sign pylon
        box(1.4, 0.7, 1.0, 0x6a6050, { x: 1.0, y: 6.9 }),
        box(0.5, 1.8, 0.5, 0xb8443a, { x: -1.4, y: 7.3 }), // sign pylon
      ];
      // clerestory window rows on both volumes
      for (let i = 0; i < 7; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.6, 0.05, lit, { x: -2.4 + i * 0.8, y: 3.1, z: 2.12 }));
      }
      for (let i = 0; i < 5; i++) {
        const lit = rng() < 0.45 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.5, 0.5, 0.05, lit, { x: -1.6 + i * 0.8, y: 5.5, z: 1.72 }));
      }
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
