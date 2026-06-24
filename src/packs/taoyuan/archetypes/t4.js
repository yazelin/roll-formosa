/**
 * @file packs/taoyuan/archetypes/t4.js — Roll Formosa Taoyuan pack, TIER 4
 * content: 大溪老街街屋 (Daxi Old Street baroque shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/taoyuan/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 大溪木器行 (Daxi woodcraft shop — 大溪特色街屋) -------------------- */
  {
    id: 'daxi_woodcraft_shop',
    displayName: '大溪木器行',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a5a38, 0x6a4028, 0xa07048, 0xd8c8b0, 0xc8a060],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Daxi is famous for its traditional woodcraft shops (大溪木器行)
      const parts = [];
      const wood = 0x8a5a38;
      // main building body (wood-fronted traditional shophouse)
      parts.push(box(1.4, 2.2, 1.5, 0xd8c8b0, { y: 1.2 }));
      // wooden storefront facade (大溪特色)
      parts.push(box(1.5, 2.0, 0.15, wood, { y: 1.1, z: 0.7, hex2: 0xa07048 }));
      // traditional wooden door (hinged panels)
      parts.push(box(0.4, 1.4, 0.06, 0x6a4028, { x: -0.3, y: 0.7, z: 0.78 }));
      parts.push(box(0.4, 1.4, 0.06, 0x5a3820, { x: 0.3, y: 0.7, z: 0.78 }));
      // display window showing woodwork
      parts.push(box(0.5, 0.5, 0.08, 0x9fc4d8, { x: -0.45, y: 1.55, z: 0.76 }));
      parts.push(box(0.5, 0.5, 0.08, 0x9fc4d8, { x: 0.45, y: 1.55, z: 0.76 }));
      // signboard with shop name
      parts.push(box(1.2, 0.4, 0.08, 0x4a3018, { y: 2.15, z: 0.76 }));
      parts.push(box(1.0, 0.3, 0.04, 0xc8a060, { y: 2.15, z: 0.8 })); // gold text
      // sloped tile roof
      parts.push(box(1.6, 0.12, 1.7, 0x7a6a5a, { y: 2.38 }));
      parts.push(box(1.7, 0.35, 1.8, 0x6a5a4a, { y: 2.5, rx: 0.15 })); // front slope
      // wooden furniture display outside
      parts.push(box(0.4, 0.3, 0.3, 0xa07048, { x: 0.75, y: 0.15, z: 0.9 })); // stool
      parts.push(box(0.5, 0.5, 0.35, 0x8a5a38, { x: -0.75, y: 0.25, z: 0.95 })); // small cabinet
      return finish(parts);
    },
  },

  /* ---- slot 1: 農機具行 (Taoyuan farm equipment shop) ------------------- */
  {
    id: 'farm_equipment_shop',
    displayName: '農機具行',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.5,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0x4a8a3a, 0xe0a030, 0x9aa0aa, 0xc83828, 0xd8c8b0],
    yOffset: -0.40,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Taoyuan's agricultural areas (Guanyin, Xinwu) have many farm equipment shops
      const parts = [
        // main building body
        box(2.6, 1.5, 2.0, 0xd8c8b0, { y: 0.75 }),
        // corrugated metal roof
        box(2.8, 0.12, 2.2, 0x8a9098, { y: 1.56 }),
        // large open bay door
        box(2.0, 1.2, 0.08, 0x4a5058, { y: 0.6, z: 1.02 }),
        // signboard
        box(2.2, 0.4, 0.1, 0x4a8a3a, { y: 1.4, z: 1.06 }),
        // displayed farm equipment in front
        // small tractor (simplified)
        box(0.8, 0.5, 0.6, 0x4a8a3a, { x: -0.7, y: 0.25, z: 1.4 }), // tractor body
        cyl(0.2, 0.2, 0.15, 6, 0x2a2c30, { x: -1.0, y: 0.2, z: 1.4, rx: HALF_PI }), // wheel
        cyl(0.2, 0.2, 0.15, 6, 0x2a2c30, { x: -0.4, y: 0.2, z: 1.4, rx: HALF_PI }), // wheel
        // rotary tiller attachment
        box(0.5, 0.3, 0.4, 0xe0a030, { x: 0.6, y: 0.15, z: 1.5 }),
        cyl(0.15, 0.15, 0.5, 6, 0x8a8a8a, { x: 0.6, y: 0.2, z: 1.5, rz: HALF_PI }),
        // pump equipment
        cyl(0.2, 0.2, 0.4, 6, 0xc83828, { x: 1.0, y: 0.2, z: 1.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 客家老街屋 (Zhongli Hakka old shophouse) --------------- */
  {
    id: 'hakka_shophouse',
    displayName: '客家老街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0x8a6a4a, 0xa07850, 0xd8c8a8, 0xc8a070, 0x5a4a3a],
    yOffset: -0.32,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Zhongli Hakka old street shophouse (中壢客家老街屋)
      // Traditional Hakka architecture with distinctive earthy tones
      const parts = [];
      const hakka_brown = 0x8a6a4a;
      const earth_wall = 0xd8c8a8;
      // Main two-storey shophouse body (Hakka-style earthen walls)
      parts.push(box(2.0, 2.0, 1.6, earth_wall, { y: 1.0, hex2: 0xc8b898 }));
      // Hakka-style wooden facade (darker wood tones)
      parts.push(box(2.1, 0.8, 0.12, hakka_brown, { y: 0.5, z: 0.78 }));
      // Traditional wooden door with carved panels
      parts.push(box(0.5, 1.2, 0.08, 0x5a4a3a, { y: 0.6, z: 0.82 }));
      parts.push(box(0.08, 1.0, 0.06, 0x4a3a2a, { x: -0.22, y: 0.6, z: 0.86 })); // door divider
      // Upper floor wooden windows (客家傳統格窗)
      parts.push(box(0.5, 0.4, 0.06, 0x6a5a4a, { x: -0.55, y: 1.6, z: 0.82 }));
      parts.push(box(0.5, 0.4, 0.06, 0x6a5a4a, { x: 0.55, y: 1.6, z: 0.82 }));
      // Lattice window grilles
      parts.push(box(0.4, 0.02, 0.04, 0x4a3a2a, { x: -0.55, y: 1.55, z: 0.86 }));
      parts.push(box(0.4, 0.02, 0.04, 0x4a3a2a, { x: -0.55, y: 1.65, z: 0.86 }));
      parts.push(box(0.4, 0.02, 0.04, 0x4a3a2a, { x: 0.55, y: 1.55, z: 0.86 }));
      parts.push(box(0.4, 0.02, 0.04, 0x4a3a2a, { x: 0.55, y: 1.65, z: 0.86 }));
      // Signboard (客家店招)
      parts.push(box(1.2, 0.35, 0.08, 0x5a4a3a, { y: 1.95, z: 0.8 }));
      parts.push(box(1.0, 0.25, 0.04, 0xc8a070, { y: 1.95, z: 0.86 })); // gold text
      // Hakka-style sloped tile roof (黑瓦屋頂)
      parts.push(box(2.2, 0.12, 1.8, 0x4a4a4a, { y: 2.1 }));
      parts.push(box(2.3, 0.35, 1.9, 0x3a3a3a, { y: 2.25, rx: 0.12 })); // main roof slope
      // Roof ridge ornament
      parts.push(box(2.0, 0.08, 0.15, 0x5a5a5a, { y: 2.5 }));
      // Side arcade column (騎樓柱)
      parts.push(box(0.25, 1.2, 0.25, earth_wall, { x: -0.85, y: 0.6, z: 0.65 }));
      parts.push(box(0.25, 1.2, 0.25, earth_wall, { x: 0.85, y: 0.6, z: 0.65 }));
      return finish(parts);
    },
  },

  /* ---- slot 3: 豆乾店 (Daxi dried tofu shop — 大溪豆乾專賣店) --------------------- */
  {
    id: 'tofu_shop',
    displayName: '豆乾店',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x5a3824, 0x6a4430, 0xd8c8b0, 0xead8b0, 0x8a5a38],
    yOffset: -0.58,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // Daxi dried tofu specialty shop (大溪豆乾專賣店)
      const parts = [];
      const tofu = 0x5a3824; // dark brown Daxi tofu color
      // main shop building
      parts.push(box(2.6, 0.95, 1.5, 0xd8c8b0, { y: 0.48 }));
      // traditional signboard
      parts.push(box(2.0, 0.4, 0.1, tofu, { y: 1.1, z: 0.76 }));
      parts.push(box(1.8, 0.3, 0.06, 0xead8b0, { y: 1.1, z: 0.82 })); // text area
      // awning / canopy
      parts.push(box(2.7, 0.08, 0.8, 0xc83828, { y: 0.92, z: 1.1 }));
      parts.push(box(2.7, 0.06, 0.8, 0xe8e8e0, { y: 0.88, z: 1.1 })); // white stripe
      // display window with tofu products
      parts.push(box(1.8, 0.5, 0.08, 0x9fc4d8, { y: 0.5, z: 0.76 }));
      // visible tofu blocks in display
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.25, 0.12, 0.06, tofu, { x: -0.6 + i * 0.4, y: 0.45, z: 0.82 }));
      }
      // entrance
      parts.push(box(0.6, 0.7, 0.06, 0x8a5a38, { x: 0.85, y: 0.35, z: 0.78 }));
      // steamer visible at entrance
      parts.push(cyl(0.25, 0.25, 0.15, 8, 0xc8b89a, { x: -0.8, y: 0.25, z: 1.0 }));
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0xd4c4a4, { x: -0.8, y: 0.38, z: 1.0 })); // lid
      // roof
      parts.push(box(2.72, 0.12, 1.6, 0x7a6a5a, { y: 1.26 }));
      return finish(parts);
    },
  },

  /* ---- slot 4: 公車 (city bus) ---------------------------------------- */
  {
    id: 'city_bus',
    displayName: '公車',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xe8e8e2, 0x3a6ea0, 0xc94f46, 0xe0a83a, 0x8a9098],
    yOffset: -0.63,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const parts = [
        box(3.6, 1.0, 1.2, 0xffffff, { y: 0.95 }), // long bus body (tinted)
        box(3.64, 0.18, 1.22, 0x3a6ea0, { y: 0.5 }), // lower livery band
        box(3.5, 0.34, 1.24, 0x28323e, { y: 1.18 }), // continuous window band (dark)
        box(3.4, 0.06, 1.1, 0xd2d6dc, { y: 1.5 }), // roof
        box(1.0, 0.18, 1.14, 0xe0a83a, { x: 1.4, y: 1.46 }), // roof route-number sign
        box(3.66, 0.5, 0.04, 0xffffff, { z: 0.64, y: 0.95, hex2: 0xeef2f6 }), // side panel sheen
        // windshield + headlights front
        box(0.06, 0.4, 1.18, 0x35414e, { x: 1.83, y: 1.16 }), // windshield
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: 0.42 }), // headlight R
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: -0.42 }), // headlight L
        box(0.05, 0.7, 0.5, 0x35414e, { x: -1.55, y: 0.9, z: 0.5 }), // folding door (rear)
        box(0.05, 0.55, 0.06, 0xc94f46, { x: 0.2, y: 0.5 }), // hot-red accent stripe
      ];
      // 6 wheels (front pair + dual rear), low-seg tires for tri budget
      const wx = [1.4, 1.4, -1.2, -1.2, -1.55, -1.55];
      const wz = [0.6, -0.6, 0.6, -0.6, 0.6, -0.6];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.32, 0.32, 0.2, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.32 })); // tire
      }
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

  /* ---- slot 7: 龍岡市場攤位 (Longgang Market stall — Yunnan/Myanmar cuisine) ---- */
  {
    id: 'longgang_market_stall',
    displayName: '龍岡市場攤位',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe04838, 0xffe8a8, 0xd8c090, 0x4a8a4a],
    yOffset: -0.52,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Longgang Market (龍岡市場) stall — famous for Yunnan & Myanmar cuisine
      // A unique feature of Taoyuan's military dependents' village area
      const parts = [];
      // Market stall structure (open-front style)
      parts.push(box(2.8, 1.5, 1.6, 0xd8d0c0, { y: 0.75 }));
      // Distinctive red awning (Longgang market signature)
      parts.push(box(3.0, 0.08, 2.0, 0xc83828, { y: 1.55, z: 0.3 }));
      parts.push(box(3.0, 0.06, 0.15, 0xe04838, { y: 1.52, z: 1.2 })); // awning edge
      // Support poles for awning
      parts.push(cyl(0.08, 0.08, 1.5, 6, 0x8a8a88, { x: -1.3, y: 0.75, z: 1.1 }));
      parts.push(cyl(0.08, 0.08, 1.5, 6, 0x8a8a88, { x: 1.3, y: 0.75, z: 1.1 }));
      // Counter/service window
      parts.push(box(2.4, 0.12, 0.5, 0xd8c090, { y: 0.9, z: 0.85 }));
      // Noodle/food display steamer baskets (米線/米干蒸籠)
      parts.push(cyl(0.25, 0.25, 0.12, 8, 0xc8b89a, { x: -0.7, y: 1.02, z: 0.9 }));
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0xd8c8a8, { x: -0.7, y: 1.14, z: 0.9 })); // lid
      parts.push(cyl(0.25, 0.25, 0.12, 8, 0xc8b89a, { x: 0.0, y: 1.02, z: 0.9 }));
      parts.push(cyl(0.25, 0.25, 0.08, 8, 0xd8c8a8, { x: 0.0, y: 1.14, z: 0.9 })); // lid
      // Signboard with menu (米干/米線 Yunnan noodles)
      parts.push(box(1.8, 0.5, 0.08, 0xffe8a8, { y: 1.35, z: 0.84 }));
      parts.push(box(1.6, 0.4, 0.04, 0xc83828, { y: 1.35, z: 0.9 })); // red text
      // Side display: dried goods / pickles (雲南醃菜)
      parts.push(box(0.4, 0.4, 0.35, 0x4a8a4a, { x: 0.95, y: 0.65, z: 0.7 })); // jar
      parts.push(cyl(0.18, 0.18, 0.35, 6, 0x8a6a4a, { x: -1.0, y: 0.65, z: 0.8 })); // pickle jar
      // Plastic stools for customers
      parts.push(box(0.25, 0.25, 0.25, 0xc83828, { x: -0.5, y: 0.12, z: 1.4 }));
      parts.push(box(0.25, 0.25, 0.25, 0x3a6ea0, { x: 0.3, y: 0.12, z: 1.35 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 大溪巴洛克街屋 (chunk landmark — Daxi Baroque facade) ---- */
  {
    id: 'baroque_facade',
    displayName: '大溪巴洛克街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xb8a898, 0x8a7a6a, 0xd8c8a8, 0xc8a050, 0xe8d8c0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Daxi Old Street's iconic Japanese colonial-era Baroque shophouse facades
      // (閩南巴洛克 / 大溪老街立面) — ornate parapets hiding simple shops behind
      const parts = [];
      // main two-storey shophouse body
      parts.push(box(4.0, 1.8, 1.5, 0xb8a898, { y: 0.9, hex2: 0xd8c8b0 }));
      // ground floor arcade (騎樓)
      parts.push(box(4.1, 0.5, 0.4, 0x9a8a78, { y: 0.25, z: 0.55 })); // arcade beam
      // arcade columns (baroque-inspired square pillars)
      for (let i = 0; i < 4; i++) {
        parts.push(box(0.24, 0.5, 0.24, 0xd8c8b0, { x: -1.5 + i * 1.0, y: 0.25, z: 0.7 }));
      }
      // central raised parapet (the iconic Baroque false-front 女兒牆/山牆)
      parts.push(box(2.4, 1.4, 0.25, 0xffffff, { y: 2.5, z: 0.6, hex2: 0xd8c8b0 }));
      // curved pediment top (simplified half-cylinder arch)
      parts.push(cyl(0.7, 0.7, 2.2, 8, 0xd8c8b0, { rx: HALF_PI, y: 3.2, z: 0.6, thetaLen: PI }));
      // ornamental pilasters flanking parapet
      parts.push(box(0.18, 1.4, 0.12, 0xc8a050, { x: -1.3, y: 2.5, z: 0.7 }));
      parts.push(box(0.18, 1.4, 0.12, 0xc8a050, { x: 1.3, y: 2.5, z: 0.7 }));
      // pilaster capitals
      parts.push(box(0.26, 0.12, 0.16, 0xe8b840, { x: -1.3, y: 3.2, z: 0.7 }));
      parts.push(box(0.26, 0.12, 0.16, 0xe8b840, { x: 1.3, y: 3.2, z: 0.7 }));
      // central name plaque (shop name board, typical Daxi style)
      parts.push(box(1.0, 0.5, 0.1, 0x4a3a28, { y: 2.5, z: 0.76 }));
      parts.push(box(0.8, 0.35, 0.06, 0xeae0d0, { y: 2.5, z: 0.82 })); // plaque face
      // decorative rosette medallions (simplified as cylinders)
      parts.push(cyl(0.18, 0.18, 0.08, 8, 0xe8b840, { x: -0.8, y: 3.0, z: 0.72, rx: HALF_PI }));
      parts.push(cyl(0.18, 0.18, 0.08, 8, 0xe8b840, { x: 0.8, y: 3.0, z: 0.72, rx: HALF_PI }));
      // top finial ornament
      parts.push(cone(0.2, 0.5, 6, 0xc85a3a, { y: 3.8, z: 0.6 })); // terracotta finial
      parts.push(sph(0.14, 0xe8b840, { ws: 6, hs: 4, y: 4.1, z: 0.6 })); // gold ball
      // side wing parapets (lower than center)
      parts.push(box(0.7, 0.8, 0.2, 0xc8b89a, { x: -1.85, y: 2.2, z: 0.6 }));
      parts.push(box(0.7, 0.8, 0.2, 0xc8b89a, { x: 1.85, y: 2.2, z: 0.6 }));
      // shop roll shutter at ground level
      parts.push(box(1.6, 0.5, 0.06, 0x8a9098, { y: 0.5, z: 0.78 }));
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
