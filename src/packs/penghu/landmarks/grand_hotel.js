/**
 * @file packs/penghu/landmarks/grand_hotel.js — Roll Formosa Penghu pack, landmark 3.
 *
 * 鯨魚洞 (Whale Cave) — a natural sea cave on Xiaoyu Island (小門嶼), Penghu.
 * The cave opening resembles a whale's mouth, carved by millennia of wave
 * erosion into the basalt cliff. A dramatic arch formation with the sea
 * visible through the opening.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1).
 *
 * Palette: dark basalt rock + sea blue water + white foam/spray.
 */

import { box, cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const ROCK = 0x4a4035; // dark volcanic rock
const ROCK_L = 0x5a5045; // lighter rock (sunlit)
const ROCK_D = 0x3a3025; // darker rock (shadow/wet)
const SEA = 0x2a6a8a; // deep sea blue
const SEA_L = 0x4a8aaa; // lighter sea
const FOAM = 0xe8f4f8; // white sea foam
const GREEN = 0x4a6a40; // grass on top

export const NM_WHALE_CAVE = {
  id: 'whale_cave',
  name: '鯨魚洞',
  landmarkId: 3,
  dioramaRHint: 25, // ~50 m wide rock formation
  colorHex: ROCK,

  buildGeometry(rng) {
    const parts = [];

    // ---- sea base ----
    parts.push(cyl(2.5, 2.6, 0.2, 12, SEA_L, { y: 0.1, hex2: SEA }));
    // Foam ring
    parts.push(torus(2.3, 0.05, 3, 12, FOAM, { rx: HALF_PI, y: 0.18 }));

    // ---- rocky base / platform ----
    parts.push(box(3.5, 0.35, 2.2, ROCK_D, { y: 0.25, z: -0.3, hex2: ROCK }));
    parts.push(box(3.2, 0.25, 1.8, ROCK, { y: 0.52, z: -0.4, hex2: ROCK_L }));

    // ---- main cliff mass (the whale's body shape) ----
    // Left cliff wall
    parts.push(box(1.2, 2.2, 1.6, ROCK_D, { x: -1.2, y: 1.5, z: -0.2, hex2: ROCK }));
    parts.push(box(1.0, 2.4, 1.4, ROCK, { x: -1.4, y: 1.6, z: -0.3, hex2: ROCK_L }));

    // Right cliff wall
    parts.push(box(1.2, 2.0, 1.6, ROCK_D, { x: 1.2, y: 1.4, z: -0.2, hex2: ROCK }));
    parts.push(box(1.0, 2.2, 1.4, ROCK, { x: 1.4, y: 1.5, z: -0.3, hex2: ROCK_L }));

    // ---- the cave arch (whale's mouth opening) ----
    // Top of arch connecting the two sides
    parts.push(box(2.0, 0.8, 1.2, ROCK_D, { x: 0, y: 2.4, z: -0.1, hex2: ROCK }));

    // Arch curve (using cylinders to create rounded top)
    parts.push(
      cyl(1.0, 1.1, 1.0, 8, ROCK_D, {
        rx: HALF_PI,
        y: 1.8,
        z: 0.4,
        theta0: 0,
        thetaLen: PI,
        hex2: ROCK,
      })
    );

    // Dark interior of cave
    parts.push(box(1.6, 1.4, 0.5, 0x1a1815, { x: 0, y: 1.3, z: -0.6 }));
    parts.push(
      cyl(0.75, 0.8, 0.4, 8, 0x1a1815, {
        rx: HALF_PI,
        y: 1.6,
        z: -0.4,
        theta0: 0,
        thetaLen: PI,
      })
    );

    // ---- cliff top with vegetation ----
    parts.push(box(3.0, 0.3, 1.5, GREEN, { y: 2.9, z: -0.5, hex2: 0x5a7a50 }));
    // Grass clumps
    for (let i = 0; i < 5; i++) {
      const gx = -1.2 + rng() * 2.4;
      const gz = -0.8 - rng() * 0.5;
      parts.push(
        sph(0.15 + rng() * 0.1, GREEN, {
          ws: 3, hs: 2,
          x: gx, y: 3.0, z: gz,
          sy: 0.4,
        })
      );
    }

    // ---- water inside cave / at base ----
    parts.push(box(1.4, 0.15, 0.8, SEA, { y: 0.35, z: 0.2, hex2: SEA_L }));
    // Foam at wave crash point
    parts.push(torus(0.6, 0.04, 2, 8, FOAM, { rx: HALF_PI, y: 0.4, z: 0.5 }));

    // ---- scattered rocks ----
    const rockPositions = [
      { x: -1.8, z: 0.8 }, { x: 1.7, z: 0.9 }, { x: -0.8, z: 1.1 },
      { x: 0.9, z: 1.0 }, { x: 0, z: 1.3 },
    ];
    for (const pos of rockPositions) {
      const rs = 0.15 + rng() * 0.12;
      parts.push(
        sph(rs, ROCK_D, {
          ws: 4, hs: 3,
          x: pos.x + (rng() - 0.5) * 0.2,
          y: 0.25,
          z: pos.z,
          sy: 0.5 + rng() * 0.3,
          hex2: ROCK,
        })
      );
    }

    // ---- subtle wave lines ----
    parts.push(torus(1.5, 0.02, 2, 10, FOAM, { rx: HALF_PI, y: 0.2, arc: PI * 0.4, ry: rng() * PI }));

    return finish(parts);
  },
};

// Backward compatibility export (cityMap.js imports NM_GRAND_HOTEL)
export const NM_GRAND_HOTEL = NM_WHALE_CAVE;

export default NM_WHALE_CAVE;
