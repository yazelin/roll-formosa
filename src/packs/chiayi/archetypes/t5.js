/**
 * @file archetypes/t5.js — Chiayi pack T5 「嘉義車站商圈」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / civic
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/chiayi/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 林業商辦 forestry_office (wood-city style office) ---- */
  {
    id: 'forestry_office',
    displayName: '林業商辦',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xe8d8c0, 0xd0c0a0, 0x8a7050, 0x5a4028, 0xf0e8d8],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Chiayi wood-city style office: warm tones with wood-inspired facade
      const wood = 0x5a4028;
      return finish([
        towerBanded(2.6, 7.2, 2.0, 14, 0xfaf0e0, 0x5a4030, 0xffd890, rng, { y: 3.6 }),
        // vertical wood trim fins (wood-city motif)
        box(0.12, 7.2, 0.1, wood, { x: -0.8, y: 3.6, z: 1.02 }),
        box(0.12, 7.2, 0.1, wood, { x: 0.0, y: 3.6, z: 1.02 }),
        box(0.12, 7.2, 0.1, wood, { x: 0.8, y: 3.6, z: 1.02 }),
        box(0.12, 7.2, 0.1, wood, { x: -0.8, y: 3.6, z: -1.02 }),
        box(0.12, 7.2, 0.1, wood, { x: 0.8, y: 3.6, z: -1.02 }),
        // ground-floor lobby (wood-framed entry)
        box(2.8, 0.9, 2.2, wood, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0xc8e0e8, { y: 0.4, z: 1.12 }), // lobby glass
        // Japanese-style roof cap
        box(2.4, 0.2, 1.9, wood, { y: 7.3 }),
        box(2.0, 0.4, 1.6, 0x8a6a48, { y: 7.6 }), // pitched roof
        // rooftop with wood-city motif
        box(1.0, 0.4, 0.8, 0x6a5040, { y: 7.95 }),
        cyl(0.05, 0.05, 1.0, 6, 0x808080, { y: 8.65 }),
      ]);
    },
  },

  /* ---- slot 1: 耐斯百貨 nice_plaza (Chiayi's iconic department store) -- */
  {
    id: 'nice_plaza',
    displayName: '耐斯百貨',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8e0d0, 0xf0e8d8, 0x8a7a64, 0x2a6a9a, 0xf8f0e0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 耐斯百貨 (Nice Plaza): Chiayi's major department store with blue accent
      const parts = [
        box(4.4, 4.6, 3.4, 0xffffff, { y: 2.5 }), // main mass (cream tint)
        box(4.5, 0.3, 3.5, 0x8a8070, { y: 4.95 }), // cornice cap
        // glass podium (ground floors) wrapping the front
        box(4.6, 1.5, 0.4, 0x2b3640, { y: 0.95, z: 1.7 }), // dark glass frame
        box(4.2, 1.2, 0.06, 0xb9c8da, { y: 0.95, z: 1.92 }), // bright display glass
        // entrance canopy with Nice Plaza blue
        box(2.0, 0.18, 1.0, 0x2a6a9a, { y: 1.9, z: 2.0 }),
        cyl(0.08, 0.08, 1.7, 6, 0x6a6050, { x: -0.8, y: 1.0, z: 2.4 }),
        cyl(0.08, 0.08, 1.7, 6, 0x6a6050, { x: 0.8, y: 1.0, z: 2.4 }),
        // vertical brand band with Nice Plaza blue
        box(0.5, 3.6, 0.12, 0x2a6a9a, { x: -2.15, y: 2.9, z: 1.66 }),
        box(0.34, 3.2, 0.06, 0xf8f0e0, { x: -2.15, y: 2.9, z: 1.73 }),
        // Nice signage on top
        box(1.4, 0.5, 0.1, 0x2a6a9a, { y: 5.15, z: 1.7 }),
      ];
      // a row of square clerestory windows along the upper facade
      for (let i = 0; i < 6; i++) {
        const lit = rng() < 0.5 ? 0xfff0c8 : 0x6a7280;
        parts.push(box(0.42, 0.5, 0.05, lit, { x: -1.7 + i * 0.68, y: 4.0, z: 1.72 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 嘉義車站 chiayi_station_plaza (historic Japanese-era station) -- */
  {
    id: 'chiayi_station_plaza',
    displayName: '嘉義車站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8d8c0, 0xd0c0a8, 0x8a7060, 0x5a4030, 0xf0e8d8],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 嘉義車站: Japanese colonial-era station with distinctive roof and clock tower
      const parts = [
        // main station building (cream-colored colonial style)
        box(6.0, 2.4, 3.2, 0xffffff, { y: 1.4 }), // main hall (tinted cream)
        box(6.1, 0.2, 3.3, 0x8a7060, { y: 2.7 }), // cornice
        // central section with arched windows
        box(2.8, 2.8, 3.4, 0xfaf0e0, { y: 1.6 }), // central bay (taller)
        // pitched roof (Japanese-era style)
        box(6.2, 0.15, 3.4, 0x5a4030, { y: 2.85, rz: 0.15 }), // main roof slope
        box(6.2, 0.15, 3.4, 0x5a4030, { y: 2.85, rz: -0.15 }), // main roof slope
        box(3.0, 0.15, 3.6, 0x6a5040, { y: 3.2, rz: 0.2 }), // central roof slope
        box(3.0, 0.15, 3.6, 0x6a5040, { y: 3.2, rz: -0.2 }), // central roof slope
        // station entrance (triple arches)
        box(4.0, 1.4, 0.15, 0x4a3828, { y: 0.9, z: 1.7 }), // entrance dark recess
      ];
      // arched entrance openings
      for (let i = 0; i < 3; i++) {
        const x = -1.0 + i * 1.0;
        parts.push(box(0.7, 1.2, 0.1, 0xf8f0e0, { x, y: 0.8, z: 1.76 })); // arch fill (light)
        parts.push(box(0.08, 1.2, 0.12, 0x5a4030, { x: x - 0.35, y: 0.8, z: 1.74 })); // pilaster
      }
      // clock on the central facade
      parts.push(cyl(0.4, 0.4, 0.1, 8, 0xf8f0e0, { y: 2.4, z: 1.75, rx: HALF_PI }));
      parts.push(cyl(0.32, 0.32, 0.05, 8, 0x2a2020, { y: 2.4, z: 1.78, rx: HALF_PI }));
      // platform canopy extending to the side
      box(4.0, 0.12, 2.0, 0xc8c0b0, { x: 3.5, y: 2.0, z: 0 }); // platform roof
      // railway tracks (simplified)
      parts.push(box(7.0, 0.08, 0.12, 0x5a5a5a, { y: 0.04, z: -0.8 }));
      parts.push(box(7.0, 0.08, 0.12, 0x5a5a5a, { y: 0.04, z: -1.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 車站跨站天橋 station_overpass (Chiayi station style) -- */
  {
    id: 'station_overpass',
    displayName: '車站跨站天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8d8c0, 0xd0c0a8, 0x8a7060, 0x5a4030, 0xf0e8d8],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Chiayi station overpass: Japanese colonial style with warm wood tones
      const parts = [
        // span deck (warm cream tones like station)
        box(6.4, 0.32, 1.3, 0xfaf0e0, { y: 2.6 }),
        // railings (dark wood style)
        box(6.4, 0.08, 0.06, 0x5a4030, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x5a4030, { y: 3.1, z: -0.6 }),
        // peaked roof canopy (colonial station style)
        box(6.4, 0.06, 0.9, 0x8a7060, { y: 3.55, z: 0.45, rx: 0.28 }),
        box(6.4, 0.06, 0.9, 0x8a7060, { y: 3.55, z: -0.45, rx: -0.28 }),
        box(6.4, 0.1, 0.2, 0x6a5040, { y: 3.85 }), // dark wood ridge
      ];
      // railing posts (wood style) — fewer posts to save tris
      for (let i = 0; i < 3; i++) {
        const x = -2.4 + i * 2.4;
        parts.push(box(0.06, 0.5, 0.06, 0x6a5040, { x, y: 2.85, z: 0.6 }));
        parts.push(box(0.06, 0.5, 0.06, 0x6a5040, { x, y: 2.85, z: -0.6 }));
      }
      // twin stair towers (colonial cream/wood style) — simplified
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.0, 2.7, 1.2, 0xf0e8d8, { x: sx, y: 1.35 }));
        parts.push(box(1.02, 0.12, 1.22, 0x8a7060, { x: sx, y: 2.7 })); // cornice
        // 2 stair treads instead of 3
        for (let s = 0; s < 2; s++) {
          parts.push(box(0.9, 0.07, 0.34, 0x8a7060, {
            x: sx, y: 0.6 + s * 0.85, z: 0.7 + s * 0.3,
          }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 木造停車場 wood_parking (Hinoki Village style) ----- */
  {
    id: 'wood_parking',
    displayName: '木造停車場',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xc8b898, 0xe8d8c0, 0x6a5038, 0xf0e0c8],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Chiayi wood-city style parking: warm wood tones with colonial influence
      const wood = 0x6a5038;
      const parts = [
        box(2.0, 7.0, 2.4, 0xfaf0e0, { y: 3.6 }), // shaft (cream tint)
        // dark wood corner columns (Japanese colonial style)
        box(0.24, 7.0, 0.24, wood, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.24, 7.0, 0.24, wood, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.24, 7.0, 0.24, wood, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.24, 7.0, 0.24, wood, { x: 0.95, y: 3.6, z: -1.15 }),
        // Japanese-era pitched roof cap
        box(2.2, 0.15, 2.6, wood, { y: 7.2 }),
        box(1.8, 0.4, 2.2, 0x8a6a48, { y: 7.5 }), // pitched roof
        box(1.0, 0.7, 0.1, wood, { y: 0.5, z: 1.22 }), // wood-framed entry
      ];
      // deck floors with wood trim
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.1, 0.08, wood, { y: y + 0.35, z: 1.18 })); // wood trim
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 阿里山森鐵看板 alishan_billboard (Alishan railway ad) - */
  {
    id: 'alishan_billboard',
    displayName: '阿里山森鐵看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x58a848, 0x78c868, 0x8a6038, 0xf0e8d8, 0x486838],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Alishan Forest Railway billboard: green + wood tones, scenic imagery
      const wood = 0x6a5038;
      const parts = [
        // wood-style gantry legs
        box(0.24, 4.6, 0.24, wood, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.24, 4.6, 0.24, wood, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.22, 0.22, wood, { y: 1.4 }),
        box(3.6, 0.22, 0.22, wood, { y: 3.0 }),
        box(4.0, 0.16, 0.16, 0x5a4030, { y: 2.2, rz: 0.78 }),
        // billboard frame (wood-style) + scenic face
        box(5.2, 2.4, 0.18, wood, { y: 5.4 }),
        box(5.0, 2.2, 0.06, 0xf0e8d8, { y: 5.4, z: 0.13 }), // cream ad face
        box(5.2, 0.22, 0.3, wood, { y: 6.7 }),
      ];
      // Alishan scenic imagery (green mountains, train, sunset)
      parts.push(box(2.0, 1.2, 0.04, 0x58a848, { x: -1.2, y: 5.2, z: 0.17 })); // green mountain
      parts.push(box(1.5, 0.6, 0.04, 0x78c868, { x: -1.0, y: 5.8, z: 0.17 })); // lighter hill
      parts.push(box(1.0, 0.4, 0.04, 0xc04030, { x: 0.8, y: 4.8, z: 0.17 })); // red train
      parts.push(box(0.8, 0.6, 0.04, 0xffd080, { x: 1.5, y: 5.8, z: 0.17 })); // sunset
      // "阿里山" text area
      parts.push(box(1.5, 0.4, 0.05, 0x486838, { x: 1.2, y: 5.0, z: 0.18 }));
      // warm lantern-style spotlights
      parts.push(cyl(0.14, 0.1, 0.22, 6, 0xffd080, { x: -1.6, y: 6.5, rx: 0.6 }));
      parts.push(cyl(0.14, 0.1, 0.22, 6, 0xffd080, { x: 1.6, y: 6.5, rx: 0.6 }));
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

  /* ---- slot 7: 嘉義銀行 chiayi_bank (colonial-era style) ---------- */
  {
    id: 'chiayi_bank',
    displayName: '嘉義銀行',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0xf0e8d8, 0xe0d0c0, 0x8a7060, 0x5a4030, 0xc8a84a],
    yOffset: -0.4,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Japanese colonial-era bank: warm cream + dark wood trim
      const wood = 0x5a4030;
      const cream = 0xfaf0e0;
      const parts = [
        box(4.0, 3.4, 3.0, cream, { y: 1.9 }), // main hall
        box(4.2, 0.2, 3.2, wood, { y: 3.7 }), // dark wood cornice
        // portico with wood columns (colonial style)
        box(3.6, 0.35, 0.5, cream, { y: 3.0, z: 1.6 }),
        box(3.6, 0.5, 0.4, cream, { y: 3.45, z: 1.55 }),
        // Japanese-era pitched roof cap
        box(3.8, 0.15, 0.6, wood, { y: 3.75, z: 1.55 }),
        box(2.0, 0.18, 1.0, 0x8a7060, { y: 0.18, z: 1.7 }), // steps
      ];
      // square wood columns (Japanese colonial style)
      for (let i = 0; i < 4; i++) {
        const x = -1.35 + i * 0.9;
        parts.push(box(0.2, 2.5, 0.2, cream, { x, y: 1.55, z: 1.7 })); // square column
        parts.push(box(0.3, 0.12, 0.3, wood, { x, y: 0.34, z: 1.7 })); // wood base
        parts.push(box(0.3, 0.12, 0.3, wood, { x, y: 2.78, z: 1.7 })); // wood capital
      }
      // gold name plaque (with bank name)
      parts.push(box(2.0, 0.3, 0.08, 0xc8a84a, { y: 3.0, z: 1.84 }));
      // wood-framed entrance
      parts.push(box(1.0, 1.6, 0.08, wood, { y: 1.0, z: 1.76 }));
      parts.push(box(0.8, 1.4, 0.06, 0xc8e0e8, { y: 1.0, z: 1.78 })); // glass
      return finish(parts);
    },
  },

  /* ---- slot 8: 車站商辦塔 station_office_tower (CHUNK LANDMARK) ---- */
  {
    id: 'station_office_tower',
    displayName: '車站商辦塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xe8e0d0, 0xd0c8b8, 0x7a7060, 0x4a4030, 0xf0e8d8],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Chiayi station area office tower: wood-city inspired with warm colors
      // podium (station plaza style) → banded shaft → crown
      return finish([
        // multi-floor podium (warm cream tones, echoing station architecture)
        box(4.2, 1.8, 3.4, 0xfaf0e0, { y: 0.9 }),
        box(4.3, 0.2, 3.5, 0x8a7a68, { y: 1.85 }),
        // main banded shaft (warm tones)
        towerBanded(3.0, 9.0, 2.4, 13, 0xfff8f0, 0x5a4a38, 0xffd890, rng, { y: 6.5 }),
        // vertical wood-inspired trim fins
        box(0.12, 9.0, 0.12, 0x5a4030, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x5a4030, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x5a4030, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback with wood accent
        box(2.4, 0.4, 1.9, 0x8a7a68, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(1.9, 3.4, 1.6, 7, 0xf8f0e8, 0x6a5a48, 0xffd890, rng, { y: 13.1 }),
        // crown (warm tones)
        box(1.5, 0.6, 1.2, 0xe8d8c8, { y: 15.1 }),
        box(1.2, 0.8, 1.0, 0xd0c0b0, { y: 15.7 }),
        // simple rooftop equipment
        cyl(0.06, 0.08, 1.8, 6, 0x808080, { y: 16.9 }),
        sph(0.12, 0xff5040, { ws: 6, hs: 4, y: 18.0 }), // beacon
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
