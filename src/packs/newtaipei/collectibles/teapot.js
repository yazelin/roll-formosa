/**
 * @file packs/newtaipei/collectibles/teapot.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_TEAPOT — 茶壺 (Teapot). A traditional Chinese clay teapot, representing
 * the tea culture of Jiufen's famous mountain teahouses. Features the classic
 * Yixing-style purple clay (紫砂) teapot shape with a round body, curved spout,
 * loop handle, and domed lid with a knob.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, cone, box, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CLAY = 0x8a5040;       // purple/brown zisha clay
const CLAY_HI = 0xa06050;    // lighter highlight
const CLAY_DK = 0x6a3a2a;    // darker shadow

export const COL_TEAPOT = {
  id: 'teapot',
  name: '茶壺',
  colorHex: CLAY, // purple clay read color

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x080404); // slight color variation
    const clay = CLAY + t;
    const parts = [];

    // ---- 1) Main pot body (round belly) --------------------------------
    parts.push(sph(0.55, clay, {
      ws: 10, hs: 8,
      y: 0.45,
      sy: 0.75, // slightly flattened
      hex2: CLAY_HI,
    }));

    // ---- 2) Flat bottom and foot ring ----------------------------------
    parts.push(cyl(0.35, 0.38, 0.08, 6, CLAY_DK, { y: 0.04 }));

    // ---- 3) Neck and lid seat ------------------------------------------
    parts.push(cyl(0.28, 0.26, 0.1, 6, clay, { y: 0.75 }));
    // Lid seat rim
    parts.push(cyl(0.3, 0.3, 0.03, 6, CLAY_DK, { y: 0.81 }));

    // ---- 4) Domed lid --------------------------------------------------
    parts.push(cyl(0.26, 0.28, 0.05, 6, clay, { y: 0.86 })); // lid base
    parts.push(sph(0.24, clay, {
      ws: 8, hs: 4,
      y: 0.92,
      sy: 0.5, // flattened dome
      thetaLen: HALF_PI,
    }));
    // Lid knob
    parts.push(cyl(0.06, 0.08, 0.06, 6, CLAY_DK, { y: 1.0 }));
    parts.push(sph(0.06, clay, { ws: 4, hs: 3, y: 1.06 }));

    // ---- 5) Spout ------------------------------------------------------
    // Curved spout extending from body
    // Base attachment
    parts.push(cyl(0.08, 0.1, 0.1, 6, clay, {
      x: 0.45, y: 0.5, z: 0,
      rx: 0, rz: -HALF_PI * 0.6,
    }));
    // Spout tube (angled up)
    parts.push(cyl(0.05, 0.07, 0.25, 6, clay, {
      x: 0.62, y: 0.58, z: 0,
      rz: -HALF_PI * 0.4,
      hex2: CLAY_HI,
    }));
    // Spout tip
    parts.push(cyl(0.04, 0.05, 0.06, 6, CLAY_DK, {
      x: 0.78, y: 0.7, z: 0,
      rz: -HALF_PI * 0.3,
    }));

    // ---- 6) Handle (loop handle opposite spout) ------------------------
    // Torus segment for the loop handle
    parts.push(torus(0.18, 0.04, 4, 6, clay, {
      x: -0.45, y: 0.5, z: 0,
      ry: HALF_PI,
      arc: PI * 0.8,
    }));
    // Handle attachments to body
    parts.push(sph(0.05, CLAY_DK, { ws: 5, hs: 3, x: -0.42, y: 0.7, z: 0 }));
    parts.push(sph(0.05, CLAY_DK, { ws: 5, hs: 3, x: -0.42, y: 0.32, z: 0 }));

    return finish(parts);
  },
};

export default COL_TEAPOT;
