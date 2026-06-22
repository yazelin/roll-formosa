/**
 * @file packs/tainan/collectibles/budaixi.js — Roll Formosa Tainan collectible.
 *
 * 椪餅 (pong cake / hollow sugar cake) — a beloved old Tainan sweet: a round,
 * puffed, hollow pastry the size of a fist. As a small hand-rollable collectible
 * it reads as a light-brown domed disc: a low flattened dome with a crackled tan
 * crust on top and a paler flat bottom, the puffed-but-hollow silhouette of a
 * 椪餅 fresh off the tray.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read: wide and low, a
 * gentle dome over a flat base. rng only nudges tiny non-structural crackle.
 * Triangle budget kept well under 350.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

// Palette — baked sugar-cake materials.
const CRUST = 0xd8b270; // light golden-brown crackled top crust
const CRUST_T = 0xe8c98e; // sunlit highlight of the crust
const SIDE = 0xc99a52; // toasted side wall
const BASE = 0xe6d3aa; // paler flat baked bottom
const CRACK = 0xb07e3e; // darker crackle line on the crust

export const COL_PUPPET = {
  id: 'budaixi',
  name: '椪餅',
  collectibleId: 7,
  colorHex: 0xd8b270, // light golden-brown — the cake's baked crust
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.05; // tiny non-structural crackle jitter
    const parts = [];

    // ---- Flat baked bottom (the disc base) -------------------------------
    // A short wide cylinder gives the round footprint and a paler underside.
    parts.push(cyl(1.0, 1.0, 0.28, 9, SIDE, { y: -0.18, hex2: BASE }));

    // ---- Puffed dome top (the crackled crust) ----------------------------
    // A flattened upper half-sphere reads as the gently puffed hollow dome.
    parts.push(
      sph(1.0, SIDE, { y: -0.04, sy: 0.62, ws: 9, hs: 4, thetaLen: PI / 2, hex2: CRUST_T })
    );
    // A smaller bright crown sits at the very top for the baked highlight.
    parts.push(
      sph(0.6, CRUST, { y: 0.18, sy: 0.5, ws: 8, hs: 3, thetaLen: PI / 2, hex2: CRUST_T })
    );

    // ---- Crackle lines across the crust ----------------------------------
    // A few thin darker bars laid over the dome read as the signature crackle
    // of a 椪餅 crust without spending real tris on texture.
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * PI + j;
      parts.push(
        cyl(0.03, 0.03, 1.1, 4, CRACK, { rz: PI / 2, ry: a, y: 0.16 })
      );
    }

    return finish(parts);
  },
};

export default COL_PUPPET;
