/**
 * @file archetypes/t5.js — Penghu pack T5 「玄武岩海岸」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the basalt coast / harbor
 * commercial scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.3). ids are the FROZEN CONTRACT
 * declared in packs/penghu/tiers.js — spelling must NOT drift.
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
  /* ---- slot 0: 商辦大樓 office_tower ------------------------------- */
  {
    id: 'office_tower',
    displayName: '商辦大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a5a72, 0xc8d4e2, 0x8a98aa, 0x2e3744, 0xe2e8f0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Island-scale office: shorter slab high-rise with banded glass shaft.
      return finish([
        towerBanded(2.2, 5.6, 1.8, 11, 0xffffff, 0x2e3a4a, 0xfff0c0, rng, { y: 2.8 }),
        // vertical mullion fins (front + back)
        box(0.1, 5.6, 0.1, 0x33404f, { x: -0.65, y: 2.8, z: 0.92 }),
        box(0.1, 5.6, 0.1, 0x33404f, { x: 0.0, y: 2.8, z: 0.92 }),
        box(0.1, 5.6, 0.1, 0x33404f, { x: 0.65, y: 2.8, z: 0.92 }),
        // ground-floor lobby (darker, recessed)
        box(2.4, 0.8, 2.0, 0x222a34, { y: 0.4 }),
        box(0.9, 0.6, 0.06, 0x9fb4cc, { y: 0.35, z: 1.02 }), // lit lobby glass
        // setback crown + parapet
        box(1.9, 0.6, 1.5, 0xd6dee8, { y: 5.9 }),
        box(1.9, 0.1, 1.5, 0x8a98aa, { y: 6.26 }),
        // rooftop plant box + mast
        box(0.9, 0.4, 0.7, 0x5a6472, { y: 6.4 }),
        cyl(0.04, 0.04, 1.0, 6, 0xb04030, { y: 7.1 }),
      ]);
    },
  },

  /* ---- slot 1: 港倉 port_warehouse --------------------------------- */
  {
    id: 'port_warehouse',
    displayName: '港倉',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 26,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x7a8898, 0xb0b8c4, 0x5a6a7a, 0x3a4a5a, 0xd0d8e0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Harbor warehouse: long corrugated-metal shed with rolling doors.
      const parts = [
        // main warehouse body (long rectangular shed)
        box(5.0, 2.8, 3.2, 0xffffff, { y: 1.5 }), // body (tinted metal)
        // pitched roof (shallow gable via half-cylinder)
        cyl(1.7, 1.7, 5.2, 4, 0x6a7888, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 3.2 }),
        // corrugation ridges on sides
        box(0.08, 2.6, 3.24, 0x5a6a7a, { x: 2.52, y: 1.5 }),
        box(0.08, 2.6, 3.24, 0x5a6a7a, { x: -2.52, y: 1.5 }),
      ];
      // rolling doors on front face
      for (let i = 0; i < 3; i++) {
        const x = -1.4 + i * 1.4;
        parts.push(box(1.1, 2.2, 0.08, 0x3a4a5a, { x, y: 1.2, z: 1.62 })); // roll door
        parts.push(box(1.0, 0.12, 0.06, 0xc0c8d0, { x, y: 2.4, z: 1.66 })); // door header
      }
      // loading dock platform
      parts.push(box(5.2, 0.3, 0.8, 0x9aa0aa, { y: 0.15, z: 2.0 }));
      // company sign
      parts.push(box(1.8, 0.5, 0.1, 0xd0d8e0, { y: 3.4, z: 1.2 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 觀光船 tour_boat ------------------------------------ */
  {
    id: 'tour_boat',
    displayName: '觀光船',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 35,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe8e8e2, 0x3a6ea0, 0xc94f46, 0x2e3a48, 0xf0f4f8],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Tourist ferry boat for island hopping — Penghu's lifeline.
      const parts = [
        // hull (long boat shape via tapered box)
        box(6.0, 1.0, 2.0, 0xffffff, { y: 0.5 }), // main hull (tinted white)
        // bow taper (front wedge)
        box(1.2, 0.9, 1.6, 0xffffff, { x: 3.4, y: 0.45, rz: -0.15 }),
        // stern
        box(0.8, 1.2, 2.0, 0xe8e8e2, { x: -3.2, y: 0.6 }),
        // waterline stripe
        box(6.2, 0.2, 2.04, 0x3a6ea0, { y: 0.15 }),
        // cabin superstructure
        box(3.4, 1.4, 1.6, 0xf0f4f8, { y: 1.7 }), // main cabin
        box(3.5, 0.4, 0.06, 0x2e3a48, { y: 1.9, z: 0.82 }), // window band front
        box(3.5, 0.4, 0.06, 0x2e3a48, { y: 1.9, z: -0.82 }), // window band back
        // wheelhouse (bridge on top)
        box(1.4, 0.8, 1.2, 0xe8e8e2, { x: 0.6, y: 2.8 }),
        box(1.3, 0.3, 0.06, 0x2e3a48, { x: 0.6, y: 2.9, z: 0.62 }), // bridge window
        // roof
        box(3.6, 0.12, 1.7, 0xd0d4da, { y: 2.45 }),
        box(1.5, 0.1, 1.3, 0xc8ccd2, { x: 0.6, y: 3.25 }),
        // mast + flag
        cyl(0.08, 0.08, 1.5, 6, 0x9aa0aa, { x: 0.6, y: 3.95 }),
        box(0.5, 0.35, 0.04, 0xc94f46, { x: 0.9, y: 4.45 }), // flag
        // lifeboats on deck
        cyl(0.25, 0.2, 0.8, 6, 0xffa030, { rx: HALF_PI, x: -1.4, y: 2.6, z: 0.7 }),
        cyl(0.25, 0.2, 0.8, 6, 0xffa030, { rx: HALF_PI, x: -1.4, y: 2.6, z: -0.7 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨港天橋 harbor_bridge ------------------------------ */
  {
    id: 'harbor_bridge',
    displayName: '跨港天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x9aa0a8, 0x3a6ea0, 0x6a7078, 0xe0e4ea],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Harbor pedestrian bridge: maritime style with blue accents.
      const parts = [
        // span deck
        box(7.0, 0.35, 1.4, 0xffffff, { y: 2.8 }), // walkway (tinted)
        // railings with maritime pipe style
        box(7.0, 0.1, 0.08, 0x3a6ea0, { y: 3.35, z: 0.65 }), // top rail blue
        box(7.0, 0.1, 0.08, 0x3a6ea0, { y: 3.35, z: -0.65 }), // top rail blue
        // arched roof canopy (nautical white)
        box(7.0, 0.08, 1.0, 0xe0e4ea, { y: 3.8, z: 0.5, rx: 0.2 }),
        box(7.0, 0.08, 1.0, 0xe0e4ea, { y: 3.8, z: -0.5, rx: -0.2 }),
        box(7.0, 0.08, 0.2, 0xc6ccd2, { y: 4.05 }), // ridge
        // twin stair towers (port style)
        box(1.2, 2.9, 1.3, 0xc6ccd2, { x: -3.8, y: 1.45 }),
        box(1.0, 0.6, 0.08, 0x3a6ea0, { x: -3.8, y: 1.8, z: 0.68 }), // blue accent panel
        box(1.2, 2.9, 1.3, 0xc6ccd2, { x: 3.8, y: 1.45 }),
        box(1.0, 0.6, 0.08, 0x3a6ea0, { x: 3.8, y: 1.8, z: 0.68 }), // blue accent panel
      ];
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

  /* ---- slot 5: 港區看板 port_billboard ----------------------------- */
  {
    id: 'port_billboard',
    displayName: '港區看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a6ea0, 0x2e7a46, 0xffd84d, 0xc94f46, 0xf2f2ee],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Harbor district billboard: maritime tourism ads on a sturdy gantry.
      const parts = [
        // gantry legs (wide A-stance)
        box(0.24, 4.4, 0.24, 0x44484f, { x: -1.6, y: 2.2, rz: 0.06 }),
        box(0.24, 4.4, 0.24, 0x44484f, { x: 1.6, y: 2.2, rz: -0.06 }),
        box(3.4, 0.22, 0.22, 0x44484f, { y: 1.3 }), // cross brace
        box(3.4, 0.22, 0.22, 0x44484f, { y: 2.8 }), // cross brace
        // diagonal brace
        box(3.8, 0.14, 0.14, 0x5a6068, { y: 2.0, rz: 0.75 }),
        // billboard frame + bright face (harbor tourism theme)
        box(5.0, 2.2, 0.2, 0x2e3138, { y: 5.2 }), // frame
        box(4.8, 2.0, 0.06, 0xffffff, { y: 5.2, z: 0.13 }), // ad face (tinted bright)
        box(5.0, 0.2, 0.32, 0x222428, { y: 6.4 }), // top spotlight bar
      ];
      // color blocks on the ad face (island tourism graphics: sea, islands, boat)
      const adHex = [0x3a6ea0, 0x2e7a46, 0xffd84d, 0xc94f46]; // blue sea, green island, sun, boat
      for (let i = 0; i < 4; i++) {
        const w = 0.85 + (i % 2) * 0.35;
        parts.push(box(w, 1.5 - (i % 2) * 0.5, 0.04, adHex[i], {
          x: -1.6 + i * 1.1, y: 5.2, z: 0.17,
        }));
      }
      // spotlights
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.5, y: 6.3, rx: 0.6 }));
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.5, y: 6.3, rx: 0.6 }));
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

  /* ---- slot 8: 玄武岩柱 basalt_pillar (CHUNK LANDMARK) ------------ */
  {
    id: 'basalt_pillar',
    displayName: '玄武岩柱',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3a4048, 0x5a6068, 0x2a3038, 0x4a5058, 0x6a7078],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Penghu's famous columnar basalt formation: hexagonal columns rising
      // from the sea cliff — the iconic geological landmark.
      const parts = [];
      // simplified cluster of hexagonal basalt columns
      parts.push(cyl(0.7, 0.67, 8.0, 6, 0x3a4048, { x: 0, z: 0, y: 4.0 }));
      parts.push(cyl(0.65, 0.62, 7.2, 6, 0x4a5058, { x: 1.1, z: 0.4, y: 3.6 }));
      parts.push(cyl(0.6, 0.57, 6.8, 6, 0x3e464e, { x: -1.0, z: 0.5, y: 3.4 }));
      parts.push(cyl(0.62, 0.59, 7.5, 6, 0x464e56, { x: 0.5, z: -0.9, y: 3.75 }));
      parts.push(cyl(0.55, 0.52, 5.5, 6, 0x424a52, { x: -1.5, z: -0.2, y: 2.75 }));
      // rocky base platform (sea cliff edge)
      parts.push(box(4.5, 0.8, 3.5, 0x5a6068, { y: 0.4 }));
      // sea splash effect at base (white foam hints)
      parts.push(box(4.8, 0.15, 3.8, 0xb0c0d0, { y: 0.08 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 港邊倉庫 warehouse_mass (CHUNK LANDMARK) ----------- */
  {
    id: 'warehouse_mass',
    displayName: '港邊倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x8a9098, 0xb0b8c0, 0x6a7078, 0x3a4a5a, 0xd0d8e0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Large harbor warehouse complex: multiple connected sheds with
      // loading docks, cranes, and shipping infrastructure.
      const parts = [
        // main warehouse block (largest)
        box(6.0, 3.4, 4.0, 0xffffff, { y: 1.8 }), // tinted metal
        // pitched roof
        cyl(2.2, 2.2, 6.2, 4, 0x7a8a98, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.9 }),
        // secondary warehouse (smaller, attached)
        box(3.5, 2.8, 3.2, 0xffffff, { x: -4.2, y: 1.5 }),
        cyl(1.7, 1.7, 3.7, 4, 0x6a7a88, { theta0: PI, rx: HALF_PI, sy: 0.35, x: -4.2, y: 3.2 }),
      ];
      // rolling doors on main warehouse front
      for (let i = 0; i < 4; i++) {
        const x = -1.8 + i * 1.2;
        parts.push(box(1.0, 2.4, 0.1, 0x3a4a5a, { x, y: 1.3, z: 2.02 }));
        parts.push(box(0.9, 0.15, 0.08, 0xd0d8e0, { x, y: 2.6, z: 2.06 })); // header
      }
      // rolling doors on secondary warehouse
      for (let i = 0; i < 2; i++) {
        const x = -4.8 + i * 1.2;
        parts.push(box(0.9, 2.0, 0.1, 0x3a4a5a, { x, y: 1.1, z: 1.62 }));
      }
      // loading dock platforms
      parts.push(box(6.2, 0.35, 1.0, 0x9aa0aa, { y: 0.18, z: 2.5 }));
      parts.push(box(3.7, 0.3, 0.8, 0x9aa0aa, { x: -4.2, y: 0.15, z: 2.0 }));
      // small gantry crane between buildings
      parts.push(cyl(0.18, 0.18, 4.5, 6, 0x5a6068, { x: -1.5, y: 2.25 })); // crane tower
      parts.push(cyl(0.18, 0.18, 4.5, 6, 0x5a6068, { x: -2.5, y: 2.25 })); // crane tower
      parts.push(box(1.2, 0.25, 0.25, 0x4a5058, { x: -2.0, y: 4.5 })); // crane beam
      parts.push(box(2.5, 0.2, 0.2, 0x6a7078, { x: -2.0, y: 4.3, rz: -0.3 })); // crane arm
      // company signs
      parts.push(box(2.2, 0.6, 0.12, 0xd0d8e0, { y: 4.2, z: 1.5 })); // main sign
      parts.push(box(1.4, 0.4, 0.1, 0xb0b8c0, { x: -4.2, y: 3.5, z: 1.2 })); // secondary sign
      // containers / cargo near dock
      parts.push(box(1.8, 0.9, 0.7, 0xc94f46, { x: 2.8, y: 0.55, z: 2.4 })); // red container
      parts.push(box(1.8, 0.9, 0.7, 0x3a6ea0, { x: 2.8, y: 1.5, z: 2.4 })); // blue container stacked
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
