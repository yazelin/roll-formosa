/**
 * @file packs/hualien/collectibles/aboriginal_weave.js — Roll Formosa Hualien pack, COLLECTIBLE.
 *
 * COL_ABORIGINAL_WEAVE — 原住民編織 (Aboriginal weaving). A colorful woven
 * textile piece from the Amis or Truku tribes of Hualien — featuring the
 * signature red, black, and white geometric patterns. Displayed as a
 * small rolled/folded piece of traditional fabric.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to UNIT bounding sphere.
 * <= 350 triangles (collectible budget).
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const WEAVE_R = 0xba3020; // traditional red
const WEAVE_B = 0x2a2a28; // black
const WEAVE_W = 0xf0e8d8; // white/cream
const WEAVE_Y = 0xe8a830; // yellow accent

export const COL_ABORIGINAL_WEAVE = {
  id: 'aboriginal_weave',
  name: '原住民編織',
  collectibleId: 5,
  colorHex: 0xba3020, // traditional red

  buildGeometry(rng) {
    const parts = [];

    // --- Rolled fabric main body ---
    parts.push(cyl(0.5, 0.5, 1.5, 10, WEAVE_R, { rz: 1.57, y: 0.0, hex2: 0xca4030 }));

    // --- Band stripes (wrapped around) ---
    // Black band
    parts.push(cyl(0.52, 0.52, 0.25, 10, WEAVE_B, { rz: 1.57, y: 0.0, x: -0.4 }));
    // White band
    parts.push(cyl(0.53, 0.53, 0.12, 10, WEAVE_W, { rz: 1.57, y: 0.0, x: -0.25 }));
    // Another black band
    parts.push(cyl(0.52, 0.52, 0.18, 10, WEAVE_B, { rz: 1.57, y: 0.0, x: 0.25 }));
    // Yellow accent band
    parts.push(cyl(0.54, 0.54, 0.08, 10, WEAVE_Y, { rz: 1.57, y: 0.0, x: 0.45 }));

    // --- End caps (visible spiral of rolled fabric) ---
    parts.push(cyl(0.48, 0.45, 0.06, 8, WEAVE_W, { rz: 1.57, y: 0.0, x: 0.73 }));
    parts.push(cyl(0.48, 0.45, 0.06, 8, WEAVE_W, { rz: 1.57, y: 0.0, x: -0.73 }));

    // --- Small diamond pattern elements on red areas ---
    parts.push(box(0.08, 0.08, 0.08, WEAVE_W, { x: 0.05, y: 0.45, z: 0.2, ry: 0.78 }));
    parts.push(box(0.06, 0.06, 0.06, WEAVE_W, { x: 0.1, y: -0.4, z: -0.2, ry: 0.78 }));

    return finish(parts);
  },
};

export default COL_ABORIGINAL_WEAVE;
