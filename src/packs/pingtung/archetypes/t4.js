/**
 * @file packs/pingtung/archetypes/t4.js — Roll Formosa Pingtung pack, TIER 4
 * content: 恆春古城與廟 (Hengchun old town & temples).
 *
 * The 10 tier-4 ArchetypeDefs (size band 3–12 m REAL). ids are the FROZEN
 * CONTRACT from packs/pingtung/tiers.js TIERS[4].archetypeIds — slots [0..7]
 * absorbable street structures (spawnWeight 1.0), slots [8..9] repeatable
 * CHUNK LANDMARK masses (spawnWeight ~0.3, ~2.5–3x the tier's largest body).
 *
 * Every buildGeometry(rng) returns ONE merged, vertex-colored BufferGeometry
 * (<= 350 tris) composed of low-segment primitives from geomHelpers.js, then
 * finish()-normalized to a UNIT bounding sphere (radius 1.0). rng() drives
 * only small per-instance variation (lit windows), never structure.
 */

import { paint, xf, box, cyl, cone, sph, ico, torus, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T4_ARCHETYPES = [
  /* ---- slot 0: 咾咕石屋 (coral-stone house — Hengchun/Kenting traditional) ---- */
  {
    id: 'coral_stone_house',
    displayName: '咾咕石屋',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 6.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xe0d8c8, 0xd0c8b8, 0xc8c0b0, 0xdad0c0, 0xb8b0a0],
    yOffset: -0.09,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Traditional Hengchun coral stone house (咾咕石屋)
      const coral = 0xffffff; // tinted grey coral stone
      const parts = [
        // Main house body - coral stone walls with textured surface
        box(1.6, 1.8, 1.5, coral, { y: 1.0, hex2: 0xe0d8c8 }),
        // Coral stone texture (random bumps)
        box(0.2, 0.15, 0.1, 0xc8c0b0, { x: -0.7, y: 0.6, z: 0.76 }),
        box(0.15, 0.18, 0.1, 0xd0c8b8, { x: 0.5, y: 1.2, z: 0.76 }),
        box(0.18, 0.12, 0.1, 0xc0b8a8, { x: 0.1, y: 0.8, z: 0.76 }),
        // Traditional sloped tile roof
        box(1.8, 0.15, 1.7, 0x8a6040, { y: 2.0 }),
        cyl(1.0, 1.0, 1.9, 4, 0x9a5030, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 2.25 }),
        // Roof ridge
        box(0.15, 0.1, 1.6, 0x7a5030, { y: 2.45 }),
        // Traditional wooden door
        box(0.5, 0.9, 0.08, 0x6a4020, { y: 0.55, z: 0.78 }),
        // Small window
        box(0.35, 0.3, 0.08, 0x4a3a30, { x: 0.5, y: 1.1, z: 0.78 }),
        // Stone base foundation
        box(1.7, 0.25, 1.6, 0xa8a098, { y: 0.12 }),
        // Low coral stone fence section
        box(0.8, 0.5, 0.2, 0xc8c0b0, { x: 1.1, y: 0.25, z: 0.3 }),
      ];
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
        box(2.4, 1.0, 1.7, 0xd8d4cc, { y: 0.5 }),
        box(2.42, 0.5, 1.72, 0xffffff, { y: 1.2, hex2: 0xe0d8d0 }),
        box(2.7, 0.1, 1.9, 0xffffff, { rz: 0.16, y: 1.62 }),
      ];
      for (let i = 0; i < 4; i++) {
        const x = -0.95 + i * 0.64;
        parts.push(box(0.06, 0.04, 1.9, 0xa84a30, { rz: 0.16, x, y: 1.69 + x * 0.16 }));
      }
      parts.push(box(2.74, 0.06, 0.12, 0x6a4a32, { rz: 0.16, y: 1.7, z: 0.92 }));
      parts.push(box(0.7, 0.7, 0.05, 0x44484f, { x: 0.6, y: 0.5, z: 0.86 }));
      parts.push(box(0.4, 0.45, 0.06, 0x9fc4d8, { x: -0.7, y: 0.55, z: 0.86 }));
      parts.push(cyl(0.28, 0.28, 0.4, 8, 0x3a6ea0, { x: -0.7, y: 1.95 }));
      parts.push(cyl(0.08, 0.08, 0.3, 6, 0x9aa0aa, { x: 0.7, y: 1.9 }));
      return finish(parts);
    },
  },

  /* ---- slot 2: 恆春老洋樓 (Hengchun colonial-era villa) --------------- */
  {
    id: 'hengchun_villa',
    displayName: '恆春老洋樓',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 8.0,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0xe8dcc8, 0xd8d0c0, 0xf0e8d8, 0xc8c0b0],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Japanese/colonial era villa typical of Hengchun Old Town
      const parts = [
        // Main 2-storey villa body - cream/white wash walls
        box(2.4, 2.0, 1.6, 0xffffff, { y: 1.2, hex2: 0xf8f0e0 }),
        // Arched windows on 2nd floor (colonial style)
        box(0.4, 0.5, 0.08, 0x3a4a5a, { x: -0.7, y: 1.8, z: 0.82 }),
        sph(0.2, 0x3a4a5a, { ws: 6, hs: 3, x: -0.7, y: 2.05, z: 0.82, thetaLen: HALF_PI }),
        box(0.4, 0.5, 0.08, 0x3a4a5a, { x: 0.7, y: 1.8, z: 0.82 }),
        sph(0.2, 0x3a4a5a, { ws: 6, hs: 3, x: 0.7, y: 2.05, z: 0.82, thetaLen: HALF_PI }),
        // Ground floor entrance - wooden doors
        box(0.6, 0.9, 0.08, 0x6a4a30, { y: 0.55, z: 0.82 }),
        // Colonial balustrade on 2nd floor balcony
        box(2.5, 0.1, 0.5, 0xe0d8c8, { y: 1.35, z: 1.0 }),
        box(2.5, 0.3, 0.06, 0xe8e0d0, { y: 1.55, z: 1.2 }),
        // Roof with Japanese-style tiles
        box(2.6, 0.18, 1.8, 0x8a5a3a, { y: 2.25 }),
        cyl(1.1, 1.1, 2.7, 4, 0x9a6a4a, { theta0: PI, rx: HALF_PI, sy: 0.35, y: 2.6 }),
        // Decorative cornices
        box(2.55, 0.08, 0.15, 0xd8d0c0, { y: 2.18, z: 0.88 }),
        // Stone base
        box(2.5, 0.25, 1.7, 0xb8b0a0, { y: 0.12 }),
        // Small garden palm
        cyl(0.06, 0.06, 0.8, 5, 0x6a5040, { x: 1.4, y: 0.4, z: 0.8 }),
        cone(0.3, 0.5, 5, 0x40a048, { x: 1.4, y: 0.95, z: 0.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 超商 (convenience store) ------------------------------ */
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
        box(2.6, 0.95, 1.5, 0xffffff, { y: 0.48 }),
        box(2.66, 0.22, 1.54, 0xe06a1a, { y: 1.06 }),
        box(2.66, 0.08, 1.54, 0x2a8a3a, { y: 1.21 }),
        box(2.66, 0.06, 1.54, 0xc83828, { y: 1.28 }),
        box(1.1, 0.16, 0.06, 0xfff2c0, { x: -0.5, y: 1.06, z: 0.79 }),
        box(2.72, 0.06, 1.6, 0x8a9098, { y: 1.34 }),
        box(0.42, 0.32, 0.32, 0xb8bec8, { x: 0.9, y: 1.46 }),
        box(2.2, 0.6, 0.06, 0x9fc4d8, { y: 0.46, z: 0.76 }),
        box(2.1, 0.1, 0.07, 0xffe9b0, { y: 0.62, z: 0.765 }),
        box(2.1, 0.08, 0.07, 0xf0d8a0, { y: 0.4, z: 0.765 }),
        box(0.5, 0.66, 0.08, 0x7a8088, { x: 0.92, y: 0.36, z: 0.78 }),
        box(0.46, 0.42, 0.05, 0x9fc4d8, { x: 0.92, y: 0.44, z: 0.81 }),
        box(0.5, 0.7, 0.4, 0xd8dce2, { x: -1.0, y: 0.36, z: 0.95 }),
        cyl(0.06, 0.06, 0.7, 6, 0xc8ccd2, { x: -1.25, y: 0.85, z: 0.7 }),
        box(0.4, 0.34, 0.06, 0xe06a1a, { x: -1.25, y: 1.25, z: 0.7 }),
      ];
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
        box(3.6, 1.0, 1.2, 0xffffff, { y: 0.95 }),
        box(3.64, 0.18, 1.22, 0x3a6ea0, { y: 0.5 }),
        box(3.5, 0.34, 1.24, 0x28323e, { y: 1.18 }),
        box(3.4, 0.06, 1.1, 0xd2d6dc, { y: 1.5 }),
        box(1.0, 0.18, 1.14, 0xe0a83a, { x: 1.4, y: 1.46 }),
        box(3.66, 0.5, 0.04, 0xffffff, { z: 0.64, y: 0.95, hex2: 0xeef2f6 }),
        box(0.06, 0.4, 1.18, 0x35414e, { x: 1.83, y: 1.16 }),
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: 0.42 }),
        box(0.06, 0.12, 0.2, 0xffe9a0, { x: 1.85, y: 0.62, z: -0.42 }),
        box(0.05, 0.7, 0.5, 0x35414e, { x: -1.55, y: 0.9, z: 0.5 }),
        box(0.05, 0.55, 0.06, 0xc94f46, { x: 0.2, y: 0.5 }),
      ];
      const wx = [1.4, 1.4, -1.2, -1.2, -1.55, -1.55];
      const wz = [0.6, -0.6, 0.6, -0.6, 0.6, -0.6];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.32, 0.32, 0.2, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.32 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 5: 垃圾車 (garbage truck) --------------------------------- */
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
        box(1.0, 0.95, 1.15, 0xffffff, { x: 1.4, y: 0.92, hex2: 0xf4e26a }),
        box(0.9, 0.34, 1.08, 0x28323e, { x: 1.42, y: 1.18 }),
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: 0.4 }),
        box(0.06, 0.12, 0.22, 0xffe9a0, { x: 1.92, y: 0.66, z: -0.4 }),
        box(2.3, 1.35, 1.16, 0xffffff, { x: -0.55, y: 1.1, hex2: 0xf0dc58 }),
        box(2.34, 0.18, 1.12, 0x9aa0aa, { x: -0.55, y: 0.44 }),
        box(0.9, 1.1, 1.18, 0x9aa0aa, { rz: -0.28, x: -1.75, y: 1.0 }),
        box(0.06, 0.7, 1.0, 0x44484f, { x: -1.95, y: 0.7 }),
        cyl(0.06, 0.06, 0.9, 6, 0x6a7078, { rz: 0.5, x: -1.4, y: 1.5 }),
        box(2.0, 0.06, 1.18, 0xd0b830, { x: -0.55, y: 1.78 }),
        box(0.06, 0.7, 0.6, 0xc83828, { x: 0.78, y: 1.0, z: 0.6 }),
      ];
      const wx = [1.35, 1.35, -0.7, -0.7, -1.3, -1.3];
      const wz = [0.56, -0.56, 0.56, -0.56, 0.56, -0.56];
      for (let i = 0; i < 6; i++) {
        parts.push(cyl(0.3, 0.3, 0.22, 7, 0x23262e, { rx: HALF_PI, x: wx[i], z: wz[i], y: 0.3 }));
      }
      return finish(parts);
    },
  },

  /* ---- slot 6: 加油站 (gas station) ----------------------------------- */
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
        box(3.4, 0.26, 2.4, 0xffffff, { y: 1.9 }),
        box(3.46, 0.14, 2.46, 0xc94f46, { y: 2.06 }),
        box(3.46, 0.06, 2.46, 0x3a6ea0, { y: 2.14 }),
      ];
      const cx = [-1.3, 1.3, -1.3, 1.3];
      const cz = [0.9, 0.9, -0.9, -0.9];
      for (let i = 0; i < 4; i++) {
        parts.push(cyl(0.16, 0.16, 1.8, 7, 0xd8dce2, { x: cx[i], z: cz[i], y: 0.9 }));
      }
      parts.push(box(2.2, 0.12, 1.2, 0x9aa0aa, { y: 0.06 }));
      const px = [-0.6, 0.6];
      for (let i = 0; i < 2; i++) {
        parts.push(box(0.36, 0.7, 0.5, 0xeef2f4, { x: px[i], y: 0.5 }));
        parts.push(box(0.32, 0.22, 0.46, 0x2a3138, { x: px[i], y: 0.78 }));
        parts.push(box(0.3, 0.06, 0.4, 0xe0a83a, { x: px[i], y: 0.92 }));
        parts.push(cyl(0.05, 0.05, 0.5, 6, 0x44484f, { x: px[i] + 0.22, y: 0.5, z: 0.28 }));
      }
      parts.push(cyl(0.1, 0.1, 2.1, 6, 0xbfc4ca, { x: 1.7, z: -0.7, y: 1.05 }));
      parts.push(box(0.7, 0.8, 0.14, 0xc94f46, { x: 1.7, z: -0.7, y: 2.1 }));
      parts.push(box(0.6, 0.5, 0.05, 0xfff2c0, { x: 1.7, z: -0.84, y: 2.1 }));
      return finish(parts);
    },
  },

  /* ---- slot 7: 萬巒豬腳店 (Wanruan pig trotter shop) ----------------- */
  {
    id: 'pig_trotter_shop',
    displayName: '萬巒豬腳店',
    tier: 4,
    naturalBand: 4,
    radiusNominal: 4.5,
    radiusJitter: 0.15,
    spawnWeight: 1.0,
    palette: [0xc87848, 0xd88858, 0xb86838, 0xe89868, 0xa85828],
    yOffset: -0.48,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // Famous Wanruan pig trotter restaurant storefront
      const parts = [
        // Shop building body
        box(3.0, 1.8, 1.6, 0xffffff, { y: 0.9, hex2: 0xf8f4f0 }),
        // Roof with characteristic red awning
        box(3.2, 0.2, 1.8, 0xc83828, { y: 1.9 }),
        // Sign board with golden trim
        box(2.6, 0.5, 0.1, 0xc83828, { y: 1.6, z: 0.85 }),
        box(2.4, 0.4, 0.06, 0xffd040, { y: 1.6, z: 0.88 }),
        // Glass storefront
        box(2.2, 0.9, 0.08, 0x9fc4d8, { y: 0.65, z: 0.82 }),
        // Display case with pig trotters
        box(1.5, 0.6, 0.5, 0xe8e4e0, { y: 0.4, z: 0.5 }),
        // Pig trotter display (rounded brown shapes)
        sph(0.2, 0xc87848, { ws: 6, hs: 4, x: -0.4, y: 0.6, z: 0.5 }),
        sph(0.18, 0xb86838, { ws: 6, hs: 4, x: 0, y: 0.55, z: 0.55 }),
        sph(0.2, 0xd88858, { ws: 6, hs: 4, x: 0.35, y: 0.6, z: 0.5 }),
        // Hanging lanterns
        sph(0.15, 0xff4040, { ws: 5, hs: 4, x: -1.2, y: 1.5, z: 0.7 }),
        sph(0.15, 0xff4040, { ws: 5, hs: 4, x: 1.2, y: 1.5, z: 0.7 }),
        // Steam vent
        cyl(0.1, 0.1, 0.3, 6, 0x9aa0aa, { x: 1.2, y: 2.15 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8: 恆春街屋 (chunk landmark — Hengchun street-house row) --- */
  {
    id: 'hengchun_streethouse_mass',
    displayName: '恆春街屋',
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
      const parts = [];
      const heights = [2.2, 2.8, 2.4, 3.0];
      const xs = [-2.1, -0.7, 0.7, 2.1];
      const wallTints = [0xffffff, 0xf0ead8, 0xffffff, 0xf2e6dc];
      const winTints = [0x44506a, 0x3e4a64, 0x4a5470, 0x40506a];
      for (let i = 0; i < 4; i++) {
        const h = heights[i];
        parts.push(towerBanded(1.3, h, 1.3, 3, wallTints[i], winTints[i], 0xffd98a, rng, { x: xs[i], y: h / 2 }));
        parts.push(box(1.36, 0.1, 1.36, 0x8a8f9a, { x: xs[i], y: h + 0.05 }));
        if (i !== 3) parts.push(cyl(0.2, 0.2, 0.34, 5, 0x3a6ea0, { x: xs[i] - 0.3, y: h + 0.27 }));
        if (i % 2 === 0) parts.push(box(0.7, 0.4, 0.9, 0xb0563a, { x: xs[i] + 0.2, y: h + 0.25, hex2: 0xc8704a }));
      }
      parts.push(box(5.8, 0.24, 1.36, 0xc8bca8, { y: 0.78, z: 0.02 }));
      for (let i = 0; i < 5; i++) {
        parts.push(box(0.3, 0.7, 0.3, 0xd8cdb8, { x: -2.4 + i * 1.2, y: 0.35, z: 0.55 }));
      }
      parts.push(box(5.6, 0.2, 0.06, 0xc83828, { y: 0.96, z: 0.7 }));
      return finish(parts);
    },
  },

  /* ---- slot 9: 大廟 (chunk landmark — temple mass) -------------------- */
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
        box(4.2, 0.4, 2.8, 0xb8ac98, { y: 0.2 }),
        box(3.4, 1.3, 2.0, 0xffffff, { y: 1.05, hex2: 0xd2402a }),
      ];
      const cx = [-1.4, -0.5, 0.5, 1.4];
      for (let i = 0; i < cx.length; i++) {
        parts.push(cyl(0.14, 0.16, 1.3, 6, 0xffffff, { x: cx[i], z: 1.0, y: 1.05 }));
      }
      parts.push(cyl(1.6, 1.6, 3.8, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 1.95 }));
      parts.push(box(3.9, 0.12, 2.5, 0xe0a83a, { y: 1.78 }));
      parts.push(cyl(1.1, 1.1, 3.4, 4, 0x2e5a3a, { theta0: PI, rx: HALF_PI, sy: 0.5, y: 2.55 }));
      parts.push(box(3.6, 0.18, 0.22, 0xc94f46, { y: 2.95 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.95, y: 3.05 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.95, y: 3.05 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: 0.55, x: -1.6, y: 2.62, z: 0 }));
      parts.push(box(0.7, 0.14, 0.2, 0xe0a83a, { rz: -0.55, x: 1.6, y: 2.62, z: 0 }));
      parts.push(sph(0.22, 0xe0a83a, { ws: 6, hs: 4, y: 3.18 }));
      parts.push(cone(0.16, 0.4, 6, 0xe0a83a, { y: 3.5 }));
      parts.push(box(3.0, 0.16, 0.5, 0x9aa0aa, { y: 0.46, z: 1.35 }));
      parts.push(box(1.0, 0.9, 0.08, 0x6a2a1a, { y: 0.85, z: 1.02 }));
      parts.push(box(1.04, 0.18, 0.1, 0xe0a83a, { y: 1.36, z: 1.02 }));
      return finish(parts);
    },
  },
];

export default T4_ARCHETYPES;
