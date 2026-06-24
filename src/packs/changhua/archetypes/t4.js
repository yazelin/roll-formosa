/**
 * @file packs/changhua/archetypes/t4.js — Roll Formosa Changhua pack, TIER 4
 * content: 鹿港老街建築與媽祖文化 (Lukang old street structures & Mazu culture).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/changhua/tiers.js TIERS[4].archetypeIds — slots [0..7]
 * absorbable street structures (spawnWeight 1.0), slots [8..9] repeatable
 * CHUNK LANDMARK masses (spawnWeight ~0.3, ~2.5–3x the tier's largest body).
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored BufferGeometry
 * (<= 350 tris) composed of low-segment primitives from geomHelpers.js, then
 * finish()-normalized to a UNIT bounding sphere (radius 1.0). rng() drives
 * only small per-instance variation (lit windows), never structure.
 *
 * yOffset = -1 - minY(normalized geo) so each building sits on the ground;
 * measured/rounded per id (all sit, so all are strongly negative).
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T4_ARCHETYPES = [
  /* ---- slot 0: 改裝機車 (modified scooter with delivery box) ------------ */
  {
    id: 'modified_scooter',
    displayName: '改裝機車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x3a8a5a, 0x4a9a6a, 0xe8e2d8, 0xc83828, 0x6a4a32],
    yOffset: -0.55,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // scooter body (機車車身)
        box(1.8, 0.5, 0.9, 0x3a8a5a, { y: 0.6 }), // main body green
        box(1.4, 0.35, 0.8, 0x2a7a4a, { y: 0.9 }), // upper body
        // seat
        box(0.7, 0.2, 0.6, 0x2a2a2a, { x: -0.2, y: 1.15 }), // black seat
        // handlebars
        cyl(0.06, 0.06, 0.9, 6, 0x4a4a4a, { rx: HALF_PI, x: 0.7, y: 1.1 }), // handlebar
        box(0.1, 0.25, 0.1, 0x5a5a5a, { x: 0.7, y: 0.95 }), // steering column
        // front fairing / headlight
        box(0.3, 0.4, 0.7, 0x3a8a5a, { x: 0.85, y: 0.75 }), // front fairing
        box(0.08, 0.15, 0.35, 0xffe9a0, { x: 0.92, y: 0.75 }), // headlight
        // rear cargo box (鹿港小吃外送箱)
        box(0.8, 0.7, 0.7, 0xc83828, { x: -0.7, y: 1.2 }), // red delivery box
        box(0.75, 0.2, 0.65, 0xfff2c0, { x: -0.7, y: 1.58 }), // box lid
        box(0.6, 0.15, 0.05, 0xffffff, { x: -0.7, y: 1.3, z: 0.38 }), // 肉圓 signage
        // wheels
        cyl(0.35, 0.35, 0.2, 8, 0x2a2a2a, { rx: HALF_PI, x: 0.75, y: 0.35 }), // front wheel
        cyl(0.35, 0.35, 0.2, 8, 0x2a2a2a, { rx: HALF_PI, x: -0.65, y: 0.35 }), // rear wheel
        // exhaust pipe
        cyl(0.08, 0.06, 0.5, 6, 0x8a8a8a, { rz: -0.3, x: -0.9, y: 0.45, z: 0.35 }),
        // mirrors
        box(0.04, 0.15, 0.1, 0x4a4a4a, { x: 0.65, y: 1.25, z: 0.45 }),
        box(0.04, 0.15, 0.1, 0x4a4a4a, { x: 0.65, y: 1.25, z: -0.45 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 廟口攤位 (temple market food stall) ---------------------- */
  {
    id: 'temple_stall',
    displayName: '廟口攤位',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe0a83a, 0xfff2c0, 0x6a4a32, 0xe8e2d8],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // stall counter (攤位櫃台)
        box(2.4, 0.9, 1.2, 0x6a4a32, { y: 0.45 }), // wooden counter
        box(2.3, 0.1, 1.1, 0xd8d4cc, { y: 0.92 }), // stainless steel top
        // glass display case
        box(1.6, 0.6, 0.8, 0x9fc4d8, { x: -0.2, y: 1.25, hex2: 0xc0d8e8 }), // glass case
        box(1.5, 0.08, 0.7, 0xe8e2d8, { x: -0.2, y: 1.58 }), // case top
        // 肉圓蒸籠 (meatball steamers)
        cyl(0.35, 0.35, 0.4, 8, 0x8a7a6a, { x: 0.8, y: 1.15 }), // steamer base
        cyl(0.32, 0.32, 0.25, 8, 0x6a5a4a, { x: 0.8, y: 1.42 }), // steamer lid
        // red awning / canopy
        box(2.8, 0.08, 1.6, 0xc83828, { y: 2.0, rz: 0.1 }), // red awning
        // support poles
        cyl(0.08, 0.08, 2.0, 6, 0x8a8a8a, { x: -1.2, z: 0.7, y: 1.0 }),
        cyl(0.08, 0.08, 2.0, 6, 0x8a8a8a, { x: 1.2, z: 0.7, y: 1.0 }),
        // lanterns (紅燈籠)
        sph(0.2, 0xc83828, { ws: 6, hs: 4, x: -0.6, y: 1.85 }),
        sph(0.2, 0xc83828, { ws: 6, hs: 4, x: 0.6, y: 1.85 }),
        // signboard (招牌)
        box(1.2, 0.4, 0.08, 0xfff2c0, { y: 2.1, z: 0.85 }), // lit sign
        box(1.3, 0.5, 0.06, 0xc83828, { y: 2.1, z: 0.9 }), // sign frame
        // small stools
        box(0.3, 0.35, 0.3, 0xc83828, { x: -0.8, y: 0.18, z: 0.9 }),
        box(0.3, 0.35, 0.3, 0xc83828, { x: 0.0, y: 0.18, z: 0.9 }),
        box(0.3, 0.35, 0.3, 0xc83828, { x: 0.8, y: 0.18, z: 0.9 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 紅磚牆 (old red brick wall section) ---------------------- */
  {
    id: 'red_brick_wall',
    displayName: '紅磚牆',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xb85a3a, 0xa84a2a, 0xc86a4a, 0x8a4a32, 0xd87a5a],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [
        // main wall body (鹿港老街紅磚牆)
        box(3.2, 2.2, 0.5, 0xb85a3a, { y: 1.1, hex2: 0xc86a4a }), // red brick wall
        // brick coursing bands (horizontal mortar lines — simplified)
        box(3.25, 0.04, 0.08, 0xd8ccc0, { y: 0.5, z: 0.26 }),
        box(3.25, 0.04, 0.08, 0xd8ccc0, { y: 1.0, z: 0.26 }),
        box(3.25, 0.04, 0.08, 0xd8ccc0, { y: 1.5, z: 0.26 }),
        box(3.25, 0.04, 0.08, 0xd8ccc0, { y: 2.0, z: 0.26 }),
        // decorative top coping (頂端收邊)
        box(3.3, 0.12, 0.55, 0x9a8a7a, { y: 2.28 }),
        // wall plaque (牆上匾額)
        box(0.8, 0.5, 0.08, 0x4a3a2a, { y: 1.4, z: 0.3 }), // dark frame
        box(0.7, 0.4, 0.05, 0xfff2c0, { y: 1.4, z: 0.33 }), // inscription
        // small wall shrine niche (壁龕)
        box(0.45, 0.55, 0.2, 0x3a2a1a, { x: -1.1, y: 1.2, z: 0.22 }),
        // incense holder
        cyl(0.08, 0.06, 0.15, 5, 0xc83828, { x: -1.1, y: 0.9, z: 0.35 }),
        // base foundation
        box(3.4, 0.2, 0.6, 0x6a5a4a, { y: 0.1 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 蒸汽火車頭模型 (steam locomotive display model) --------- */
  {
    id: 'steam_locomotive',
    displayName: '蒸汽火車頭模型',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2a2a2a, 0x3a3a3a, 0xc83828, 0xe0a83a, 0x8a8a8a],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // 扇形車庫 steam locomotive (彰化扇形車庫展示車頭) - simplified for tri budget
      const parts = [
        // boiler (鍋爐)
        cyl(0.6, 0.6, 2.4, 6, 0x2a2a2a, { rz: HALF_PI, y: 1.0 }), // main boiler
        // smoke box front
        cyl(0.65, 0.65, 0.3, 6, 0x3a3a3a, { rz: HALF_PI, x: 1.35, y: 1.0 }),
        // smokestack
        cyl(0.18, 0.25, 0.5, 5, 0x2a2a2a, { x: 0.9, y: 1.55 }),
        cone(0.28, 0.3, 5, 0x3a3a3a, { x: 0.9, y: 1.9 }),
        // cab (駕駛室)
        box(1.0, 1.0, 1.0, 0x2a2a2a, { x: -1.0, y: 1.0 }), // cab body
        box(0.95, 0.4, 0.05, 0x9fc4d8, { x: -1.0, y: 1.2, z: 0.5 }), // cab window
        box(1.1, 0.15, 1.1, 0xc83828, { x: -1.0, y: 1.55 }), // cab roof (red)
        // frame / chassis
        box(3.2, 0.3, 1.0, 0x3a3a3a, { y: 0.35 }), // main frame
        // cow catcher (排障器)
        box(0.8, 0.4, 0.8, 0x4a4a4a, { x: 1.6, y: 0.4, rz: 0.2 }),
        // headlight
        cyl(0.15, 0.15, 0.1, 5, 0xffe9a0, { rz: HALF_PI, x: 1.6, y: 1.3 }),
        // boiler band
        torus(0.62, 0.05, 6, 4, 0xe0a83a, { rz: HALF_PI, x: 0.2, y: 1.0 }),
        // wheels (4 drive wheels - reduced for tri budget)
        cyl(0.4, 0.4, 0.15, 6, 0x4a4a4a, { rx: HALF_PI, x: 0.6, z: 0.55, y: 0.4 }),
        cyl(0.4, 0.4, 0.15, 6, 0x4a4a4a, { rx: HALF_PI, x: -0.4, z: 0.55, y: 0.4 }),
        cyl(0.4, 0.4, 0.15, 6, 0x4a4a4a, { rx: HALF_PI, x: 0.6, z: -0.55, y: 0.4 }),
        cyl(0.4, 0.4, 0.15, 6, 0x4a4a4a, { rx: HALF_PI, x: -0.4, z: -0.55, y: 0.4 }),
        // connecting rod
        box(1.4, 0.08, 0.05, 0x8a8a8a, { x: 0.1, y: 0.4, z: 0.58 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 媽祖轎 (Mazu palanquin / divine sedan chair) ------------ */
  {
    id: 'mazu_palanquin',
    displayName: '媽祖轎',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe0a83a, 0x2e5a3a, 0x6a4a32, 0xfff2c0],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // 媽祖神轎 (Mazu procession palanquin)
      const parts = [
        // main body base (轎身)
        box(1.4, 0.8, 1.0, 0xc83828, { y: 0.8 }), // red lacquer body
        // ornate roof structure (轎頂)
        box(1.6, 0.15, 1.2, 0xe0a83a, { y: 1.25 }), // golden eave base
        cyl(0.9, 0.9, 1.3, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.55 }), // curved roof
        box(1.35, 0.1, 0.15, 0xe0a83a, { y: 1.9 }), // roof ridge
        // roof finial (頂珠)
        sph(0.15, 0xe0a83a, { ws: 6, hs: 4, y: 2.05 }),
        cone(0.12, 0.2, 6, 0xe0a83a, { y: 2.25 }),
        // dragon carvings on corners (龍雕)
        box(0.2, 0.4, 0.15, 0xe0a83a, { x: 0.75, y: 1.0, z: 0.5 }),
        box(0.2, 0.4, 0.15, 0xe0a83a, { x: -0.75, y: 1.0, z: 0.5 }),
        box(0.2, 0.4, 0.15, 0xe0a83a, { x: 0.75, y: 1.0, z: -0.5 }),
        box(0.2, 0.4, 0.15, 0xe0a83a, { x: -0.75, y: 1.0, z: -0.5 }),
        // carrying poles (轎杆)
        cyl(0.08, 0.08, 3.6, 6, 0x6a4a32, { rz: HALF_PI, y: 0.6, z: 0.4 }),
        cyl(0.08, 0.08, 3.6, 6, 0x6a4a32, { rz: HALF_PI, y: 0.6, z: -0.4 }),
        // interior shrine area (神龕)
        box(1.2, 0.6, 0.8, 0x3a2a1a, { y: 0.75 }), // dark interior
        // decorative curtains (繡帷)
        box(0.08, 0.5, 0.9, 0xc83828, { x: 0.72, y: 0.85 }),
        box(0.08, 0.5, 0.9, 0xc83828, { x: -0.72, y: 0.85 }),
        // hanging lanterns
        sph(0.12, 0xc83828, { ws: 6, hs: 4, x: 0.8, y: 1.3, z: 0.55 }),
        sph(0.12, 0xc83828, { ws: 6, hs: 4, x: -0.8, y: 1.3, z: 0.55 }),
        // golden tassels
        cyl(0.04, 0.04, 0.25, 4, 0xe0a83a, { x: 0.8, y: 1.1, z: 0.55 }),
        cyl(0.04, 0.04, 0.25, 4, 0xe0a83a, { x: -0.8, y: 1.1, z: 0.55 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 5: 垃圾車 (garbage truck — the musical yellow one) -------- */
  {
    id: 'garbage_truck',
    displayName: '垃圾車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe0c83a, 0xd8b830, 0xe8d048, 0x9aa0aa, 0x6a7078],
    yOffset: -0.6,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      const parts = [
        box(1.0, 0.95, 1.15, 0xffffff, { x: 1.4, y: 0.92, hex2: 0xf4e26a }), // yellow cab (tinted)
        box(0.9, 0.34, 1.08, 0x28323e, { x: 1.42, y: 1.18 }), // windshield band
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: 0.4 }), // headlight R
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: -0.4 }), // headlight L
        box(2.3, 1.35, 1.16, 0xffffff, { x: -0.55, y: 1.1, hex2: 0xf0dc58 }), // compactor body (yellow)
        box(2.34, 0.18, 1.12, 0x9aa0aa, { x: -0.55, y: 0.44 }), // underframe
        // angled rear loading hopper (sloped tail — defining silhouette)
        box(0.9, 1.1, 1.18, 0x9aa0aa, { rz: -0.28, x: -1.75, y: 1.0 }),
        box(0.06, 0.7, 1.0, 0x44484f, { x: -1.95, y: 0.7 }), // rear opening (dark)
        // hydraulic arm + handrails on the back
        cyl(0.06, 0.06, 0.9, 6, 0x6a7078, { rz: 0.5, x: -1.4, y: 1.5 }),
        box(2.0, 0.06, 1.18, 0xd0b830, { x: -0.55, y: 1.78 }), // body roof rib
        box(0.06, 0.7, 0.6, 0xc83828, { x: 0.78, y: 1.0, z: 0.6 }), // warning chevron stripe
      ];
      // 6 wheels (low-seg for tri budget)
      const wx = [1.35, 1.35, -0.7, -0.7, -1.3, -1.3];
      const wz = [0.56, -0.56, 0.56, -0.56, 0.56, -0.56];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.3, 0.3, 0.22, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.3 })); // tire
      }
      return finish(parts);
    },
  },

  /* ---- slot 6: 加油站 (gas station — canopy + pumps) ------------------ */
  {
    id: 'gas_station',
    displayName: '加油站',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 9.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xeef2f4, 0xc94f46, 0x3a6ea0, 0xe0a83a, 0xd8dce2],
    yOffset: -0.49,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      const parts = [
        // big flat canopy roof on slender columns
        box(3.4, 0.26, 2.4, 0xffffff, { y: 1.9 }), // canopy slab (tinted white)
        box(3.46, 0.14, 2.46, 0xc94f46, { y: 2.06 }), // red fascia trim
        box(3.46, 0.06, 2.46, 0x3a6ea0, { y: 2.14 }), // blue trim stripe
      ];
      // 4 support columns
      const cx = [-1.3, 1.3, -1.3, 1.3];
      const cz = [0.9, 0.9, -0.9, -0.9];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.16, 0.16, 1.8, 7, 0xd8dce2, { x: cx[i], z: cz[i], y: 0.9 }));
      }
      // ground island slab
      parts.push(box(2.2, 0.12, 1.2, 0x9aa0aa, { y: 0.06 }));
      // 2 fuel pumps (boxy dispensers with hose post)
      const px = [-0.6, 0.6];
      for (let i = 0; i < 2; i++) {
        parts.push(box(0.36, 0.7, 0.5, 0xeef2f4, { x: px[i], y: 0.5 })); // pump body
        parts.push(box(0.32, 0.22, 0.46, 0x2a3138, { x: px[i], y: 0.78 })); // pump screen (dark)
        parts.push(box(0.3, 0.06, 0.4, 0xe0a83a, { x: px[i], y: 0.92 })); // pump top cap (amber)
        parts.push(cyl(0.05, 0.05, 0.5, 6, 0x44484f, { x: px[i] + 0.22, y: 0.5, z: 0.28 })); // hose post
      }
      // tall price totem sign at the corner
      parts.push(cyl(0.1, 0.1, 2.1, 6, 0xbfc4ca, { x: 1.7, z: -0.7, y: 1.05 })); // pole
      parts.push(box(0.7, 0.8, 0.14, 0xc94f46, { x: 1.7, z: -0.7, y: 2.1 })); // price board
      parts.push(box(0.6, 0.5, 0.05, 0xfff2c0, { x: 1.7, z: -0.84, y: 2.1 })); // lit price digits
      return finish(parts);
    },
  },

  /* ---- slot 7: 騎樓柱列 (arcade pillar colonnade) --------------------- */
  {
    id: 'arcade_pillar',
    displayName: '騎樓柱列',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8cdb8, 0xc8bca8, 0xe0d2c0, 0xcfd6d0, 0xb8ac98],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // the slab beam the storefront sits under (騎樓 ceiling)
        box(3.2, 0.3, 1.2, 0xffffff, { y: 2.0, hex2: 0xe6dcc8 }),
        box(3.24, 0.12, 1.24, 0xb8ac98, { y: 2.2 }), // upper edge band (street-house above)
        box(2.0, 0.5, 1.0, 0xcfd6d0, { z: -0.4, y: 1.4 }), // rear shop wall recess
      ];
      // 4 square arcade columns with capital + base
      const cx = [-1.35, -0.45, 0.45, 1.35];
      for (let i = 0; i < cx.length; i++) {
        parts.push(box(0.34, 1.7, 0.34, 0xffffff, { x: cx[i], y: 0.95 })); // column shaft (tinted)
        parts.push(box(0.46, 0.16, 0.46, 0xc8bca8, { x: cx[i], y: 1.82 })); // capital
        parts.push(box(0.46, 0.18, 0.46, 0xb8ac98, { x: cx[i], y: 0.16 })); // base
        // small shop signboard between alternating columns
        if (i < cx.length - 1 && i % 2 === 0) {
          parts.push(box(0.74, 0.3, 0.06, 0xc83828, { x: cx[i] + 0.45, y: 1.62, z: 0.5 })); // sign
          parts.push(box(0.6, 0.18, 0.05, 0xfff2c0, { x: cx[i] + 0.45, y: 1.62, z: 0.54 })); // lit sign face
        }
      }
      // hanging shop lanterns/lamps under the beam
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: -0.9, y: 1.78 }));
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: 0.9, y: 1.78 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 公寓街屋 (chunk landmark — street-house row mass) --- */
  {
    id: 'streethouse_mass',
    displayName: '公寓街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xe2d8c8, 0xc8bca8, 0xd0d8e0, 0xd9c8b0, 0xb8ac98],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // a contiguous row of 4 abutting street-houses of varying height (連棟街屋)
      const parts = [];
      const heights = [2.2, 2.8, 2.4, 3.0];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xffffff, 0xf0ead8, 0xffffff, 0xf2e6dc];
      const winTints = [0x44506a, 0x3e4a64, 0x4a5470, 0x40506a];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // floors=3 keeps the banded-window read while staying in tri budget
        parts.push(towerBanded(1.3, h, 1.3, 3, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        parts.push(box(1.36, 0.1, 1.36, 0x8a8f9a, { x: xs[i], y: h + 0.05 })); // roof slab
        // rooftop water tanks / tin add-on (the chaotic skyline)
        if (i !== 3) parts.push(cyl(0.2, 0.2, 0.34, 5, 0x3a6ea0, { x: xs[i] - 0.3, y: h + 0.27 }));
        if (i % 2 === 0) parts.push(box(0.7, 0.4, 0.9, 0xb0563a, { x: xs[i] + 0.2, y: h + 0.25, hex2: 0xc8704a })); // tin penthouse
      }
      // continuous 騎樓 colonnade across the whole ground floor front
      parts.push(box(5.8, 0.24, 1.36, 0xc8bca8, { y: 0.78, z: 0.02 })); // arcade beam
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.3, 0.7, 0.3, 0xd8cdb8, { x: -2.4 + i * 1.2, y: 0.35, z: 0.55 })); // arcade column
      }
      // street-front shop sign band
      parts.push(box(5.6, 0.2, 0.06, 0xc83828, { y: 0.96, z: 0.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 大廟 (chunk landmark — temple mass, 燕尾脊) -------- */
  {
    id: 'temple_mass',
    displayName: '大廟',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc23a26, 0xd2402a, 0xe0a83a, 0xb83422, 0x3a6a4a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // raised stone platform (廟埕台基)
        box(4.2, 0.4, 2.8, 0xb8ac98, { y: 0.2 }),
        // main hall body — red walls + warm interior glow
        box(3.4, 1.3, 2.0, 0xffffff, { y: 1.05, hex2: 0xd2402a }),
        // front vermilion columns (龍柱) of the portico
      ];
      const cx = [-1.4, -0.5, 0.5, 1.4];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.14, 0.16, 1.3, 6, 0xffffff, { x: cx[i], z: 1.0, y: 1.05 })); // vermilion column (tinted)
      }
      // sweeping double-eave hip roof — wide lower eave + narrower upper ridge.
      // low-seg cyl(seg=4) half-cylinders give the curved tiled slopes.
      parts.push(cyl(1.6, 1.6, 3.8, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.95 })); // lower eave roof (green-glaze tint)
      parts.push(box(3.9, 0.12, 2.5, 0xe0a83a, { y: 1.78 })); // golden eave fascia under lower roof
      parts.push(cyl(1.1, 1.1, 3.4, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.55 })); // upper roof tier
      // central ridge beam with ornament
      parts.push(box(3.6, 0.18, 0.22, 0xc94f46, { y: 2.95 })); // main ridge
      // 燕尾脊 — upswept swallow-tail ridge ends (the defining temple silhouette)
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.95, y: 3.05 })); // swallowtail L
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.95, y: 3.05 })); // swallowtail R
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.6, y: 2.62, z: 0 })); // lower-eave tail L
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.6, y: 2.62, z: 0 })); // lower-eave tail R
      // central roof ornament (寶塔 / 葫蘆 finial)
      parts.push(sph(0.22, 0xe0a83a, { ws: 6, hs: 4, y: 3.18 }));
      parts.push(cone(0.16, 0.4, 6, 0xe0a83a, { y: 3.5 }));
      // entrance steps + dark double doors
      parts.push(box(3.0, 0.16, 0.5, 0x9aa0aa, { y: 0.46, z: 1.35 })); // steps
      parts.push(box(1.0, 0.9, 0.08, 0x6a2a1a, { y: 0.85, z: 1.02 })); // temple doors (dark red)
      parts.push(box(1.04, 0.18, 0.1, 0xe0a83a, { y: 1.36, z: 1.02 })); // door lintel plaque (gold)
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
