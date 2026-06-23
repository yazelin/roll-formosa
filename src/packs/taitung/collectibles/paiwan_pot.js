/**
 * @file packs/taitung/collectibles/paiwan_pot.js — Roll Formosa Taitung pack, COLLECTIBLE.
 *
 * COL_PAIWAN_POT — 排灣族陶壺 (Paiwan Ceramic Pot). Traditional pottery of the
 * Paiwan people, featuring distinctive serpent and human figure decorations.
 * These pots are sacred treasures (三寶) along with bronze knives and glass beads.
 */

import { cyl, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

export const COL_PAIWAN_POT = {
  id: 'paiwan_pot',
  name: '排灣族陶壺',
  collectibleId: 10,
  colorHex: 0x8a6848,

  buildGeometry(rng) {
    const CLAY = 0x8a6848; // terracotta
    const CLAY_LO = 0x6a4828;
    const PATTERN = 0x3a3028; // dark pattern
    const PATTERN_R = 0xa84838; // red ochre pattern

    const parts = [];

    // Pot body (rounded vessel)
    parts.push(sph(0.6, CLAY, {
      ws: 12, hs: 8,
      sy: 0.8,
      y: 0.48,
      hex2: CLAY_LO,
    }));

    // Flat base
    parts.push(cyl(0.3, 0.3, 0.1, 10, CLAY_LO, { y: 0.05 }));

    // Neck
    parts.push(cyl(0.25, 0.2, 0.35, 10, CLAY, { y: 0.95 }));

    // Rim
    parts.push(cyl(0.28, 0.28, 0.08, 10, CLAY_LO, { y: 1.16 }));

    // Opening
    parts.push(cyl(0.18, 0.18, 0.06, 8, 0x2a2018, { y: 1.18 }));

    // Serpent pattern (zigzag bands)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      parts.push(box(0.2, 0.08, 0.05, PATTERN, {
        x: Math.cos(a) * 0.52,
        z: Math.sin(a) * 0.52,
        y: 0.45 + (i % 2) * 0.1,
        ry: -a,
      }));
    }

    // Human figure decorations (stylized ancestral figures)
    for (const a of [0, PI]) {
      const cx = Math.cos(a) * 0.5;
      const cz = Math.sin(a) * 0.5;
      // Head
      parts.push(sph(0.06, PATTERN, { ws: 5, hs: 4, x: cx, z: cz, y: 0.72 }));
      // Body
      parts.push(box(0.04, 0.12, 0.03, PATTERN, { x: cx, z: cz, y: 0.6 }));
    }

    // Red ochre decorative band
    parts.push(cyl(0.62, 0.62, 0.04, 12, PATTERN_R, { y: 0.35, open: true }));

    return finish(parts);
  },
};

export default COL_PAIWAN_POT;
