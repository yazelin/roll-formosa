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

  /* ---- slot 4: 停車塔 parking_tower ------------------------------- */
  {
    id: 'parking_tower',
    displayName: '停車塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x9aa0a6, 0x7a8088, 0xc0c4ca, 0x5a6068, 0xe0a838],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Mechanical car-stacker: a tall narrow concrete shaft with open deck
      // slots (dark gaps) and parked-car chips peeking out.
      const parts = [
        box(2.0, 7.0, 2.4, 0xffffff, { y: 3.6 }), // shaft (tinted concrete)
        // corner columns to emphasize the open-frame look
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: -1.15 }),
        box(2.0, 0.4, 2.4, 0x7a8088, { y: 7.3 }), // roof slab
        box(1.0, 0.7, 0.1, 0xe0a838, { y: 0.5, z: 1.22 }), // entry gate (yellow)
      ];
      // 6 deck floors: each a dark slot + a colored car chip on the front
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 })); // open deck shadow
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 })); // car chip
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 巨型看板 giant_billboard --------------------------- */
  {
    id: 'giant_billboard',
    displayName: '巨型看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46, 0xf2f2ee],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // A rooftop / roadside billboard: big bright panel on a lattice gantry.
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0, rz: 0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0xffffff, { y: 5.4, z: 0.13 }), // ad face (tinted bright)
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // color blocks on the ad face (deterministic mock graphic)
      const adHex = [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46];
      for (let i = 0; i < 4; i++) {
        const w = 0.9 + (i % 2) * 0.4;
        parts.push(box(w, 1.6 - (i % 2) * 0.6, 0.04, adHex[i], {
          x: -1.7 + i * 1.15, y: 5.4, z: 0.17,
        }));
      }
      // spotlights
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.6, y: 6.6, rx: 0.6 }));
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.6, y: 6.6, rx: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 玻璃帷幕街屋 glass_curtain_house ------------------- */
  {
    id: 'glass_curtain_house',
    displayName: '玻璃帷幕街屋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x6fbfd0, 0xbfeaf0, 0x3a6a78, 0x2e3744, 0xe8f4f6],
    yOffset: -0.1,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Narrow mid-rise street shophouse with a full glass curtain wall front.
      const parts = [
        box(2.2, 5.2, 2.0, 0xffffff, { y: 2.8 }), // body (tinted concrete sides)
        // glass curtain wall on the front (proud, gridded)
        box(2.0, 4.6, 0.14, 0x2e3744, { y: 2.9, z: 1.02 }), // mullion grid (dark)
        box(1.8, 4.4, 0.06, 0x8fd6e2, { y: 2.9, z: 1.1 }), // glass (tinted blue-green)
        // ground-floor shop entrance
        box(2.0, 0.9, 0.1, 0x20262c, { y: 0.5, z: 1.06 }),
        box(1.2, 0.7, 0.06, 0xbfeaf0, { y: 0.5, z: 1.12 }), // bright entry glass
        // parapet + a small rooftop water tank
        box(2.3, 0.24, 2.1, 0x4a8090, { y: 5.5 }),
        cyl(0.4, 0.4, 0.6, 7, 0x9aa0a8, { x: 0.5, y: 5.9 }),
      ];
      // horizontal floor-line mullions across the glass (5 floors)
      for (let f = 1; f < 5; f++) {
        parts.push(box(1.85, 0.07, 0.04, 0x223038, { y: 0.6 + f * 0.95, z: 1.14 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 銀行 bank ------------------------------------------ */
  {
    id: 'bank',
    displayName: '銀行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xd8d0bc, 0xeae4d2, 0x9a8e72, 0x3a4a6a, 0xc8a84a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Classical-front bank: stone block with a portico of fat columns + pediment.
      const parts = [
        box(4.0, 3.4, 3.0, 0xffffff, { y: 1.9 }), // main hall (tinted stone)
        box(4.2, 0.3, 3.2, 0x9a8e72, { y: 3.7 }), // cornice
        // portico: entablature beam + triangular pediment up front
        box(3.6, 0.4, 0.5, 0xeae4d2, { y: 3.0, z: 1.6 }), // architrave
        // pediment (a wide flat triangle via a thin scaled box rotated? use cone-ish prism)
        box(3.6, 0.6, 0.4, 0xeae4d2, { y: 3.5, z: 1.55, sx: 1, sy: 1, sz: 1 }),
        cone(1.9, 0.7, 4, 0xe2dcca, { y: 3.95, z: 1.55, ry: PI / 4, sz: 0.25 }), // pediment apex
        // 4 fat columns
        box(2.0, 0.2, 1.0, 0x8a7e64, { y: 0.18, z: 1.7 }), // stylobate / steps
      ];
      for (let i = 0; i < 4; i++) {
        const x = -1.35 + i * 0.9;
        parts.push(cyl(0.26, 0.28, 2.5, 6, 0xf0ead8, { x, y: 1.55, z: 1.7 })); // shaft
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 0.34, z: 1.7 })); // base
        parts.push(box(0.66, 0.16, 0.66, 0xd8d0bc, { x, y: 2.78, z: 1.7 })); // capital
      }
      // gold name plaque + door
      parts.push(box(2.0, 0.34, 0.08, 0xc8a84a, { y: 3.0, z: 1.84 }));
      parts.push(box(0.9, 1.6, 0.08, 0x2a3a58, { y: 1.0, z: 1.76 })); // dark glass door
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
