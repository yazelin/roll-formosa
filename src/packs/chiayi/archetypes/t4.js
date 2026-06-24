/**
 * @file packs/chiayi/archetypes/t4.js — Roll Formosa Chiayi pack, TIER 4
 * content: 嘉義街屋與廟 (Chiayi shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/chiayi/tiers.js TIERS[4].archetypeIds — slots [0..7]
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

  /* ---- slot 2: 老公寓 (5-storey old walk-up, Chiayi style) ------------- */
  {
    id: 'old_apartment',
    displayName: '老公寓',
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

  /* ---- slot 4: 嘉義BRT (Chiayi BRT bus — distinctive green livery) --- */
  {
    id: 'chiayi_brt',
    displayName: '嘉義BRT',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 7.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x28a060, 0x38b070, 0xf0f0e8, 0x208050, 0x48c080],
    yOffset: -0.63,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      // Chiayi BRT: distinctive green livery with white accents
      const parts = [
        box(3.6, 1.0, 1.2, 0xf0f0e8, { y: 0.95 }), // long bus body (white)
        box(3.64, 0.35, 1.22, 0xffffff, { y: 0.5 }), // lower body band (green tint)
        box(3.5, 0.34, 1.24, 0x28323e, { y: 1.18 }), // continuous window band (dark)
        box(3.4, 0.06, 1.1, 0xd2d6dc, { y: 1.5 }), // roof
        // BRT green stripe along the side
        box(3.66, 0.22, 0.04, 0x28a060, { z: 0.64, y: 0.72, hex2: 0x38b070 }),
        // "嘉義BRT" branding band on roof edge
        box(1.2, 0.12, 1.14, 0x28a060, { x: 1.35, y: 1.44 }),
        box(0.8, 0.08, 0.9, 0xf0f0e8, { x: 1.35, y: 1.47 }), // route number area
        // windshield + headlights front
        box(0.06, 0.4, 1.18, 0x35414e, { x: 1.83, y: 1.16 }), // windshield
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: 0.42 }), // headlight R
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: -0.42 }), // headlight L
        box(0.05, 0.7, 0.5, 0x35414e, { x: -1.55, y: 0.9, z: 0.5 }), // folding door
        // BRT logo accent (green rectangle)
        box(0.4, 0.25, 0.04, 0x28a060, { x: 0.5, y: 1.0, z: 0.64 }),
      ];
      // 6 wheels (front pair + dual rear)
      const wx = [1.4, 1.4, -1.2, -1.2, -1.55, -1.55];
      const wz = [0.6, -0.6, 0.6, -0.6, 0.6, -0.6];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.32, 0.32, 0.2, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.32 }));
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

  /* ---- slot 7: 檜意騎樓 (Hinoki Village style arcade colonnade) ------- */
  {
    id: 'hinoki_arcade',
    displayName: '檜意騎樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8c8a8, 0xc8b898, 0xe8d8c0, 0xb8a888, 0xf0e0c8],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Chiayi Hinoki Village style: Japanese colonial era wood arcade
      const wood = 0x5a4030; // dark hinoki wood
      const cream = 0xfaf0e0;
      const parts = [
        // the slab beam (Japanese colonial style, dark wood trim)
        box(3.2, 0.3, 1.2, cream, { y: 2.0 }),
        box(3.24, 0.12, 1.24, wood, { y: 2.2 }), // dark wood edge band
        box(2.0, 0.5, 1.0, 0xf0e8d8, { z: -0.4, y: 1.4 }), // rear shop wall
      ];
      // 3 square wood columns (simplified Japanese style)
      const cx = [-1.2, 0, 1.2];
      for (let i = 0; i < cx.length; i++) {
        parts.push(box(0.24, 1.7, 0.24, 0xffffff, { x: cx[i], y: 0.95 })); // square wood column (tinted)
        parts.push(box(0.36, 0.12, 0.36, wood, { x: cx[i], y: 1.82 })); // dark wood capital
        parts.push(box(0.36, 0.14, 0.36, 0x6a5040, { x: cx[i], y: 0.16 })); // dark wood base
      }
      // Japanese-style shop noren (curtain) between columns
      parts.push(box(0.8, 0.4, 0.04, 0xc04030, { x: -0.6, y: 1.65, z: 0.48 })); // noren
      parts.push(box(0.82, 0.06, 0.05, wood, { x: -0.6, y: 1.86, z: 0.48 })); // noren rod
      // hanging Japanese lanterns (box instead of sphere for tri budget)
      parts.push(box(0.26, 0.32, 0.26, 0xffd080, { x: -0.9, y: 1.68 }));
      parts.push(box(0.26, 0.32, 0.26, 0xffd080, { x: 0.9, y: 1.68 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 木都街屋 (chunk landmark — wood-city street-house row) */
  {
    id: 'woodcity_streethouse_mass',
    displayName: '木都街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xd8c8a8, 0xc8b898, 0xb8a888, 0xe0d0b0, 0xa89878],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Chiayi 木都 style: contiguous row of 4 wood-trimmed street-houses (連棟木造街屋)
      const parts = [];
      const heights = [2.2, 2.6, 2.3, 2.8];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      // warm hinoki-tinted plaster and dark wood window frames (檜意森活 style)
      const wallTints = [0xfaf0e0, 0xf5e8d0, 0xf8f0e0, 0xf2e6d0];
      const winTints = [0x5a4030, 0x4a3828, 0x5a4530, 0x483a28]; // dark wood frames
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        // floors=3 keeps the banded-window read while staying in tri budget
        parts.push(towerBanded(1.3, h, 1.3, 3, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        // Japanese-era pitched roof style (Chiayi heritage)
        parts.push(box(1.4, 0.08, 1.4, 0x6a4a30, { x: xs[i], y: h + 0.04 })); // dark wood roof edge
        parts.push(box(1.2, 0.3, 1.2, 0x8a6a48, { x: xs[i], y: h + 0.2, rz: (rng() - 0.5) * 0.08 })); // pitched roof
        // rooftop details
        if (i % 2 === 0) parts.push(cyl(0.15, 0.15, 0.25, 5, 0x505050, { x: xs[i] - 0.3, y: h + 0.45 })); // chimney
      }
      // continuous 騎樓 colonnade with wood pillars (木造騎樓)
      parts.push(box(5.8, 0.24, 1.36, 0xd8c8a8, { y: 0.78, z: 0.02 })); // arcade beam
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.26, 0.7, 0.26, 0x6a5038, { x: -2.4 + i * 1.2, y: 0.35, z: 0.55 })); // wood column
      }
      // street-front shop sign band (wood frame style)
      parts.push(box(5.6, 0.2, 0.06, 0x5a4028, { y: 0.96, z: 0.7 }));
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
