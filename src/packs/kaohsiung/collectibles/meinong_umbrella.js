/**
 * @file packs/kaohsiung/collectibles/meinong_umbrella.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_MEINONG_UMBRELLA — 美濃油紙傘 (Meinong oil-paper umbrella). The signature
 * Hakka craft of Meinong, Kaohsiung: an open round canopy of red-brown oiled
 * paper, radiating bamboo ribs fanning out from a small top finial, a slim
 * handle/shaft hanging down through the center, and a knob at the bottom of the
 * handle. Silhouette reads unmistakably as "open round umbrella" at thumbnail
 * size — wide shallow dome on a thin stick.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) are authored
 * here. Small + clean, well under the collectible triangle budget. rng() only
 * nudges the paper tint, never structure.
 */

import { cyl, sph, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const PAPER = 0xc05030; // 紅褐 oiled-paper canopy
const PAPER_HI = 0xd66a44; // lighter rim glow toward the canopy edge
const RIB = 0x5a3a26; // dark bamboo rib brown
const SHAFT = 0x7a5236; // warm bamboo handle
const FINIAL = 0x3a2418; // dark wooden top knob / bottom knob

export const COL_MEINONG_UMBRELLA = {
  id: 'meinong_umbrella',
  name: '美濃油紙傘',
  colorHex: 0xc05030, // 紅褐 oiled-paper canopy — the body read color

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040201); // tiny per-instance paper-tint nudge
    const paper = PAPER + t;
    const parts = [];

    // --- CANOPY: a wide shallow dome (top half-sphere, flattened) -----------
    //     bottom(paper) → top-rim(lighter) so the oiled edge catches light.
    parts.push(
      sph(1.0, paper, { ws: 12, hs: 3, thetaLen: PI * 0.5, sy: 0.5, y: 0.0, hex2: PAPER_HI }),
    );
    // bright outer rim lip — a thin flat ring at the canopy edge.
    parts.push(cyl(1.0, 0.92, 0.05, 14, PAPER_HI, { y: 0.02 }));

    // --- RIBS: radiating bamboo ribs fanning from the top finial to the rim.
    //     8 thin tilted spokes laid over the dome's underside for the read.
    const ribN = 8;
    const ribR = 0.62; // ring radius where rib mid-points sit
    for (let i = 0; i < ribN; i++) {
      const a = (i / ribN) * PI * 2;
      const cx = Math.cos(a) * ribR;
      const cz = Math.sin(a) * ribR;
      parts.push(
        cyl(0.025, 0.025, 1.0, 4, RIB, {
          x: cx,
          z: cz,
          y: -0.06,
          rz: Math.sin(a) * 0.5,
          rx: -Math.cos(a) * 0.5,
        }),
      );
    }

    // --- TOP FINIAL: small dark knob where the ribs gather at the apex. -----
    parts.push(cone(0.1, 0.18, 6, FINIAL, { y: 0.5 }));

    // --- SHAFT/HANDLE: slim stick hanging down through the canopy center. ---
    parts.push(cyl(0.05, 0.05, 1.7, 6, SHAFT, { y: -0.55, hex2: 0x8c6242 }));
    // bottom handle knob.
    parts.push(sph(0.09, FINIAL, { ws: 6, hs: 4, y: -1.42 }));

    return finish(parts);
  },
};

export default COL_MEINONG_UMBRELLA;
