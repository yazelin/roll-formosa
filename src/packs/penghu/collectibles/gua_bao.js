/**
 * @file packs/penghu/collectibles/gua_bao.js — Roll Formosa Penghu pack.
 *
 * COL_SEAFOOD_NOODLES — 海鮮麵線 (seafood vermicelli soup). A warm bowl of
 * Penghu's signature noodle soup: a wide ceramic bowl filled with thin
 * vermicelli noodles in a savory brown broth, topped with fresh seafood —
 * small shrimp, clams, and little squid pieces poking out of the noodles.
 * Garnished with cilantro and fried shallots. The read: a cozy bowl of
 * golden-brown noodles with pink/white seafood peeking through.
 *
 * Authored ONLY from the engine geometry vocabulary (geomHelpers.js:
 * box/cyl/cone/sph/ico/torus + paint/xf + finish) and normalized by finish()
 * to a UNIT bounding sphere (radius 1). Tri budget <= 350 (kept low via small
 * radial segment counts). rng() is used ONLY for tiny deterministic nudges to
 * the seafood placement, never for structure.
 */

import { box, cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const BOWL = 0xd4c8b0;      // warm cream ceramic bowl
const BOWL_DK = 0xb8a890;   // bowl shadow / rim gradient
const NOODLE = 0xe8d4a8;    // pale golden vermicelli
const NOODLE_DK = 0xc9b586; // noodle shadow / broth-soaked
const BROTH = 0x8b6b4a;     // savory brown broth
const SHRIMP = 0xf0a080;    // coral-pink shrimp
const SHRIMP_DK = 0xd88060; // darker shrimp tail
const CLAM = 0xf2ede5;      // white clam meat
const SHELL = 0x6a6055;     // clam shell grey-brown
const SQUID = 0xf5f0e8;     // pale white squid
const CILANTRO = 0x4a8a3a;  // green cilantro garnish
const SHALLOT = 0xc4923a;   // golden fried shallots

export const COL_SEAFOOD_NOODLES = {
  id: 'seafood_noodles',
  name: '海鮮麵線',
  collectibleId: 3,
  colorHex: NOODLE, // golden noodles — the body read color

  buildGeometry(rng) {
    const parts = [];

    // === CERAMIC BOWL =======================================================
    parts.push(cyl(1.1, 0.8, 0.7, 8, BOWL, { y: 0.35, hex2: BOWL_DK }));
    // Bowl foot ring
    parts.push(cyl(0.5, 0.5, 0.1, 5, BOWL, { y: 0.05, hex2: BOWL_DK }));

    // === NOODLE MOUND =======================================================
    parts.push(sph(0.85, NOODLE, { ws: 6, hs: 3, sy: 0.5, y: 0.65, hex2: NOODLE_DK }));
    // Noodle strand
    parts.push(torus(0.5, 0.04, 3, 5, NOODLE, { rx: 0.3, y: 0.78, x: 0.1 }));

    // === SHRIMP (2 pieces) ==================================================
    parts.push(sph(0.16, SHRIMP, {
      ws: 4, hs: 2, sx: 1.2, sy: 0.8,
      x: 0.35, y: 0.92, z: 0.25,
      hex2: SHRIMP_DK
    }));
    parts.push(sph(0.14, SHRIMP, {
      ws: 4, hs: 2, sx: 1.1, sy: 0.7,
      x: -0.4, y: 0.88, z: -0.15,
      hex2: SHRIMP_DK
    }));

    // === CLAM ===============================================================
    parts.push(sph(0.12, SHELL, {
      ws: 4, hs: 2, sy: 0.5,
      x: -0.2, y: 0.85, z: 0.4
    }));

    // === SQUID RING =========================================================
    parts.push(torus(0.1, 0.03, 3, 4, SQUID, { y: 0.95, rx: 0.4 }));

    // === CILANTRO GARNISH ===================================================
    parts.push(sph(0.08, CILANTRO, { ws: 3, hs: 2, x: 0.15, y: 0.98, z: -0.1 }));

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_GUABAO = COL_SEAFOOD_NOODLES;

export default COL_SEAFOOD_NOODLES;
