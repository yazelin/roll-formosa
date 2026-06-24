/**
 * @file packs/yilan/collectibles/cherry_duck.js — Roll Formosa Yilan pack.
 *
 * 櫻桃鴨 (Cherry Valley Duck) — collectibleId 6. Yilan's famous roasted duck,
 * known for its crispy skin and tender meat. A whole roasted duck.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, sph, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const DUCK_SKIN = 0xa86030;     // roasted golden brown skin
const DUCK_CRISP = 0x8a4820;   // crispy darker areas
const PLATE = 0xf0e8e0;        // serving plate
const GARNISH = 0x4a8a3a;      // green garnish

export const COL_CHERRY_DUCK = {
  id: 'col_cherry_duck',
  name: '櫻桃鴨',
  collectibleId: 6,
  colorHex: 0xa86030, // roasted duck skin — the read color

  buildGeometry(rng) {
    const parts = [];

    // Serving plate
    parts.push(
      cyl(0.55, 0.60, 0.05, 10, PLATE, {
        y: 0.025,
      })
    );

    // Duck body (oval roasted shape)
    parts.push(
      sph(0.35, DUCK_SKIN, {
        y: 0.30,
        sx: 1.4,
        sy: 0.9,
        sz: 1.0,
        ws: 8,
        hs: 5,
        hex2: DUCK_CRISP,
      })
    );

    // Duck breast (front prominence)
    parts.push(
      sph(0.25, DUCK_SKIN, {
        x: 0.15,
        y: 0.25,
        z: 0.15,
        ws: 6,
        hs: 4,
      })
    );

    // Duck legs (drumsticks)
    parts.push(
      cyl(0.08, 0.05, 0.25, 6, DUCK_CRISP, {
        x: -0.25,
        y: 0.12,
        z: 0.25,
        rx: 0.4,
        rz: 0.3,
      })
    );
    parts.push(
      cyl(0.08, 0.05, 0.25, 6, DUCK_CRISP, {
        x: -0.25,
        y: 0.12,
        z: -0.25,
        rx: -0.4,
        rz: 0.3,
      })
    );

    // Neck/head area (tucked or removed in presentation)
    parts.push(
      cyl(0.10, 0.06, 0.15, 6, DUCK_SKIN, {
        x: 0.40,
        y: 0.35,
        z: 0.0,
        rz: -0.5,
      })
    );

    // Green garnish
    parts.push(
      box(0.15, 0.03, 0.08, GARNISH, {
        x: 0.35,
        y: 0.08,
        z: 0.30,
      })
    );
    parts.push(
      box(0.12, 0.03, 0.06, GARNISH, {
        x: -0.30,
        y: 0.08,
        z: -0.25,
      })
    );

    return finish(parts);
  },
};

export default COL_CHERRY_DUCK;
