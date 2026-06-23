/**
 * @file archetypes/t5.js — Kaohsiung pack T5 「港區與商業」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the harbor / commercial
 * district scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.5). ids are the FROZEN CONTRACT
 * declared in packs/kaohsiung/tiers.js — spelling must NOT drift.
 *
 * Theme: 港都金紫暮色 — port warehouses, container yards, the light rail
 * (環狀輕軌) viaduct, harbor crossings, glass office towers along 亞洲新灣區.
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored
 * BufferGeometry built only from the geomHelpers vocabulary, normalized by
 * finish() to a UNIT bounding sphere (radius 1.0). Tri budget <= 350 — keep
 * cyl/sph radial segment counts low (6–10). rng() (0..1) is used only for
 * small deterministic variation (lit window bands, sign tints), never for
 * structure.
 *
 * Palette = 4–6 hex tints (catalog.test enforces 4–6). Bodies meant to be
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
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a5a72, 0xc8d4e2, 0x8a98aa, 0x2e3744, 0xe2e8f0],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Slab high-rise: banded glass shaft + setback crown + rooftop plant box.
      return finish([
        towerBanded(2.6, 7.2, 2.0, 14, 0xffffff, 0x2e3a4a, 0xfff0c0, rng, { y: 3.6 }),
        // vertical mullion fins (front + back) to read as a curtain wall
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.0, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: 1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: -0.8, y: 3.6, z: -1.02 }),
        box(0.1, 7.2, 0.1, 0x33404f, { x: 0.8, y: 3.6, z: -1.02 }),
        // ground-floor lobby (darker, recessed)
        box(2.8, 0.9, 2.2, 0x222a34, { y: 0.45 }),
        box(1.0, 0.7, 0.06, 0x9fb4cc, { y: 0.4, z: 1.12 }), // lit lobby glass
        // setback crown + parapet
        box(2.2, 0.7, 1.7, 0xd6dee8, { y: 7.55 }),
        box(2.2, 0.12, 1.7, 0x8a98aa, { y: 7.96 }),
        // rooftop plant box + mast
        box(1.0, 0.5, 0.8, 0x5a6472, { y: 8.15 }),
        cyl(0.05, 0.05, 1.2, 6, 0xb04030, { y: 9.0 }),
      ]);
    },
  },

  /* ---- slot 1: 港倉 port_warehouse -------------------------------- */
  {
    id: 'port_warehouse',
    displayName: '港倉',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 30,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc0a86a, 0xd8c488, 0x8a7848, 0x5a6470, 0xe6d8a8, 0xb8443a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Long corrugated-metal harbor shed: gable roof, big roller doors, a
      // 駁二-style brick / steel warehouse mass on the wharf.
      const parts = [
        box(6.4, 2.8, 4.0, 0xffffff, { y: 1.4 }), // main shed body (tinted)
        // low-pitch gable roof (two leaning ridges)
        box(6.6, 0.16, 2.2, 0x7a6a40, { y: 2.95, z: 1.0, rx: 0.18 }),
        box(6.6, 0.16, 2.2, 0x7a6a40, { y: 2.95, z: -1.0, rx: -0.18 }),
        box(6.6, 0.18, 0.2, 0x5a4e30, { y: 3.22 }), // ridge cap
        // continuous loading-dock plinth at the front
        box(6.4, 0.5, 0.5, 0x6a6258, { y: 0.25, z: 2.0 }),
        // gable-end name band
        box(2.6, 0.6, 0.08, 0xb8443a, { x: -3.18, y: 2.3, z: 0 }),
      ];
      // a row of big roller doors + dark window strip along the front
      const litWin = [0xfff0c8, 0x5f6670];
      for (let i = 0; i < 4; i++) {
        const x = -2.4 + i * 1.6;
        parts.push(box(1.1, 1.7, 0.1, 0x37404a, { x, y: 0.95, z: 2.02 })); // door frame
        parts.push(box(0.9, 1.5, 0.06, 0x9aa0a8, { x, y: 0.95, z: 2.08 })); // corrugated door
        const lit = rng() < 0.4 ? litWin[0] : litWin[1];
        parts.push(box(0.9, 0.34, 0.05, lit, { x, y: 2.2, z: 2.05 })); // clerestory window
      }
      // vertical corrugation ribs on the long wall
      for (let i = 0; i < 6; i++) {
        parts.push(box(0.06, 2.6, 0.04, 0x9a8a58, { x: -2.7 + i * 1.08, y: 1.4, z: 2.0 }));
      }
      // rooftop vent stacks
      parts.push(cyl(0.16, 0.16, 0.5, 6, 0x4a4e54, { x: -1.6, y: 3.3 }));
      parts.push(cyl(0.16, 0.16, 0.5, 6, 0x4a4e54, { x: 1.6, y: 3.3 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 輕軌高架 lrt_viaduct ------------------------------- */
  {
    id: 'lrt_viaduct',
    displayName: '輕軌高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x2e8a5a, 0xe6e2d4],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Kaohsiung 環狀輕軌: a lower, slimmer deck on single pillars + a green
      // low-floor tram car (catenary-free streetcar look).
      const parts = [
        // continuous deck girder (long along X) — slimmer than a heavy metro
        box(9.0, 0.5, 1.4, 0xffffff, { y: 2.8 }), // deck (tinted concrete)
        box(9.0, 0.34, 0.12, 0x8a9098, { y: 2.95, z: 0.72 }), // side parapet
        box(9.0, 0.34, 0.12, 0x8a9098, { y: 2.95, z: -0.72 }), // side parapet
      ];
      // single slim round pillars at intervals (LRT signature)
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.32, 0.4, 2.55, 7, 0xc2c6cc, { x, y: 1.27 }));
        parts.push(box(1.0, 0.3, 1.5, 0xb0b6be, { x, y: 2.5 })); // pier cap
      }
      // a green low-floor tram car on the deck
      parts.push(box(4.6, 0.95, 1.0, 0xffffff, { y: 3.55 })); // car body (tinted)
      parts.push(box(4.64, 0.34, 0.06, 0x2e3a48, { y: 3.65, z: 0.52 })); // window strip
      parts.push(box(4.64, 0.34, 0.06, 0x2e3a48, { y: 3.65, z: -0.52 })); // window strip
      parts.push(box(4.7, 0.16, 1.04, 0x2e8a5a, { y: 4.08 })); // green roof / brand stripe
      parts.push(box(0.5, 0.7, 0.04, 0xe6e2d4, { x: 2.3, y: 3.55, z: 0.51 })); // cab window
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨港天橋 harbor_bridge ----------------------------- */
  {
    id: 'harbor_bridge',
    displayName: '跨港天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 44,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd6dce2, 0x9aa0a8, 0xe04f3a, 0x3a6ca8, 0x6a7078, 0xeef2f6],
    yOffset: -0.36,
    upright: true,
    collisionScale: 0.68,
    buildGeometry(rng) {
      // 高雄港橫渡:a cable-stayed harbor bridge — single inclined pylon with
      // stay cables fanning to a flat deck over the water.
      const parts = [
        // deck (long span across the harbor)
        box(8.4, 0.34, 1.4, 0xffffff, { y: 2.2 }), // deck (tinted)
        box(8.4, 0.18, 0.08, 0x8a9098, { y: 2.45, z: 0.66 }), // railing
        box(8.4, 0.18, 0.08, 0x8a9098, { y: 2.45, z: -0.66 }), // railing
        // two squat support piers under the deck
        box(0.7, 2.0, 1.4, 0xc2c6cc, { x: -3.0, y: 1.1 }),
        box(0.7, 2.0, 1.4, 0xc2c6cc, { x: 3.0, y: 1.1 }),
        // single inclined A-pylon near one third point
        box(0.46, 5.2, 0.46, 0xe04f3a, { x: -1.2, y: 4.6, rz: 0.12 }),
        box(0.9, 0.4, 1.6, 0xc23a2c, { x: -1.5, y: 7.0 }), // pylon head
      ];
      // stay cables fanning from the pylon head to deck points (thin tilted boxes)
      const headX = -1.5;
      const headY = 7.0;
      for (let i = 0; i < 5; i++) {
        const dx = 1.4 + i * 1.4; // forward span anchor offset
        const ax = headX + dx;
        const ay = 2.36;
        const mx = (headX + ax) / 2;
        const my = (headY + ay) / 2;
        const len = Math.hypot(ax - headX, ay - headY);
        const ang = Math.atan2(ay - headY, ax - headX); // negative slope
        parts.push(box(len, 0.05, 0.05, 0xeef2f6, { x: mx, y: my, rz: ang }));
      }
      // a couple of back-stay cables behind the pylon
      for (let i = 0; i < 2; i++) {
        const ax = headX - (1.6 + i * 1.6);
        const ay = 2.36;
        const mx = (headX + ax) / 2;
        const my = (headY + ay) / 2;
        const len = Math.hypot(ax - headX, ay - headY);
        const ang = Math.atan2(ay - headY, ax - headX);
        parts.push(box(len, 0.05, 0.05, 0xeef2f6, { x: mx, y: my, rz: ang }));
      }
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

  /* ---- slot 5: 港區看板 port_billboard ---------------------------- */
  {
    id: 'port_billboard',
    displayName: '港區看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe04f3a, 0x3f6cc4, 0xffd84d, 0x2e7a46, 0xf2f2ee, 0x2e3138],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // A wharfside / rooftop billboard: big bright panel on a lattice gantry.
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
        // pediment apex (low triangular prism)
        cone(1.9, 0.7, 4, 0xe2dcca, { y: 3.95, z: 1.55, ry: PI / 4, sz: 0.25 }),
        // stylobate / steps
        box(2.0, 0.2, 1.0, 0x8a7e64, { y: 0.18, z: 1.7 }),
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

  /* ---- slot 8: 港邊商辦塔 waterfront_office_tower (CHUNK LANDMARK) - */
  {
    id: 'waterfront_office_tower',
    displayName: '港邊商辦塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0x3e4e66, 0xaecae0, 0x7a8aa0, 0x232c38, 0xe6eef6, 0xd8a84a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // 亞洲新灣區 waterfront skyscraper — the district's repeatable landmark
      // mass: wide podium → tapered banded glass shaft → crown + antenna.
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
        // crown (gold-lit dusk accent)
        box(1.5, 0.6, 1.2, 0xaecae0, { y: 15.1 }),
        box(1.5, 0.16, 1.2, 0xd8a84a, { y: 15.5 }),
        cone(0.9, 1.2, 6, 0x55657a, { y: 16.1 }),
        // antenna mast
        cyl(0.06, 0.08, 2.4, 6, 0xb0b6be, { y: 17.7 }),
        sph(0.14, 0xff5040, { ws: 6, hs: 4, y: 19.0 }), // beacon
      ]);
    },
  },

  /* ---- slot 9: 港邊倉庫 warehouse_mass (CHUNK LANDMARK) ----------- */
  {
    id: 'warehouse_mass',
    displayName: '港邊倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.5,
    palette: [0xc0a86a, 0xd8c488, 0x8a7848, 0x5a6470, 0xe6d8a8, 0xb8443a],
    yOffset: -0.41,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // A whole bonded-warehouse block (駁二/中島區 scale): a long north-light
      // transit shed with a stacked container wall, gantry rail + rooftop sign.
      const parts = [
        // long low warehouse mass
        box(7.2, 3.2, 4.6, 0xffffff, { y: 1.6 }), // shed body (tinted)
        box(7.3, 0.3, 4.7, 0x8a7848, { y: 3.25 }), // cornice
        // dock plinth along the front
        box(7.2, 0.5, 0.6, 0x6a6258, { y: 0.25, z: 2.3 }),
        // stacked container wall at one end (port yard)
        box(2.0, 1.1, 1.2, 0xb8443a, { x: 2.4, y: 0.55, z: 2.8 }),
        box(2.0, 1.1, 1.2, 0x3f6cc4, { x: 2.4, y: 1.7, z: 2.8 }),
        box(2.0, 1.1, 1.2, 0x2e7a46, { x: 4.6, y: 0.55, z: 2.8 }),
        box(2.0, 1.1, 1.2, 0xd8a84a, { x: 4.6, y: 1.7, z: 2.8 }),
        // rooftop sign pylon + name band
        box(0.5, 1.8, 0.5, 0xb8443a, { x: -2.8, y: 4.0 }),
        box(3.0, 0.7, 0.16, 0xb8443a, { x: -1.4, y: 3.7, z: 2.32 }),
        box(2.8, 0.5, 0.06, 0xe6d8a8, { x: -1.4, y: 3.7, z: 2.4 }), // band face
      ];
      // north-light sawtooth roof — 4 glazed slopes
      for (let i = 0; i < 4; i++) {
        const x = -2.7 + i * 1.8;
        parts.push(box(1.7, 0.14, 2.0, 0x7a6a40, { x, y: 3.6, z: 0.5, rx: 0.34 })); // opaque slope
        parts.push(box(1.7, 0.5, 0.06, 0x9fc4d8, { x, y: 3.9, z: -0.6, rx: -0.6 })); // glazed slope
      }
      // big roller doors along the long front wall
      for (let i = 0; i < 4; i++) {
        const x = -2.7 + i * 1.6;
        parts.push(box(1.1, 1.9, 0.1, 0x37404a, { x, y: 1.05, z: 2.32 })); // door frame
        parts.push(box(0.9, 1.7, 0.06, 0x9aa0a8, { x, y: 1.05, z: 2.38 })); // corrugated door
      }
      // gantry rail beam over the yard
      parts.push(box(5.0, 0.2, 0.2, 0x5a6470, { x: 2.0, y: 3.0, z: 1.6 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
