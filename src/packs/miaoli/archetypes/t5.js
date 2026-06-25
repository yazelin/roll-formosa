/**
 * @file archetypes/t5.js — Miaoli pack T5 「舊山線鐵道」chunk archetypes.
 *
 * Tier 5 (naturalBand 5) of the 7-tier ladder: the Old Mountain Railway
 * (舊山線) scale band (radiusNominal 12–60 m real). Eight absorbable
 * archetypes (slots 0–7, spawnWeight 1.0) plus two repeatable CHUNK
 * LANDMARKS (slots 8–9, spawnWeight ~0.5). ids are the FROZEN CONTRACT
 * declared in packs/miaoli/tiers.js — spelling must NOT drift.
 *
 * Theme: 舊山線暮色 — historic railway stations, rail viaducts through
 * mountain valleys, the 勝興車站 heritage station, old brick warehouses,
 * and rural mountain architecture of Sanyi/Miaoli.
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
  /* ---- slot 0: 舊山線商號 old_mountain_shophouse -------------------- */
  {
    id: 'old_mountain_shophouse',
    displayName: '舊山線商號',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 22,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xc8b890, 0x8a6a4a, 0xf0e8d8, 0x5a3a1a, 0xe8d8c0],
    yOffset: -0.08,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Heritage shophouse along the Old Mountain Railway (舊山線商號) —
      // 2-3 storey Japanese-colonial era commercial building with arcade.
      const parts = [
        // main building body (cream/earth tone)
        box(2.6, 6.0, 2.0, 0xffffff, { y: 3.0, hex2: 0xf0e8d8 }),
        // dark wood horizontal trim bands (Japanese style)
        box(2.7, 0.14, 0.12, 0x5a3a1a, { y: 0.5, z: 1.02 }),
        box(2.7, 0.14, 0.12, 0x5a3a1a, { y: 2.2, z: 1.02 }),
        box(2.7, 0.14, 0.12, 0x5a3a1a, { y: 4.0, z: 1.02 }),
        box(2.7, 0.14, 0.12, 0x5a3a1a, { y: 5.8, z: 1.02 }),
        // vertical wood posts
        box(0.16, 6.0, 0.16, 0x6a4a2a, { x: -1.2, y: 3.0, z: 0.94 }),
        box(0.16, 6.0, 0.16, 0x6a4a2a, { x: 1.2, y: 3.0, z: 0.94 }),
        box(0.16, 6.0, 0.16, 0x6a4a2a, { x: 0, y: 3.0, z: 0.94 }),
        // hip tile roof
        cyl(1.6, 1.6, 3.0, 4, 0x7a5a40, { theta0: PI, rx: HALF_PI, sy: 0.45, y: 6.3 }),
        box(3.0, 0.12, 0.18, 0x6a4a32, { y: 6.58 }), // ridge
        // ground arcade (騎樓)
        box(2.8, 0.18, 0.3, 0x9a8a78, { y: 2.0, z: 1.15 }),
        // arcade columns
        cyl(0.12, 0.14, 2.0, 6, 0xe8e0d0, { x: -1.0, y: 1.0, z: 1.3 }),
        cyl(0.12, 0.14, 2.0, 6, 0xe8e0d0, { x: 1.0, y: 1.0, z: 1.3 }),
        // shop signboard
        box(1.8, 0.5, 0.08, 0x5a3a1a, { y: 2.4, z: 1.1 }),
        box(1.6, 0.35, 0.04, 0xf0e8d8, { y: 2.4, z: 1.15 }),
      ];
      // windows (traditional style)
      const winY = [3.2, 4.6];
      for (const wy of winY) {
        parts.push(box(0.6, 0.7, 0.08, 0xe8e0d0, { x: -0.7, y: wy, z: 1.02 }));
        parts.push(box(0.6, 0.7, 0.08, 0xe8e0d0, { x: 0.7, y: wy, z: 1.02 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 舊車站 old_station (Historic Japanese-era station) -- */
  {
    id: 'old_station',
    displayName: '舊車站',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 28,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0xc8b090, 0x5a4a3a, 0xb04030, 0xe8e0d0],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Japanese colonial-era wooden railway station (勝興車站 style)
      // Dark wood frame, white plaster infill, hip roof with eaves
      const parts = [
        // raised platform base
        box(5.0, 0.4, 2.8, 0x9a8a78, { y: 0.2 }),
        // main station building — wood frame + plaster
        box(4.2, 1.8, 2.4, 0xffffff, { y: 1.3, hex2: 0xf0e8d8 }),
        // dark wood trim beams (horizontal)
        box(4.3, 0.12, 0.1, 0x5a4a3a, { y: 0.5, z: 1.22 }),
        box(4.3, 0.12, 0.1, 0x5a4a3a, { y: 1.3, z: 1.22 }),
        box(4.3, 0.12, 0.1, 0x5a4a3a, { y: 2.1, z: 1.22 }),
        // vertical wood posts
        box(0.14, 1.8, 0.14, 0x5a4a3a, { x: -1.9, y: 1.3, z: 1.18 }),
        box(0.14, 1.8, 0.14, 0x5a4a3a, { x: -0.6, y: 1.3, z: 1.18 }),
        box(0.14, 1.8, 0.14, 0x5a4a3a, { x: 0.6, y: 1.3, z: 1.18 }),
        box(0.14, 1.8, 0.14, 0x5a4a3a, { x: 1.9, y: 1.3, z: 1.18 }),
        // hip roof with wide eaves (Japanese style)
        cyl(1.6, 1.6, 4.6, 4, 0x6a4a32, { theta0: PI, rx: HALF_PI, sy: 0.45, y: 2.5 }),
        box(4.8, 0.1, 3.0, 0x7a5a40, { y: 2.25 }), // eave overhang slab
        // station name sign board
        box(1.4, 0.4, 0.08, 0xe8e0d0, { y: 1.8, z: 1.26 }),
        box(1.3, 0.3, 0.04, 0x5a4a3a, { y: 1.8, z: 1.3 }), // kanji text area
        // entrance doors (double wooden)
        box(0.9, 1.2, 0.1, 0x6a5040, { y: 1.0, z: 1.22 }),
        // platform awning on track side
        box(4.6, 0.1, 1.2, 0x8a7a68, { y: 2.0, z: -1.8 }),
      ];
      // awning support posts
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.08, 0.08, 1.6, 6, 0x5a4a3a, { x: -1.7 + i * 1.13, y: 1.2, z: -2.3 }));
      }
      // windows (paper screens / glass)
      const winX = [-1.25, 1.25];
      for (const wx of winX) {
        parts.push(box(0.5, 0.6, 0.06, 0xf0e8d8, { x: wx, y: 1.4, z: 1.24 }));
        parts.push(box(0.06, 0.6, 0.04, 0x5a4a3a, { x: wx, y: 1.4, z: 1.27 })); // mullion
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 鐵道高架 rail_viaduct (Mountain rail viaduct) ------ */
  {
    id: 'rail_viaduct',
    displayName: '鐵道高架',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 45,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa09080, 0x8a7868, 0xc8b8a0, 0x6a5a4a, 0xb8443a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Old Mountain Line brick/stone rail viaduct (龍騰斷橋 style arches)
      // Multiple brick arches supporting rail tracks
      const parts = [
        // continuous deck girder / rail bed on top
        box(9.0, 0.4, 1.6, 0xffffff, { y: 3.6, hex2: 0xc8b8a0 }),
        // rail tracks on deck
        box(9.0, 0.08, 0.12, 0x5a5a5a, { y: 3.84, z: 0.4 }),
        box(9.0, 0.08, 0.12, 0x5a5a5a, { y: 3.84, z: -0.4 }),
        // cross ties
        box(0.15, 0.06, 1.2, 0x6a5040, { x: -3.0, y: 3.78 }),
        box(0.15, 0.06, 1.2, 0x6a5040, { x: -1.5, y: 3.78 }),
        box(0.15, 0.06, 1.2, 0x6a5040, { x: 0.0, y: 3.78 }),
        box(0.15, 0.06, 1.2, 0x6a5040, { x: 1.5, y: 3.78 }),
        box(0.15, 0.06, 1.2, 0x6a5040, { x: 3.0, y: 3.78 }),
        // parapet walls
        box(9.0, 0.5, 0.12, 0xa09080, { y: 3.95, z: 0.78 }),
        box(9.0, 0.5, 0.12, 0xa09080, { y: 3.95, z: -0.78 }),
      ];
      // brick arch piers with semi-circular arches (4 arches)
      for (let i = 0; i < 4; i++) {
        const x = -3.4 + i * 2.26;
        // pier (brick pillar)
        parts.push(box(0.8, 3.4, 1.5, 0xb8443a, { x, y: 1.7, hex2: 0xa04030 }));
        // arch ring between piers (half-cylinder)
        if (i < 3) {
          const arcX = x + 1.13;
          parts.push(cyl(1.0, 1.0, 1.5, 8, 0xb8443a, {
            x: arcX, y: 2.9, rx: HALF_PI, thetaLen: PI, theta0: 0,
          }));
        }
      }
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

  /* ---- slot 5: 鐵道看板 rail_billboard ---------------------------- */
  {
    id: 'rail_billboard',
    displayName: '鐵道看板',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 20,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0x5a4a3a, 0xe8d8c0, 0xb04030, 0xf2f2ee],
    yOffset: -0.21,
    upright: true,
    collisionScale: 0.5,
    buildGeometry(rng) {
      // Heritage railway billboard / station name sign on wooden gantry
      const parts = [
        // wooden gantry legs
        box(0.22, 4.6, 0.22, 0x6a5040, { x: -1.7, y: 2.3, rz: 0.06 }),
        box(0.22, 4.6, 0.22, 0x6a5040, { x: 1.7, y: 2.3, rz: -0.06 }),
        box(3.6, 0.2, 0.2, 0x6a5040, { y: 1.4 }), // cross brace
        box(3.6, 0.2, 0.2, 0x6a5040, { y: 3.0 }), // cross brace
        // diagonal brace
        box(4.0, 0.14, 0.14, 0x5a4a3a, { y: 2.2, rz: 0.78 }),
        // billboard frame (wooden) + painted face
        box(5.2, 2.4, 0.22, 0x5a4a3a, { y: 5.4 }), // wooden frame
        box(5.0, 2.2, 0.06, 0xe8d8c0, { y: 5.4, z: 0.15 }), // painted face (cream)
        box(5.2, 0.2, 0.3, 0x6a5040, { y: 6.7 }), // top rail
        // "舊山線" text area
        box(3.0, 1.2, 0.04, 0xffffff, { y: 5.4, z: 0.2 }),
        // red accent bands (heritage railway style)
        box(5.0, 0.15, 0.05, 0xb04030, { y: 4.4, z: 0.2 }),
        box(5.0, 0.15, 0.05, 0xb04030, { y: 6.4, z: 0.2 }),
      ];
      // small lantern lights
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

  /* ---- slot 8: 舊山線車站塔 mountain_rail_station (CHUNK LANDMARK) - */
  {
    id: 'mountain_rail_station',
    displayName: '舊山線車站塔',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 55,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0x8a6a4a, 0xc8b090, 0x5a4a3a, 0xb04030, 0xe8e0d0],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // Grand historic mountain railway station (勝興車站 scale landmark)
      // Multi-wing Japanese colonial station with signal tower
      const parts = [
        // main platform base
        box(6.0, 0.5, 4.0, 0x9a8a78, { y: 0.25 }),
        // main station hall (central)
        box(3.6, 2.4, 2.8, 0xffffff, { y: 1.7, hex2: 0xf0e8d8 }),
        // left wing (waiting room)
        box(2.0, 1.8, 2.4, 0xffffff, { x: -2.5, y: 1.4, hex2: 0xf0e8d8 }),
        // right wing (ticket office)
        box(2.0, 1.8, 2.4, 0xffffff, { x: 2.5, y: 1.4, hex2: 0xf0e8d8 }),
        // hip roofs (Japanese style)
        cyl(1.8, 1.8, 4.0, 4, 0x6a4a32, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 3.2 }),
        cyl(1.3, 1.3, 2.4, 4, 0x7a5a40, { theta0: PI, rx: HALF_PI, sy: 0.45, x: -2.5, y: 2.6 }),
        cyl(1.3, 1.3, 2.4, 4, 0x7a5a40, { theta0: PI, rx: HALF_PI, sy: 0.45, x: 2.5, y: 2.6 }),
        // signal tower (the distinctive vertical element)
        box(1.2, 3.5, 1.2, 0x5a4a3a, { x: 3.2, y: 2.25 }),
        cyl(0.9, 0.9, 1.4, 4, 0x6a4a32, { theta0: PI, rx: HALF_PI, sy: 0.5, x: 3.2, y: 4.2 }),
        // signal arms
        box(0.8, 0.1, 0.15, 0xb04030, { x: 3.5, y: 3.6 }),
        box(0.6, 0.08, 0.12, 0xe8e0d0, { x: 3.5, y: 3.3 }),
        // platform awning (track side)
        box(5.5, 0.12, 1.8, 0x8a7a68, { y: 2.3, z: -2.4 }),
      ];
      // awning supports
      for (let i = 0; i < 5; i++) {
        parts.push(cyl(0.1, 0.1, 1.8, 6, 0x5a4a3a, { x: -2.2 + i * 1.1, y: 1.4, z: -3.2 }));
      }
      // dark wood trim
      parts.push(box(3.7, 0.14, 0.12, 0x5a4a3a, { y: 0.7, z: 1.42 }));
      parts.push(box(3.7, 0.14, 0.12, 0x5a4a3a, { y: 1.6, z: 1.42 }));
      parts.push(box(3.7, 0.14, 0.12, 0x5a4a3a, { y: 2.5, z: 1.42 }));
      // entrance door
      parts.push(box(1.2, 1.5, 0.1, 0x6a5040, { y: 1.25, z: 1.42 }));
      // station name board
      parts.push(box(1.8, 0.5, 0.08, 0xe8e0d0, { y: 2.2, z: 1.46 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 倉庫 warehouse_mass (CHUNK LANDMARK) ---------------- */
  {
    id: 'warehouse_mass',
    displayName: '倉庫',
    tier: TIER,
    naturalBand: TIER,
    radiusNominal: 50,
    radiusJitter: 0.14,
    spawnWeight: 0.3,
    palette: [0xb8443a, 0xc85848, 0x8a7848, 0x5a6470, 0xe6d8a8],
    yOffset: -0.41,
    upright: true,
    collisionScale: 0.84,
    buildGeometry(rng) {
      // Old brick railway warehouse (貨運倉庫) — long shed with gabled roof
      const parts = [
        // long low warehouse mass (red brick)
        box(7.2, 3.2, 4.6, 0xffffff, { y: 1.6, hex2: 0xb8443a }),
        // gabled roof
        box(7.4, 0.16, 2.5, 0x7a6a40, { y: 3.35, z: 1.15, rx: 0.2 }),
        box(7.4, 0.16, 2.5, 0x7a6a40, { y: 3.35, z: -1.15, rx: -0.2 }),
        box(7.4, 0.18, 0.2, 0x5a4e30, { y: 3.55 }), // ridge cap
        // loading dock plinth
        box(7.2, 0.5, 0.6, 0x6a6258, { y: 0.25, z: 2.3 }),
        // rail track alongside
        box(7.4, 0.1, 1.2, 0x4a4a4a, { y: 0.05, z: -2.8 }),
        box(7.4, 0.06, 0.1, 0x5a5a5a, { y: 0.12, z: -2.5 }),
        box(7.4, 0.06, 0.1, 0x5a5a5a, { y: 0.12, z: -3.1 }),
      ];
      // big roller doors + dark loading bays
      for (let i = 0; i < 4; i++) {
        const x = -2.7 + i * 1.6;
        parts.push(box(1.1, 1.9, 0.1, 0x37404a, { x, y: 1.05, z: 2.32 })); // door frame
        parts.push(box(0.9, 1.7, 0.06, 0x9aa0a8, { x, y: 1.05, z: 2.38 })); // corrugated door
      }
      // clerestory windows
      for (let i = 0; i < 5; i++) {
        const lit = rng() < 0.4 ? 0xfff0c8 : 0x5f6670;
        parts.push(box(0.9, 0.4, 0.05, lit, { x: -2.4 + i * 1.3, y: 2.6, z: 2.32 }));
      }
      // warehouse name sign
      parts.push(box(2.4, 0.6, 0.1, 0xe6d8a8, { x: -2.2, y: 2.9, z: 2.34 }));
      return finish(parts);
    },
  },
];

export default T5_ARCHETYPES;
