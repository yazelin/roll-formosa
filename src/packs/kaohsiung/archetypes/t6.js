/**
 * @file packs/kaohsiung/archetypes/t6.js — Roll Formosa Kaohsiung pack, Tier 6.
 *
 * T6 — 亞洲新灣區天際線 (Asia New Bay Area skyline). The finale band: glass
 * curtain-wall highrises, the 高雄展覽館 exhibition hall, the 高雄流行音樂中心
 * (Music Center) crystal towers, the 高雄市立圖書館總館 suspended library, giant
 * LED ad walls and rooftop mech rooms lit against the 新灣區 deep blue-violet
 * night. Ten ArchetypeDefs, authored in the FROZEN tier order
 * (tiers.js T6.archetypeIds) — slots [0..7] absorbable, slots [8..9] repeatable
 * chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (新灣區 skyscraper scale).
 */

import { box, cyl, cone, sph, towerBanded, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 玻璃帷幕高樓 glass curtain-wall highrise ----------------- */
  {
    id: 'glass_highrise',
    displayName: '玻璃帷幕高樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x2f5478, 0x4a7aa0, 0x6fb0cc, 0x9fd0e4, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Slender all-glass slab with a stepped glass crown and vertical mullion seams.
      return finish([
        towerBanded(0.95, 3.4, 0.95, 12, 0x2a4868, 0x6fb0cc, 0xffe08a, rng, { y: 1.7 }), // glass shaft (港邊藍 + lit windows)
        towerBanded(0.78, 0.9, 0.78, 4, 0x32567a, 0x7ab8d4, 0xffe6a0, rng, { y: 3.85 }), // setback crown box
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: 0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        box(0.05, 3.4, 0.05, 0xbfe2f0, { x: -0.5, y: 1.7, z: 0.5 }), // corner mullion glint
        cyl(0.05, 0.05, 0.7, 6, 0xd0d6dc, { y: 4.6 }), // rooftop mast
        box(0.4, 0.14, 0.4, 0x556270, { y: 4.32 }), // mast base plinth
      ]);
    },
  },

  /* ---- slot 1: 高雄展覽館 Kaohsiung Exhibition Center ------------------ */
  {
    id: 'exhibition_hall',
    displayName: '高雄展覽館',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3a6a86, 0x5a96b0, 0x88c0d4, 0xcbe6ee, 0xffd884],
    yOffset: -0.541,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Low-slung waterfront convention hall: long glass-walled hangar block under a
      // sweeping wave roof, fronted by a glazed canopy on slim columns.
      const parts = [
        box(4.0, 0.16, 2.0, 0x33586e, { y: 0.08 }), // waterfront apron slab
        towerBanded(3.6, 1.3, 1.7, 4, 0x3a6a86, 0x88c0d4, 0xffd884, rng, { y: 0.81 }), // glazed hall body
        box(3.7, 0.18, 1.78, 0x6aa6bc, { y: 1.55, hex2: 0x9fd0e4 }), // roof slab over hall
      ];
      // sweeping wave roof — three shallow shells along the length
      for (let i = 0; i < 3; i++) {
        const x = -1.2 + i * 1.2;
        parts.push(cyl(0.6, 0.6, 1.8, 10, 0xcbe6ee, { rx: Math.PI / 2, x, y: 1.85, thetaLen: Math.PI, theta0: 0, hex2: 0x9fd0e4 })); // half-shell wave
      }
      // glazed entrance canopy on slim columns, water side
      parts.push(box(3.4, 0.08, 0.7, 0xb4dde8, { y: 1.0, z: 1.2 })); // canopy plate
      for (const cx of [-1.4, -0.5, 0.5, 1.4]) {
        parts.push(cyl(0.05, 0.05, 1.0, 6, 0x9fb6c2, { x: cx, y: 0.5, z: 1.2 })); // canopy column
      }
      return finish(parts);
    },
  },

  /* ---- slot 2: 其他摩天樓 other skyscraper --------------------------- */
  {
    id: 'other_skyscraper',
    displayName: '其他摩天樓',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x46566c, 0x5a6678, 0x8a96a8, 0xc0c8d4, 0xffd884],
    yOffset: -0.046,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Tapered three-tier office tower with a slim antenna — a generic 新灣區 peer.
      return finish([
        towerBanded(1.25, 1.9, 1.25, 6, 0x46566c, 0x8a96a8, 0xffd884, rng, { y: 0.95 }), // base block
        towerBanded(0.95, 1.5, 0.95, 5, 0x4c5e76, 0x96a2b4, 0xffe0a0, rng, { y: 2.65 }), // mid block (setback)
        towerBanded(0.68, 1.1, 0.68, 4, 0x546880, 0xa4b0c2, 0xffe6ac, rng, { y: 3.95 }), // upper block (setback)
        box(0.5, 0.18, 0.5, 0x7a8494, { y: 4.6 }), // crown cap
        cyl(0.035, 0.035, 0.9, 6, 0xcdd4dc, { y: 5.15 }), // antenna
      ]);
    },
  },

  /* ---- slot 3: 巨型廣告牆 giant LED ad wall --------------------------- */
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

  /* ---- slot 4: 高雄市立圖書館總館 main library tower ------------------ */
  {
    id: 'library_tower',
    displayName: '高雄市立圖書館總館',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x3c5e74, 0x6a9ab0, 0xa8d2e0, 0xe6f1f4, 0xffe6a0],
    yOffset: -0.336,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 高雄總圖: the famous suspended-garden cube — a tall glass core hoisting a
      // wide glazed reading box clear of the ground on a single fat mast, leaving an
      // open plaza beneath. Horizontal floor bands read as its signature stacking.
      const parts = [
        box(3.0, 0.14, 2.6, 0x2f4d60, { y: 0.07 }), // open ground plaza slab
        cyl(0.42, 0.42, 1.5, 8, 0x6a9ab0, { y: 0.85, hex2: 0x8ab8cc }), // central suspension core/mast
        towerBanded(2.6, 1.9, 2.3, 6, 0x3c5e74, 0xa8d2e0, 0xffe6a0, rng, { y: 2.45 }), // suspended glazed reading box
        box(2.74, 0.16, 2.44, 0xe6f1f4, { y: 3.45 }), // bright roof-garden slab
      ];
      // suspension stay rods from the roof down to the lifted box corners
      for (const sx of [-1.1, 1.1]) {
        for (const sz of [-0.95, 0.95]) {
          parts.push(box(0.04, 1.6, 0.04, 0xcdd8dc, { x: sx, y: 2.55, z: sz })); // hanger rod
        }
      }
      // thin floor-edge bands to read the stacked reading levels
      for (let i = 0; i < 3; i++) {
        parts.push(box(2.72, 0.05, 2.42, 0xcbe6ee, { y: 1.7 + i * 0.5 })); // floor band
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 高雄流行音樂中心 music center -------------------------- */
  {
    id: 'music_center',
    displayName: '高雄流行音樂中心',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x2c3a66, 0x4a5e9a, 0x7a86c8, 0xb6c0ec, 0x9fe6e0],
    yOffset: -0.25,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // 高流: the cluster of faceted crystalline towers rising from the 愛河灣
      // waterfront — angular jewel-like peaks of varied height over a low podium,
      // skinned in cool violet-cyan glass.
      const parts = [
        box(3.4, 0.18, 1.6, 0x26305c, { y: 0.09 }), // waterfront podium deck
      ];
      // a row of faceted crystal towers (low-seg cones = jewel facets) of varied height
      const peaks = [
        { x: -1.3, h: 1.7, r: 0.5 },
        { x: -0.55, h: 2.6, r: 0.46 },
        { x: 0.2, h: 2.1, r: 0.5 },
        { x: 0.95, h: 3.0, r: 0.44 },
        { x: 1.55, h: 1.5, r: 0.42 },
      ];
      for (let i = 0; i < peaks.length; i++) {
        const p = peaks[i];
        const wall = i % 2 ? 0x4a5e9a : 0x3a4c84;
        parts.push(cyl(p.r * 0.74, p.r, p.h, 5, wall, { x: p.x, y: 0.18 + p.h / 2, hex2: 0x7a86c8 })); // pentagonal crystal shaft
        parts.push(cone(p.r * 0.78, p.h * 0.42, 5, 0x9fe6e0, { x: p.x, y: 0.18 + p.h + p.h * 0.21 })); // faceted glass peak (lit cyan)
      }
      return finish(parts);
    },
  },

  /* ---- slot 6: 屋頂機房 rooftop plant room ---------------------------- */
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

  /* ---- slot 7: 灣區量體 bay-area block ------------------------------- */
  {
    id: 'bayarea_block',
    displayName: '灣區量體',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x32405e, 0x46567a, 0x7a86b0, 0xa8c0d8, 0xffd884],
    yOffset: -0.308,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // A whole stretch of 新灣區 waterfront skyline: staggered lit towers of varying
      // heights along a quay, the lights reflecting in the harbour blue.
      const parts = [box(3.6, 0.16, 1.4, 0x232b46, { y: 0.08 })]; // quay / street slab
      const hs = [2.4, 3.4, 1.8, 2.9, 2.2];
      const floorsArr = [6, 8, 5, 7, 6];
      const wallHex = [0x32405e, 0x3a4a6e, 0x405074, 0x36466a, 0x3c4c70];
      for (let i = 0; i < 5; i++) {
        const h = hs[i];
        const x = -1.4 + i * 0.7;
        parts.push(
          towerBanded(0.56, h, 0.78, floorsArr[i], wallHex[i], 0x7a86b0, 0xffd884, rng, {
            x, y: 0.16 + h / 2, z: (i % 2) * 0.18 - 0.09,
          }) // skyline tower
        );
        // small rooftop cap so silhouettes vary
        parts.push(box(0.3, 0.16, 0.3, 0x6a7494, { x, y: 0.16 + h + 0.06, z: (i % 2) * 0.18 - 0.09 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨街空橋 cross-street skybridge ------- */
  {
    id: 'crossstreet_skybridge',
    displayName: '跨街空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x33526e, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Monumental: a wide multi-level glazed skybridge spanning a street between
      // two big 新灣區 mixed-use blocks — the signature waterfront air-corridor.
      const parts = [
        towerBanded(1.3, 2.8, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: -2.0, y: 1.4 }), // block A
        towerBanded(1.3, 3.0, 1.3, 9, 0x33526e, 0x5a86a8, 0xffe0a0, rng, { x: 2.0, y: 1.5 }), // block B
        box(2.8, 0.6, 0.9, 0x9fd0e4, { y: 1.6, hex2: 0xc8e8f4 }), // lower glazed span
        box(2.8, 0.55, 0.85, 0x9fd0e4, { y: 2.4, hex2: 0xc8e8f4 }), // upper glazed span
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 1.32 }), // lower span floor
        box(2.8, 0.05, 0.92, 0x88a0b4, { y: 2.7 }), // upper span roof
      ];
      // diagonal truss struts under the lower span
      for (let i = 0; i < 4; i++) {
        const sx = -1.1 + i * 0.73;
        parts.push(box(0.05, 0.85, 0.05, 0xb8c0c8, { rz: (i % 2 ? 1 : -1) * 0.5, x: sx, y: 1.25 })); // truss strut
      }
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: -2.0, y: 2.95 })); // block A roof unit
      parts.push(box(0.7, 0.26, 0.7, 0x7a8492, { x: 2.0, y: 3.15 })); // block B roof unit
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 屋頂機房塔 rooftop mech tower --------- */
  {
    id: 'rooftop_mech_tower',
    displayName: '屋頂機房塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x42505e, 0x646c7a, 0x8a92a0, 0xb8bcc6, 0xe0c860],
    yOffset: -0.044,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A tall tower crowned by a dense mechanical/antenna mast head — the kind of
      // rooftop mech stack that tops 新灣區's tallest service towers.
      const parts = [
        towerBanded(1.4, 3.4, 1.4, 11, 0x42505e, 0x8a92a0, 0xe0c860, rng, { y: 1.7 }), // main shaft
        box(1.5, 0.2, 1.5, 0x363c46, { y: 3.5 }), // roof slab
        box(1.1, 1.0, 1.1, 0x646c7a, { y: 4.1, hex2: 0x8a92a0 }), // mech penthouse
        box(0.7, 0.7, 0.7, 0xb8bcc6, { y: 4.85 }), // upper mech box
      ];
      // antenna mast cluster on top
      parts.push(cyl(0.05, 0.05, 1.4, 6, 0xd0d4dc, { y: 5.6 })); // central mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: 0.28, y: 5.3 })); // side mast
      parts.push(cyl(0.035, 0.035, 0.9, 6, 0xc8ccd4, { x: -0.28, y: 5.3 })); // side mast
      parts.push(sph(0.12, 0xe0c860, { ws: 6, hs: 4, y: 6.3 })); // aircraft warning light (lit)
      // three mech-platform rings up the mast
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.5, 0.04, 0.5, 0x9aa0aa, { y: 5.1 + i * 0.45 })); // mast platform
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
