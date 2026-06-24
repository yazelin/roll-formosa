/**
 * @file archetypes/t5.js — New Taipei pack T5 「商業文教區」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the commercial / civic
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/newtaipei/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 淡水渡船頭 tamsui_ferry_terminal ------------------- */
  {
    id: 'tamsui_ferry_terminal',
    displayName: '淡水渡船頭',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x3a6ea0, 0xe8e8ee, 0x2a55a8, 0xffd040, 0x1a2a40],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Tamsui Ferry Terminal — iconic riverside building with observation deck
      const parts = [
        // Main terminal building
        box(4.0, 2.8, 3.0, 0xe8e8ee, { y: 1.4 }),
        // Blue accent bands (Tamsui river theme)
        box(4.1, 0.3, 3.1, 0x3a6ea0, { y: 0.15 }),
        box(4.1, 0.2, 3.1, 0x2a55a8, { y: 2.9 }),
        // Glass facade
        box(3.6, 2.0, 0.1, 0x9fc4d8, { y: 1.5, z: 1.52 }),
        // Window grid
        box(3.5, 0.08, 0.08, 0x1a2a40, { y: 1.0, z: 1.56 }),
        box(3.5, 0.08, 0.08, 0x1a2a40, { y: 2.0, z: 1.56 }),
        // Entrance canopy
        box(2.0, 0.12, 1.0, 0x2a55a8, { y: 1.2, z: 2.0 }),
        cyl(0.08, 0.08, 1.1, 6, 0xe8e8ee, { x: -0.8, y: 0.65, z: 1.8 }),
        cyl(0.08, 0.08, 1.1, 6, 0xe8e8ee, { x: 0.8, y: 0.65, z: 1.8 }),
        // Observation tower on top
        box(1.5, 1.5, 1.5, 0xe8e8ee, { y: 3.55 }),
        box(1.6, 0.1, 1.6, 0x3a6ea0, { y: 4.35 }),
        // Flagpole with Taiwan flag
        cyl(0.05, 0.05, 1.5, 6, 0xc8ccd2, { x: 0.5, y: 5.0 }),
        box(0.5, 0.3, 0.05, 0xc83030, { x: 0.75, y: 5.5 }),
        // Pier platform
        box(5.0, 0.2, 2.0, 0x8a7a6a, { y: 0.1, z: -0.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 林口購物中心 linkou_mall --------------------------- */
  {
    id: 'linkou_mall',
    displayName: '林口購物中心',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8dce2, 0xe8ecf0, 0x8a9098, 0x3a6ea0, 0xf4f6f8],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Linkou Outlet style mall — modern white/blue glass structure
      const parts = [
        box(4.4, 3.8, 3.4, 0xffffff, { y: 2.0 }), // main white mass
        box(4.5, 0.2, 3.5, 0x3a6ea0, { y: 4.0 }), // blue roof trim
        // glass curtain wall front
        box(4.2, 3.2, 0.12, 0x9fc4d8, { y: 1.9, z: 1.72 }),
        // entrance atrium (curved glass)
        cyl(1.2, 1.2, 3.4, 8, 0xa8d0e4, { y: 1.9, z: 2.0, rx: HALF_PI, theta0: -HALF_PI, thetaLen: PI }),
        // Brand signage
        box(2.5, 0.5, 0.1, 0x3a6ea0, { y: 3.6, z: 1.78 }),
        box(2.3, 0.35, 0.06, 0xf4f6f8, { y: 3.6, z: 1.84 }),
        // Ground level shop fronts
        box(4.0, 0.8, 0.08, 0x2a3440, { y: 0.5, z: 1.74 }),
        // Parking garage entrance
        box(1.5, 1.2, 0.6, 0x6a7078, { x: -1.8, y: 0.6, z: 0 }),
        box(1.2, 0.8, 0.1, 0x2a3440, { x: -1.8, y: 0.5, z: 0.32 }),
        // Rooftop sign tower
        box(0.8, 1.2, 0.8, 0xe8ecf0, { x: 1.4, y: 4.5 }),
        box(0.6, 0.8, 0.1, 0x3a6ea0, { x: 1.4, y: 4.8, z: 0.42 }),
      ];
      // Window mullions
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.06, 3.2, 0.08, 0x8a9098, { x: -1.6 + i * 0.8, y: 1.9, z: 1.78 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 捷運高架 metro_viaduct ----------------------------- */
  {
    id: 'metro_viaduct',
    displayName: '捷運高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x3a6ca8],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated rail: a long box girder deck on twin Y-piers + a train car.
      const parts = [
        // continuous deck girder (long along X)
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }), // deck (tinted concrete)
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: 0.95 }), // side parapet
        box(9.0, 0.5, 0.18, 0x8a9098, { y: 3.6, z: -0.95 }), // side parapet
      ];
      // piers: square columns with flared caps at intervals
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.7, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.5, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 })); // pier cap
      }
      // a train car sitting on the deck
      parts.push(box(4.2, 1.1, 1.2, 0xffffff, { y: 4.35 })); // car body (tinted)
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: 0.62 })); // window strip
      parts.push(box(4.24, 0.36, 0.06, 0x2e3a48, { y: 4.55, z: -0.62 })); // window strip
      parts.push(box(4.3, 0.18, 1.24, 0x3a6ca8, { y: 4.95 })); // brand stripe / roof trim
      return finish(parts);
    },
  },

  /* ---- slot 3: 天橋 pedestrian_bridge ----------------------------- */
  {
    id: 'pedestrian_bridge',
    displayName: '天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 16,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x9aa0a8, 0xe0e4ea, 0x6a7078, 0x4a8a5a],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Overpass: a flat span with railings + roof canopy, twin stair towers.
      const parts = [
        // span deck
        box(6.4, 0.32, 1.3, 0xffffff, { y: 2.6 }), // walkway (tinted)
        // railings (perforated read = thin top rail + posts)
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x8a9098, { y: 3.1, z: -0.6 }),
        // arched roof canopy (two leaning panels)
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: 0.45, rx: 0.22 }),
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: -0.45, rx: -0.22 }),
        box(6.4, 0.06, 0.16, 0x9aa0a8, { y: 3.78 }), // ridge
      ];
      // railing posts (sparse) + canopy supports
      for (let i = 0; i < 4; i++) {
        const x = -2.4 + i * 1.6;
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: 0.6 }));
        parts.push(box(0.05, 0.5, 0.05, 0x7a8088, { x, y: 2.85, z: -0.6 }));
        if (i % 2 === 0) parts.push(box(0.07, 0.95, 0.07, 0x9aa0a8, { x, y: 3.1, z: 0 }));
      }
      // twin stair / lift towers at the ends
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.0, 2.7, 1.2, 0xb6bcc4, { x: sx, y: 1.35 }));
        parts.push(box(0.9, 0.5, 0.06, 0x8fd0a0, { x: sx, y: 1.6, z: 0.63 })); // green-glass panel
        // a couple of diagonal stair treads
        for (let s = 0; s < 3; s++) {
          parts.push(box(0.9, 0.07, 0.34, 0x7a8088, {
            x: sx, y: 0.6 + s * 0.7, z: 0.7 + s * 0.24,
          }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 鶯歌陶瓷廠 yingge_ceramics_factory ----------------- */
  {
    id: 'yingge_ceramics_factory',
    displayName: '鶯歌陶瓷廠',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xa84a32, 0xc8bca8, 0x6a5a4a, 0xe8dcc4, 0xd8b878],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Yingge Ceramics Factory — traditional kiln building with chimney
      const parts = [
        // Main factory building (red brick style)
        box(3.5, 2.5, 2.5, 0xa84a32, { y: 1.25, hex2: 0x8a3a28 }),
        // Brick texture lines
        box(3.52, 0.06, 2.52, 0x7a2a18, { y: 0.8 }),
        box(3.52, 0.06, 2.52, 0x7a2a18, { y: 1.6 }),
        // Arched kiln opening
        cyl(0.6, 0.6, 0.4, 8, 0x2a1a0a, { y: 0.6, z: 1.28, rx: HALF_PI, theta0: 0, thetaLen: PI }),
        box(1.0, 0.6, 0.1, 0x2a1a0a, { y: 0.3, z: 1.28 }),
        // Tall chimney
        cyl(0.4, 0.35, 4.0, 8, 0xa84a32, { x: 1.2, y: 4.5, hex2: 0x8a3a28 }),
        cyl(0.5, 0.45, 0.3, 8, 0x7a2a18, { x: 1.2, y: 6.55 }), // chimney cap
        // Ceramic vases displayed outside
        cyl(0.2, 0.15, 0.5, 6, 0xd8b878, { x: -1.2, y: 0.25, z: 1.4 }),
        cyl(0.18, 0.12, 0.4, 6, 0xc8a868, { x: -0.8, y: 0.2, z: 1.4 }),
        cyl(0.22, 0.18, 0.55, 6, 0xe8c888, { x: -1.6, y: 0.28, z: 1.4 }),
        // Roof with clay tiles
        box(3.7, 0.15, 2.7, 0x6a5a4a, { y: 2.55 }),
        box(3.8, 0.1, 0.3, 0x7a6a5a, { y: 2.7, z: 0 }), // ridge
        // Sign board
        box(1.5, 0.4, 0.08, 0xe8dcc4, { y: 2.2, z: 1.32 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 平溪天燈工坊 pingxi_lantern_workshop ---------------- */
  {
    id: 'pingxi_lantern_workshop',
    displayName: '平溪天燈工坊',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc83030, 0xe8a020, 0xf8d848, 0x8a6040, 0xf0e8d8],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Pingxi Sky Lantern Workshop — traditional shop with lanterns on display
      const parts = [
        // Main workshop building
        box(3.5, 2.8, 2.5, 0xf0e8d8, { y: 1.4, hex2: 0xe0d8c8 }),
        // Traditional tiled roof (4 segments)
        cyl(2.0, 2.0, 3.8, 4, 0x6a4030, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.2 }),
        box(4.0, 0.1, 0.2, 0x5a3020, { y: 3.6 }), // ridge
        // Shop front opening
        box(2.5, 2.0, 0.1, 0x4a3020, { y: 1.0, z: 1.28 }),
        // Wooden beam
        box(3.6, 0.15, 0.15, 0x6a4030, { y: 2.1, z: 1.25 }),
        // Hanging sky lanterns (reduced count, lower segments for tri budget)
        sph(0.5, 0xc83030, { ws: 5, hs: 4, x: -0.8, y: 1.8, z: 1.5, sy: 1.4 }),
        sph(0.5, 0xe8a020, { ws: 5, hs: 4, x: 0.4, y: 1.7, z: 1.5, sy: 1.35 }),
        sph(0.45, 0xf8d848, { ws: 5, hs: 4, x: 0, y: 2.2, z: 1.4, sy: 1.3 }),
        // Sign
        box(1.8, 0.5, 0.08, 0xc83030, { y: 2.8, z: 1.32 }),
        box(1.6, 0.35, 0.04, 0xf8d848, { y: 2.8, z: 1.38 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 九份茶屋 jiufen_teashop ----------------------------- */
  {
    id: 'jiufen_teashop',
    displayName: '九份茶屋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 14,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc83030, 0xe8a020, 0x5a3020, 0xf0e8d8, 0xd8b040],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Jiufen Teahouse — multi-level traditional teahouse with red lanterns
      const parts = [
        // Multi-story traditional building
        box(2.2, 4.5, 2.0, 0xf0e8d8, { y: 2.35, hex2: 0xe0d8c8 }),
        // Dark wood frame accents
        box(2.24, 0.1, 2.04, 0x5a3020, { y: 0.85 }),
        box(2.24, 0.1, 2.04, 0x5a3020, { y: 1.85 }),
        box(2.24, 0.1, 2.04, 0x5a3020, { y: 2.85 }),
        box(2.24, 0.1, 2.04, 0x5a3020, { y: 3.85 }),
        // Traditional tiled roof (overhanging)
        cyl(1.6, 1.6, 2.4, 4, 0x5a4030, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 4.8 }),
        box(2.5, 0.08, 0.15, 0x4a3020, { y: 5.05 }), // ridge
        // Hanging red lanterns (signature Jiufen look)
        sph(0.25, 0xc83030, { ws: 6, hs: 4, x: -0.7, y: 1.3, z: 1.15 }),
        sph(0.25, 0xc83030, { ws: 6, hs: 4, x: 0, y: 1.3, z: 1.15 }),
        sph(0.25, 0xc83030, { ws: 6, hs: 4, x: 0.7, y: 1.3, z: 1.15 }),
        sph(0.22, 0xc83030, { ws: 6, hs: 4, x: -0.35, y: 2.3, z: 1.15 }),
        sph(0.22, 0xc83030, { ws: 6, hs: 4, x: 0.35, y: 2.3, z: 1.15 }),
        // Wooden balcony railings
        box(2.0, 0.5, 0.08, 0x6a4030, { y: 1.55, z: 1.04 }),
        box(2.0, 0.5, 0.08, 0x6a4030, { y: 2.55, z: 1.04 }),
        // Windows with warm light
        box(0.4, 0.5, 0.05, 0xffd868, { x: -0.6, y: 3.3, z: 1.02 }),
        box(0.4, 0.5, 0.05, 0xffd868, { x: 0.6, y: 3.3, z: 1.02 }),
        // Shop sign
        box(0.6, 1.2, 0.08, 0xc83030, { x: -1.05, y: 2.5, z: 1.05 }),
        box(0.5, 1.0, 0.04, 0xd8b040, { x: -1.05, y: 2.5, z: 1.1 }),
      ];
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

  /* ---- slot 8: 新北大樓 newtaipei_tower (CHUNK LANDMARK) ---------- */
  {
    id: 'newtaipei_tower',
    displayName: '新北大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3a5a70, 0xa0cad8, 0x6a8a9a, 0x203040, 0xe0eaf0],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // New Taipei civic/commercial tower — the district's repeatable landmark:
      // wide podium → tapered banded shaft → crown with New Taipei branding.
      return finish([
        // multi-floor podium (wider base)
        box(4.4, 2.0, 3.6, 0xffffff, { y: 1.0 }),
        box(4.5, 0.22, 3.7, 0x5a7a88, { y: 2.06 }),
        // main banded shaft (tall, blue-glass tinted)
        towerBanded(3.0, 9.0, 2.4, 13, 0xffffff, 0x203848, 0xfff0c0, rng, { y: 6.5 }),
        // mullion fins front (vertical rhythm)
        box(0.12, 9.0, 0.12, 0x1e303c, { x: -0.95, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x1e303c, { x: 0.0, y: 6.5, z: 1.22 }),
        box(0.12, 9.0, 0.12, 0x1e303c, { x: 0.95, y: 6.5, z: 1.22 }),
        // first setback
        box(2.5, 0.4, 2.0, 0x6a8a9a, { y: 11.2 }),
        // tapered upper shaft
        towerBanded(2.0, 3.4, 1.7, 7, 0xe0eaf0, 0x2a4050, 0xfff0c0, rng, { y: 13.1 }),
        // crown with gentle curve (New Taipei modern style)
        box(1.6, 0.6, 1.3, 0xa0cad8, { y: 15.1 }),
        box(1.2, 0.8, 1.0, 0x7aacbc, { y: 15.8 }),
        // "新北" text band (simplified as a colored bar)
        box(1.0, 0.3, 0.1, 0x3a5a70, { y: 14.0, z: 1.26 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.4 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 18.7 }), // beacon
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
