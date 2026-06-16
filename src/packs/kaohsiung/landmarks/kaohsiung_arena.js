/**
 * @file packs/kaohsiung/landmarks/kaohsiung_arena.js — Roll Formosa Kaohsiung pack.
 *
 * 高雄巨蛋 (Kaohsiung Arena, 左營 Zuoying). A curated hero geometry: a big smooth
 * ELLIPTICAL DOME stadium — a wide, vertically-squashed silver shell that reads as
 * a giant egg lid (橢圓穹頂), seated on a ringed concrete base with a glazed concourse
 * skirt. The silhouette is unmistakably wide-and-low (a dome, never a tower): the
 * elongated dome (stretched along X) caps a circular plinth wrapped by a banded glass
 * curtain and a ring of slim pillars, with a small apex skylight crowning the shell.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (a flattened oval dome over a wide ringed base) — NOT absolute size. The integration
 * step owns the size-ladder; dioramaRHint is the real-world footprint hint.
 * <= 600 triangles (hero budget). rng() only nudges the glass tint.
 */

import { cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — silver-grey shell over a pale concrete + glass ring base.
const SHELL = 0xc0c4cc; // silver-grey dome shell
const SHELL_HI = 0xeaecf0; // near-white crown highlight
const CONCRETE = 0xb6bac2; // pale concrete plinth
const GLASS = 0x86b6cc; // glazed concourse curtain
const GLASS_HI = 0xb6e0f0; // upper glazing sheen
const RIM = 0xd6dade; // bright cornice / seam ring
const PILLAR = 0xe2e6ea; // slim perimeter mullion / pillar
const APEX = 0xaab0b8; // apex skylight drum

export const NM_KAO_ARENA = {
  id: 'kaohsiung_arena',
  name: '高雄巨蛋',
  landmarkId: 0,
  dioramaRHint: 160, // 高雄巨蛋 ~ 180 m wide oval stadium footprint radius hint
  colorHex: 0xc0c4cc, // the arena's signature silver-grey shell

  buildGeometry(rng) {
    const t = rng() < 0.5 ? 0x0 : 0x040404; // tiny per-instance glass tint nudge
    const glass = GLASS - t;
    const parts = [];

    // ---- Wide circular concrete plinth (ground ring) ----------------------
    parts.push(cyl(2.18, 2.24, 0.1, 16, CONCRETE, { y: 0.05 })); // ground plinth lip

    // ---- Glazed concourse skirt (banded glass curtain) --------------------
    parts.push(cyl(2.05, 2.12, 0.6, 16, glass, { y: 0.4, hex2: GLASS_HI })); // glass curtain (vertical sheen)

    // ---- Bright cornice ring where glass meets the dome shell -------------
    parts.push(torus(2.06, 0.05, 3, 14, RIM, { rx: HALF_PI, y: 0.7 }));

    // ---- Slim perimeter pillars / mullion glints around the ring ----------
    const nPillars = 8;
    for (let i = 0; i < nPillars; i++) {
      const a = (i / nPillars) * PI * 2;
      parts.push(
        cyl(0.035, 0.035, 0.58, 3, PILLAR, {
          x: Math.cos(a) * 2.07,
          z: Math.sin(a) * 2.07,
          y: 0.41,
        })
      );
    }

    // ---- Big smooth ELLIPTICAL DOME shell (the 橢圓穹頂) -------------------
    // Only the top hemisphere is built (thetaLen = HALF_PI), squashed sy=0.42
    // for a shallow lid and stretched sx=1.18 along X for the oval footprint —
    // no wasted hidden underside polys.
    parts.push(
      sph(2.0, SHELL, {
        ws: 16,
        hs: 5,
        thetaLen: HALF_PI,
        sx: 1.18,
        sy: 0.42,
        y: 0.7,
        hex2: SHELL_HI,
      })
    );

    // ---- Crown detailing: mid rib ring + apex skylight --------------------
    parts.push(torus(1.45, 0.04, 3, 10, 0xb0b4bc, { rx: HALF_PI, y: 0.98 })); // mid rib ring
    parts.push(cyl(0.34, 0.4, 0.11, 10, APEX, { y: 1.18 })); // apex skylight drum
    parts.push(cyl(0.32, 0.32, 0.04, 8, SHELL_HI, { y: 1.25 })); // apex glazing cap

    return finish(parts);
  },
};

export default NM_KAO_ARENA;
