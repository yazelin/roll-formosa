/**
 * @file packs/tainan/collectibles/chicken_cutlet.js — Roll Formosa Tainan pack,
 * collectible 2.
 *
 * 蝦捲 — Tainan's deep-fried shrimp rolls: crisp golden tubular spring-roll
 * cylinders with a pinkish minced-shrimp filling, served two-or-three to a
 * small plate. Silhouette: a couple of fat golden rolls leaning on a low round
 * plate, their cut ends showing the pale-pink shrimp paste inside.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * read: stubby crispy tubes on a plate.
 *
 * Palette: golden fried wrapper (warm top, darker underside), pinkish shrimp
 * filling at the cut ends, off-white plate. rng() is used only for a hair of
 * crumb-speck jitter — never for structure.
 */

import { cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

// ---- palette ----------------------------------------------------------------
const SKIN = 0xd2a35a; // golden fried wrapper
const SKIN_D = 0xa5762c; // darker fried underside
const SKIN_L = 0xe7c281; // crispy highlight
const SHRIMP = 0xf2b8a8; // pale-pink minced-shrimp filling
const SHRIMP_D = 0xe08c7a; // shrimp filling shadow
const PLATE = 0xf3ede2; // off-white plate
const PLATE_D = 0xdacfbd; // plate rim shadow
const CRUMB = 0x8a5a22; // toasted crumb speck

export const COL_CHICKEN = {
  id: 'chicken_cutlet',
  name: '蝦捲',
  collectibleId: 2,
  colorHex: SKIN,

  /**
   * @param {() => number} rng Boot rng — tiny cosmetic jitter only.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];
    const j = () => (rng() - 0.5);

    // === PLATE ==============================================================
    // A low round dish the rolls rest on.
    parts.push(
      cyl(1.55, 1.35, 0.2, 8, PLATE, { y: -0.6, hex2: PLATE_D }),
    );
    parts.push(
      cyl(1.5, 1.5, 0.12, 8, PLATE_D, { y: -0.5, open: true }), // rim band
    );

    // === SHRIMP ROLLS =======================================================
    // Each roll: a fat golden cylinder lying along X, with a pinkish filling
    // disc at the cut end and a rounded crispy nub at the back.
    /** @param {number} x @param {number} z @param {number} y @param {number} rot @param {number} len */
    const roll = (x, z, y, rot, len) => {
      // crispy golden tube
      parts.push(
        cyl(0.34, 0.34, len, 7, SKIN, {
          rz: HALF_PI, ry: rot, x, z, y, hex2: SKIN_L,
        }),
      );
      // pinkish shrimp filling visible at the +end cut face
      const dx = Math.cos(rot) * (len / 2);
      const dz = -Math.sin(rot) * (len / 2);
      parts.push(
        cyl(0.26, 0.26, 0.06, 7, SHRIMP, {
          rz: HALF_PI, ry: rot, x: x + dx, z: z + dz, y, hex2: SHRIMP_D,
        }),
      );
      // rounded crispy back end
      parts.push(
        sph(0.34, SKIN, { ws: 6, hs: 3, x: x - dx, z: z - dz, y, hex2: SKIN_L }),
      );
    };

    // three rolls: two on the plate, one leaning on top
    roll(-0.45, 0.35, -0.18, 0.18, 1.7);
    roll(0.4, -0.35, -0.18, -0.22, 1.7);
    roll(0.0, 0.05, 0.28, 0.55, 1.5); // top roll leaning across

    // === CRUMB SPECKS =======================================================
    const specks = [
      [-0.3, 0.1, 0.4], [0.4, -0.2, 0.15],
    ];
    for (let i = 0; i < specks.length; i++) {
      const [sx, sz, sy] = specks[i];
      parts.push(
        sph(0.07, CRUMB, {
          ws: 4, hs: 2,
          x: sx + j() * 0.1, z: sz + j() * 0.1, y: sy + j() * 0.1,
        }),
      );
    }

    return finish(parts);
  },
};
