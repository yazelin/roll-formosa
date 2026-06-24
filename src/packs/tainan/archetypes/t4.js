/**
 * @file packs/tainan/archetypes/t4.js — Roll Formosa Tainan pack, TIER 4
 * content: 孔廟街屋與廟 (Tainan shophouses & temples).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/taipei/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 透天厝 (narrow 3–4 storey townhouse) -------------------- */
  {
    id: 'townhouse',
    displayName: '透天厝',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8ddc8, 0xd9c8b0, 0xcfd6d0, 0xe0d2c0, 0xd0c4b4],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // tall narrow banded body (深長街屋), tinted plaster + warm windows
        towerBanded(1.0, 2.6, 1.5, 8, 0xffffff, 0x40506a, 0xffd98a, rng, { y: 1.4 }),
        box(1.1, 0.12, 1.6, 0x8a8f9a, { y: 2.76 }), // flat roof slab
        box(1.12, 0.22, 1.62, 0xc8bca8, { y: 0.22 }), // ground-floor plinth
        // rooftop 加蓋 (illegal-extension tin penthouse — very Taiwan)
        box(0.8, 0.5, 1.1, 0xb0563a, { y: 3.06, hex2: 0xc8704a }),
        cyl(0.95, 0.95, 1.2, 4, 0x9a4a32, { theta0: PI, rx: HALF_PI, sy: 0.4, x: 0.0, y: 3.5, z: 0.0 }), // gable tin cap
        cyl(0.16, 0.16, 0.5, 6, 0xc8ccd2, { x: 0.45, y: 3.55 }), // rooftop water tank pipe
        box(0.36, 0.32, 0.36, 0x5a6e8a, { x: -0.25, y: 3.4 }), // rooftop blue water tank
        // street-level shutter + tenant sign strip
        box(0.92, 0.6, 0.06, 0x7a8088, { y: 0.5, z: 0.78 }), // roll shutter
        box(0.78, 0.18, 0.05, 0xc83828, { y: 0.94, z: 0.8 }), // shop sign band
      ];
      // stacked balconies with rail + AC unit per floor (公寓陽台 rhythm)
      for (let i = 0; i < 3; i++) {
        const y = 0.95 + i * 0.62;
        parts.push(box(1.06, 0.1, 0.12, 0xd8d4cc, { y, z: 0.78 })); // balcony rail
        if (i < 2) parts.push(box(0.26, 0.22, 0.18, 0xe2e2dc, { x: 0.36, y: y + 0.16, z: 0.74 })); // window AC
      }
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

  /* ---- slot 2: 鹽田瓦厝 (Tainan-style salt field house) --------------- */
  {
    id: 'salt_field_house',
    displayName: '鹽田瓦厝',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe8dcc8, 0xd0c4b0, 0xc8b898, 0xb0a080, 0xf0e8d8],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Tainan salt field worker house: low-rise, curved tile roof
      const parts = [
        // main body (earthen-plastered walls)
        box(3.4, 1.6, 2.2, 0xffffff, { y: 0.9 }),
        // traditional curved tile roof (half-cylinder)
        cyl(1.8, 1.8, 3.6, 4, 0x8a6a4a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 1.9 }),
        // ridge beam
        box(3.5, 0.12, 0.18, 0x6a5040, { y: 2.38 }),
        // eave fascia
        box(3.5, 0.08, 2.3, 0x7a5a40, { y: 1.72 }),
        // wooden door
        box(0.8, 1.2, 0.08, 0x6a4a30, { y: 0.7, z: 1.12 }),
        // small windows on sides
        box(0.5, 0.4, 0.08, 0x4a5a6a, { x: -1.2, y: 1.0, z: 1.12 }),
        box(0.5, 0.4, 0.08, 0x4a5a6a, { x: 1.2, y: 1.0, z: 1.12 }),
        // stone foundation
        box(3.5, 0.3, 2.3, 0x9a9088, { y: 0.15 }),
        // small outdoor shelter (salt drying area)
        cyl(0.08, 0.08, 1.4, 5, 0x7a5a40, { x: -1.4, y: 0.8, z: -1.4 }),
        cyl(0.08, 0.08, 1.4, 5, 0x7a5a40, { x: 0.8, y: 0.8, z: -1.4 }),
        box(2.4, 0.06, 1.2, 0x9a7a50, { x: -0.3, y: 1.5, z: -1.4 }), // lean-to roof
        // salt pile nearby
        sph(0.5, 0xf0f0f0, { ws: 6, hs: 4, sy: 0.5, x: -0.3, y: 0.3, z: -1.6 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (小七/全家 convenience store) --------------------- */
  {
    id: 'convenience_store',
    displayName: '超商',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0xffffff, 0xe8edf2, 0xf6f0e6, 0xdfeae2, 0xd8dee6],
    yOffset: -0.6,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      const parts = [
        box(2.6, 0.95, 1.5, 0xffffff, { y: 0.48 }), // store box (tinted white)
        // 小七 signature orange/green/red tricolor fascia stripe
        box(2.66, 0.22, 1.54, 0xe06a1a, { y: 1.06 }), // orange band
        box(2.66, 0.08, 1.54, 0x2a8a3a, { y: 1.21 }), // green stripe
        box(2.66, 0.06, 1.54, 0xc83828, { y: 1.28 }), // red stripe
        box(1.1, 0.16, 0.06, 0xfff2c0, { x: -0.5, y: 1.06, z: 0.79 }), // lit logo plate
        box(2.72, 0.06, 1.6, 0x8a9098, { y: 1.34 }), // roof lip
        box(0.42, 0.32, 0.32, 0xb8bec8, { x: 0.9, y: 1.46 }), // rooftop AC unit
        // glass storefront with warm interior shelf glow
        box(2.2, 0.6, 0.06, 0x9fc4d8, { y: 0.46, z: 0.76 }), // glass front
        box(2.1, 0.1, 0.07, 0xffe9b0, { y: 0.62, z: 0.765 }), // top shelf glow
        box(2.1, 0.08, 0.07, 0xf0d8a0, { y: 0.4, z: 0.765 }), // mid shelf glow
        box(0.5, 0.66, 0.08, 0x7a8088, { x: 0.92, y: 0.36, z: 0.78 }), // auto door
        box(0.46, 0.42, 0.05, 0x9fc4d8, { x: 0.92, y: 0.44, z: 0.81 }), // door glass
        box(0.5, 0.7, 0.4, 0xd8dce2, { x: -1.0, y: 0.36, z: 0.95 }), // ATM / ice box by door
        cyl(0.06, 0.06, 0.7, 6, 0xc8ccd2, { x: -1.25, y: 0.85, z: 0.7 }), // pole sign post
        box(0.4, 0.34, 0.06, 0xe06a1a, { x: -1.25, y: 1.25, z: 0.7 }), // pole sign panel
      ];
      // mullions splitting the glass front
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.06, 0.62, 0.08, 0xe8e4da, { x: -0.7 + i * 0.6, y: 0.44, z: 0.77 }));
      }
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

  /* ---- slot 7: 牛肉湯店 (Tainan beef soup shop facade) --------------- */
  {
    id: 'beef_soup_shop',
    displayName: '牛肉湯店',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc83828, 0xe04838, 0xf8f0e0, 0xd8c8b0, 0xfff0c0],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // typical early-morning Tainan beef soup shop storefront
      const parts = [
        // main shop body (two-story townhouse style)
        box(3.0, 2.2, 1.4, 0xf8f0e0, { y: 1.1 }),
        // red signboard across the front (iconic)
        box(3.1, 0.6, 0.08, 0xc83828, { y: 1.8, z: 0.72 }),
        // white text area on sign
        box(2.6, 0.4, 0.04, 0xfff0c0, { y: 1.8, z: 0.76 }),
        // open kitchen area at ground floor
        box(2.8, 0.8, 0.06, 0x3a3a3a, { y: 0.4, z: 0.72 }), // dark open front
        // steaming pots (stainless steel)
        cyl(0.35, 0.35, 0.5, 8, 0xd8dce2, { x: -0.6, y: 0.5, z: 0.4 }),
        cyl(0.35, 0.35, 0.5, 8, 0xd8dce2, { x: 0.6, y: 0.5, z: 0.4 }),
        // steam rising (white wisps)
        cyl(0.08, 0.12, 0.4, 5, 0xf0f0f0, { x: -0.6, y: 0.95, z: 0.4 }),
        cyl(0.08, 0.12, 0.4, 5, 0xf0f0f0, { x: 0.6, y: 0.95, z: 0.4 }),
        // awning/canopy
        box(3.3, 0.08, 1.0, 0xc83828, { y: 2.3, z: 0.3, rx: -0.15 }),
        // second floor window
        box(2.4, 0.5, 0.06, 0x6a8aa0, { y: 1.95, z: -0.68 }),
        // small tables in front
        box(0.5, 0.4, 0.5, 0x9a8a78, { x: -0.9, y: 0.2, z: 1.0 }),
        box(0.5, 0.4, 0.5, 0x9a8a78, { x: 0.9, y: 0.2, z: 1.0 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 府城街屋 (chunk landmark — old Tainan townhouse mass) --- */
  {
    id: 'fucheng_streethouse_mass',
    displayName: '府城街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xc8b89a, 0xb8a888, 0xa89878, 0x9aa0a0, 0x8a7a5a],
    yOffset: -0.5417,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // a row of 4 abutting OLD 府城 low townhouses (2–3 storeys), mixed-height
      // narrow weathered ochre/grey facades with sloped tiled roofs.
      const parts = [];
      const heights = [1.6, 2.0, 1.4, 1.8];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xc8b89a, 0xb8a888, 0xd0c2a4, 0xa89878];
      const winTints = [0x5a5a52, 0x504a40, 0x60584c, 0x4a463c];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // floors=2 keeps the low old-house read while staying in tri budget
        parts.push(towerBanded(1.3, h, 1.3, 2, wallTints[i], winTints[i], 0xd8c088, rng, { x: xs[i], y: h / 2 }));
        // sloped dark tiled roof — low half-cylinder ridge over each house
        parts.push(cyl(0.78, 0.78, 1.42, 4, 0x5a5048, { theta0: PI, rx: HALF_PI, sy: 0.42, x: xs[i], y: h + 0.18 }));
        parts.push(box(1.42, 0.08, 1.46, 0x6a5a48, { x: xs[i], y: h + 0.02 })); // eave fascia
        // a couple of small windows on the weathered facade
        parts.push(box(0.34, 0.3, 0.05, 0x4a463c, { x: xs[i] - 0.28, y: h * 0.6, z: 0.67 }));
        parts.push(box(0.34, 0.3, 0.05, 0x4a463c, { x: xs[i] + 0.28, y: h * 0.6, z: 0.67 }));
      }
      // ground-floor weathered shop-front band across the row
      parts.push(box(5.8, 0.5, 0.06, 0x8a7a5a, { y: 0.5, z: 0.68 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 孔廟 (chunk landmark — Confucius temple complex) -------- */
  {
    id: 'confucius_temple_mass',
    displayName: '孔廟',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 12,
    radiusJitter: 0.15,
    spawnWeight: 0.3,
    palette: [0xc04030, 0xb83828, 0x9aa0a0, 0xa88a5a, 0x8a7a5a],
    yOffset: -0.4781,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // low platform (台基)
        box(4.6, 0.4, 3.4, 0xb8ac98, { y: 0.2 }),
        // red-walled main hall + warm glow
        box(3.0, 1.4, 1.8, 0xffffff, { y: 1.1, hex2: 0xc04030 }),
      ];
      // big dark tiled hip-and-gable roof (low-seg half-cylinder slopes)
      parts.push(cyl(1.5, 1.5, 3.6, 4, 0x3a4048, { theta0: PI, rx: HALF_PI, sy: 0.55, y: 2.0 })); // main roof
      parts.push(box(3.6, 0.12, 2.2, 0x4a505a, { y: 1.82 })); // roof eave fascia
      parts.push(box(3.2, 0.16, 0.22, 0x2e343c, { y: 2.55 })); // ridge beam
      // small upturned ridge ends
      parts.push(box(0.6, 0.12, 0.18, 0x2e343c, { rz: 0.5, x: -1.7, y: 2.62 }));
      parts.push(box(0.6, 0.12, 0.18, 0x2e343c, { rz: -0.5, x: 1.7, y: 2.62 }));
      // entrance doors
      parts.push(box(0.9, 0.9, 0.08, 0x6a2a1a, { y: 0.85, z: 0.92 }));
      // low red boundary wall around the complex (4 sides as thin boxes)
      parts.push(box(4.4, 0.5, 0.12, 0xffffff, { y: 0.45, z: 1.6, hex2: 0xb83828 })); // front wall
      parts.push(box(4.4, 0.5, 0.12, 0xffffff, { y: 0.45, z: -1.6, hex2: 0xb83828 })); // back wall
      parts.push(box(0.12, 0.5, 3.3, 0xffffff, { x: -2.2, y: 0.45, hex2: 0xb83828 })); // left wall
      parts.push(box(0.12, 0.5, 3.3, 0xffffff, { x: 2.2, y: 0.45, hex2: 0xb83828 })); // right wall
      // wall coping caps (dark tile)
      parts.push(box(4.44, 0.08, 0.18, 0x3a4048, { y: 0.72, z: 1.6 }));
      parts.push(box(4.44, 0.08, 0.18, 0x3a4048, { y: 0.72, z: -1.6 }));
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
