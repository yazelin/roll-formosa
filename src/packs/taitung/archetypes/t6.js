/**
 * @file packs/taitung/archetypes/t6.js — Roll Formosa Taitung pack, Tier 6.
 *
 * T6 — 海岸天際線 (Coastal Skyline). The finale band featuring Taitung's
 * iconic Pacific coast: hot air balloons floating above the coast, coral
 * rocks, fishing boats, the lighthouse, resort towers, and the coastline
 * architecture leading to Sanxiantai. radiusNominal 60-300 m real.
 * Slots [0..7] absorbable, slots [8..9] repeatable CHUNK LANDMARKS.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so every recipe is authored in unit-ish space and
 * yOffset = -1 - minY(normalized) drops the object onto the ground plane.
 *
 * Contract (catalog.test.js): tier === naturalBand === 6, palette 4-6 tints,
 * -1.01 < yOffset <= 0.5, 0 < collisionScale <= 1, <= 350 triangles each.
 */

import { box, cyl, cone, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

/** @type {Archetype[]} */
export const T6_ARCHETYPES = [
  /* ---- slot 0: 熱氣球 hot_air_balloon ---------------------------------- */
  {
    id: 'hot_air_balloon',
    displayName: '熱氣球',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 160,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe06048, 0xf0c040, 0x4a90c8, 0xf8f0e0, 0x8a7050],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      // The iconic Taitung hot air balloon from the International Balloon
      // Festival at Luye Highland. Colorful envelope with wicker basket.
      const parts = [
        // balloon envelope (main sphere, stretched tall)
        sph(2.2, 0xe06048, { ws: 8, hs: 6, y: 4.5, sy: 1.4, hex2: 0xd05038 }),
        // colored stripe band around envelope (one instead of 3)
        cyl(1.9, 1.9, 0.5, 6, 0xf0c040, { y: 4.5, hex2: 0xe0b030 }),
        // bottom cone (mouth of balloon)
        cone(1.4, 1.2, 6, 0xe06048, { y: 2.2, hex2: 0xc04030 }),
        // basket (wicker)
        box(1.0, 0.7, 1.0, 0x8a7050, { y: 0.85, hex2: 0x7a6040 }),
        box(1.1, 0.1, 1.1, 0x6a5030, { y: 1.2 }), // basket rim
        // suspension cables (2 instead of 4)
        cyl(0.04, 0.04, 1.3, 4, 0x4a4a48, { x: 0.4, y: 1.75, rz: 0.15 }),
        cyl(0.04, 0.04, 1.3, 4, 0x4a4a48, { x: -0.4, y: 1.75, rz: -0.15 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 1: 珊瑚礁岩 coral_rock ------------------------------------- */
  {
    id: 'coral_rock',
    displayName: '珊瑚礁岩',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 130,
    radiusJitter: 0.2,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0xa89880, 0xe8d8c0, 0x8a7a60, 0x6a5a48],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // Weathered coral limestone rock formation, typical of Taitung's east
      // coast. Irregular lumpy shapes with tide-worn surfaces.
      const parts = [
        // main rock mass (irregular spheroids)
        sph(1.8, 0xc8b8a0, { ws: 7, hs: 5, y: 1.4, sx: 1.2, sy: 0.8, hex2: 0xa89880 }),
        sph(1.4, 0xe8d8c0, { ws: 6, hs: 4, x: 1.2, y: 1.0, sy: 0.7, hex2: 0xc8b8a0 }),
        sph(1.1, 0xa89880, { ws: 6, hs: 4, x: -1.0, y: 0.9, sz: 1.3, hex2: 0x8a7a60 }),
        // smaller rock chunks
        sph(0.8, 0xd8c8b0, { ws: 5, hs: 4, x: 0.5, y: 0.6, z: 1.3 }),
        sph(0.6, 0xb8a890, { ws: 5, hs: 4, x: -0.8, y: 0.5, z: -1.0 }),
        // tide pool depression (dark)
        cyl(0.5, 0.5, 0.15, 6, 0x4a6878, { x: 0.3, y: 1.65, z: 0.4 }),
        // barnacle/coral patches
        sph(0.2, 0xf8f0e0, { ws: 4, hs: 3, x: 1.5, y: 1.2, z: 0.5 }),
        sph(0.15, 0xf8f0e0, { ws: 4, hs: 3, x: -0.5, y: 1.5, z: -0.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 2: 海岸漁船 coast_fishing_boat ----------------------------- */
  {
    id: 'coast_fishing_boat',
    displayName: '海岸漁船',
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
      // A traditional Taitung coastal fishing boat, similar to those used
      // by Amis fishermen. Colorful hull with outrigger stabilizers.
      const hull = 0x2f6db0;
      const white = 0xe8e4da;
      const parts = [
        // hull body
        box(4.0, 0.9, 1.3, hull, { y: 0.75, hex2: 0x255a96 }),
        cone(0.9, 1.4, 4, hull, { rz: -HALF_PI, x: 2.6, y: 0.75 }), // pointed bow
        // white waterline stripe
        box(4.2, 0.16, 1.36, white, { y: 1.12 }),
        box(4.2, 0.1, 1.4, 0xd83a2c, { y: 1.0 }), // red boot stripe
        // open deck floor
        box(3.4, 0.08, 1.0, 0xc8b890, { y: 1.22 }),
        // simple wheelhouse
        box(1.3, 1.0, 1.0, white, { x: -1.0, y: 1.75, hex2: 0xf2f0e8 }),
        box(1.0, 0.4, 0.86, 0x2a3138, { x: -1.0, y: 1.95 }), // windows
        box(1.4, 0.12, 1.1, 0x9aa0ac, { x: -1.0, y: 2.3 }), // roof
        // mast
        cyl(0.07, 0.08, 2.4, 6, 0xb0b6c0, { x: 0.2, y: 2.4 }),
        box(1.8, 0.07, 0.07, 0x9aa0ac, { x: 0.6, y: 2.6 }), // boom
        // flag
        box(0.5, 0.3, 0.03, 0xf0c040, { x: 0.45, y: 3.4 }),
        // fishing buoys
        sph(0.24, 0xf0c040, { ws: 6, hs: 4, x: 1.4, y: 1.3, z: 0.7, hex2: 0xff8a3d }),
        sph(0.22, 0xd83a2c, { ws: 6, hs: 4, x: 0.6, y: 1.3, z: 0.72 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 3: 浮標 ocean_buoy ----------------------------------------- */
  {
    id: 'ocean_buoy',
    displayName: '浮標',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 80,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xe06048, 0xf0c040, 0x3a3f48, 0xf8f0e0, 0x2f6db0],
    yOffset: -0.35,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // A large ocean navigation buoy, marking shipping lanes or reef areas
      // off the Taitung coast. Red and yellow with a light beacon on top.
      const parts = [
        // main buoy body (tapered cylinder)
        cyl(1.2, 1.4, 2.5, 6, 0xe06048, { y: 1.25, hex2: 0xd05038 }),
        // yellow stripe band
        cyl(1.25, 1.25, 0.4, 6, 0xf0c040, { y: 1.2 }),
        // top platform
        cyl(1.0, 1.0, 0.2, 6, 0x3a3f48, { y: 2.6 }),
        // light beacon tower
        cyl(0.3, 0.25, 1.2, 5, 0x3a3f48, { y: 3.3 }),
        // light housing
        sph(0.4, 0xfff0a0, { ws: 5, hs: 4, y: 4.2 }), // light
        // solar panel
        box(0.6, 0.05, 0.4, 0x2a3a5a, { x: 0.5, y: 2.8, rx: -0.4 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 4: 民宿塔 resort_tower -------------------------------------- */
  {
    id: 'resort_tower',
    displayName: '民宿塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 140,
    radiusJitter: 0.17,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0x48a8d8, 0x2e6a9a, 0xc8a060, 0x3a3a38],
    yOffset: -0.191,
    upright: true,
    collisionScale: 0.8,
    buildGeometry(rng) {
      // A beachside resort/B&B tower, typical of Taitung's coastal tourism
      // developments. White building with ocean-blue accents.
      return finish([
        // podium base
        box(2.4, 0.55, 1.6, 0xb8b2a6, { y: 0.28, hex2: 0xc8c2b6 }),
        // main tower with banded windows
        towerBanded(1.9, 4.5, 1.0, 12, 0xffffff, 0x48a8d8, 0xfff8d0, rng, { y: 2.8 }),
        // blue horizontal accent bands
        box(2.0, 0.12, 1.06, 0x2e6a9a, { y: 1.8 }),
        box(2.0, 0.12, 1.06, 0x2e6a9a, { y: 3.2 }),
        box(2.0, 0.12, 1.06, 0x2e6a9a, { y: 4.6 }),
        // rooftop
        box(2.0, 0.2, 1.1, 0xc8c0b0, { y: 5.2 }),
        // rooftop observation deck railings
        box(1.8, 0.4, 0.06, 0x48a8d8, { y: 5.4, z: 0.5 }),
        box(1.8, 0.4, 0.06, 0x48a8d8, { y: 5.4, z: -0.5 }),
        // sign
        box(1.2, 0.4, 0.08, 0xc8a060, { y: 0.8, z: 0.85 }),
      ]);
    },
  },

  /* ---- slot 5: 漁港吊車 port_crane ------------------------------------- */
  {
    id: 'port_crane',
    displayName: '漁港吊車',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 200,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x3a6a8a, 0x4a7a9a, 0x8a96a8, 0xc0c8d4, 0xe88030],
    yOffset: -0.4362,
    upright: true,
    collisionScale: 0.9,
    buildGeometry(rng) {
      // A port crane at Fugang Fishery Harbor or Taitung's fishing ports.
      // Industrial blue-grey with safety orange accents.
      const parts = [
        // ground rail beams
        box(3.4, 0.12, 0.16, 0x4a525c, { y: 0.08, z: 0.9 }),
        box(3.4, 0.12, 0.16, 0x4a525c, { y: 0.08, z: -0.9 }),
      ];
      // four tall box legs
      const legX = [-1.3, 1.3];
      for (const lx of legX) {
        parts.push(box(0.26, 3.4, 0.26, 0xe88030, { x: lx, y: 1.7, z: 0.9 }));
        parts.push(box(0.26, 3.4, 0.26, 0xe88030, { x: lx, y: 1.7, z: -0.9 }));
        // diagonal cross-brace
        parts.push(box(0.12, 2.0, 0.12, 0x6a7480, { rx: 0.42, x: lx, y: 1.6 }));
      }
      // top frame
      parts.push(box(3.0, 0.3, 2.1, 0x3a6a8a, { y: 3.5, hex2: 0x4a7a9a }));
      // horizontal boom arm
      parts.push(box(6.0, 0.34, 0.46, 0x4a7a9a, { y: 3.85 }));
      parts.push(box(6.0, 0.1, 0.5, 0x8a96a8, { y: 4.06 }));
      // trolley cab
      parts.push(box(0.7, 0.6, 0.6, 0xc0c8d4, { x: 1.2, y: 3.4 }));
      parts.push(box(0.5, 0.3, 0.5, 0x2a3138, { x: 1.2, y: 3.45, z: 0.32 }));
      // lifting cables + spreader
      parts.push(box(0.04, 1.6, 0.04, 0xb8c0c8, { x: 1.05, y: 2.6 }));
      parts.push(box(0.04, 1.6, 0.04, 0xb8c0c8, { x: 1.35, y: 2.6 }));
      parts.push(box(0.8, 0.18, 0.7, 0xe88030, { x: 1.2, y: 1.85 }));
      return finish(parts);
    },
  },

  /* ---- slot 6: 觀光旅館 beach_hotel ------------------------------------- */
  {
    id: 'beach_hotel',
    displayName: '觀光旅館',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 180,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xf8f0e0, 0x48a8d8, 0x4a8a5a, 0xc8a060, 0x3a3a38],
    yOffset: -0.28,
    upright: true,
    collisionScale: 0.82,
    buildGeometry(rng) {
      // A beach resort hotel with multiple wings, tropical landscaping
      // accents, and ocean-view balconies facing the Pacific.
      const parts = [
        // main hotel tower
        box(3.0, 5.5, 2.5, 0xffffff, { y: 2.75, hex2: 0xf8f0e0 }),
        // side wing
        box(2.0, 4.0, 2.0, 0xffffff, { x: 2.2, y: 2.0, hex2: 0xf8f0e0 }),
        // ocean-blue accent bands
        box(3.1, 0.2, 2.6, 0x48a8d8, { y: 1.5 }),
        box(3.1, 0.2, 2.6, 0x48a8d8, { y: 3.0 }),
        box(3.1, 0.2, 2.6, 0x48a8d8, { y: 4.5 }),
        // balconies on main tower
        box(2.8, 0.1, 0.5, 0xe8e0d0, { y: 1.6, z: 1.5 }),
        box(2.8, 0.1, 0.5, 0xe8e0d0, { y: 3.1, z: 1.5 }),
        box(2.8, 0.1, 0.5, 0xe8e0d0, { y: 4.6, z: 1.5 }),
        // rooftop pool area
        box(2.8, 0.15, 2.3, 0xc8c0b0, { y: 5.55 }),
        box(1.5, 0.2, 1.0, 0x48c8e8, { y: 5.55, x: 0.3 }), // pool
        // lobby entrance
        box(2.0, 1.5, 0.8, 0x48a8d8, { y: 0.75, z: 1.5 }),
        box(1.6, 1.2, 0.1, 0x9fd4e8, { y: 0.7, z: 1.9 }), // glass doors
        // palm tree planters (simplified)
        cyl(0.15, 0.15, 1.8, 6, 0x8a7050, { x: -1.8, y: 0.9, z: 1.8 }),
        sph(0.5, 0x4a8a5a, { ws: 6, hs: 4, x: -1.8, y: 2.0, z: 1.8 }),
        // hotel sign
        box(1.8, 0.4, 0.1, 0xc8a060, { y: 5.0, z: 1.3 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 7: 海岸量體 coastline_block --------------------------------- */
  {
    id: 'coastline_block',
    displayName: '海岸量體',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 150,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0xc8b8a0, 0x48a8d8, 0xf8f0e0, 0x4a8a5a, 0x8a7a60],
    yOffset: -0.38,
    upright: true,
    collisionScale: 0.85,
    buildGeometry(rng) {
      // A coastal mixed-use block: shops, cafes, and residences clustered
      // along the Taitung coastal road, with ocean-facing terraces.
      const parts = [
        // main block mass
        box(4.5, 3.5, 3.0, 0xffffff, { y: 1.75, hex2: 0xf8f0e0 }),
        // secondary lower wing
        box(2.5, 2.5, 2.5, 0xffffff, { x: 2.8, y: 1.25, hex2: 0xf8f0e0 }),
        // ocean-blue facade accent
        box(4.6, 0.3, 0.1, 0x48a8d8, { y: 3.6, z: 1.55 }),
        // shop fronts at ground level
        box(1.0, 1.2, 0.1, 0x9fd4e8, { x: -1.2, y: 0.7, z: 1.55 }),
        box(1.0, 1.2, 0.1, 0x9fd4e8, { x: 0.5, y: 0.7, z: 1.55 }),
        box(1.0, 1.2, 0.1, 0x9fd4e8, { x: 2.2, y: 0.7, z: 1.55 }),
        // awnings
        box(1.2, 0.1, 0.5, 0xe06048, { x: -1.2, y: 1.4, z: 1.7 }),
        box(1.2, 0.1, 0.5, 0xf0c040, { x: 0.5, y: 1.4, z: 1.7 }),
        box(1.2, 0.1, 0.5, 0x4a8a5a, { x: 2.2, y: 1.4, z: 1.3 }),
        // rooftop terrace
        box(4.6, 0.15, 3.1, 0xc8c0b0, { y: 3.55 }),
        // terrace railing
        box(4.4, 0.4, 0.08, 0x48a8d8, { y: 3.8, z: 1.45 }),
        // rooftop garden planters
        box(1.0, 0.4, 0.8, 0x4a8a5a, { x: 1.2, y: 3.8 }),
        box(0.8, 0.4, 0.6, 0x4a8a5a, { x: -1.0, y: 3.8 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 8 (chunk landmark): 跨海空橋 coast_skybridge --------------- */
  {
    id: 'coast_skybridge',
    displayName: '跨海空橋',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 280,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0x48a8d8, 0xf8f0e0, 0x2e6a9a, 0xc8c0b0, 0xffe0a0],
    yOffset: -0.485,
    upright: true,
    collisionScale: 0.75,
    buildGeometry(rng) {
      // A monumental coastal skybridge / walkway connecting scenic viewpoints
      // along Taitung's coast, reminiscent of Sanxiantai's arched bridge.
      const parts = [
        // two anchor towers at each end (box instead of banded tower for budget)
        box(1.3, 2.8, 1.3, 0x48a8d8, { x: -2.0, y: 1.4, hex2: 0x3898c8 }),
        box(1.3, 3.0, 1.3, 0x48a8d8, { x: 2.0, y: 1.5, hex2: 0x3898c8 }),
        // main arched span (curved via stacked segments)
        box(1.0, 0.5, 0.9, 0x48a8d8, { x: -1.0, y: 2.0, rz: 0.2, hex2: 0x3898c8 }),
        box(1.2, 0.5, 0.9, 0x48a8d8, { y: 2.4, hex2: 0x3898c8 }),
        box(1.0, 0.5, 0.9, 0x48a8d8, { x: 1.0, y: 2.0, rz: -0.2, hex2: 0x3898c8 }),
        // deck surface
        box(2.8, 0.08, 0.92, 0xc8c0b0, { y: 2.2 }),
        // railings
        box(2.8, 0.06, 0.06, 0xf8f0e0, { y: 2.5, z: 0.4 }),
        box(2.8, 0.06, 0.06, 0xf8f0e0, { y: 2.5, z: -0.4 }),
        // tower roof details
        box(0.7, 0.26, 0.7, 0x7a8492, { x: -2.0, y: 2.95 }),
        box(0.7, 0.26, 0.7, 0x7a8492, { x: 2.0, y: 3.15 }),
      ];
      return finish(parts);
    },
  },

  /* ---- slot 9 (chunk landmark): 燈塔 lighthouse_tower ------------------ */
  {
    id: 'lighthouse_tower',
    displayName: '燈塔',
    tier: 6,
    naturalBand: 6,
    radiusNominal: 260,
    radiusJitter: 0.16,
    spawnWeight: 0.3,
    palette: [0xf2f2ee, 0xd83a2c, 0x2a2c34, 0xc8ccd2, 0xffe08a],
    yOffset: -0.04,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      // A coastal lighthouse, like the ones guiding ships along Taitung's
      // Pacific coast (Green Island Lighthouse style). White tower with
      // red gallery and bright lantern room.
      const white = 0xffffff;
      const parts = [
        // base platform
        cyl(1.3, 1.4, 0.6, 6, 0xc8c4b8, { y: 0.3 }),
        // tapered white tower shaft
        cyl(0.65, 0.95, 4.0, 6, white, { y: 3.1, hex2: 0xf4f4ee }),
        // red gallery deck
        cyl(0.9, 0.9, 0.35, 6, 0xd83a2c, { y: 5.25 }),
        // glass lantern room
        cyl(0.55, 0.55, 0.8, 6, 0xbfe2f0, { y: 5.85, hex2: 0xffe08a }),
        // domed red roof cap
        cone(0.62, 0.65, 6, 0xd83a2c, { y: 6.55 }),
        // beacon light
        sph(0.2, 0xffe08a, { ws: 4, hs: 3, y: 7.0 }),
        // small entrance door at base
        box(0.5, 0.9, 0.1, 0x5a4a3a, { y: 1.1, z: 1.05 }),
      ];
      return finish(parts);
    },
  },
];

export default T6_ARCHETYPES;
