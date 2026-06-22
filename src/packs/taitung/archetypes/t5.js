/**
 * @file packs/taitung/archetypes/t5.js — Roll Formosa Taitung pack, Tier 5.
 *
 * T5 — 海濱觀光區 (Coastal Tourism Zone). The penultimate band featuring
 * coastal tourism infrastructure: surf shops, beachside B&Bs, the elevated
 * Taitung railway, balloon towers for the famous Taitung balloon festival,
 * and fishery associations. radiusNominal 12–60 m real. Slots [0..7] absorbable,
 * slots [8..9] repeatable CHUNK LANDMARKS (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 5, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 */

import {
  paint, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI,
} from '../geomHelpers.js';

const TIER = 5;

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T5_ARCHETYPES = [
  /* ---- slot 0: 民宿大樓 minsu_building --------------------------------- */
  {
    id: 'minsu_building',
    displayName: '民宿大樓',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0x4a90c8, 0x2e6a9a, 0xc8a060, 0x3a3a38],
    yOffset: -0.06,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Coastal B&B / minsu: a bright 4-5 story building with ocean-blue
      // accents, balconies with sea-view railings, and a rooftop observation deck.
      const parts = [
        // main body (white / cream tinted)
        box(2.6, 5.8, 2.2, 0xffffff, { y: 2.9, hex2: 0xf8f0e0 }),
        // blue accent stripe at each floor
        box(2.7, 0.15, 2.3, 0x4a90c8, { y: 1.4 }),
        box(2.7, 0.15, 2.3, 0x4a90c8, { y: 2.6 }),
        box(2.7, 0.15, 2.3, 0x4a90c8, { y: 3.8 }),
        box(2.7, 0.15, 2.3, 0x4a90c8, { y: 5.0 }),
        // balconies on front
        box(2.4, 0.1, 0.5, 0xe8e0d0, { y: 1.5, z: 1.3 }),
        box(2.4, 0.1, 0.5, 0xe8e0d0, { y: 2.7, z: 1.3 }),
        box(2.4, 0.1, 0.5, 0xe8e0d0, { y: 3.9, z: 1.3 }),
        // balcony glass railings
        box(2.4, 0.4, 0.06, 0x9fd4e8, { y: 1.7, z: 1.5 }),
        box(2.4, 0.4, 0.06, 0x9fd4e8, { y: 2.9, z: 1.5 }),
        box(2.4, 0.4, 0.06, 0x9fd4e8, { y: 4.1, z: 1.5 }),
        // rooftop deck + railing
        box(2.8, 0.2, 2.4, 0xc8c0b0, { y: 5.9 }),
        box(2.8, 0.5, 0.08, 0x4a90c8, { y: 6.25, z: 1.15 }),
        // ground floor entrance
        box(1.2, 1.0, 0.1, 0x2a3038, { y: 0.6, z: 1.15 }),
        // sign
        box(1.4, 0.4, 0.08, 0xc8a060, { y: 1.1, z: 1.18 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 衝浪店 surf_shop ---------------------------------------- */
  {
    id: 'surf_shop',
    displayName: '衝浪店',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 18,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x48a8d8, 0xf8f0e0, 0xf0c040, 0x2e6a9a, 0xe06048],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Beach surf shop: low building with surfboards displayed outside,
      // tropical colors, and an outdoor shower area.
      const parts = [
        // main building (ocean blue)
        box(3.2, 2.2, 2.4, 0x48a8d8, { y: 1.1, hex2: 0x3898c8 }),
        // white trim roof
        box(3.4, 0.3, 2.6, 0xf8f0e0, { y: 2.35 }),
        // front glass windows
        box(2.0, 1.2, 0.08, 0xbfe8f4, { y: 0.9, z: 1.22 }),
        box(2.2, 0.12, 0.12, 0x2e6a9a, { y: 1.55, z: 1.24 }),
        // entrance door
        box(0.8, 1.4, 0.1, 0x2a3038, { x: -0.9, y: 0.8, z: 1.22 }),
        // outdoor surfboard rack with boards
        box(0.1, 1.8, 0.1, 0x8a7a60, { x: 1.9, y: 0.9, z: 0.6 }),
        box(0.1, 1.8, 0.1, 0x8a7a60, { x: 1.9, y: 0.9, z: -0.6 }),
        box(0.1, 0.1, 1.4, 0x8a7a60, { x: 1.9, y: 1.7 }),
        // surfboards on rack (various colors)
        box(0.08, 1.4, 0.35, 0xf0c040, { x: 2.0, y: 0.95, z: 0.4, rz: 0.1 }),
        box(0.08, 1.4, 0.35, 0xe06048, { x: 2.0, y: 0.95, z: 0, rz: -0.05 }),
        box(0.08, 1.4, 0.35, 0x48c8a8, { x: 2.0, y: 0.95, z: -0.4, rz: 0.08 }),
        // shop sign
        box(1.8, 0.5, 0.1, 0xf0c040, { y: 2.0, z: 1.28 }),
        // outdoor shower
        cyl(0.06, 0.06, 1.6, 6, 0x8a8a8a, { x: -1.8, y: 0.8 }),
        sph(0.15, 0xc0c0c0, { ws: 6, hs: 4, x: -1.8, y: 1.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 台鐵高架 taitung_railway -------------------------------- */
  {
    id: 'taitung_railway',
    displayName: '台鐵高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 40,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xb0b6be, 0x8a9098, 0xd0d4da, 0x6a7078, 0x5a4a3a],
    yOffset: -0.6104,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Elevated TRA railway section: concrete track deck on stout pillars,
      // with railings and hints of track — identical structure to Tainan but
      // branded as Taitung Line.
      const parts = [
        // continuous concrete track deck (long along X)
        box(9.0, 0.7, 1.8, 0xffffff, { y: 3.4 }), // deck (tinted concrete)
        box(9.0, 0.5, 0.16, 0x8a9098, { y: 3.65, z: 0.92 }), // side railing
        box(9.0, 0.5, 0.16, 0x8a9098, { y: 3.65, z: -0.92 }), // side railing
      ];
      // railing posts along both edges
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(box(0.08, 0.5, 0.08, 0x6a7078, { x, y: 3.65, z: 0.92 }));
        parts.push(box(0.08, 0.5, 0.08, 0x6a7078, { x, y: 3.65, z: -0.92 }));
      }
      // stout pillars at intervals
      for (let i = 0; i < 4; i++) {
        const x = -3.6 + i * 2.4;
        parts.push(cyl(0.55, 0.62, 3.1, 6, 0xc2c6cc, { x, y: 1.55 }));
        parts.push(box(1.4, 0.4, 1.9, 0xb0b6be, { x, y: 3.05 })); // pier cap
      }
      // twin steel rail track on top
      parts.push(box(9.0, 0.1, 0.1, 0x5a4a3a, { y: 3.8, z: 0.35 }));
      parts.push(box(9.0, 0.1, 0.1, 0x5a4a3a, { y: 3.8, z: -0.35 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 跨海天橋 coast_bridge ----------------------------------- */
  {
    id: 'coast_bridge',
    displayName: '跨海天橋',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 35,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc6ccd2, 0x48a8d8, 0xe0e4ea, 0x6a7078, 0xf0c040],
    yOffset: -0.57,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Coastal pedestrian overpass: ocean-blue accented span with viewing
      // platforms for watching the Pacific Ocean.
      const parts = [
        // span deck
        box(6.4, 0.32, 1.3, 0xffffff, { y: 2.6 }), // walkway
        // ocean-blue railings
        box(6.4, 0.08, 0.06, 0x48a8d8, { y: 3.1, z: 0.6 }),
        box(6.4, 0.08, 0.06, 0x48a8d8, { y: 3.1, z: -0.6 }),
        // arched roof canopy (two leaning panels)
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: 0.45, rx: 0.22 }),
        box(6.4, 0.06, 0.9, 0xc6ccd2, { y: 3.55, z: -0.45, rx: -0.22 }),
        box(6.4, 0.06, 0.16, 0x9aa0a8, { y: 3.78 }), // ridge
      ];
      // railing posts + canopy supports
      for (let i = 0; i < 4; i++) {
        const x = -2.4 + i * 1.6;
        parts.push(box(0.05, 0.5, 0.05, 0x48a8d8, { x, y: 2.85, z: 0.6 }));
        parts.push(box(0.05, 0.5, 0.05, 0x48a8d8, { x, y: 2.85, z: -0.6 }));
        if (i % 2 === 0) parts.push(box(0.07, 0.95, 0.07, 0x9aa0a8, { x, y: 3.1, z: 0 }));
      }
      // viewing platform bumps at ends
      for (const sx of [-3.4, 3.4]) {
        parts.push(box(1.2, 2.7, 1.4, 0xb6bcc4, { x: sx, y: 1.35 }));
        parts.push(box(1.0, 0.5, 0.06, 0x9fe0f0, { x: sx, y: 1.8, z: 0.73 })); // glass view panel
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 停車塔 parking_tower ------------------------------------ */
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
        // corner columns
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: 1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: -0.95, y: 3.6, z: -1.15 }),
        box(0.22, 7.0, 0.22, 0x5a6068, { x: 0.95, y: 3.6, z: -1.15 }),
        box(2.0, 0.4, 2.4, 0x7a8088, { y: 7.3 }), // roof slab
        box(1.0, 0.7, 0.1, 0xe0a838, { y: 0.5, z: 1.22 }), // entry gate (yellow)
      ];
      // 6 deck floors with car chips
      const carHex = [0xc94f46, 0x3f6cc4, 0xe0e0e0, 0x49a05f, 0xe0a838, 0x9a9a9a];
      for (let f = 0; f < 6; f++) {
        const y = 1.4 + f * 0.95;
        parts.push(box(1.7, 0.62, 0.08, 0x20262e, { y, z: 1.18 })); // open deck shadow
        parts.push(box(0.7, 0.3, 0.5, carHex[f], { x: -0.3, y: y - 0.06, z: 1.0 })); // car
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 觀光看板 tourism_billboard ------------------------------ */
  {
    id: 'tourism_billboard',
    displayName: '觀光看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x48a8d8, 0xf0c040, 0x4a8a5a, 0xf8f0e0, 0xe06048],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // A tourism billboard advertising Taitung attractions: hot air balloons,
      // beaches, indigenous culture. Bright panel on a lattice gantry.
      const parts = [
        // gantry legs (wide A-stance)
        box(0.22, 4.6, 0.22, 0x44484f, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x44484f, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x44484f, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x44484f, { y: 3.0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a6068, { y: 2.2, rz: 0.78 }),
        // billboard frame + bright face
        box(5.2, 2.4, 0.18, 0x2e3138, { y: 5.4 }), // frame
        box(5.0, 2.2, 0.06, 0x48a8d8, { y: 5.4, z: 0.13 }), // ocean blue base
        box(5.2, 0.2, 0.3, 0x222428, { y: 6.7 }), // top spotlight bar
      ];
      // colored graphic blocks (hot air balloon motif)
      parts.push(sph(0.6, 0xe06048, { ws: 6, hs: 4, x: -1.5, y: 5.6, z: 0.16 })); // balloon shape
      parts.push(sph(0.5, 0xf0c040, { ws: 6, hs: 4, x: 0.5, y: 5.4, z: 0.16 })); // balloon 2
      parts.push(box(1.2, 0.6, 0.04, 0x4a8a5a, { x: 1.8, y: 5.0, z: 0.16 })); // green hills
      parts.push(box(2.0, 0.3, 0.04, 0xf8f0e0, { x: 0, y: 4.5, z: 0.16 })); // text area
      // spotlights
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: -1.6, y: 6.6, rx: 0.6 }));
      parts.push(cyl(0.12, 0.18, 0.2, 6, 0xfff0c0, { x: 1.6, y: 6.6, rx: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 玻璃帷幕街屋 glass_curtain_house ------------------------ */
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
        box(2.2, 5.2, 2.0, 0xffffff, { y: 2.8 }), // body
        // glass curtain wall on the front
        box(2.0, 4.6, 0.14, 0x2e3744, { y: 2.9, z: 1.02 }), // mullion grid (dark)
        box(1.8, 4.4, 0.06, 0x8fd6e2, { y: 2.9, z: 1.1 }), // glass (blue-green)
        // ground-floor shop entrance
        box(2.0, 0.9, 0.1, 0x20262c, { y: 0.5, z: 1.06 }),
        box(1.2, 0.7, 0.06, 0xbfeaf0, { y: 0.5, z: 1.12 }), // bright entry glass
        // parapet + rooftop water tank
        box(2.3, 0.24, 2.1, 0x4a8090, { y: 5.5 }),
        cyl(0.4, 0.4, 0.6, 7, 0x9aa0a8, { x: 0.5, y: 5.9 }),
      ];
      // horizontal floor-line mullions (5 floors)
      for (let f = 1; f < 5; f++) {
        parts.push(box(1.85, 0.07, 0.04, 0x223038, { y: 0.6 + f * 0.95, z: 1.14 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 漁會 fishery_assoc -------------------------------------- */
  {
    id: 'fishery_assoc',
    displayName: '漁會',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 24,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x4a90c8, 0xf8f0e0, 0x2e6a9a, 0xc8a060, 0x3a3a38],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Fisherman's Association building: a practical 2-3 story administrative
      // building with ocean-blue accents and a large sign.
      const parts = [
        // main building body
        box(4.0, 3.0, 3.0, 0xffffff, { y: 1.5, hex2: 0xf8f0e0 }),
        // blue trim band at top
        box(4.1, 0.3, 3.1, 0x4a90c8, { y: 3.1 }),
        // flat roof
        box(4.2, 0.2, 3.2, 0xc8c0b0, { y: 3.3 }),
        // front entrance portico
        box(2.4, 2.2, 0.8, 0x2e6a9a, { y: 1.1, z: 1.5 }),
        box(2.2, 1.8, 0.1, 0x9fd4e8, { y: 1.0, z: 1.9 }), // glass doors
        // organization name sign
        box(2.8, 0.5, 0.1, 0xf8f0e0, { y: 2.4, z: 1.95 }),
        box(2.6, 0.35, 0.05, 0xc8a060, { y: 2.4, z: 2.0 }), // gold lettering
        // rooftop equipment
        box(1.0, 0.6, 0.8, 0x6a7078, { x: 1.0, y: 3.7 }),
        // flagpole
        cyl(0.04, 0.04, 2.0, 6, 0x8a8a8a, { x: -1.6, y: 2.5, z: 1.6 }),
        box(0.6, 0.4, 0.03, 0x4a90c8, { x: -1.6, y: 3.3, z: 1.6 }), // flag
      ];
      // window grid on sides
      for (let i = 0; i < 3; i++) {
        const lit = rng() < 0.4 ? 0xfff0c8 : 0x8a9098;
        parts.push(box(0.6, 0.8, 0.06, lit, { x: -1.2 + i * 1.2, y: 2.0, z: -1.52 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8: 熱氣球塔架 balloon_tower (CHUNK LANDMARK) --------------- */
  {
    id: 'balloon_tower',
    displayName: '熱氣球塔架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xe06048, 0xf0c040, 0x4a90c8, 0xf8f0e0, 0x3a3a38],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      // A hot air balloon launching tower/tether point for the famous
      // Taitung International Balloon Festival at Luye Highland.
      const parts = [
        // launch platform base
        box(4.0, 0.5, 4.0, 0xc8c0b0, { y: 0.25 }),
        // tower structure (lattice mast)
        box(0.3, 8.0, 0.3, 0x5a6068, { x: -1.2, y: 4.0, z: -1.2 }),
        box(0.3, 8.0, 0.3, 0x5a6068, { x: 1.2, y: 4.0, z: -1.2 }),
        box(0.3, 8.0, 0.3, 0x5a6068, { x: -1.2, y: 4.0, z: 1.2 }),
        box(0.3, 8.0, 0.3, 0x5a6068, { x: 1.2, y: 4.0, z: 1.2 }),
        // horizontal braces
        box(2.4, 0.15, 0.15, 0x4a525c, { y: 2.5, z: 0 }),
        box(0.15, 0.15, 2.4, 0x4a525c, { y: 2.5, x: 0 }),
        box(2.4, 0.15, 0.15, 0x4a525c, { y: 5.5, z: 0 }),
        box(0.15, 0.15, 2.4, 0x4a525c, { y: 5.5, x: 0 }),
        // top platform
        box(3.0, 0.3, 3.0, 0x7a8088, { y: 8.15 }),
        // tethered balloon (iconic Taitung balloon shape)
        sph(1.8, 0xe06048, { ws: 10, hs: 6, y: 12.0, sy: 1.3, hex2: 0xf0c040 }),
        // balloon stripe bands
        box(0.1, 2.8, 3.6, 0xf8f0e0, { y: 12.0, rz: HALF_PI }),
        box(0.1, 2.8, 3.6, 0x4a90c8, { y: 12.0, ry: HALF_PI, rz: HALF_PI }),
        // balloon basket
        box(0.7, 0.5, 0.7, 0x8a7050, { y: 9.8 }),
        // tether lines
        cyl(0.03, 0.03, 1.5, 5, 0x6a6a68, { x: 0.3, y: 9.0, rz: 0.2 }),
        cyl(0.03, 0.03, 1.5, 5, 0x6a6a68, { x: -0.3, y: 9.0, rz: -0.2 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9: 海濱涼亭 beach_pavilion (CHUNK LANDMARK) ---------------- */
  {
    id: 'beach_pavilion',
    displayName: '海濱涼亭',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x9a7a52, 0xf8f0e0, 0x48a8d8, 0x4a8a5a, 0xc8a060],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // A large beachside pavilion/viewing platform for watching the Pacific
      // sunrise. Wooden construction with thatched or tile roof.
      const parts = [
        // raised wooden platform deck
        box(5.0, 0.3, 4.0, 0x9a7a52, { y: 0.8, hex2: 0x8a6a42 }),
        // support posts under deck
        cyl(0.2, 0.2, 0.7, 6, 0x7a5a32, { x: -2.0, y: 0.4, z: -1.5 }),
        cyl(0.2, 0.2, 0.7, 6, 0x7a5a32, { x: 2.0, y: 0.4, z: -1.5 }),
        cyl(0.2, 0.2, 0.7, 6, 0x7a5a32, { x: -2.0, y: 0.4, z: 1.5 }),
        cyl(0.2, 0.2, 0.7, 6, 0x7a5a32, { x: 2.0, y: 0.4, z: 1.5 }),
        // main roof support posts
        cyl(0.25, 0.25, 3.0, 6, 0x9a7a52, { x: -2.2, y: 2.5, z: -1.7 }),
        cyl(0.25, 0.25, 3.0, 6, 0x9a7a52, { x: 2.2, y: 2.5, z: -1.7 }),
        cyl(0.25, 0.25, 3.0, 6, 0x9a7a52, { x: -2.2, y: 2.5, z: 1.7 }),
        cyl(0.25, 0.25, 3.0, 6, 0x9a7a52, { x: 2.2, y: 2.5, z: 1.7 }),
        // thatched/wooden gabled roof
        box(5.6, 0.2, 2.4, 0xc8a060, { y: 4.3, z: 1.0, rx: -0.35, hex2: 0xb89050 }),
        box(5.6, 0.2, 2.4, 0xc8a060, { y: 4.3, z: -1.0, rx: 0.35, hex2: 0xb89050 }),
        box(5.6, 0.15, 0.2, 0x8a6a42, { y: 4.7 }), // ridge cap
        // railing around platform edge
        box(5.0, 0.08, 0.08, 0x9a7a52, { y: 1.5, z: 1.95 }),
        box(5.0, 0.08, 0.08, 0x9a7a52, { y: 1.5, z: -1.95 }),
        box(0.08, 0.08, 3.9, 0x9a7a52, { y: 1.5, x: 2.45 }),
        // railing posts
        box(0.08, 0.6, 0.08, 0x8a6a42, { x: -2.0, y: 1.2, z: 1.95 }),
        box(0.08, 0.6, 0.08, 0x8a6a42, { x: 0, y: 1.2, z: 1.95 }),
        box(0.08, 0.6, 0.08, 0x8a6a42, { x: 2.0, y: 1.2, z: 1.95 }),
        // bench seating
        box(2.0, 0.15, 0.5, 0x7a5a32, { x: 0, y: 1.1, z: -1.4 }),
      ];
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
