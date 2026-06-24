/**
 * @file packs/yilan/collectibles/luwei_pot.js — Roll Formosa Yilan pack.
 *
 * 滷味 (Luwei Braised Snacks) — collectibleId 4. A pot of Yilan night market
 * braised delicacies in aromatic soy-based broth.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const POT_METAL = 0x606060;     // stainless steel pot
const BROTH = 0x4a3020;        // dark soy broth
const TOFU = 0xe8d8b0;         // braised tofu
const EGG_BROWN = 0x6a4a30;    // tea egg
const KELP_GREEN = 0x3a5a4a;   // seaweed/kelp
const MEAT = 0x8a5040;         // braised meat

export const COL_LUWEI_POT = {
  id: 'col_luwei_pot',
  name: '滷味',
  collectibleId: 4,
  colorHex: 0x4a3020, // braised broth — the read color

  buildGeometry(rng) {
    const parts = [];

    // Metal pot body
    parts.push(
      cyl(0.5, 0.45, 0.4, 10, POT_METAL, {
        y: 0.2,
        hex2: 0x707070,
      })
    );

    // Pot rim
    parts.push(
      cyl(0.52, 0.52, 0.04, 10, POT_METAL, {
        y: 0.42,
      })
    );

    // Broth surface
    parts.push(
      cyl(0.44, 0.44, 0.03, 10, BROTH, {
        y: 0.38,
      })
    );

    // Braised tofu pieces
    parts.push(box(0.15, 0.10, 0.15, TOFU, { x: -0.15, y: 0.45, z: 0.1 }));
    parts.push(box(0.12, 0.10, 0.12, TOFU, { x: 0.2, y: 0.44, z: -0.1 }));

    // Tea egg
    parts.push(
      sph(0.1, EGG_BROWN, {
        x: 0.0,
        y: 0.46,
        z: 0.2,
        ws: 6,
        hs: 4,
      })
    );

    // Kelp strips
    parts.push(box(0.20, 0.03, 0.06, KELP_GREEN, { x: -0.1, y: 0.42, z: -0.15, ry: 0.3 }));
    parts.push(box(0.18, 0.03, 0.05, KELP_GREEN, { x: 0.15, y: 0.43, z: 0.15, ry: -0.4 }));

    // Braised meat chunk
    parts.push(box(0.12, 0.08, 0.10, MEAT, { x: 0.0, y: 0.44, z: -0.05 }));

    // Pot handles
    parts.push(
      cyl(0.04, 0.04, 0.12, 5, POT_METAL, {
        x: -0.55,
        y: 0.30,
        z: 0.0,
        rz: HALF_PI,
      })
    );
    parts.push(
      cyl(0.04, 0.04, 0.12, 5, POT_METAL, {
        x: 0.55,
        y: 0.30,
        z: 0.0,
        rz: HALF_PI,
      })
    );

    return finish(parts);
  },
};

export default COL_LUWEI_POT;
