/**
 * @file packs/newtaipei/collectibles/pingxi_train.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_PINGXI_TRAIN — 平溪小火車 (Pingxi Line Train). The charming vintage
 * diesel railcar that runs on the scenic Pingxi Line through the mountains,
 * past sky lantern villages and old mining towns. Features the distinctive
 * blue and white color scheme of the Taiwan Railway's local trains.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BODY_BLUE = 0x2a5080;  // TRA local train blue
const BODY_WHITE = 0xf4f4f0; // white stripe
const STEEL = 0x606068;      // undercarriage/wheels
const WINDOW = 0x88b8d8;     // window glass
const ROOF = 0xe0e0e0;       // silver/grey roof
const LIGHT = 0xffd840;      // headlight

export const COL_PINGXI_TRAIN = {
  id: 'pingxi_train',
  name: '平溪小火車',
  colorHex: BODY_BLUE, // blue train read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Main car body ----------------------------------------------
    // Lower body (blue)
    parts.push(box(1.6, 0.35, 0.55, BODY_BLUE, { y: 0.3, hex2: 0x3a60a0 }));
    // White stripe band
    parts.push(box(1.62, 0.08, 0.56, BODY_WHITE, { y: 0.52 }));
    // Upper body (blue)
    parts.push(box(1.58, 0.25, 0.53, BODY_BLUE, { y: 0.68 }));

    // ---- 2) Roof -------------------------------------------------------
    // Curved roof (simplified as rounded box)
    parts.push(box(1.55, 0.06, 0.5, ROOF, { y: 0.83 }));
    parts.push(cyl(0.26, 0.26, 1.5, 6, ROOF, {
      y: 0.88,
      rz: HALF_PI,
      thetaLen: PI,
    })); // curved top

    // ---- 3) Windows ----------------------------------------------------
    // Side windows (left)
    for (let i = -3; i <= 3; i++) {
      parts.push(box(0.12, 0.15, 0.02, WINDOW, {
        x: i * 0.2,
        y: 0.58,
        z: 0.28,
      }));
    }
    // Side windows (right)
    for (let i = -3; i <= 3; i++) {
      parts.push(box(0.12, 0.15, 0.02, WINDOW, {
        x: i * 0.2,
        y: 0.58,
        z: -0.28,
      }));
    }

    // ---- 4) Front cab --------------------------------------------------
    // Windshield
    parts.push(box(0.02, 0.2, 0.35, WINDOW, { x: 0.79, y: 0.6 }));
    // Headlights
    parts.push(cyl(0.04, 0.04, 0.03, 4, LIGHT, { x: 0.82, y: 0.45, z: 0.15 }));
    parts.push(cyl(0.04, 0.04, 0.03, 4, LIGHT, { x: 0.82, y: 0.45, z: -0.15 }));
    // Front number plate
    parts.push(box(0.02, 0.06, 0.15, BODY_WHITE, { x: 0.81, y: 0.32 }));

    // ---- 5) Rear cab ---------------------------------------------------
    parts.push(box(0.02, 0.2, 0.35, WINDOW, { x: -0.79, y: 0.6 }));
    // Rear lights (red)
    parts.push(cyl(0.03, 0.03, 0.02, 4, 0xc03030, { x: -0.82, y: 0.45, z: 0.15 }));
    parts.push(cyl(0.03, 0.03, 0.02, 4, 0xc03030, { x: -0.82, y: 0.45, z: -0.15 }));

    // ---- 6) Undercarriage and wheels -----------------------------------
    parts.push(box(1.5, 0.08, 0.5, STEEL, { y: 0.08 })); // frame
    // Wheel trucks (bogies)
    for (const tx of [-0.5, 0.5]) {
      parts.push(box(0.25, 0.06, 0.52, 0x404048, { x: tx, y: 0.05 }));
      // Wheels
      for (const wz of [-0.22, 0.22]) {
        parts.push(cyl(0.08, 0.08, 0.04, 6, 0x303030, {
          x: tx - 0.08, y: 0.08, z: wz,
          rx: HALF_PI,
        }));
        parts.push(cyl(0.08, 0.08, 0.04, 6, 0x303030, {
          x: tx + 0.08, y: 0.08, z: wz,
          rx: HALF_PI,
        }));
      }
    }

    // ---- 7) Pantograph or antenna (for diesel railcar - small) ---------
    parts.push(cyl(0.02, 0.02, 0.08, 4, STEEL, { x: 0.3, y: 0.95 }));
    parts.push(box(0.1, 0.02, 0.02, STEEL, { x: 0.3, y: 1.0 }));

    return finish(parts);
  },
};

export default COL_PINGXI_TRAIN;
