/**
 * @file packs/keelung/archetypes/t4.js — Roll Formosa Keelung pack, TIER 4
 * content: 港邊街屋與廟 (harbor shophouses & temple).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/keelung/tiers.js TIERS[4].archetypeIds — slots [0..7]
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
  /* ---- slot 0: 港邊街屋 (Keelung harbor-district narrow shophouse) ------ */
  {
    id: 'harbor_townhouse',
    displayName: '港邊街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8e0e8, 0xc8d0d8, 0xd0d8e0, 0xc0c8d0, 0xb8c0c8],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // tall narrow banded body with cooler maritime colors
        towerBanded(1.0, 2.6, 1.5, 8, 0xffffff, 0x3a5068, 0xd0e0f0, rng, { y: 1.4 }),
        box(1.1, 0.12, 1.6, 0x7a8a9a, { y: 2.76 }), // flat roof slab
        box(1.12, 0.22, 1.62, 0xb8c0c8, { y: 0.22 }), // ground-floor plinth
        // rooftop weathered by rain (more grey-green patina)
        box(0.8, 0.5, 1.1, 0x6a8a7a, { y: 3.06, hex2: 0x7a9a8a }),
        cyl(0.95, 0.95, 1.2, 4, 0x5a7a6a, { theta0: PI, rx: HALF_PI, sy: 0.4, y: 3.5 }),
        cyl(0.16, 0.16, 0.5, 6, 0xa0a8b0, { x: 0.45, y: 3.55 }),
        box(0.36, 0.32, 0.36, 0x3a6ea0, { x: -0.25, y: 3.4 }), // blue water tank
        // seafood shop sign (harbor district)
        box(0.92, 0.6, 0.06, 0x5a6870, { y: 0.5, z: 0.78 }),
        box(0.78, 0.18, 0.05, 0x2f6db0, { y: 0.94, z: 0.8 }), // blue maritime sign
      ];
      for (let i = 0; i < 3; i++) {
        const y = 0.95 + i * 0.62;
        parts.push(box(1.06, 0.1, 0.12, 0xc8d0d8, { y, z: 0.78 }));
        if (i < 2) parts.push(box(0.26, 0.22, 0.18, 0xd0d8e0, { x: 0.36, y: y + 0.16, z: 0.74 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 1: 漁寮 (Keelung fisherman's shed/workshop) ---------------- */
  {
    id: 'fisherman_shed',
    displayName: '漁寮',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.0,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x7090a0, 0x6080a8, 0x8aa0b0, 0x5080a0, 0x90b0c0],
    yOffset: -0.42,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        box(2.4, 1.0, 1.7, 0xc0c8d0, { y: 0.5 }), // weathered concrete walls
        box(2.42, 0.5, 1.72, 0xffffff, { y: 1.2, hex2: 0xb0c0d0 }), // faded blue-grey tin walls
        // single-slope tin roof (weathered green-grey)
        box(2.7, 0.1, 1.9, 0xffffff, { rz: 0.16, y: 1.62 }),
      ];
      for (let i = 0; i < 4; i++) {
        const x = -0.95 + i * 0.64;
        parts.push(box(0.06, 0.04, 1.9, 0x6a8a7a, { rz: 0.16, x, y: 1.69 + x * 0.16 }));
      }
      parts.push(box(2.74, 0.06, 0.12, 0x5a7a6a, { rz: 0.16, y: 1.7, z: 0.92 }));
      parts.push(box(0.7, 0.7, 0.05, 0x3a5060, { x: 0.6, y: 0.5, z: 0.86 })); // dark blue door
      parts.push(box(0.4, 0.45, 0.06, 0x8ab0c8, { x: -0.7, y: 0.55, z: 0.86 })); // window
      // fishing gear outside: net rolls, buoys
      parts.push(cyl(0.35, 0.35, 0.4, 8, 0x4a7060, { x: -0.85, y: 0.2, z: 1.0 })); // net roll
      parts.push(sph(0.18, 0xe87030, { ws: 6, hs: 4, x: -0.4, y: 0.18, z: 1.1 })); // orange buoy
      parts.push(sph(0.15, 0xff8848, { ws: 5, hs: 3, x: 0.5, y: 0.15, z: 1.05 })); // buoy
      return finish(parts);
    },
  },

  /* ---- slot 2: 老公寓 (5-storey 老公寓 walk-up — Keelung style) ---------- */
  {
    id: 'old_apartment',
    displayName: '老公寓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xd8d0c0, 0xc8c0b0, 0xe0d0c4, 0xd6ddd0, 0xb8ac98],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Keelung old apartment — slightly more weathered, maritime feel
      const parts = [
        // wide squat 5-floor banded slab
        towerBanded(2.0, 2.4, 1.3, 10, 0xffffff, 0x44506a, 0xffe0a0, rng, { y: 1.25 }),
        box(2.08, 0.12, 1.38, 0x8a8f9a, { y: 2.5 }), // roof slab
        box(2.04, 0.22, 1.34, 0xb8ac98, { y: 0.16 }), // ground plinth
        // rooftop clutter: water tanks + 鐵皮加蓋
        box(1.0, 0.5, 0.9, 0xa05a3a, { x: -0.4, y: 2.8, hex2: 0xb8604a }), // tin penthouse (rustier)
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.6, y: 2.78 }), // blue tank
        cyl(0.26, 0.26, 0.42, 8, 0x3a6ea0, { x: 0.95, y: 2.78 }), // blue tank
        box(0.5, 0.5, 0.05, 0x6a7078, { y: 0.55, z: 0.7 }), // entrance gate
        box(2.06, 0.12, 0.06, 0x2f6db0, { y: 2.18, z: 0.66 }), // blue trim band (maritime)
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

  /* ---- slot 3: 魚市場攤位 (fish market stall - Keelung Zhengbin fish market) */
  {
    id: 'fish_market_stall',
    displayName: '魚市場攤位',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 5.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xd8dce2, 0x3a8080, 0xffd84d, 0xe8e8ee],
    yOffset: -0.5,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // stainless steel counter
        box(2.6, 0.8, 1.5, 0xd8dce2, { y: 0.4, hex2: 0xc8ccd2 }),
        // ice display bed
        box(2.4, 0.2, 1.3, 0xd0e8f0, { y: 0.9 }),
        // fish on display (elongated shapes)
        box(0.8, 0.12, 0.25, 0x7090a0, { x: -0.6, y: 1.0, z: 0.3 }),
        box(0.7, 0.1, 0.22, 0x6080a8, { x: 0.4, y: 1.02, z: -0.2 }),
        box(0.6, 0.08, 0.2, 0x8098a8, { x: 0.0, y: 1.0, z: 0.0 }),
        // shrimp pile
        sph(0.2, 0xf0a080, { ws: 6, hs: 4, x: 0.8, y: 1.0, z: 0.35 }),
        // blue awning roof (harbor themed)
        box(2.8, 0.1, 1.7, 0x2f6db0, { y: 2.2 }),
        // awning support posts
        cyl(0.06, 0.06, 1.2, 6, 0x8a9098, { x: -1.2, y: 1.6, z: 0.7 }),
        cyl(0.06, 0.06, 1.2, 6, 0x8a9098, { x: 1.2, y: 1.6, z: 0.7 }),
        cyl(0.06, 0.06, 1.2, 6, 0x8a9098, { x: -1.2, y: 1.6, z: -0.7 }),
        cyl(0.06, 0.06, 1.2, 6, 0x8a9098, { x: 1.2, y: 1.6, z: -0.7 }),
        // price sign
        box(0.6, 0.4, 0.05, 0xffd84d, { x: -0.8, y: 1.6, z: 0.78 }),
        // hanging scale
        cyl(0.03, 0.03, 0.4, 5, 0x6a7078, { x: 0.9, y: 1.8 }),
        sph(0.12, 0xc8ccd2, { ws: 6, hs: 4, x: 0.9, y: 1.55 }),
      ];
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
      // 6 wheels
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
        // angled rear loading hopper
        box(0.9, 1.1, 1.18, 0x9aa0aa, { rz: -0.28, x: -1.75, y: 1.0 }),
        box(0.06, 0.7, 1.0, 0x44484f, { x: -1.95, y: 0.7 }), // rear opening (dark)
        // hydraulic arm + handrails on the back
        cyl(0.06, 0.06, 0.9, 6, 0x6a7078, { rz: 0.5, x: -1.4, y: 1.5 }),
        box(2.0, 0.06, 1.18, 0xd0b830, { x: -0.55, y: 1.78 }), // body roof rib
        box(0.06, 0.7, 0.6, 0xc83828, { x: 0.78, y: 1.0, z: 0.6 }), // warning chevron stripe
      ];
      // 6 wheels
      const wx = [1.35, 1.35, -0.7, -0.7, -1.3, -1.3];
      const wz = [0.56, -0.56, 0.56, -0.56, 0.56, -0.56];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.3, 0.3, 0.22, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.3 })); // tire
      }
      return finish(parts);
    },
  },

  /* ---- slot 6: 漁船配件店 (fishing boat parts shop - harbor district) ---- */
  {
    id: 'boat_parts_shop',
    displayName: '漁船配件店',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 9.0,
    radiusJitter: 0.12,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0x8a9098, 0xe8e8ee, 0xffd84d, 0xc94f46],
    yOffset: -0.45,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      const parts = [
        // main shop building
        box(3.2, 2.0, 2.0, 0xe8e8ee, { y: 1.0, hex2: 0xd8d8de }),
        // blue roll-up door (harbor shop theme)
        box(1.6, 1.5, 0.08, 0x2f6db0, { y: 0.75, z: 1.02 }),
        // shop sign
        box(2.8, 0.5, 0.1, 0xffd84d, { y: 1.9, z: 1.05 }),
        // roof
        box(3.4, 0.15, 2.2, 0x8a9098, { y: 2.1 }),
        // displayed items outside - propeller
        cyl(0.5, 0.5, 0.1, 6, 0x8a9098, { x: -1.4, y: 0.6, z: 1.2, rx: HALF_PI }),
        // displayed items - rope coil
        cyl(0.35, 0.35, 0.2, 8, 0xc8b896, { x: 1.4, y: 0.3, z: 1.15 }),
        // displayed items - buoys
        sph(0.25, 0xc94f46, { ws: 6, hs: 4, x: -1.0, y: 0.25, z: 1.3 }),
        sph(0.22, 0xff8a3d, { ws: 6, hs: 4, x: 1.0, y: 0.22, z: 1.35 }),
        // side window
        box(1.0, 0.8, 0.06, 0x9fc4d8, { x: -1.65, y: 1.2, z: 0.0, ry: HALF_PI }),
        // anchor display on wall
        box(0.5, 0.6, 0.08, 0x4a4e58, { x: 1.65, y: 1.3, z: 0.0, ry: HALF_PI }),
        // roof water tank
        cyl(0.3, 0.3, 0.4, 8, 0x3a6ea0, { x: 0.8, y: 2.4 }),
      ];
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
          parts.push(box(0.74, 0.3, 0.06, 0x2f6db0, { x: cx[i] + 0.45, y: 1.62, z: 0.5 })); // blue sign (harbor theme)
          parts.push(box(0.6, 0.18, 0.05, 0xfff2c0, { x: cx[i] + 0.45, y: 1.62, z: 0.54 })); // lit sign face
        }
      }
      // hanging shop lanterns/lamps under the beam
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: -0.9, y: 1.78 }));
      parts.push(cyl(0.12, 0.12, 0.2, 7, 0xe0a83a, { x: 0.9, y: 1.78 }));
      return finish(parts);
    },
  },

  /* ---- slot 8: 港邊街屋 (chunk landmark — harbor street-house row) --- */
  {
    id: 'harbor_streethouse_mass',
    displayName: '港邊街屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 14,
    radiusJitter: 0.18,
    spawnWeight: 0.3,
    palette: [0xd8d0c0, 0xc0b8a8, 0xc8d0d8, 0xd0c8b8, 0xa8a090],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Keelung harbor-district connected shophouses — slightly maritime palette
      const parts = [];
      const heights = [2.2, 2.6, 2.4, 2.8];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xffffff, 0xf0e8d8, 0xffffff, 0xe8f0f0]; // some with blue-grey tinge
      const winTints = [0x44506a, 0x3e4a64, 0x4a5470, 0x3a5468]; // cooler blues
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        parts.push(towerBanded(1.3, h, 1.3, 3, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        parts.push(box(1.36, 0.1, 1.36, 0x8a8f9a, { x: xs[i], y: h + 0.05 })); // roof slab
        // rooftop water tanks / tin add-on
        if (i !== 3) parts.push(cyl(0.2, 0.2, 0.34, 5, 0x3a6ea0, { x: xs[i] - 0.3, y: h + 0.27 }));
        if (i % 2 === 0) parts.push(box(0.7, 0.4, 0.9, 0xa05a3a, { x: xs[i] + 0.2, y: h + 0.25, hex2: 0xb8604a }));
      }
      // continuous 騎樓 colonnade across the whole ground floor front
      parts.push(box(5.8, 0.24, 1.36, 0xc0b8a8, { y: 0.78, z: 0.02 })); // arcade beam
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.3, 0.7, 0.3, 0xd8d0c0, { x: -2.4 + i * 1.2, y: 0.35, z: 0.55 })); // arcade column
      }
      // street-front shop sign band - blue for harbor theme
      parts.push(box(5.6, 0.2, 0.06, 0x2f6db0, { y: 0.96, z: 0.7 }));
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
        // main hall body — red walls
        box(3.4, 1.3, 2.0, 0xffffff, { y: 1.05, hex2: 0xd2402a }),
      ];
      // front vermilion columns (龍柱) of the portico
      const cx = [-1.4, -0.5, 0.5, 1.4];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.14, 0.16, 1.3, 6, 0xffffff, { x: cx[i], z: 1.0, y: 1.05 })); // vermilion column
      }
      // sweeping double-eave hip roof
      parts.push(cyl(1.6, 1.6, 3.8, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.95 })); // lower eave roof
      parts.push(box(3.9, 0.12, 2.5, 0xe0a83a, { y: 1.78 })); // golden eave fascia
      parts.push(cyl(1.1, 1.1, 3.4, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.55 })); // upper roof tier
      // central ridge beam with ornament
      parts.push(box(3.6, 0.18, 0.22, 0xc94f46, { y: 2.95 })); // main ridge
      // 燕尾脊
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
