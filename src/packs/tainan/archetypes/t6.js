/**
 * @file packs/taipei/archetypes/t6.js — Roll Formosa Taipei pack, Tier 6.
 *
 * T6 — 安平港天際線 (Anping harbor skyline). The finale band: the Anping
 * lighthouse, fishing boats, port containers, oyster racks, harbor cranes and
 * old red-brick warehouses lit against the deep blue-violet night sky, with one
 * business tower for the skyline. Ten ArchetypeDefs, authored in
 * the FROZEN tier order (tiers.js T6.archetypeIds) — slots [0..7] absorbable,
 * slots [8..9] repeatable chunk landmarks (lower spawnWeight).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 * Size band: 60-300 m radiusNominal (Xinyi skyscraper scale).
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 安平燈塔 Anping lighthouse ----------------------------- */
  {
    id: 'anping_lighthouse',
    displayName: '安平燈塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xf2f2ee, 0xd83a2c, 0x2a2c34, 0xc8ccd2, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      // White tapered lighthouse tower with a red lantern gallery, glass light
      // room and a small light beacon on top.
      const white = 0xffffff;
      return finish([
        // wide base ring / plinth
        cyl(0.95, 1.05, 0.5, 12, 0xe6e2d8, { y: 0.25 }),
        // tapered white tower shaft
        cyl(0.62, 0.9, 3.3, 12, white, { y: 2.0, hex2: 0xf4f4ee }),
        // red gallery deck near the top
        cyl(0.82, 0.82, 0.3, 12, 0xd83a2c, { y: 3.75 }),
        cyl(0.86, 0.86, 0.06, 12, 0x2a2c34, { y: 3.92, open: true }), // dark rail ring
        // glass light room (lantern)
        cyl(0.5, 0.5, 0.7, 10, 0xbfe2f0, { y: 4.25, hex2: 0xffe08a }),
        // red domed cap roof
        cone(0.58, 0.6, 10, 0xd83a2c, { y: 4.9 }),
        // little beacon light + finial
        sph(0.16, 0xffe08a, { ws: 6, hs: 4, y: 5.3 }),
        cyl(0.03, 0.03, 0.3, 5, 0x2a2c34, { y: 5.55 }),
      ]);
    },
  },

  /* ---- slot 1: 漁船 fishing boat (Anping harbor) --------------------- */
  {
    id: 'fishing_boat',
    displayName: '漁船',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 190,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xe8e4da, 0xd83a2c, 0x3a3f52, 0xf0c040],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // A small coastal fishing trawler: hull, wheelhouse cabin, mast with a
      // boom and a few buoys / antenna. Painted blue hull + white cabin.
      const hull = 0x2f6db0;
      const white = 0xe8e4da;
      const parts = [
        // hull body (boxy, slightly tapered bow via an end cone)
        box(4.0, 0.9, 1.3, hull, { y: 0.75, hex2: 0x255a96 }),
        cone(0.9, 1.4, 4, hull, { rz: -HALF_PI, x: 2.6, y: 0.75 }), // pointed bow
        // white waterline / gunwale stripe
        box(4.2, 0.16, 1.36, white, { y: 1.12 }),
        box(4.2, 0.1, 1.4, 0xd83a2c, { y: 1.0 }), // red boot stripe
        // open deck floor
        box(3.4, 0.08, 1.0, 0xc8b890, { y: 1.22 }),
        // wheelhouse cabin toward the stern
        box(1.3, 1.0, 1.0, white, { x: -1.0, y: 1.75, hex2: 0xf2f0e8 }),
        box(1.0, 0.4, 0.86, 0x2a3138, { x: -1.0, y: 1.95, z: 0.0 }), // dark windows band
        // cabin roof + small rail
        box(1.4, 0.12, 1.1, 0x9aa0ac, { x: -1.0, y: 2.3 }),
        // mast with a boom arm
        cyl(0.07, 0.08, 2.4, 6, 0xb0b6c0, { x: 0.2, y: 2.4 }),
        box(1.8, 0.07, 0.07, 0x9aa0ac, { x: 0.6, y: 2.6 }), // boom
        // pennant flag on the mast
        box(0.5, 0.3, 0.03, 0xf0c040, { x: 0.45, y: 3.4 }),
        // a couple of round buoys hung on the side
        sph(0.24, 0xf0c040, { ws: 6, hs: 4, x: 1.4, y: 1.3, z: 0.7, hex2: 0xff8a3d }),
        sph(0.22, 0xd83a2c, { ws: 6, hs: 4, x: 0.6, y: 1.3, z: 0.72 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 貨櫃 shipping containers (stacked at the port) -------- */
  {
    id: 'shipping_container',
    displayName: '貨櫃',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 170,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xd83a2c, 0x2f8f6a, 0x2f6db0, 0xe0a020, 0x9aa0ac],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A neat stack/cluster of corrugated intermodal shipping containers in
      // mixed harbor colors. One ribbed box, replicated with ridges.
      const colors = [0xd83a2c, 0x2f8f6a, 0x2f6db0, 0xe0a020, 0x9a3a8a];
      const parts = [];
      // each container: a long box + door-end frame + a few corrugation ribs
      const makeBox = (cx, cy, cz, col) => {
        parts.push(box(3.2, 0.95, 1.1, col, { x: cx, y: cy, z: cz, hex2: col }));
        // top & bottom edge rails (darker)
        parts.push(box(3.24, 0.1, 1.14, 0x2a2c30, { x: cx, y: cy + 0.45, z: cz }));
        parts.push(box(3.24, 0.1, 1.14, 0x2a2c30, { x: cx, y: cy - 0.45, z: cz }));
        // door end (corner casting bars)
        parts.push(box(0.08, 0.95, 1.14, 0x8a8278, { x: cx + 1.6, y: cy, z: cz }));
        // a few vertical corrugation ribs
        for (let i = 0; i < 5; i++) {
          parts.push(box(0.05, 0.85, 1.16, 0x000000, { x: cx - 1.2 + i * 0.6, y: cy, z: cz, hex2: col }));
        }
      };
      // bottom row of two, one stacked on top
      makeBox(-0.2, 0.5, 0.65, colors[0]);
      makeBox(0.1, 0.5, -0.65, colors[1]);
      makeBox(-0.05, 1.5, 0.0, colors[2]);
      return finish(parts);
    },
  },

  /* ---- slot 3: 蚵棚 oyster rack (Anping oyster-farming bamboo trestle) - */
  {
    id: 'oyster_rack',
    displayName: '蚵棚',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 130,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x9a7a52, 0x7a5a32, 0x6e6a5e, 0xc8b890, 0x4a525c],
    yOffset: -0.24,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      // A bamboo oyster-farming trestle: rows of slanted bamboo legs with
      // horizontal rails, and strings of oyster shells hanging down.
      const bamboo = 0x9a7a52;
      const dark = 0x7a5a32;
      const shell = 0xc8c2b0;
      const parts = [
        // top horizontal rails (the rack frame)
        box(4.2, 0.12, 0.12, dark, { y: 2.0, z: 0.5 }),
        box(4.2, 0.12, 0.12, dark, { y: 2.0, z: -0.5 }),
        box(0.12, 0.12, 1.2, dark, { x: -1.9, y: 2.0 }),
        box(0.12, 0.12, 1.2, dark, { x: 1.9, y: 2.0 }),
      ];
      // slanted A-frame bamboo legs along the length (low seg)
      const legX = [-1.6, 0.0, 1.6];
      for (const lx of legX) {
        parts.push(cyl(0.08, 0.1, 2.3, 5, bamboo, { rz: 0.18, x: lx - 0.2, y: 1.0, z: 0.4 }));
        parts.push(cyl(0.08, 0.1, 2.3, 5, bamboo, { rz: -0.18, x: lx + 0.2, y: 1.0, z: -0.4 }));
      }
      // hanging strings of oyster shells (vertical cords with shell clumps)
      const cordX = [-1.2, 0.0, 1.2];
      for (let i = 0; i < cordX.length; i++) {
        const cx = cordX[i];
        const cz = (i % 2 ? 0.25 : -0.25);
        parts.push(box(0.03, 1.5, 0.03, 0x4a525c, { x: cx, y: 1.2, z: cz })); // cord
        // a few clustered shells down the cord (low seg)
        for (let s = 0; s < 3; s++) {
          parts.push(sph(0.15, shell, { ws: 4, hs: 3, sy: 0.6, x: cx, y: 1.6 - s * 0.42, z: cz, hex2: 0xe0dcc8 }));
        }
      }
      return finish(parts);
    },
  },

  /* ---- slot 4: 商辦塔 business tower ---------------------------------- */
  {
    id: 'biz_tower',
    displayName: '商辦塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0x405068, 0x5878a0, 0x88b0c8, 0xc8d4dc, 0xffd884],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Wide glass office slab on a granite podium with a horizontal sunshade band.
      return finish([
        box(2.4, 0.55, 1.6, 0xb8b2a6, { y: 0.28, hex2: 0xc8c2b6 }), // granite podium
        towerBanded(1.9, 2.9, 1.0, 9, 0x3a4c64, 0x88b0c8, 0xffd884, rng, { y: 2.0 }), // glass slab
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 1.45 }), // sunshade band
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 2.55 }), // sunshade band
        box(2.0, 0.1, 1.06, 0x9aa6b4, { y: 3.45 }), // sunshade band
        box(1.4, 0.2, 0.7, 0x6a7484, { y: 3.6 }), // rooftop parapet box
        box(0.55, 0.28, 0.55, 0x7e8a98, { x: 0.5, y: 3.84 }), // rooftop cooling unit
      ]);
    },
  },

  /* ---- slot 5: 繫船柱 mooring bollards on the wharf ------------------- */
  {
    id: 'mooring_bollard',
    displayName: '繫船柱',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 80,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a3f48, 0x4a525c, 0x6a7280, 0xc8b890, 0xe88030],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // A pair of cast-iron mooring bollards bolted to a concrete wharf edge,
      // with a thick mooring rope looped between them.
      const iron = 0x3a3f48;
      const parts = [
        // concrete wharf slab
        box(4.0, 0.5, 1.4, 0xc4bca8, { y: 0.25, hex2: 0xd4ccb8 }),
        // edge curb stripe (safety)
        box(4.0, 0.12, 0.2, 0xe88030, { y: 0.55, z: 0.6 }),
      ];
      // two bollards (low seg)
      for (const bx of [-1.1, 1.1]) {
        parts.push(cyl(0.42, 0.5, 0.2, 7, 0x4a525c, { x: bx, y: 0.6 })); // base flange
        parts.push(cyl(0.3, 0.34, 1.0, 7, iron, { x: bx, y: 1.15, hex2: 0x4a525c })); // post body
        parts.push(cyl(0.42, 0.36, 0.3, 7, iron, { x: bx, y: 1.75 })); // mushroom head
        parts.push(sph(0.42, iron, { ws: 6, hs: 3, thetaLen: HALF_PI, x: bx, y: 1.9 })); // domed cap
      }
      // thick rope looped between the two bollards (sag via two slanted segments)
      parts.push(box(1.4, 0.14, 0.14, 0xc8b890, { rz: 0.3, x: -0.55, y: 1.5, hex2: 0xb0a078 }));
      parts.push(box(1.4, 0.14, 0.14, 0xc8b890, { rz: -0.3, x: 0.55, y: 1.5, hex2: 0xb0a078 }));
      // coiled rope heap on the deck
      parts.push(cyl(0.5, 0.5, 0.18, 8, 0xc8b890, { x: 0.0, y: 0.62, hex2: 0xb0a078 }));
      parts.push(cyl(0.34, 0.34, 0.18, 7, 0xb0a078, { x: 0.0, y: 0.78 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 安平倉庫 old red-brick harbor warehouse --------------- */
  {
    id: 'harbor_warehouse',
    displayName: '安平倉庫',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 90,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xa8462c, 0x8a3a24, 0xc8b890, 0x6e6a5e, 0x3a3f48],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A weathered colonial-era red-brick harbor warehouse (德記洋行 style):
      // long brick block, arched arcade openings, low gabled tiled roof.
      const brick = 0xa8462c;
      const brick2 = 0x8a3a24;
      const stone = 0xc8b890;
      const parts = [
        // main brick block
        box(4.2, 2.0, 2.2, brick, { y: 1.0, hex2: brick2 }),
        // white-stone base plinth
        box(4.3, 0.4, 2.3, stone, { y: 0.2 }),
        // stone cornice band near the top
        box(4.36, 0.2, 2.26, stone, { y: 1.85 }),
        // low gabled roof (two pitched tile slabs)
        box(4.4, 0.18, 1.3, 0x6e3a28, { y: 2.3, z: 0.6, rx: -0.32, hex2: 0x8a4a30 }),
        box(4.4, 0.18, 1.3, 0x6e3a28, { y: 2.3, z: -0.6, rx: 0.32, hex2: 0x8a4a30 }),
        box(4.4, 0.16, 0.16, 0x5a3020, { y: 2.55 }), // ridge cap
      ];
      // arched arcade openings along the front (5 bays)
      for (let i = 0; i < 5; i++) {
        const ax = -1.6 + i * 0.8;
        parts.push(box(0.5, 1.0, 0.12, 0x2a2c30, { x: ax, y: 0.85, z: 1.1 })); // dark doorway
        parts.push(cyl(0.26, 0.26, 0.12, 6, 0x2a2c30, { x: ax, y: 1.35, z: 1.1, rx: HALF_PI, thetaLen: PI, theta0: 0 })); // arch top
        parts.push(box(0.62, 0.1, 0.16, stone, { x: ax, y: 1.5, z: 1.12 })); // arch keystone band
      }
      return finish(parts);
    },
  },

  /* ---- slot 7: 安平港吊車 harbor crane -------------------------------- */
  {
    id: 'harbor_crane',
    displayName: '安平港吊車',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 230,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a6a8a, 0x4a7a9a, 0x8a96a8, 0xc0c8d4, 0xe88030],
    yOffset: -0.4362,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // A container gantry crane: tall box legs supporting a long horizontal
      // boom arm high up, with a trolley/cab and cables. Industrial blue/grey
      // + safety-orange.
      const parts = [
        // ground rail beams
        box(3.4, 0.12, 0.16, 0x4a525c, { y: 0.08, z: 0.9 }),
        box(3.4, 0.12, 0.16, 0x4a525c, { y: 0.08, z: -0.9 }),
      ];
      // four tall box legs (A-stance front/back pairs)
      const legX = [-1.3, 1.3];
      for (const lx of legX) {
        parts.push(box(0.26, 3.4, 0.26, 0xe88030, { x: lx, y: 1.7, z: 0.9 })); // safety-orange leg
        parts.push(box(0.26, 3.4, 0.26, 0xe88030, { x: lx, y: 1.7, z: -0.9 }));
        // diagonal cross-brace per leg pair
        parts.push(box(0.12, 2.0, 0.12, 0x6a7480, { rx: 0.42, x: lx, y: 1.6 }));
      }
      // top frame the boom sits on
      parts.push(box(3.0, 0.3, 2.1, 0x3a6a8a, { y: 3.5, hex2: 0x4a7a9a }));
      // long horizontal boom arm cantilevered out high up
      parts.push(box(6.0, 0.34, 0.46, 0x4a7a9a, { y: 3.85 }));
      parts.push(box(6.0, 0.1, 0.5, 0x8a96a8, { y: 4.06 })); // boom top chord
      // trolley / operator cab hanging under the boom
      parts.push(box(0.7, 0.6, 0.6, 0xc0c8d4, { x: 1.2, y: 3.4 }));
      parts.push(box(0.5, 0.3, 0.5, 0x2a3138, { x: 1.2, y: 3.45, z: 0.32 })); // cab window
      // lifting cables + spreader block dangling down
      parts.push(box(0.04, 1.6, 0.04, 0xb8c0c8, { x: 1.05, y: 2.6 }));
      parts.push(box(0.04, 1.6, 0.04, 0xb8c0c8, { x: 1.35, y: 2.6 }));
      parts.push(box(0.8, 0.18, 0.7, 0xe88030, { x: 1.2, y: 1.85 })); // spreader
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
    palette: [0x3c5876, 0x5a86a8, 0x9fd0e4, 0xc8d0d8, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // Monumental: a wide multi-level glazed skybridge spanning a street between
      // two big mixed-use blocks — the signature Xinyi air-corridor.
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

  /* ---- slot 9 (chunk landmark): 七股鹽山 salt mound -------------------- */
  {
    id: 'salt_mound',
    displayName: '七股鹽山',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0xf4f4f0, 0xe8e8e2, 0xdadad4, 0xd8d4cc, 0xb0a89a],
    yOffset: -0.4183,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A big white conical mound of salt on a flat salt-field base — mostly
      // one big slightly-lumpy white cone, with a tiny staircase line up a side.
      const parts = [
        // flat salt-field base pan
        box(4.4, 0.2, 4.4, 0xd8d4cc, { y: 0.1, hex2: 0xe4e0d8 }),
        // the big white salt cone (low-seg, slightly lumpy via stacked cones)
        cone(2.2, 3.4, 8, 0xffffff, { y: 1.9, hex2: 0xf0f0ec }),
        cone(1.5, 1.2, 8, 0xf6f6f2, { y: 3.5 }), // upper lump
        cone(0.9, 0.7, 7, 0xffffff, { y: 4.1 }), // crest lump
      ];
      // a tiny staircase line up one side (small steps climbing the cone face)
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        parts.push(box(0.16, 0.06, 0.3, 0xb0a89a, {
          x: -(2.0 - t * 1.7), y: 0.3 + t * 3.0, z: 0.15,
        }));
      }
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
