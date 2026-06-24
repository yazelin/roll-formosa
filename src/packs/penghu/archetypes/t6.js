/**
 * @file packs/penghu/archetypes/t6.js — Roll Formosa Penghu pack, Tier 6.
 *
 * T6 — 跨海大橋天際線 (Cross-Sea Bridge skyline). The finale band: the Cross-Sea
 * Bridge piers, bay area buildings, visitor centers and rooftop mech structures
 * against the Penghu bay sunset sky. Ten ArchetypeDefs, authored in the FROZEN
 * tier order (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9]
 * repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (Cross-Sea Bridge scale).
 */

import { box, cyl, sph, towerBanded, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 玻璃帷幕高樓 glass curtain-wall highrise (shorter for island) */
  {
    id: 'glass_highrise',
    displayName: '玻璃帷幕高樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 120, // shorter for island scale
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a5a7a, 0x4a7aa0, 0x6aa8c8, 0x9fd0e4, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Shorter glass slab suitable for island township — fewer floors, same style.
      return finish([
        towerBanded(0.95, 2.4, 0.95, 8, 0x2a4868, 0x6aa8c8, 0xffe08a, rng, { y: 1.2 }), // glass shaft
        towerBanded(0.78, 0.7, 0.78, 3, 0x32567a, 0x7ab8d4, 0xffe6a0, rng, { y: 2.75 }), // setback crown
        box(0.05, 2.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.2, z: 0.5 }), // corner mullion glint
        box(0.05, 2.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.2, z: 0.5 }), // corner mullion glint
        cyl(0.05, 0.05, 0.5, 6, 0xd0d6dc, { y: 3.35 }), // rooftop mast
        box(0.4, 0.12, 0.4, 0x556270, { y: 3.12 }), // mast base plinth
      ]);
    },
  },

  /* ---- slot 1: 橋墩 bridge pier (Cross-Sea Bridge massive pier) ----------- */
  {
    id: 'bridge_pier',
    displayName: '橋墩',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb8b0a4, 0xc8c0b4, 0xe05a4a, 0xd8d4cc, 0xffd25a],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // Massive cable-stayed bridge pier: A-pylon rising from sea, stay cables fanning out.
      // Evokes the Penghu Cross-Sea Bridge (澎湖跨海大橋).
      const parts = [
        // Main pier base rising from water
        box(1.4, 1.8, 1.0, 0xb0a89c, { y: 0.9, hex2: 0xc4bcb0 }), // concrete pier shaft
        box(1.6, 0.3, 1.2, 0xa09888, { y: 0.0 }), // pier foundation cap
        box(1.5, 0.15, 1.1, 0xc8c0b4, { y: 1.85 }), // deck level cap
      ];
      // A-frame pylon rising from the deck
      parts.push(cyl(0.18, 0.22, 2.8, 6, 0xe05a4a, { rz: 0.08, x: -0.25, y: 3.3 })); // pylon leg left
      parts.push(cyl(0.18, 0.22, 2.8, 6, 0xe05a4a, { rz: -0.08, x: 0.25, y: 3.3 })); // pylon leg right
      parts.push(box(0.8, 0.18, 0.22, 0xe05a4a, { y: 3.8 })); // pylon crossbeam
      parts.push(box(0.6, 0.14, 0.18, 0xd04838, { y: 4.5 })); // upper crossbeam
      // Stay cables fanning from pylon top
      for (let i = 0; i < 4; i++) {
        const span = 0.5 + i * 0.5;
        const len = Math.hypot(span, 2.2);
        const ang = Math.atan2(span, 2.2);
        parts.push(box(0.03, len, 0.03, 0xe8e2d6, { rz: ang, x: -span / 2, y: 3.3 })); // cable left
        parts.push(box(0.03, len, 0.03, 0xe8e2d6, { rz: -ang, x: span / 2, y: 3.3 })); // cable right
      }
      // Navigation light at top
      parts.push(sph(0.1, 0xffd25a, { ws: 5, hs: 4, y: 4.75 })); // warning light
      return finish(parts);
    },
  },

  /* ---- slot 2: 其他摩天樓 other skyscraper (shorter for island) ----------- */
  {
    id: 'other_skyscraper',
    displayName: '其他摩天樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 130, // shorter for island scale
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x4a5466, 0x5a6678, 0x8a96a8, 0xc0c8d4, 0xffd884],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Shorter tapered office tower for island scale — Magong township building.
      return finish([
        towerBanded(1.25, 1.5, 1.25, 5, 0x46566c, 0x8a96a8, 0xffd884, rng, { y: 0.75 }), // base block
        towerBanded(0.95, 1.2, 0.95, 4, 0x4c5e76, 0x96a2b4, 0xffe0a0, rng, { y: 2.1 }), // mid block
        towerBanded(0.68, 0.8, 0.68, 3, 0x546880, 0xa4b0c2, 0xffe6ac, rng, { y: 3.1 }), // upper block
        box(0.5, 0.16, 0.5, 0x7a8494, { y: 3.58 }), // crown cap
        cyl(0.035, 0.035, 0.6, 6, 0xcdd4dc, { y: 3.98 }), // antenna
      ]);
    },
  },

  /* ---- slot 3: 巨型廣告牆 giant ad wall ----------------------------------- */
  {
    id: 'giant_ad_wall',
    displayName: '巨型廣告牆',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 110,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2c3140, 0xff3d6e, 0x37c8e0, 0xffd23d, 0xf0f2f6],
    yOffset: -0.239,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // A building face turned into a giant LED billboard wall: bright color panels.
      const panel = [0xff3d6e, 0x37c8e0, 0xffd23d, 0x6ae060, 0xff8a3d];
      const parts = [
        box(2.4, 3.2, 0.9, 0x23272f, { y: 1.7, hex2: 0x2c3140 }), // host building (dark)
        box(2.55, 2.6, 0.12, 0x10131a, { y: 2.0, z: 0.5 }), // billboard backing frame
      ];
      // 3 x 4 grid of glowing LED panels on the front face
      for (let gx = 0; gx < 3; gx++) {
        for (let gy = 0; gy < 4; gy++) {
          const c = panel[(gx * 4 + gy + (rng() < 0.4 ? 1 : 0)) % panel.length];
          parts.push(box(0.66, 0.5, 0.06, c, { x: -0.72 + gx * 0.72, y: 1.15 + gy * 0.6, z: 0.58 })); // LED panel
        }
      }
      parts.push(box(2.6, 0.1, 0.16, 0x55606e, { y: 0.5, z: 0.5 })); // ground catwalk
      return finish(parts);
    },
  },

  /* ---- slot 4: 圖書館塔 library tower (Penghu visitor facility) ----------- */
  {
    id: 'library_tower',
    displayName: '圖書館塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0xd8d0c0, 0xc8c0b0, 0x88a8c0, 0xe8e4dc, 0xffd884],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Penghu library/cultural center: white-washed walls, arched entrance, reading galleries.
      const parts = [
        // Main building block (clean white-washed style)
        box(2.2, 2.2, 1.8, 0xd8d0c0, { y: 1.1, hex2: 0xe8e4dc }), // main block
        box(2.3, 0.12, 1.9, 0xc4bcac, { y: 2.25 }), // roof cornice
        // Arched entrance portico
        cyl(0.5, 0.5, 0.4, 8, 0xc8c0b0, { rx: Math.PI / 2, y: 0.7, z: 1.0 }), // arch barrel
        box(1.2, 1.0, 0.2, 0xe0d8c8, { y: 0.5, z: 1.0 }), // entrance frame
        // Reading gallery windows
        towerBanded(1.6, 1.0, 0.3, 4, 0xc0b8a8, 0x88a8c0, 0xffd884, rng, { y: 1.8, z: 0.76 }), // gallery windows
        // Upper reading room with larger windows
        box(1.4, 0.9, 1.2, 0xd4ccc0, { y: 2.75, hex2: 0xe4dcd0 }), // upper floor
        box(1.2, 0.5, 0.15, 0x88a8c0, { y: 2.8, z: 0.65 }), // upper windows
        // Roof elements
        box(1.5, 0.08, 1.3, 0xb8b0a0, { y: 3.24 }), // upper roof
        cyl(0.06, 0.06, 0.4, 6, 0xa8a090, { y: 3.5 }), // flag pole
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 遊客中心 visitor center ------------------------------------ */
  {
    id: 'visitor_center',
    displayName: '遊客中心',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 100,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd0c8b8, 0xa8c8d8, 0x88b8d0, 0xe4e0d8, 0xffeaa0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Penghu tourist visitor center: modern low-rise with observation deck and info panels.
      const parts = [
        // Main visitor center building (low, wide)
        box(3.0, 1.2, 1.6, 0xd0c8b8, { y: 0.6, hex2: 0xe4e0d8 }), // main hall
        box(3.1, 0.1, 1.7, 0xc0b8a8, { y: 1.25 }), // roof edge
        // Large glass entrance facade
        box(1.8, 0.9, 0.1, 0xa8c8d8, { y: 0.5, z: 0.85, hex2: 0x88b8d0 }), // glass wall
        // Observation tower on one end
        box(0.8, 2.0, 0.8, 0xc8c0b0, { x: 1.0, y: 1.6, hex2: 0xd8d0c0 }), // tower shaft
        box(1.0, 0.2, 1.0, 0xb8b0a0, { x: 1.0, y: 2.7 }), // observation deck
        box(0.9, 0.06, 0.9, 0xa0988c, { x: 1.0, y: 2.83 }), // deck railing
        // Info kiosk / ticket booth
        box(0.6, 0.8, 0.6, 0xe0d8cc, { x: -1.3, y: 0.4 }), // kiosk
        box(0.7, 0.08, 0.7, 0xd0c8bc, { x: -1.3, y: 0.84 }), // kiosk roof
        // Signage panel
        box(0.8, 0.5, 0.05, 0x88b8d0, { x: -0.2, y: 1.5, z: 0.83 }), // info sign
      ];
      return finish(parts);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop plant room -------------------------------- */
  {
    id: 'rooftop_plant_room',
    displayName: '屋頂機房',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 68,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x6a7280, 0x848c9a, 0xa6aeba, 0xc8ccd2, 0xe0c860],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A capped building top: the plant-room penthouse with cooling towers, ducts and rails.
      const parts = [
        box(2.6, 1.6, 2.0, 0x5a6470, { y: 0.8, hex2: 0x6a7280 }), // truncated building top
        box(2.66, 0.16, 2.06, 0x4a525e, { y: 1.6 }), // roof slab cornice
        box(1.5, 0.9, 1.2, 0xa6aeba, { x: -0.3, y: 2.05, hex2: 0xc8ccd2 }), // plant-room penthouse
        box(0.6, 0.18, 0.4, 0x444a54, { x: -0.3, y: 2.5 }), // penthouse roof hatch
      ];
      // Cooling-tower fans + ducting scattered on the roof.
      parts.push(cyl(0.34, 0.34, 0.5, 8, 0x9aa2ae, { x: 0.85, y: 1.93 })); // cooling tower
      parts.push(cyl(0.34, 0.0, 0.16, 8, 0x7a828e, { x: 0.85, y: 2.26 })); // cooling tower cowl
      parts.push(cyl(0.28, 0.28, 0.46, 8, 0x9aa2ae, { x: 0.85, y: 1.91, z: -0.7 })); // cooling tower 2
      parts.push(box(1.2, 0.18, 0.18, 0x88909c, { x: 0.2, y: 1.78, z: 0.7 })); // duct run
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: 0.95 })); // roof guard rail
      parts.push(box(2.5, 0.06, 0.06, 0xb0b6c0, { y: 1.72, z: -0.95 })); // roof guard rail
      return finish(parts);
    },
  },

  /* ---- slot 7: 灣區大樓 bayarea block ------------------------------------- */
  {
    id: 'bayarea_block',
    displayName: '灣區大樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x36405a, 0x4a5670, 0x7a86a0, 0xb0bccc, 0xffd884],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Bay area building cluster: lower heights suited to Penghu harbor district.
      const parts = [box(3.2, 0.14, 1.2, 0x2a3142, { y: 0.07 })]; // ground / harbor slab
      // Fewer, shorter buildings than mainland skyline
      const hs = [1.6, 2.4, 1.4, 2.0, 1.8];
      const floorsArr = [4, 6, 4, 5, 5];
      const wallHex = [0x36405a, 0x3e4a64, 0x44506c, 0x3a4660, 0x404c66];
      for (let i = 0; i < 5; i++) {
        const h = hs[i];
        const x = -1.2 + i * 0.6;
        parts.push(
          towerBanded(0.5, h, 0.7, floorsArr[i], wallHex[i], 0x7a86a0, 0xffd884, rng, {
            x, y: 0.14 + h / 2, z: (i % 2) * 0.15 - 0.08,
          }) // bay area tower
        );
        // small rooftop cap
        parts.push(box(0.26, 0.12, 0.26, 0x6a7488, { x, y: 0.14 + h + 0.05, z: (i % 2) * 0.15 - 0.08 }));
      }
      // Harbor-side railing
      parts.push(box(3.0, 0.08, 0.04, 0x8896a8, { y: 0.16, z: 0.6 }));
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 cross-street skybridge ----------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 240,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x3c5876, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Skybridge between two bay area buildings — Penghu style, more modest scale.
      const parts = [
        towerBanded(1.1, 2.2, 1.1, 7, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: -1.7, y: 1.1 }), // block A
        towerBanded(1.1, 2.4, 1.1, 7, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: 1.7, y: 1.2 }), // block B
        box(2.4, 0.5, 0.75, 0x9fd0e4, { y: 1.4, hex2: 0xc8e8f4 }), // lower glazed span
        box(2.4, 0.45, 0.7, 0x9fd0e4, { y: 2.0, hex2: 0xc8e8f4 }), // upper glazed span
        box(2.4, 0.05, 0.78, 0x88a0b4, { y: 1.16 }), // lower span floor
        box(2.4, 0.05, 0.78, 0x88a0b4, { y: 2.26 }), // upper span roof
      ];
      // diagonal truss struts under the lower span
      for (let i = 0; i < 3; i++) {
        const sx = -0.9 + i * 0.6;
        parts.push(box(0.04, 0.7, 0.04, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.1 })); // truss strut
      }
      parts.push(box(0.6, 0.22, 0.6, 0x7a8492, { x: -1.7, y: 2.35 })); // block A roof unit
      parts.push(box(0.6, 0.22, 0.6, 0x7a8492, { x: 1.7, y: 2.55 })); // block B roof unit
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop mech tower ------------- */
  {
    id: 'rooftop_mech_tower',
    displayName: '屋頂機房塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x4a5260, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A tower with a dense mechanical/antenna mast head — island communications tower style.
      const parts = [
        towerBanded(1.2, 2.6, 1.2, 8, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.3 }), // main shaft
        box(1.3, 0.18, 1.3, 0x363c46, { y: 2.7 }), // roof slab
        box(0.9, 0.8, 0.9, 0x646c7a, { y: 3.2, hex2: 0x8a92a0 }), // mech penthouse
        box(0.6, 0.55, 0.6, 0xb8bcc6, { y: 3.85 }), // upper mech box
      ];
      // antenna mast cluster on top
      parts.push(cyl(0.05, 0.05, 1.2, 6, 0xd0d4dc, { y: 4.7 })); // central mast
      parts.push(cyl(0.035, 0.035, 0.7, 6, 0xc8ccd4, { x: 0.24, y: 4.45 })); // side mast
      parts.push(cyl(0.035, 0.035, 0.7, 6, 0xc8ccd4, { x: -0.24, y: 4.45 })); // side mast
      parts.push(sph(0.1, 0xe0c860, { ws: 6, hs: 4, y: 5.3 })); // aircraft warning light (lit)
      // three mech-platform rings up the mast
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.4, 0.04, 0.4, 0x9aa0aa, { y: 4.2 + i * 0.35 })); // mast platform
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
