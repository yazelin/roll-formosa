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

  /* ---- slot 1: 鐵皮屋 (low corrugated-tin shed) ------------------------ */
  {
    id: 'tin_roof_house',
    displayName: '鐵皮屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc05a3a, 0xb0563a, 0x9aa0aa, 0x8a4a8a, 0x6a8a6a],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        box(2.4, 1.0, 1.7, 0xd8d4cc, { y: 0.5 }), // breeze-block / plaster lower walls
        box(2.42, 0.5, 1.72, 0xffffff, { y: 1.2, hex2: 0xe0d8d0 }), // upper tin walls (tinted)
        // single-slope corrugated tin roof (rusty red) — leaning lid
        box(2.7, 0.1, 1.9, 0xffffff, { rz: 0.16, y: 1.62 }),
        // corrugation ridges suggested by thin batten boxes along the slope
      ];
      for (let i = 0; i < 4; i++) {
        const x = -0.95 + i * 0.64;
        parts.push(box(0.06, 0.04, 1.9, 0xa84a30, { rz: 0.16, x, y: 1.69 + x * 0.16 })); // tin rib
      }
      parts.push(box(2.74, 0.06, 0.12, 0x6a4a32, { rz: 0.16, y: 1.7, z: 0.92 })); // eave gutter front
      parts.push(box(0.7, 0.7, 0.05, 0x44484f, { x: 0.6, y: 0.5, z: 0.86 })); // dark roll door
      parts.push(box(0.4, 0.45, 0.06, 0x9fc4d8, { x: -0.7, y: 0.55, z: 0.86 })); // small window
      // water-tank + vent on roof (typical 違建 detail)
      parts.push(cyl(0.28, 0.28, 0.4, 8, 0x3a6ea0, { x: -0.7, y: 1.95 })); // blue water tank
      parts.push(cyl(0.08, 0.08, 0.3, 6, 0x9aa0aa, { x: 0.7, y: 1.9 })); // vent pipe
      return finish(parts);
    },
  },

  /* ---- slot 2: 公寓 (5-storey 老公寓 walk-up) -------------------------- */
  {
    id: 'apartment',
    displayName: '公寓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe2d8c8, 0xd0d8e0, 0xe0d0c4, 0xd6ddd0, 0xc8bca8],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // wide squat 5-floor banded slab (公寓比透天矮胖)
        towerBanded(2.0, 2.4, 1.3, 10, 0xffffff, 0x44506a, 0xffe0a0, rng, { y: 1.25 }),
        box(2.08, 0.12, 1.38, 0x8a8f9a, { y: 2.5 }), // roof slab
        box(2.04, 0.22, 1.34, 0xc8bca8, { y: 0.16 }), // ground plinth
        // rooftop clutter: water tanks + 鐵皮加蓋
        box(1.0, 0.5, 0.9, 0xb0563a, { x: -0.4, y: 2.8, hex2: 0xc8704a }), // tin penthouse
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.6, y: 2.78 }), // blue tank
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.95, y: 2.78 }), // blue tank
        box(0.5, 0.5, 0.05, 0x6a7078, { y: 0.55, z: 0.7 }), // entrance gate
        box(2.06, 0.12, 0.06, 0xc83828, { y: 2.18, z: 0.66 }), // top trim band
      ];
      // characteristic 鐵窗 (security-grille) cages on each floor face
      for (let f = 0; f < 4; f++) {
        const y = 0.9 + f * 0.5;
        parts.push(box(0.5, 0.34, 0.16, 0xd8d4cc, { x: -0.55, y, z: 0.66 })); // grille cage L
        parts.push(box(0.5, 0.34, 0.16, 0xd8d4cc, { x: 0.55, y, z: 0.66 })); // grille cage R
      }
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
