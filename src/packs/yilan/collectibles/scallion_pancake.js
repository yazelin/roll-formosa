/**
 * @file packs/yilan/collectibles/scallion_pancake.js — Roll Formosa Yilan pack.
 *
 * 蔥油餅 (Scallion Pancake) — collectibleId 3. A crispy, flaky pan-fried
 * pancake studded with chopped scallions, popular street food in Yilan.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, box, sph, finish, PI } from '../geomHelpers.js';

const PANCAKE_GOLD = 0xd4a850;  // golden fried surface
const PANCAKE_CRISP = 0xc89840; // crispy edges
const SCALLION_GREEN = 0x4a8a3a; // visible scallion bits
const OIL_SHEEN = 0xe8d090;    // oily sheen

export const COL_SCALLION_PANCAKE = {
  id: 'col_scallion_pancake',
  name: '蔥油餅',
  collectibleId: 3,
  colorHex: 0xd4a850, // golden pancake — the read color

  buildGeometry(rng) {
    const parts = [];

    // Main pancake body - slightly irregular circle
    parts.push(
      cyl(0.55, 0.55, 0.08, 12, PANCAKE_GOLD, {
        y: 0.04,
        hex2: PANCAKE_CRISP,
      })
    );

    // Slightly raised, uneven top surface
    parts.push(
      sph(0.50, PANCAKE_GOLD, {
        y: 0.08,
        sy: 0.15,
        ws: 10,
        hs: 5,
      })
    );

    // Crispy folded edge
    parts.push(
      cyl(0.58, 0.52, 0.04, 12, PANCAKE_CRISP, {
        y: 0.02,
      })
    );

    // Visible scallion bits on surface
    const scallionCount = 10;
    for (let i = 0; i < scallionCount; i++) {
      const angle = (i / scallionCount) * PI * 2 + (rng ? rng() * 0.6 : i * 0.1);
      const dist = 0.1 + (rng ? rng() * 0.3 : 0.2);
      parts.push(
        box(0.08, 0.02, 0.03, SCALLION_GREEN, {
          x: Math.cos(angle) * dist,
          y: 0.10,
          z: Math.sin(angle) * dist,
          ry: angle,
        })
      );
    }

    // Oil sheen spots
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * PI * 2;
      parts.push(
        sph(0.06, OIL_SHEEN, {
          x: Math.cos(angle) * 0.25,
          y: 0.09,
          z: Math.sin(angle) * 0.25,
          sy: 0.3,
          ws: 5,
          hs: 3,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_SCALLION_PANCAKE;
